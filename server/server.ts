import { Elysia } from "elysia";
import { isHtml } from "@elysiajs/html";
import { Database } from "bun:sqlite";
import type { Post } from "../src/types/Post";
import type { User } from "../src/types/User";

const db = new Database("database.sqlite");

const app = new Elysia()
	.get("/", () => "Welcome to the Warframe Relic LFG API")
	.get("/api/posts", () => {
		console.log("Getting all posts...");
		const allPosts: Post[] = db.query("SELECT * FROM posts").all() as Post[];

		return allPosts;
	})
	.get("/api/posts/:post_id", ({ params: { post_id } }) => {
		console.log(`Getting post with id ${post_id}`);
		const post: Post = db
			.query("SELECT * FROM posts WHERE post_id = $post_id")
			.get({ $post_id: post_id }) as Post;

		return post;
	})
	.get("/api/users", () => {
		console.log("Getting all users...");
		const allUsers: User[] = db
			.query("SELECT user_id, username FROM users")
			.all() as User[];

		return allUsers;
	})
	.onError(({ code }) => {
		if (code === "NOT_FOUND") {
			return "Page not found - ≽^╥⩊╥^≼";
		}
	})
	.listen(8080);

console.log(`🦊 Elysia is running at on port ${app.server?.port}...`);
