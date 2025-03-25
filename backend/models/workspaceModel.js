/**
* @name: Co-Space Web App - Workspace Model
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Ref: https://sequelize.org/docs/v6/core-concepts/model-basics/

const { DataTypes } = require('sequelize');
const database = require('../databases/databaseConfig');

// connect to cospace database
const sequelize = database.connect();

// workspace model
const workspace = sequelize.define(
  'Workspace',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // auto-incremented unique identifier for the workspace
    },
    roomNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER, 
      allowNull: false
    },
    leaseTerm: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    availabilityDate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isSmokingAllowed : {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
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
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  },
  {
    tableName: 'workspaces', // name of the table in the database
    timestamps: false, // disable automatic timestamp fields
  }
);

module.exports = workspace;