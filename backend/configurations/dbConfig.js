/**
* @name: Co-Space Web App - Database Configurations
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

const { Sequelize } = require('sequelize');
const DATABASE_NAME = process.env.DATABASE_NAME || "cospace.db";

const connect = () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: `./${DATABASE_NAME}`,
  });

  return sequelize;
};

module.exports = { connect };