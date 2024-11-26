const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { createTicket, getTickets, updateStatus } = require('../controllers/ticketController');
const auth = require('../middleware/auth');

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Ticket routes
router.post('/tickets', auth, createTicket);
router.get('/tickets', auth, getTickets);
router.put('/tickets/:id', auth, updateStatus);

module.exports = router;