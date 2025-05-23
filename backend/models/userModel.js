/**
* @name: Co-Space Web App - User Model
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/

const { DataTypes } = require('sequelize');
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
      autoIncrement: true, // auto-incremented unique identifier for the user
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING, 
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdDate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    updatedDate: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    tableName: 'users', // name of the table in the database
    timestamps: false, // disable automatic timestamp fields
  }
);

module.exports = user;