// server.js
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');

// Configure environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Custom CORS middleware to handle any origin with credentials
app.use((req, res, next) => {
    const origin = req.headers.origin;
    res.header('Access-Control-Allow-Origin', origin); // Dynamically set allowed origin
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Added 'Authorization'

    // Handle preflight request (OPTIONS method)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200); // Send OK status for preflight
    }

    next();
});

app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/product', productRoutes);

app.get('/', (req, res) => {
    res.send({ message: 'Welcome to my app' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
});