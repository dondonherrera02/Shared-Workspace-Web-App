/**
* @name: Co-Space Web Common Helper
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Ref: https://www.freecodecamp.org/news/how-to-hash-passwords-with-bcrypt-in-nodejs/

const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
require('dotenv').config(); // set up global configuration access - .env file
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_DURATION = process.env.TOKEN_DURATION;

const HashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

const GenerateToken = (existingUser) => {
    const token = jwt.sign(
        {
            id: existingUser.id,
            email: existingUser.email,
            phone: existingUser.phone,
            fullName: existingUser.fullName,
            role: existingUser.role
        },
        JWT_SECRET, { expiresIn: TOKEN_DURATION });
    return token;
};

// https://sequelize.org/docs/v7/querying/operators/
const MakeCaseInsensitiveFilters = (filters) => {
    return Object.entries(filters || {})  // converts object to array of key-value pairs
        .reduce((filter, [key, value]) => {  // iterates over each key-value pair
            // ensure value is a string
            filter[key] = { [Op.like]: `%${String(value)}%` }; // case-insensitive matching
            return filter;
        }, {});  // initial accumulator is an empty object
};

module.exports = {
    HashPassword,
    MakeCaseInsensitiveFilters,
    GenerateToken
};
