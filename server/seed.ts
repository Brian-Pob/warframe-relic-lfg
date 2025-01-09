import { Database } from "bun:sqlite";
import { randomUUIDv7 } from "bun";
const db = new Database("database.sqlite", { strict: true });

const user_id = randomUUIDv7();
const username = "dabrianator";
const password = "password123";
const passwordHash = await Bun.password.hash(password);
const addUser = `
  INSERT INTO users (user_id, username, password) VALUES($user_id, $username, $password);
`;
db.query(addUser).run({
	user_id: user_id,
	username: username,
	password: passwordHash,
});

const addPost = `
  INSERT INTO posts (post_id, relic, user_id, created_at, updated_at open_slots) VALUES ($post_id, $relic, $user_id, $created_at, $updated_at, $open_slots)
`;
db.query(addPost).run({
	post_id: randomUUIDv7(),
	relic: "Axi A1 Radiant",
	user_id: user_id,
	created_at: Date.now(),
	updated_at: Date.now(),
	open_slots: 3,
});
