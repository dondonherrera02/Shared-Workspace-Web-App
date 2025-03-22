/**
* @name: Co-Space Web App - Manual Creation of Database
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

// Reference: https://www.geeksforgeeks.org/how-to-create-table-in-sqlite3-database-using-node-js/

const sqlite3 = require('sqlite3').verbose();

// Create a new database (if it doesn't exist) or open an existing one
const DATABASE_NAME = "cospace.db";
const db = new sqlite3.Database(`./${DATABASE_NAME}`);

// Run the SQL query to create the 'users' table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,     -- Auto-generated unique identifier for the user
    fullName TEXT NOT NULL,                   -- The user's full name
    phone TEXT NOT NULL,                      -- The user's phone number
    email TEXT NOT NULL,                      -- The user's email address
    password TEXT NOT NULL,                   -- The user's password (hashed before saving)
    role TEXT NOT NULL,                       -- The user's role (e.g., "co-worker", "workspace-owner")
    createdDate TEXT NOT NULL,                -- Date and time when the user was created
    updatedDate TEXT NOT NULL                 -- Date and time when the user was last updated
  )
`, (err) => {
    if (err) {
        console.error('Error creating users table:', err.message);
    } else {
        console.log('Users table created.');
    }
});

// Run the SQL query to create the 'properties' table
db.run(`
    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,     -- Auto-generated unique identifier for the property
      name TEXT NOT NULL,                       -- The property's name
      street TEXT NOT NULL,                     -- The property's street name
      city TEXT NOT NULL,                       -- The property's city
      state TEXT NOT NULL,                      -- The property's state
      postalCode TEXT NOT NULL,                 -- The property's postal code
      neighborhood TEXT NOT NULL,               -- The property's neighborhood
      squareFeet REAL NOT NULL,                 -- The property's sqft.
      hasParkingGarage BOOLEAN NOT NULL,        -- If property has parking garage
      hasTransportation BOOLEAN NOT NULL,       -- If property has transportation access
      createdDate TEXT NOT NULL,                -- Date and time when the property was created
      updatedDate TEXT NOT NULL,                -- Date and time when the property was last updated
      ownerId INTEGER,                          -- Property's ownerId
      FOREIGN KEY(ownerId) REFERENCES users(id) -- Foreign key linking to the users table
    )
`, (err) => {
    if (err) {
        console.error('Error creating properties table:', err.message);
    } else {
        console.log('Properties table created');
    }
});


// Close the database connection after creating the table
db.close((err) => {
    if (err) {
        console.error('Error closing the database:', err.message);
    } else {
        console.log('Database connection closed');
    }
});