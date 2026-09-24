const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/', authenticate, requireRole('agent'), userController.getUsers);

module.exports = router;
