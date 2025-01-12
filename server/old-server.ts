import { Database } from "bun:sqlite";
import type { Post } from "../src/types/Post";
import type { User } from "../src/types/User";

const db = new Database("database.sqlite");

const server = Bun.serve({
	async fetch(req) {
		const path = new URL(req.url).pathname;

		if (path === "/api/posts") {
			console.log("Getting all posts");
			const allPosts: Post[] = db.query("SELECT * FROM posts").all() as Post[];
			return new Response(JSON.stringify(allPosts));
		}

		//NOTE - Bun does not support dynamic routes out of the box
		// if (path === "/api/posts/:post_id") {
		// 	console.log("Getting specific post");
		// 	const post_id = new URL(req.url).pathname.split("/")[2];
		// 	const post: Post = db
		// 		.query("SELECT * FROM posts WHERE post_id = $post_id")
		// 		.get({ $post_id: post_id }) as Post;
		// 	return new Response(JSON.stringify(post));
		// }

		if (path === "/api/users") {
			console.log("Getting all users");
			const allUsers: User[] = db
				.query("SELECT user_id, username FROM users")
				.all() as User[];

			return new Response(JSON.stringify(allUsers));
		}
		// 404s
		return new Response("Page not found - ≽^╥⩊╥^≼", { status: 404 });
	},
});

console.log(`Server running on ${server.url}`);
