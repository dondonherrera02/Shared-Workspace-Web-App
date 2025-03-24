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
      squareFeet DECIMAL(10,2) NOT NULL,        -- The property's sqft.
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
        console.log('Properties table created successfully');
    }
});

// Run the SQL query to create the 'workspaces' table
db.run(`
    CREATE TABLE IF NOT EXISTS workspaces (
      id INTEGER PRIMARY KEY AUTOINCREMENT,                 -- Auto-generated unique identifier for the workspace
      roomNumber TEXT NOT NULL,                             -- The workspace's room number
      type TEXT NOT NULL,                                   -- Type of workspace (e.g., private, desk)
      capacity INTEGER NOT NULL,                            -- Number of people the workspace can accommodate
      leaseTerm TEXT NOT NULL,                              -- Lease term (e.g., monthly, yearly)
      availabilityDate TEXT NOT NULL,                       -- Date when the workspace is available
      isSmokingAllowed BOOLEAN NOT NULL,                    -- 0 or 1 for boolean values
      price DECIMAL(10,2) NOT NULL,                         -- Price for leasing the workspace
      createdDate TEXT NOT NULL,                            -- Auto-generated creation timestamp
      updatedDate TEXT NOT NULL,                            -- Auto-generated update timestamp
      ownerId INTEGER,                                      -- ID of the workspace owner
      propertyId INTEGER,                                   -- ID of the associated property
      FOREIGN KEY(ownerId) REFERENCES users(id),            -- Foreign key linking to the users table
      FOREIGN KEY(propertyId) REFERENCES properties(id)     -- Foreign key linking to the properties table
    )
`, (err) => {
    if (err) {
        console.error('Error creating workspaces table:', err.message);
    } else {
        console.log('Workspaces table created successfully.');
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