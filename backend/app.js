/**
* @name: Co-Space Web App - start-up file
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

const express = require('express'); // express js web server
const bodyParser = require('body-parser'); // read incoming POST request
const apiRoutes = require('./routes/routes'); // api routes or endpoints
const cors = require('cors'); // cors middleware
const app = express(); // create express app

const corsOptions = {
    origin: '*', // allowed origin
    methods: 'POST,PUT,POST,GET,DELETE', // allowed http methods
    optionsSuccessStatus: 204, // for initial success
  };

app.use(express.json()); // express middleware
app.use(cors(corsOptions)); // add cors origin
app.use(bodyParser.json()); // parse incoming POST request
app.use('/api', apiRoutes); // API routes

// get the base url and port
const BASE_URL = process.env.BASE_URL || "http://localhost:";
const PORT = process.env.PORT || 8081;

// Start server
app.listen(PORT, () => console.log(`Server running on ${BASE_URL}${PORT}`));