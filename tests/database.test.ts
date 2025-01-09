import { expect, test, describe } from "bun:test";
import { Database } from "bun:sqlite";
import type { Post } from "../src/types/Post";

const db = new Database("database.sqlite");

describe("read", () => {
	test("get all posts", () => {
		const allPosts: Post[] = db.query("SELECT * FROM posts").all() as Post[];
		expect(allPosts).toBeDefined();
		expect(allPosts.length).toBeGreaterThan(0);

		console.log(allPosts);
	});

	test("2 * 2", () => {
		expect(2 * 2).toBe(4);
	});
});
