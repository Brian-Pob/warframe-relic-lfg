import { Database } from "bun:sqlite";
import { randomUUIDv7 } from "bun";
const db = new Database("database.sqlite", { strict: true });
db.query("PRAGMA foreign_keys = ON").run();

const NUM_USERS = 5;
const NUM_POSTS = 3;
const USER_IDS: string[] = [];
const SAMPLE_RELICS = [
  "Axi A1 Radiant",
  "Lith K2 Intact",
  "Meso M4 Exceptional",
  "Neo B3 Flawless",
];

// Adding users
for (let i = 0; i < NUM_USERS; i++) {
  const user_id = randomUUIDv7();
  USER_IDS.push(user_id);

  const username = user_id.split("-")[3];
  const password = username;
  const passwordHash = await Bun.password.hash(password);

  const addUser = `
  INSERT INTO users (user_id, username, password) VALUES($user_id, $username, $password);
`;
  db.query(addUser).run({
    user_id: user_id,
    username: username,
    password: passwordHash,
  });
}

// Adding posts
for (let i = 0; i < NUM_POSTS; i++) {
  const addPost = `
  INSERT INTO posts (post_id, relic_name, user_id, created_at,updated_at, open_slots) VALUES ($post_id, $relic_name, $user_id, $created_at, $updated_at, $open_slots)
`;
  db.query(addPost).run({
    post_id: randomUUIDv7(),
    relic_name: SAMPLE_RELICS[Math.floor(Math.random() * SAMPLE_RELICS.length)],
    user_id: USER_IDS[Math.floor(Math.random() * USER_IDS.length)],
    created_at: Date.now(),
    updated_at: Date.now(),
    open_slots: Math.floor(Math.random() * 4),
  });
}

console.log(db.query("SELECT * FROM users").get());
console.log(db.query("SELECT * FROM posts").get());
await Bun.write(
  "./tests/sample_post.json",
  JSON.stringify(db.query("SELECT * FROM posts").get()),
);
