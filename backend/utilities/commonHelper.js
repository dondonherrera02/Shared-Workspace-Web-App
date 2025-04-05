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
    const where = Object.entries(filters || {})  // converts object to array of key-value pairs
        .reduce((filter, [key, value]) => {  // iterates over each key-value pair
            
            // Check if the value is a boolean
            if (typeof value === "boolean") {
                // Direct boolean match (no like operator needed)
                filter[key] = value;
            } else {
                // Ensure value is treated as a string for case-insensitive matching
                filter[key] = { [Op.like]: `%${String(value)}%` };  // case-insensitive matching
            }

            return filter;
        }, {});  // initial accumulator is an empty object
    
    console.log("Filter being applied:", where);
    
    return where;
};

module.exports = {
    HashPassword,
    MakeCaseInsensitiveFilters,
    GenerateToken
};
