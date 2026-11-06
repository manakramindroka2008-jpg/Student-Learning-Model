
const Database = require("better-sqlite3");
const path = require("path");

// Create or open the SQLite database file
const dbPath = path.join(__dirname, "lms.db");
const db = new Database(dbPath);

// Enable foreign key support
db.pragma("foreign_keys = ON");

console.log("SQLite database connected successfully!");

module.exports = db;
