import { Elysia } from "elysia";
import { Database } from "bun:sqlite";
import { PostModel, type Post } from "../src/types/Post";
import type { User } from "../src/types/User";

const db = new Database("database.sqlite");

const app = new Elysia()
	.get("/", () => "Welcome to the Warframe Relic LFG API")
	.get("/api/posts", () => {
		console.log("Getting all posts...");
		const allPosts = db.query("SELECT * FROM posts").all() as Post[];

		return allPosts;
	})
	.get("/api/posts/:post_id", ({ params: { post_id } }) => {
		console.log(`Getting post with id ${post_id}`);
		const post = db
			.query("SELECT * FROM posts WHERE post_id = $post_id")
			.get({ $post_id: post_id }) as Post;

		return post;
	})
	.post(
		"/api/posts",
		({ body, error }) => {
			console.log(body);

			const insertPost = `
			INSERT INTO posts (post_id, relic_name, user_id, created_at, updated_at, open_slots) VALUES ($post_id, $relic_name, $user_id, $created_at, $updated_at, $open_slots)
			`;
			try {
				db.query(insertPost).run({
					$post_id: body.post_id,
					$relic_name: body.relic_name,
					$user_id: body.user_id,
					$created_at: body.created_at,
					$updated_at: body.updated_at,
					$open_slots: body.open_slots,
				});
			} catch (e) {
				console.error(e);
				return error(500, e);
			}

			return body;
		},
		{ body: PostModel },
	)
	.get("/api/users", () => {
		console.log("Getting all users...");
		const allUsers = db
			.query("SELECT user_id, username FROM users")
			.all() as User[];

		return allUsers;
	})
	.get("/api/users/:user_id", ({ params: { user_id } }) => {
		console.log(`Getting user with id: ${user_id}`);
		const user = db
			.query("SELECT user_id, username FROM users WHERE user_id = $user_id")
			.get({ $user_id: user_id }) as User;

		return user;
	})
	.onError(({ code }) => {
		if (code === "NOT_FOUND") {
			return "Invalid route - ≽^╥⩊╥^≼";
		}
	})
	.listen(8080);

console.log(`🦊 Elysia is running at on port ${app.server?.port}...`);
