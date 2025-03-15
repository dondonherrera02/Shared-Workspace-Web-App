/**
* @name: Co-Space Web App - start-up file
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

const express = require('express'); // express js web server
const fileSystem = require("./fileSystem/fileSystem"); // import the file system service
const cors = require('cors'); // cors middleware
const app = express(); // create express app

// define allowed origins (deployed & local development)
const allowedOrigins = [
    "https://co-space-together.vercel.app",
    "http://127.0.0.1:5501"
];

// More robust CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log("Blocked origin:", origin);
            callback(null, false);
        }
    },
    methods: "POST, PUT, GET, DELETE, OPTIONS", // explicitly include OPTIONS
    allowedHeaders: "Content-Type, Authorization",
    credentials: true, // Allow cookies to be sent with requests
    optionsSuccessStatus: 204, // quick response for preflight requests
    maxAge: 86400 // Cache preflight response for 24 hours
};

// Apply CORS middleware to all routes
app.use(cors(corsOptions));

// Add a specific handler for OPTIONS requests
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json());

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error("Global error handler:", err);
    res.status(500).json({ error: "Internal server error" });
});

// API Endpoints

// POST and PUT Data
app.post("/data/:objectName", (req, res) => {
    const objectName = req.params.objectName;
    const data = req.body;

    try {
        fileSystem.saveToFile(objectName, data);
        res.json({ message: `Data saved for ${objectName}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error saving data." });
    }
});

// GET list of data (Array)
app.get("/data/:objectName", (req, res) => {
    const objectName = req.params.objectName;

    try {
        const data = fileSystem.getList(objectName);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error reading data." });
    }
});

// GET a single object with a delay
app.get("/data/user/:objectName", (req, res) => {
    const objectName = req.params.objectName;

    try {
        // Log the request for debugging
        console.log(`GET request for /data/user/${objectName} from origin: ${req.headers.origin}`);
        
        // Explicitly set CORS headers for this route
        res.header("Access-Control-Allow-Origin", allowedOrigins.includes(req.headers.origin) ? req.headers.origin : allowedOrigins[0]);
        res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        
        const data = fileSystem.getOne(objectName);
        res.json(data);
    } catch (error) {
        console.error("Error retrieving data:", error);
        res.status(500).json({ error: "Error retrieving data." });
    }
});

// Get the base URL and port
const BASE_URL = process.env.BASE_URL || "http://localhost:";
const PORT = process.env.PORT || 8080;
const URL = `${BASE_URL}${PORT}`;

// Start server
app.listen(PORT, () => console.log(`Server running on ${URL}`));
