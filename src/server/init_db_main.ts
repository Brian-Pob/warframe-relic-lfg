import db from "./db";

db.query("DROP TABLE IF EXISTS posts").run();
db.query("DROP TABLE IF EXISTS users").run();
// Does not drop relics and related tables because it's costly to recreate
// db.query("DROP TABLE IF EXISTS relics").run();
// db.query("DROP TABLE IF EXISTS rewards").run();
// db.query("DROP TABLE IF EXISTS items").run();

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
    relic_id TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    open_slots INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (relic_id) REFERENCES relics(id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  );`;

db.query(createPosts).run();
