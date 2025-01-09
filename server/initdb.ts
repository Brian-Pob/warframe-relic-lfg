import { Database } from "bun:sqlite";
const db = new Database("database.sqlite", { create: true });

db.query("DROP TABLE IF EXISTS users").run();
db.query("DROP TABLE IF EXISTS posts").run();

const createUsers = `
  CREATE TABLE IF NOT EXISTS users(
    user_id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );`;

db.query(createUsers).run();

const createPosts = `
  CREATE TABLE IF NOT EXISTS posts(
    post_id TEXT PRIMARY KEY,
    relic TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    open_slots INTEGER NOT NULL,
    FOREIGN KEY (user_id)
      REFERENCES users (user_id)
  );`;

db.query(createPosts).run();
