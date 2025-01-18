import db from "./db";

db.query("DROP TABLE IF EXISTS posts").run();
db.query("DROP TABLE IF EXISTS users").run();
// Does not drop relics table because it's costly to recreate
db.query("DROP TABLE IF EXISTS rewards").run();
db.query("DROP TABLE IF EXISTS items").run();

const createUsers = `
  CREATE TABLE IF NOT EXISTS users(
    user_id TEXT PRIMARY KEY NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );`;

db.query(createUsers).run();

const createPosts = `
  CREATE TABLE IF NOT EXISTS posts(
    post_id TEXT PRIMARY KEY,
    relic_name TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    open_slots INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id)
      REFERENCES users (user_id)
  );`;

db.query(createPosts).run();

// Create the relics table
const createRelics = `
  CREATE TABLE IF NOT EXISTS relics (
    id TEXT PRIMARY KEY NOT NULL,
    tier TEXT NOT NULL,
    relic_name TEXT NOT NULL,
    state TEXT NOT NULL
  );`;

db.query(createRelics).run();

// Create the items table
const createItems = `
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY NOT NULL,
    item_name TEXT NOT NULL
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
