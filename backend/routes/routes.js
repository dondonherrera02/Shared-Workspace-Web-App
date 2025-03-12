/**
* @name: Co-Space Web App - Router JS
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

const express = require('express');
const RouterUtilService = express.Router();

// namespaces - controllers
const UserController = require('../controllers/UserController');

// USER Routes
RouterUtilService.post('/user', UserController.createUser); // create user
RouterUtilService.put('/user/:id', UserController.updateUser); // update user
RouterUtilService.get('/user', UserController.getUsers); // get users
RouterUtilService.get('/user/:id', UserController.getUserById); // get user by id


module.exports = RouterUtilService;