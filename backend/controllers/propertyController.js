/**
* @name: Co-Space Web App - Property Controller
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// References:
// https://lo-victoria.com/build-a-rest-api-with-nodejs-routes-and-controllers
const propertyManager = require('../managers/propertyManager');

// COMMAND - POST, PUT, DELETE

// Create a new property
const createProperty = async (req, res) => {
    try {
        const property = await propertyManager.createProperty(req, res);

        res.status(201).json({
            message: 'Property created successfully',
            property: {
                id: property.id,
                name: property.name,
                street: property.street,
                city: property.city,
                state: property.state,
                postalCode: property.postalCode,
                neighborhood: property.neighborhood,
                squareFeet: property.squareFeet,
                hasParkingGarage: property.hasParkingGarage,
                hasTransportation: property.hasTransportation,
                createdDate: property.createdDate,
                ownerId: property.ownerId
            }
        });
    } catch {
    }
};

// Update a property
const updateProperty = async (req, res) => {
    try {

        const property = await propertyManager.updateProperty(req, res);

        res.status(200).json({
            message: 'Property created successfully',
            property: {
                id: property.id,
                name: property.name,
                street: property.street,
                city: property.city,
                state: property.state,
                postalCode: property.postalCode,
                neighborhood: property.neighborhood,
                squareFeet: property.squareFeet,
                hasParkingGarage: property.hasParkingGarage,
                hasTransportation: property.hasTransportation,
                updatedDate: property.updatedDate,
                ownerId: property.ownerId
            }
        });
    } catch {
    }
};

const deleteProperty = async (req, res) => {
    try {
        await propertyManager.deleteProperty(req, res);
        res.status(200).json({ message: 'Property deleted successfully'});
    } catch {
    }
};

// QUERY - GET

// Get property list
const getProperties = async (req, res) => {
    try {
        const properties = await propertyManager.getProperties(req, res);
        res.status(200).json(properties);
    } catch {
    }
};

// Get property by id
const getPropertyById = async (req, res) => {
    try {
        const property = await propertyManager.getProperty(req, res);
        res.status(200).json(property);
    } catch {
    }
};

module.exports = {
    createProperty,
    updateProperty,
    deleteProperty,
    getProperties,
    getPropertyById
};