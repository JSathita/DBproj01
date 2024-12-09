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
const placeSchema = new mongoose.Schema({
    place_name: {
        type: String,
        required: true, // กำหนดให้จำเป็นต้องมีค่า
        trim: true // ลบช่องว่างหน้าและหลังข้อความ
    },
    place_detail: {
        type: String,
        required: true,
        trim: true
    },
    place_capacity: {
        // type: Number, // กำหนดเป็น Number
        type: String,
        required: true,
        trim: true
    },
    place_maintDate: {
        type: String,
        // type: Date,
        required: true,
        trim: true
    },
    place_zone: String,
    place_detailPrc: {
        // type: Number, // กำหนดเป็น Number
        type: String,
        required: true,
        trim: true
    },
    place_detailCond: String,
})

const Ticket = mongoose.model('Ticket', ticketSchema);
const Place = mongoose.model('Place',placeSchema)

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
// create a new place x zone
app.post('/api/places', async (req, res) => {
    try {
        const place = new Place(req.body);
        await place.save();
        res.status(201).json(place);
    } catch (error) {
        res.status(400).send('Error creating place');
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
// get all place (read)
app.get('/api/places', async (req, res) => {
    try {
        const places = await Place.find();
        res.json(places);  // Send the data as JSON
    } catch (error) {
        res.status(500).send('Error fetching places');
    }
});

// 3. Update a ticket by ID
app.put('/api/tickets/:id', async (req, res) => {
    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTicket) {
            return res.status(404).send('Place not found');
        }
        res.json(updatedTicket);  // Return the updated ticket
    } catch (error) {
        res.status(400).send('Error updating ticket');
    }
});
//update a place by ID
app.put('/api/places/:id', async (req, res) => {
    try {
        const updatedPlace = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPlace) {
            return res.status(404).send('Place not found');
        }
        res.json(updatedPlace);
    } catch (error) {
        res.status(400).send('Error updating places');
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
//delete a place by ID
app.delete('/api/places/:id', async (req, res) => {
    try {
        const deletedPlace = await Place.findByIdAndDelete(req.params.id);
        if (!deletedPlace) {
            return res.status(404).send('Place not found');
        }
        res.json({ message: 'Place deleted successfully' });  // Send success message
    } catch (error) {
        res.status(500).send('Error deleting places');
    }
});