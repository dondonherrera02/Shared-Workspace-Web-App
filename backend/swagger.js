/**
* @name: Co-Space Web App - Swagger JS
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Ref: https://dev.to/desmondsanctity/documenting-nodejs-api-using-swagger-4klp

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Co-Space',
            description: "API endpoints for a co-working space services (work in progress...)",
            contact: {
                name: "Dondon Herrera",
                email: "d.herrera111@mybvc.ca",
                url: "https://www.linkedin.com/in/dondon-herrera/"
            },
            version: '1.0.0',
        },
        servers: [
            {
                url: "http://localhost:8080/",
                description: "Local server"
            },
            {
                url: "https://co-space-dev.onrender.com",
                description: "Live server"
            },
        ]
    },
    // API routes
    apis: ['./routers/routes.js'],
}

const swaggerSpec = swaggerJsdoc(options)

const SwaggerDocs = (app, port) => {
    // Swagger Page
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    // Documentation in JSON format
    app.get('/swagger.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })
}

module.exports = {
    SwaggerDocs
};