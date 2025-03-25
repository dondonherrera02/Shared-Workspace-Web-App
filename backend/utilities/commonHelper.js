/**
* @name: Co-Space Web Common Helper
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Ref: https://www.freecodecamp.org/news/how-to-hash-passwords-with-bcrypt-in-nodejs/

const bcrypt = require('bcrypt');
const { Op } = require("sequelize");

const HashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
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
    MakeCaseInsensitiveFilters
};
