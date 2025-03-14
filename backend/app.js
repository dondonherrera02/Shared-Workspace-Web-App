/**
* @name: Co-Space Web App - start-up file
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

const express = require('express'); // express js web server
const bodyParser = require('body-parser'); // read incoming POST request
const fileSystem = require("./fileSystem/fileSystem"); // import the file system service
const cors = require('cors'); // cors middleware
const app = express(); // create express app

const corsOptions = {
    origin: ['https://co-space-together.vercel.app', 'http://127.0.0.1:5501'], // List of allowed origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    optionsSuccessStatus: 204,
    preflightContinue: false
};

// Middleware
app.options('*', cors(corsOptions)); // handle OPTIONS
app.use(cors(corsOptions));          // apply CORS
app.use(express.json());             // Body parsing comes after CORS
app.use(bodyParser.json()); // parse incoming POST request

// API Endpoints

// POST and PUT Data
app.post("/data/:objectName", (req, res) => {
    const objectName = req.params.objectName;
    const data = req.body;
    
    try {
        fileSystem.saveToFile(objectName, data);
        res.json({ message: `Data saved for ${objectName}` });
    } catch (error) {
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
        res.status(500).json({ error: "Error reading data." });
    }
});

// GET a single object
app.get("/data/user/:objectName", (req, res) => {
    const objectName = req.params.objectName;

    try {
        const data = fileSystem.getOne(objectName);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving data." });
    }
});

// get the base url and port
const BASE_URL = process.env.BASE_URL || "http://localhost:";
const PORT = process.env.PORT || 8080;
const URL = `${BASE_URL}${PORT}`;

// start server
app.listen(PORT, () => console.log(`Server running on ${URL}`));
