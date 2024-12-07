const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static HTML files
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection (replace with your MongoDB link)
const mongoDB = 'mongodb+srv://6534471823:KLdyRlFkcMzTaE4Y@proj01.3oied.mongodb.net/';  // Use your MongoDB Atlas link or local link
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.log('Error connecting to MongoDB:', error));

// Schema and Model
const ticketSchema = new mongoose.Schema({
    type: String,
    price: String,
    photo: String,
    name: String,
    detail: String
});

const Ticket = mongoose.model('Ticket', ticketSchema);

// API Route to fetch items
app.get('/api/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.json(tickets);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

// Root route to serve your HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// 1. Create a new ticket

app.post('/api/tickets', async (req, res) => {
    try {
        const ticket = new Ticket(req.body);
        await ticket.save();
        res.status(201).json(ticket);  // Return the newly created ticket
    } catch (error) {
        res.status(400).send('Error creating ticket');
    }
});

// 2. Get all tickets (Read)
app.get('/api/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.json(tickets);  // Send the data as JSON
    } catch (error) {
        res.status(500).send('Error fetching tickets');
    }
});

// 3. Update a ticket by ID
app.put('/api/tickets/:id', async (req, res) => {
    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTicket) {
            return res.status(404).send('Ticket not found');
        }
        res.json(updatedTicket);  // Return the updated ticket
    } catch (error) {
        res.status(400).send('Error updating ticket');
    }
});

// 4. Delete a ticket by ID
app.delete('/api/tickets/:id', async (req, res) => {
    try {
        const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
        if (!deletedTicket) {
            return res.status(404).send('Ticket not found');
        }
        res.json({ message: 'Ticket deleted successfully' });  // Send success message
    } catch (error) {
        res.status(500).send('Error deleting ticket');
    }
});