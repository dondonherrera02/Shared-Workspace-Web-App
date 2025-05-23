/**
 * @name: Co-Space Web App - Start-up File
 * @Course Code: SODV1201
 * @Class: Software Development Diploma Program
 * @Author: Dondon Herrera
 */

const express = require('express');
const apiRoutes = require('./routers/routes'); // import api routes or endpoints
const { SwaggerDocs } = require('./swagger.js'); 
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');

// set up global configuration access - .env file
dotenv.config();

/*
    Render – API hosting for web services.
    Vercel – Deployed the frontend.
    Please note that Render may restart due to file changes, so I ignored those files to prevent the server from restarting, which could cause CORS errors.
*/

// https://stackoverflow.com/questions/75399430/cors-errors-after-deployment-to-render-worked-fine-locally
// allowed origins for CORS
const allowedOrigins = [
    'https://co-space-together.vercel.app',         // production co-space [UI] 
    'https://co-space-dev.vercel.app',              // dev co-space [UI] 
    'http://127.0.0.1:5501'                         // local server [UI]
];

// CORS Middleware
app.use(cors({
    origin: allowedOrigins,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
}));

app.options('*', (req, res) => {
    const origin = allowedOrigins.includes(req.headers.origin) ? req.headers.origin : allowedOrigins[0];
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(204); // No Content
});

app.use(express.json()); // body parsing middleware
app.use('/api', apiRoutes); // use API routes

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/swagger`));
SwaggerDocs(app, PORT);
