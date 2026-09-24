const ticketService = require('../services/ticketService');
const userService = require('../services/userService');
const {
  isNonEmptyString,
  isValidPriority,
  isValidStatus,
} = require('../middleware/validate');

async function createTicket(req, res, next) {
  try {
    const { subject, description, priority } = req.body;

    if (!isNonEmptyString(subject)) {
      return res.status(400).json({ success: false, message: 'Subject is required' });
    }
    if (!isNonEmptyString(description)) {
      return res.status(400).json({ success: false, message: 'Description is required' });
    }
    if (!isValidPriority(priority)) {
      return res.status(400).json({ success: false, message: 'Priority must be low, medium, or high' });
    }

    // Ownership always comes from the JWT, never from the request body.
    const ticket = await ticketService.createTicket({
      userId: req.user.id,
      subject: subject.trim(),
      description: description.trim(),
      priority,
    });

    return res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    return next(err);
  }
}

async function getTickets(req, res, next) {
  try {
    const { status, priority } = req.query;

    if (status && !isValidStatus(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status filter' });
    }
    if (priority && !isValidPriority(priority)) {
      return res.status(400).json({ success: false, message: 'Invalid priority filter' });
    }

    const tickets = await ticketService.listTickets({
      role: req.user.role,
      userId: req.user.id,
      status,
      priority,
    });

    return res.status(200).json({ success: true, data: tickets });
  } catch (err) {
    return next(err);
  }
}

async function getTicketById(req, res, next) {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Customers can only view their own tickets. Agents can view any ticket.
    if (req.user.role === 'customer' && ticket.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You do not have access to this ticket' });
    }

    return res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    return next(err);
  }
}

async function updateTicket(req, res, next) {
  try {
    // Route is already agent-only via requireRole middleware, but we double
    // check here as defense in depth.
    if (req.user.role !== 'agent') {
      return res.status(403).json({ success: false, message: 'Only agents can update tickets' });
    }

    const ticket = await ticketService.getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const { status, priority, assigned_to: assignedTo } = req.body;
    const updates = {};

    if (status !== undefined) {
      if (!isValidStatus(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value' });
      }
      updates.status = status;
    }

    if (priority !== undefined) {
      if (!isValidPriority(priority)) {
        return res.status(400).json({ success: false, message: 'Invalid priority value' });
      }
      updates.priority = priority;
    }

    if (assignedTo !== undefined) {
      if (assignedTo === null) {
        updates.assigned_to = null;
      } else {
        const agent = await userService.findById(assignedTo);
        if (!agent || agent.role !== 'agent') {
          return res.status(400).json({ success: false, message: 'Tickets can only be assigned to a valid agent' });
        }
        updates.assigned_to = agent.id;
      }
    }

    const updatedTicket = await ticketService.updateTicket(req.params.id, updates);
    return res.status(200).json({ success: true, data: updatedTicket });
  } catch (err) {
    return next(err);
  }
}

async function deleteTicket(req, res, next) {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    if (req.user.role === 'customer' && ticket.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You cannot delete another customer\'s ticket' });
    }
    // Agents can delete any ticket; customers may only delete their own.

    await ticketService.deleteTicket(req.params.id);
    return res.status(200).json({ success: true, message: 'Ticket deleted successfully' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { createTicket, getTickets, getTicketById, updateTicket, deleteTicket };
