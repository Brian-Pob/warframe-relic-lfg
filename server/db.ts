import { Database } from "bun:sqlite";

const db = new Database("database.sqlite", { create: true, strict: true });
db.query("PRAGMA foreign_keys = ON").run();

export default db;
