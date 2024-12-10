const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { type } = require('os');

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
    place_detailCond: String
})
const reviewSchema = new mongoose.Schema({
    rev_name: { type: String, required: true, trim: true },
    rev_topic: { type: String, required: true, trim: true },
    rev_detail: { type: String, required: true, trim: true },
    rev_date: { type: String, required: true, trim: true },
    rev_completedate: { type: String, default: '', trim: true },
    rev_budget: { type: String, default: '', trim: true },
    rev_note: { type: String, default: '', trim: true },
    rev_status: Boolean
});
const empSchema = new mongoose.Schema({
    emp_id: { type: String, required: true, trim: true },
    emp_name: { type: String, required: true, trim: true },
    depm_ID: { type: String, required: true, trim: true },
    shift_ID: { type: String, required: true, trim: true },
    emp_startDate: { type: Date, required: true },
    emp_phone: { type: String, default: '', trim: true },
    emp_mail: { type: String, default: '', trim: true },
    emp_address: { type: String, default: '', trim: true }
})
const cusSchema = new mongoose.Schema({
    cus_id: { type: String, required: true, trim: true },
    cus_name: { type: String, required: true, trim: true },
    cus_dateofbirth: { type: Date, required: true },
    cus_phone: { type: String, default: '', trim: true },
    cus_email: { type: String, default: '', trim: true },
    cus_idcard: { type: String, default: '', trim: true },
    cus_apDate: { type: Date, required: true }
})
const transactionSchema = new mongoose.Schema({
    cus_idcard: String, // Customer idcard
    tk_type: String, // Ticket Type
    trans_num: Number, // Transaction Number
    pro_name: String, // Promotion Name
    trans_totalPrice: Number, // Total Price
    trans_status: Boolean,
    trans_date: { type: Date, required: true }
});
const promotionSchema = new mongoose.Schema({
    pro_id: { type: String, required: true, trim: true },
    pro_name: { type: String, required: true, trim: true },
    pro_discount: Number,
    pro_cond: { type: String, required: true, trim: true },
    pro_photo: { type: String, required: true, trim: true },
})

const Ticket = mongoose.model('Ticket', ticketSchema);
const Place = mongoose.model('Place',placeSchema);
const Review = mongoose.model('Review', reviewSchema);
const Employee = mongoose.model('Employee', empSchema);
const Customer = mongoose.model('Customer', cusSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const Promotion = mongoose.model('Promotion', promotionSchema);

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
app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});
app.get('/api/transactions', async (req, res) => {
    try {
    const transactions = await Transaction.find();
    res.json(transactions); // Send all transactions as JSON
    } catch (error) {
    res.status(500).send('Error fetching transactions');
    }
});
app.get('/api/promotions', async (req, res) => {
    try {
        const promotions = await Promotion.find();
        res.json(promotions);
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
//Create a new employee
app.post('/api/employees', async (req, res) => {
    try {
        const employee = new Employee(req.body);
        await employee.save();
        res.status(201).json(employee);  // Return the newly created employee
    } catch (error) {
        res.status(400).send('Error creating employee');
    }
});
//Create a new customer
app.post('/api/customers', async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json(customer);  // Return the newly created customer
    } catch (error) {
        res.status(400).send('Error creating customer');
    }
});
//Create a new transaction
app.post('/api/transactions', async (req, res) => {
    try {
        const transaction = new Transaction(req.body);
        await transaction.save();
        res.status(201).json(transaction);  // Return the newly created transaction
    } catch (error) {
        res.status(400).send('Error creating transaction');
    }
});
//Create a new ticket
app.post('/api/promotions', async (req, res) => {
    try {
        const promotion = new Promotion(req.body);
        await promotion.save();
        res.status(201).json(promotion);  // Return the newly created promotion
    } catch (error) {
        res.status(400).send('Error creating promotion');
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
//Get all employees (Read)
app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);  // Send the data as JSON
    } catch (error) {
        res.status(500).send('Error fetching employees');
    }
});
//Get all customers (Read)
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);  // Send the data as JSON
    } catch (error) {
        res.status(500).send('Error fetching customers');
    }
});
// Get all transactions (Read)
app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions); // Send the data as JSON
    } catch (error) {
        res.status(500).send('Error fetching transactions');
    }
});
//Get all promotions (Read)
app.get('/api/promotions', async (req, res) => {
    try {
        const promotions = await Promotion.find();
        res.json(promotions);  // Send the data as JSON
    } catch (error) {
        res.status(500).send('Error fetching promotions');
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
//Update a employee by ID
app.put('/api/employees/:id', async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEmployee) {
            return res.status(404).send('Employee not found');
        }
        res.json(updatedEmployee);  // Return the updated employee
    } catch (error) {
        res.status(400).send('Error updating employee');
    }
});
//Update a customer by ID
app.put('/api/customers/:id', async (req, res) => {
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCustomer) {
            return res.status(404).send('Customer not found');
        }
        res.json(updatedCustomer);  // Return the updated Customer
    } catch (error) {
        res.status(400).send('Error updating Customer');
    }
});
// Update a transaction by ID
app.put('/api/transactions/:id', async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTransaction) {
            return res.status(404).send('Transaction not found');
        }
        res.json(updatedTransaction);  // Return the updated transaction
    } catch (error) {
        res.status(400).send('Error updating transaction');
    }
});
// 3. Update a promotion by ID
app.put('/api/promotions/:id', async (req, res) => {
    try {
        const updatedPromotion = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPromotion) {
            return res.status(404).send('Promotion not found');
        }
        res.json(updatedPromotion);  // Return the updated promotion
    } catch (error) {
        res.status(400).send('Error updating promotion');
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
//Delete a employee by ID
app.delete('/api/employees/:id', async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).send('Employee not found');
        }
        res.json({ message: 'Employee deleted successfully' });  // Send success message
    } catch (error) {
        res.status(500).send('Error deleting employee');
    }
});
//Delete a customer by ID
app.delete('/api/customers/:id', async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        if (!deletedCustomer) {
            return res.status(404).send('Customer not found');
        }
        res.json({ message: 'Customer deleted successfully' });  // Send success message
    } catch (error) {
        res.status(500).send('Error deleting Customer');
    }
});
//Delete a transaction by ID
app.delete('/api/transactions/:id', async (req, res) => {
    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!deletedTransaction) {
            return res.status(404).send('Transaction not found');
        }
    res.json({ message: 'Transaction deleted successfully' });  // Send success message
    } catch (error) {
        res.status(500).send('Error deleting transaction');
    }
});
//Delete a promotion by ID
app.delete('/api/promotions/:id', async (req, res) => {
    try {
        const deletedPromotion = await Promotion.findByIdAndDelete(req.params.id);
        if (!deletedPromotion) {
            return res.status(404).send('Promotion not found');
        }
        res.json({ message: 'Promotion deleted successfully' });  // Send success message
    } catch (error) {
        res.status(500).send('Error deleting Promotion');
    }
});

const validUsername = 'user';
const validPassword = 'password';

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === validUsername && password === validPassword) {
        res.redirect('/dashboard.html');
    } else {
        res.send('Invalid credentials. Please try again.');
    }
});

//dashboard
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
});