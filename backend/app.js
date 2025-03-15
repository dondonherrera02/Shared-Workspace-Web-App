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

const corsOptions = {
    origin: allowedOrigins, // allow multiple origins
    methods: "POST, PUT, GET, DELETE", // allowed HTTP methods
    optionsSuccessStatus: 204, // quick response for preflight requests
};

app.use(cors(corsOptions)); // apply CORS middleware once

// Body parsing middleware
app.use(express.json());

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
        const data = fileSystem.getOne(objectName);
        res.json(data);
    } catch (error) {
        console.error("Error retrieving data:", error);
        res.status(500).json({ error: "Error retrieving data." });
    }
});

// DELETE a single object
app.delete("/data/:objectName", (req, res) => {
    const objectName = req.params.objectName;

    try {
        fileSystem.deleteOne(objectName);
    } catch (error) {
        console.error(error);
    }
});

// Get the base URL and port
const BASE_URL = process.env.BASE_URL || "http://localhost:";
const PORT = process.env.PORT || 8080;
const URL = `${BASE_URL}${PORT}`;

// Start server
app.listen(PORT, () => console.log(`Server running on ${URL}`));
