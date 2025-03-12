/**
* @name: Co-Space Web App - User Model
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

const { Sequelize, DataTypes } = require('sequelize');
const database = require('../configurations/dbConfig');

// connect to cospace database
const sequelize = database.connect();

// user model
const User = sequelize.define(
  'User',
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Auto-incremented unique identifier for the user
    },
    FullName: {
      type: DataTypes.STRING,
      allowNull: false, // User's full name
    },
    Phone: {
      type: DataTypes.STRING, 
      allowNull: false, // User's phone number
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Email must be unique
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false, // Password field (hashed before saving)
    },
    Role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user', // Default to 'user' if not provided
    },
    CreatedDate: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: Sequelize.NOW, // Automatically set to the current timestamp
    },
    UpdatedDate: {
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

module.exports = User;
