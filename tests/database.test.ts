import { expect, test, describe, afterAll } from "bun:test";
import { Database } from "bun:sqlite";
import type { Post } from "../src/types/Post";
import type { User } from "../src/types/User";

const db = new Database("database.sqlite");

const USER_ID = "0194504a-d742-7000-90af-d40c7b03eb8e";
const USERNAME = USER_ID.split("-")[3];
const POST_ID = "0194504a-d7fc-7000-8db1-f4074499f1a6";
const RELIC_NAME = "Meso M4 Exceptional";

describe("read", () => {
	test("get all posts", () => {
		const allPosts: Post[] = db.query("SELECT * FROM posts").all() as Post[];
		expect(allPosts).toBeDefined();
		expect(allPosts.length).toBeGreaterThan(0);

		// console.log(allPosts);
	});

	test("get all users", () => {
		const allUsers: User[] = db.query("SELECT * FROM users").all() as User[];
		expect(allUsers).toBeDefined();
		expect(allUsers.length).toBeGreaterThan(0);

		// console.log(allUsers);
	});

	test("get specific user", async () => {
		const user: User = db
			.query("SELECT * FROM users WHERE user_id = $user_id")
			.get({ $user_id: USER_ID }) as User;
		expect(user).not.toBeNull();
		expect(user.user_id).toBe(USER_ID);
		expect(user.username).toBe(USERNAME);

		const password_match = await Bun.password.verify(
			USERNAME,
			user.password as string,
		);
		expect(password_match).toBe(true);
	});

	test("get specific post", () => {
		const post: Post = db
			.query("SELECT * FROM posts WHERE post_id = $post_id")
			.get({ $post_id: POST_ID }) as Post;
		expect(post).not.toBeNull();
		expect(post.post_id).toBe(POST_ID);
		expect(post.relic_name).toBe(RELIC_NAME);
		expect(post.user_id).toBe(USER_ID);

		const created_at = new Date(Number(post.created_at) * 1000); // Convert to milliseconds
		const updated_at = new Date(Number(post.updated_at) * 1000);
		expect(created_at instanceof Date).toBe(true);
		expect(updated_at instanceof Date).toBe(true);
		expect(post.open_slots).toBeGreaterThanOrEqual(0);
		expect(post.open_slots).toBeLessThanOrEqual(3);
	});
});

const NEW_USER_ID = Bun.randomUUIDv7();
const NEW_POST_ID = Bun.randomUUIDv7();
describe("write", () => {
	test("add user", () => {
		console.log("Adding user:", NEW_USER_ID);
		const user_id = NEW_USER_ID;
		const username = user_id.split("-")[3];
		const password = username;
		const passwordHash = Bun.password.hashSync(password);
		const addUser = `
			INSERT INTO users (user_id, username, password) VALUES($user_id, $username, $password);
		`;
		db.query(addUser).run({
			$user_id: user_id,
			$username: username,
			$password: passwordHash,
		});

		const user: User = db
			.query("SELECT * FROM users WHERE user_id = $user_id")
			.get({ $user_id: user_id }) as User;
		expect(user).not.toBeNull();
		expect(user.user_id).toBe(user_id);
		expect(user.username).toBe(username);
		expect(user.password).toBe(passwordHash);
	});

	test("add post", () => {
		console.log("Adding post:", NEW_POST_ID);
		const post_id = NEW_POST_ID;
		const relic_name = RELIC_NAME;
		const user_id = USER_ID;
		const created_at = Date.now();
		const updated_at = Date.now();
		const open_slots = 3;
		const addPost = `
			INSERT INTO posts (post_id, relic_name, user_id, created_at, updated_at, open_slots) VALUES ($post_id, $relic_name, $user_id, $created_at, $updated_at, $open_slots)
		`;
		db.query(addPost).run({
			$post_id: post_id,
			$relic_name: relic_name,
			$user_id: user_id,
			$created_at: created_at,
			$updated_at: updated_at,
			$open_slots: open_slots,
		});

		const post: Post = db
			.query("SELECT * FROM posts WHERE post_id = $post_id")
			.get({ $post_id: post_id }) as Post;
		expect(post).not.toBeNull();
		expect(post.post_id).toBe(post_id);
		expect(post.relic_name).toBe(relic_name);
		expect(post.user_id).toBe(user_id);

		// Date is stored as string in sqlite
		expect(Number(post.created_at)).toBe(created_at);
		expect(Number(post.updated_at)).toBe(updated_at);
		expect(post.open_slots).toBe(open_slots);
	});
});

describe("update", () => {
	test("update post", () => {
		console.log("Updating post:", NEW_POST_ID);
		const post_id = NEW_POST_ID;
		const updated_at = Date.now();
		const open_slots = 2;
		const updatePost = `
			UPDATE posts SET updated_at = $updated_at, open_slots = $open_slots WHERE post_id = $post_id;
		`;
		db.query(updatePost).run({
			$updated_at: updated_at,
			$open_slots: open_slots,
			$post_id: post_id,
		});

		const post: Post = db
			.query("SELECT * FROM posts WHERE post_id = $post_id")
			.get({ $post_id: post_id }) as Post;
		expect(post).not.toBeNull();
		expect(post.post_id).toBe(post_id);

		// Date is stored as string in sqlite
		expect(Number(post.updated_at)).toBe(updated_at);
		expect(post.open_slots).toBe(open_slots);
	});

	test("update user", () => {
		console.log("Updating user:", NEW_USER_ID);
		const user_id = NEW_USER_ID;
		const username = user_id.split("-")[0];
		const password = "username123";
		const passwordHash = Bun.password.hashSync(password);
		const updateUser = `
			UPDATE users SET username = $username, password = $password WHERE user_id = $user_id;
		`;
		db.query(updateUser).run({
			$username: username,
			$password: passwordHash,
			$user_id: user_id,
		});

		const user: User = db
			.query("SELECT * FROM users WHERE user_id = $user_id")
			.get({ $user_id: user_id }) as User;
		expect(user).not.toBeNull();
		expect(user.user_id).toBe(user_id);
		expect(user.username).toBe(username);
		expect(user.password).toBe(passwordHash);

		console.log(user);
	});
});

describe("delete", () => {
	test("delete user", () => {
		console.log("Deleting user:", NEW_USER_ID);
		const user_id = NEW_USER_ID;
		const deleteUser = `
			DELETE FROM users WHERE user_id = $user_id;
		`;
		db.query(deleteUser).run({ $user_id: user_id });

		const user: User = db
			.query("SELECT * FROM users WHERE user_id = $user_id")
			.get({ $user_id: user_id }) as User;
		expect(user).toBeNull();
	});

	test("delete post", () => {
		console.log("Deleting post:", NEW_POST_ID);
		const post_id = NEW_POST_ID;
		const deletePost = `
			DELETE FROM posts WHERE post_id = $post_id;
		`;
		db.query(deletePost).run({ $post_id: post_id });

		const post: Post = db
			.query("SELECT * FROM posts WHERE post_id = $post_id")
			.get({ $post_id: post_id }) as Post;
		expect(post).toBeNull();
	});
});

describe("injection", () => {
	afterAll(() => {
		const deleteUser = `
			DELETE FROM users WHERE user_id = $user_id;
		`;
		db.query(deleteUser).run({ $user_id: 12345 });
	});
	test("sql injection attack fails when creating a user", async () => {
		const user_id = "12345";
		const username = '" OR "1" = "1';
		const password = "password";
		const passwordHash = await Bun.password.hash(password);
		const addUser = `
			INSERT INTO users (user_id, username, password) VALUES($user_id, $username, $password);
		`;
		db.query(addUser).run({
			$user_id: user_id,
			$username: username,
			$password: passwordHash,
		});

		const user: User = db
			.query("SELECT * FROM users WHERE user_id = $user_id")
			.get({ $user_id: user_id }) as User;

		// If user exists it means injection attack failed
		expect(user).not.toBeNull();
	});
});
