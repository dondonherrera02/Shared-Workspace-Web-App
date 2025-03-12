/**
* @name: Co-Space Web App - Manual Creation of Database
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon Herrera
*/

const sqlite3 = require('sqlite3').verbose();

// Create a new database (if it doesn't exist) or open an existing one
const DATABASE_NAME = process.env.DATABASE_NAME || "cospace.db";
const db = new sqlite3.Database(`./${DATABASE_NAME}`);

// Run the SQL query to create the 'users' table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,     -- Auto-generated unique identifier for the user
    FullName TEXT NOT NULL,                   -- The user's full name
    Phone TEXT NOT NULL,                      -- The user's phone number
    Email TEXT NOT NULL,                      -- The user's email address
    Password TEXT NOT NULL,                   -- The user's password (hashed before saving)
    Role TEXT NOT NULL,                       -- The user's role (e.g., "co-worker", "workspace-owner")
    CreatedDate TEXT NOT NULL,                -- Date and time when the user was created
    UpdatedDate TEXT NOT NULL                 -- Date and time when the user was last updated
  )
`, (err) => {
    if (err) {
        console.error('Error creating the users table:', err.message);
    } else {
        console.log('Users table created (or already exists)');
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
