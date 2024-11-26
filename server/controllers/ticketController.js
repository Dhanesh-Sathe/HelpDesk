// server/controllers/ticketController.js
const Ticket = require('../models/Ticket');

const createTicket = async (req, res) => {
  try {
    const { title, description, priority, assignedAgent } = req.body;
    console.log(req.body);
    const ticketCount = await Ticket.countDocuments();
    const ticketId = `TKT-${String(ticketCount + 1).padStart(3, '0')}`;
    
    const ticket = new Ticket({
      ticketId,
      title,
      description,
      priority,
      customer: req.user.userId,
      assignedAgent,
      notes: [{
        content: description,
        createdBy: req.user.userId
      }]
    });
    
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getTickets = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'customer') {
      query.customer = req.user.userId;
    } else if (req.user.role === 'agent') {
      query.assignedAgent = req.user.userId;
    }
    
    const tickets = await Ticket.find(query)
      .populate('customer', 'name email')
      .populate('assignedAgent', 'name')
      .sort({ lastUpdated: -1 });
      
    res.json(tickets);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    // Log the request parameters for debugging
    console.log('Request Params:', req.params);

    // Validate if the `id` is present and correctly formatted
    if (!req.params.id) {
      return res.status(400).json({ success: false, message: 'Ticket ID is required.' });
    }

    // Find the ticket by ID
    const ticket = await Ticket.findById(req.params.id);

    // If the ticket does not exist, send a 404 response
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    // Update the status to "Closed"
    ticket.status = "Closed";
    await ticket.save();

    // Return a success response
    return res.status(200).json({ success: true, message: 'Issue is solved.' });
  } catch (err) {
    // Log the error
    console.error(err);

    // Return a generic 500 error response
    return res.status(500).json({ success: false, message: 'Issue is in Pending.' });
  }
};


module.exports = { createTicket, getTickets, updateStatus };