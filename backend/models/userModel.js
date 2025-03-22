/**
* @name: Co-Space Web App - User Model
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/

const { Sequelize, DataTypes } = require('sequelize');
const database = require('../databases/databaseConfig');

// connect to cospace database
const sequelize = database.connect();

// user model
const user = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Auto-incremented unique identifier for the user
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false, // User's full name
    },
    phone: {
      type: DataTypes.STRING, 
      allowNull: false, // User's phone number
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Email must be unique
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Password field (hashed before saving)
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user', // Default to 'user' if not provided
    },
    createdDate: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: Sequelize.NOW, // Automatically set to the current timestamp
    },
    updatedDate: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: Sequelize.NOW, // Automatically set to the current timestamp
    },
  },
  {
    tableName: 'users', // Name of the table in the database
    timestamps: false, // Disable automatic timestamp fields
  }
);

module.exports = user;