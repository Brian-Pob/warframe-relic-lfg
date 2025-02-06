import { randomUUIDv7 } from "bun";
import db from "./db";
import { getRandomNumber } from "@/utils/random";

const NUM_USERS = 5;
const NUM_POSTS = 3;
const USER_IDS: string[] = [];

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

const TOTAL_RELICS = Object.values(
  db.query("SELECT COUNT(*) FROM relics").get() as object,
)[0];

const SAMPLE_RELICS: string[] = [];
for (let i = 0; i < NUM_POSTS; i++) {
  SAMPLE_RELICS.push(
    Object.values(
      db
        .query(
          `SELECT relic_id FROM relics LIMIT 1 OFFSET ${getRandomNumber(0, TOTAL_RELICS)};`,
        )
        .get() as object,
    )[0] as string,
  );
}
// Adding posts
for (let i = 0; i < NUM_POSTS; i++) {
  const addPost = `
  INSERT INTO posts (post_id, relic_id, user_id, created_at, updated_at, open_slots) VALUES ($post_id, $relic_id, $user_id, $created_at, $updated_at, $open_slots)
`;
  db.query(addPost).run({
    post_id: randomUUIDv7(),
    relic_id: SAMPLE_RELICS[i],
    user_id: USER_IDS[Math.floor(Math.random() * USER_IDS.length)],
    created_at: Date.now(),
    updated_at: Date.now(),
    open_slots: Math.floor(Math.random() * 4),
  });
}

// console.log(db.query("SELECT * FROM users").get());
const sampleOutputDir = "./tests/sample_post.json";
console.log("Created sample data in", sampleOutputDir);
console.log(db.query("SELECT * FROM posts").get());
await Bun.write(
  sampleOutputDir,
  JSON.stringify(db.query("SELECT * FROM posts").get()),
);
