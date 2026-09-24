const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const commentController = require('../controllers/commentController');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate);

router.get('/', ticketController.getTickets);
router.post('/', ticketController.createTicket);
router.get('/:id', ticketController.getTicketById);
router.put('/:id', requireRole('agent'), ticketController.updateTicket);
router.delete('/:id', ticketController.deleteTicket);

// Comments are nested under tickets, per the API spec: /api/tickets/:id/comments
router.get('/:id/comments', commentController.getComments);
router.post('/:id/comments', commentController.addComment);

module.exports = router;
