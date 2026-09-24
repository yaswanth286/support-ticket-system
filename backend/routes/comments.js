// Comment routes are mounted as nested routes under /api/tickets/:id/comments
// (see routes/tickets.js). This file exists to keep the folder structure
// documented and can be used if comments are ever exposed standalone.
const express = require('express');
const router = express.Router();

module.exports = router;
