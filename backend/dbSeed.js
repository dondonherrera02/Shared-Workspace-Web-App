/**
* @name: Co-Space Web App - Seed Sample Data
* @Course Code: SODV1201
* @class: Software Development Diploma program.
* @author: Dondon
*/

// Reference: https://cheatcode.co/blog/how-to-use-sqlite-with-node-js

const sqlite3 = require('sqlite3').verbose();
const { HashPassword } = require('./utilities/commonHelper');

const DATABASE_NAME = "cospace.db";
const db = new sqlite3.Database(`./${DATABASE_NAME}`);
const today = new Date().toISOString().split('T')[0];

// Helpers to promisify
const runQuery = (query, params) => new Promise((resolve, reject) => {
  query.run(params, function (err) {
    if (err) reject(err);
    else resolve();
  });
});

const finalizeQuery = (query) => new Promise((resolve, reject) => {
  query.finalize((err) => {
    if (err) reject(err);
    else resolve();
  });
});

// Insert Users
async function insertUsers() {
  const users = [
    ['John Doe', '1234567890', 'owner@mail.com', 'Test@123456', 'workspace-owner', today, today],
    ['Jane Smith', '9876543210', 'worker@mail.com', 'Test@123456', 'co-worker', today, today],
  ];

  const query = db.prepare(`
    INSERT INTO users (fullName, phone, email, password, role, createdDate, updatedDate)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const user of users) {
    const hashedPassword = await HashPassword(user[3]);
    user[3] = hashedPassword;
    await runQuery(query, user);
  }

  await finalizeQuery(query);
}

// Insert Properties
async function insertProperties() {
  const properties = [
    ['Edd Building', '123 Maple Street', 'Edmonton', 'Alberta', 'E6B1A1', 'Downtown', 1500.00, 1, 1, today, today, 1],
    ['Sunset Tower', '456 Pine Avenue', 'Calgary', 'Alberta', 'T2P3N4', 'Beltline', 2800.00, 0, 1, today, today, 1],
    ['Innovation Hub', '789 Tech Way', 'Calgary', 'Alberta', 'V5K0A1', 'Mount Pleasant', 3200.00, 1, 1, today, today, 1],
    ['The Brickworks', '321 Brick Lane', 'Toronto', 'Ontario', 'M5A3J5', 'Distillery District', 2100.00, 0, 0, today, today, 1],
    ['Harbour Centre', '654 Bay Street', 'Edmonton', 'Alberta', 'V8W1S6', 'Inner Harbour', 1700.00, 1, 0, today, today, 1]
  ];

  const query = db.prepare(`
    INSERT INTO properties (name, street, city, state, postalCode, neighborhood, squareFeet, hasParkingGarage, hasTransportation, createdDate, updatedDate, ownerId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const property of properties) {
    await runQuery(query, property);
  }

  await finalizeQuery(query);
}

// Insert Workspaces
async function insertWorkspaces() {
  const workspaces = [
    ['3333', 'Meeting Room', 10, 'Day', '2025-04-30', 1, 333.00, today, today, 1, 1],
    ['204', 'Private Office', 4, 'Month', '2025-05-29', 0, 1200.00, today, today, 1, 2],
    ['105', 'Desk', 1, 'Week', '2025-04-28', 0, 10.00, today, today, 1, 3],
    ['999', 'Meeting Room', 5, 'Day', '2025-06-29', 1, 5000.00, today, today, 1, 4],
    ['501', 'Private Office', 2, 'Week', '2025-04-30', 0, 300.00, today, today, 1, 5]
  ];

  const query = db.prepare(`
    INSERT INTO workspaces (roomNumber, type, capacity, leaseTerm, availabilityDate, isSmokingAllowed, price, createdDate, updatedDate, ownerId, propertyId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const workspace of workspaces) {
    await runQuery(query, workspace);
  }

  await finalizeQuery(query);
}

// Run everything in self-invoke function
(async () => {
  try {
    await insertUsers();
    await insertProperties();
    await insertWorkspaces();

    db.close((err) => {
      if (err) console.error('Error closing DB:', err.message);
      else console.log('Success: Sample data inserted and DB closed.');
    });
  } catch (error) {
    console.error('Error during data seeding:', error);
    db.close();
  }
})();
