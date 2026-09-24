const ticketService = require('../services/ticketService');
const commentService = require('../services/commentService');
const { isNonEmptyString } = require('../middleware/validate');

async function canAccessTicket(user, ticket) {
  if (user.role === 'agent') return true;
  return ticket.user_id === user.id;
}

async function getComments(req, res, next) {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    if (!(await canAccessTicket(req.user, ticket))) {
      return res.status(403).json({ success: false, message: 'You do not have access to this ticket' });
    }

    const comments = await commentService.listComments(req.params.id);
    return res.status(200).json({ success: true, data: comments });
  } catch (err) {
    return next(err);
  }
}

async function addComment(req, res, next) {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    if (!(await canAccessTicket(req.user, ticket))) {
      return res.status(403).json({ success: false, message: 'You do not have access to this ticket' });
    }

    const { comment } = req.body;
    if (!isNonEmptyString(comment)) {
      return res.status(400).json({ success: false, message: 'Comment cannot be empty' });
    }

    // Author always comes from the JWT, never trust a user_id from the client.
    const newComment = await commentService.addComment({
      ticketId: req.params.id,
      userId: req.user.id,
      comment: comment.trim(),
    });

    return res.status(201).json({ success: true, data: newComment });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getComments, addComment };
