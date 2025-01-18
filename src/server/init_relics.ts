import db from "./db"; // Adjust the import based on your project structure

// Drop existing tables if they exist
db.query("DROP TABLE IF EXISTS rewards").run();
db.query("DROP TABLE IF EXISTS items").run();
db.query("DROP TABLE IF EXISTS relics").run();

// Create the relics table
const createRelics = `
  CREATE TABLE IF NOT EXISTS relics (
    id TEXT PRIMARY KEY NOT NULL,
    tier TEXT NOT NULL,
    relicName TEXT NOT NULL,
    state TEXT NOT NULL
  );`;

db.query(createRelics).run();

// Create the items table
const createItems = `
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY NOT NULL,
    itemName TEXT NOT NULL
  );`;

db.query(createItems).run();

// Create the rewards table
const createRewards = `
  CREATE TABLE IF NOT EXISTS rewards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    relic_id TEXT NOT NULL,
    item_id TEXT NOT NULL,
    rarity TEXT NOT NULL,
    chance REAL NOT NULL,
    FOREIGN KEY (relic_id) REFERENCES relics(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
  );`;

db.query(createRewards).run();

console.log("Tables created successfully!");
