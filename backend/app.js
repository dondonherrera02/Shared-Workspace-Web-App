/**
 * @name: Co-Space Web App - Start-up File
 * @Course Code: SODV1201
 * @Class: Software Development Diploma Program
 * @Author: Dondon Herrera
 */

const express = require('express');
const cors = require('cors');
const fileSystem = require('./fileSystem/fileSystem');

const app = express();

// Allowed origins for CORS
const allowedOrigins = [
    'https://co-space-together.vercel.app',
    'http://127.0.0.1:5501'
];

// CORS Middleware
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json()); // Body parsing middleware

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Utility function to set CORS headers dynamically
const setCorsHeaders = (req, res) => {
    const origin = allowedOrigins.includes(req.headers.origin) ? req.headers.origin : allowedOrigins[0];
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    console.log(`SET to origin: ${origin}`);
};

// API Endpoints

// POST Data
app.post('/data/:objectName', (req, res) => {
    const { objectName } = req.params;
    const data = req.body;
    console.log(`POST request for /data/${objectName} from origin: ${req.headers.origin}`);
    setCorsHeaders(req, res);

    try {
        fileSystem.saveToFile(objectName, data);
        res.json({ message: `Data saved for ${objectName}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error saving data.' });
    }
});

// GET List of Data
app.get('/data/:objectName', (req, res) => {
    const { objectName } = req.params;
    console.log(`GET request for /data/${objectName} from origin: ${req.headers.origin}`);
    setCorsHeaders(req, res);

    try {
        const data = fileSystem.getList(objectName);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error reading data.' });
    }
});

// GET a Single Object
app.get('/data/user/:objectName', (req, res) => {
    const { objectName } = req.params;
    console.log(`GET request for /data/user/${objectName} from origin: ${req.headers.origin}`);
    setCorsHeaders(req, res);

    try {
        const data = fileSystem.getOne(objectName);
        res.json(data);
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ error: 'Error retrieving data.' });
    }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
