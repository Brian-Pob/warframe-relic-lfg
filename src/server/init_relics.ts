import db from "./db";

db.query("DROP TABLE IF EXISTS relics").run();

const createRelics = `
  CREATE TABLE IF NOT EXISTS relics (
    id TEXT PRIMARY KEY NOT NULL,
    tier TEXT NOT NULL,
    relic_name TEXT NOT NULL,
    state TEXT NOT NULL
  );`;

db.query(createRelics).run();
