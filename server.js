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
const reviewSchema = new mongoose.Schema({
    rev_name: { type: String, required: true },
    rev_detail: { type: String, required: true },
    rev_date: { type: String, required: true },
    rev_completedate: { type: String, default: '' },
    rev_budget: { type: String, default: '' },
    rev_note: { type: String, default: '' }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
const Place = mongoose.model('Place', placeSchema);
const Review = mongoose.model('Review', reviewSchema);

// API Route to fetch items
app.get('/api/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.json(tickets);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});
app.get('/api/places', async (req, res) => {
    try {
        const places = await Place.find();
        res.json(places);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});
app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);  // Send the data as JSON
    } catch (error) {
        res.status(500).send('Error fetching reviews');
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
// create a new review
app.post('/api/reviews', async (req, res) => {
    try {
        const review = new Review(req.body);
        await review.save();
        res.status(201).json(review);  // Return the newly created review
    } catch (error) {
        res.status(400).send('Error creating review');
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
// Get all reviews (Read)
app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);  // Send the data as JSON
    } catch (error) {
        res.status(500).send('Error fetching reviews');
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
//Update a review by ID
app.put('/api/reviews/:id', async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedReview) {
            return res.status(404).send('Review not found');
        }
        res.json(updatedReview);  // Return the updated review
    } catch (error) {
        res.status(400).send('Error updating review');
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
//Delete a review by ID
app.delete('/api/reviews/:id', async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);
        if (!deletedReview) {
            return res.status(404).send('Review not found');
        }
        res.json({ message: 'Review deleted successfully' });  // Send success message
    } catch (error) {
        res.status(500).send('Error deleting review');
    }
});

const validUsername = 'user';
const validPassword = 'password';

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === validUsername && password === validPassword) {
        res.redirect('/ticket.html');
    } else {
        res.send('Invalid credentials. Please try again.');
    }
});
// Get count of places
// Get count of places
// Get count of places
// Get count of places
// Get count of places
// Get count of places
// Get count of places
// Get count of places
app.get('/api/places/count', async (req, res) => {
    try {
        const count = await Place.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).send('Error fetching places count');
    }
});

// Get count of reviews
app.get('/api/reviews/count', async (req, res) => {
    try {
        const count = await Review.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).send('Error fetching reviews count');
    }
});

// Get count of tickets
app.get('/api/tickets/count', async (req, res) => {
    try {
        const count = await Ticket.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).send('Error fetching tickets count');
    }
});

// Get count of customers
app.get('/api/customers/count', async (req, res) => {
    try {
        const count = await Customer.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).send('Error fetching customers count');
    }
});

// Get count of employees
app.get('/api/employees/count', async (req, res) => {
    try {
        const count = await Employee.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).send('Error fetching employees count');
    }
    // Schema and Model for Transaction
    const transactionSchema = new mongoose.Schema({
        cus_idcard: String,      // Customer idcard
        tk_type: String,       // Ticket Type
        trans_num: Number,     // Transaction Number
        pro_name: String,      // Promotion Name
        trans_totalPrice: Number, // Total Price
    });

    // Create Transaction model
    const Transaction = mongoose.model('Transaction', transactionSchema);

    // API Route to fetch transactions
    app.get('/api/transactions', async (req, res) => {
        try {
            const transactions = await Transaction.find();
            res.json(transactions);  // Send all transactions as JSON
        } catch (error) {
            res.status(500).send('Error fetching transactions');
        }
    });

    // Root route to serve your HTML page
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'txn.html'));
    });

    // Start server
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });

    // 1. Create a new transaction
    app.post('/api/transactions', async (req, res) => {
        try {
            const transaction = new Transaction(req.body);
            await transaction.save();
            res.status(201).json(transaction);  // Return the newly created transaction
        } catch (error) {
            res.status(400).send('Error creating transaction');
        }
    });

    // 2. Get all transactions (Read)
    app.get('/api/transactions', async (req, res) => {
        try {
            const transactions = await Transaction.find();
            res.json(transactions);  // Send the data as JSON
        } catch (error) {
            res.status(500).send('Error fetching transactions');
        }
    });

    // 3. Update a transaction by ID
    app.put('/api/transactions/:id', async (req, res) => {
        try {
            const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedTransaction) {
                return res.status(404).send('Transaction not found');
            }
            res.json(updatedTransaction);  // Return the updated transaction
        } catch (error) {
            res.status(400).send('Error updating transaction');
        }
    });

    // 4. Delete a transaction by ID
    app.delete('/api/transactions/:id', async (req, res) => {
        try {
            const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
            if (!deletedTransaction) {
                return res.status(404).send('Transaction not found');
            }
            res.json({ message: 'Transaction deleted successfully' });  // Send success message
        } catch (error) {
            res.status(500).send('Error deleting transaction');
        }
    });

});

