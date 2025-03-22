/**
* @name: Co-Space Web App - Property Model
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
const property = sequelize.define(
  'Property',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // auto-incremented unique identifier for the user
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING, 
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    neighborhood: {
      type: DataTypes.STRING,
      allowNull: false
    },
    squareFeet: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    hasParkingGarage: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    hasTransportation: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    createdDate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    updatedDate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  },
  {
    tableName: 'properties', // name of the table in the database
    timestamps: false, // disable automatic timestamp fields
  }
);

module.exports = property;