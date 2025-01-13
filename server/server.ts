import { Elysia } from "elysia";
import { PostModel, type Post } from "../src/types/Post";
import { UserModel, type User } from "../src/types/User";
import db from "./db";

const app = new Elysia()
  .get("/", () => "Welcome to the Warframe Relic LFG API")
  .get("/api/posts", () => {
    console.log("Getting all posts...");
    const allPosts = db.query("SELECT * FROM posts").all() as Post[];

    return allPosts;
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
          post_id: body.post_id,
          relic_name: body.relic_name,
          user_id: body.user_id,
          created_at: body.created_at,
          updated_at: body.updated_at,
          open_slots: body.open_slots,
        });
      } catch (e) {
        console.error(e);
        return error(500, e);
      }

      return body;
    },
    { body: PostModel },
  )
  .put(
    "/api/posts",
    ({ body, error }) => {
      console.log(`Updating post with id ${body.post_id}`);

      const updatePost = `
			UPDATE posts SET relic_name = $relic_name, updated_at = $updated_at, open_slots = $open_slots WHERE post_id = $post_id
			`;
      try {
        db.query(updatePost).run({
          relic_name: body.relic_name,
          updated_at: body.updated_at,
          open_slots: body.open_slots,
          post_id: body.post_id,
        });
      } catch (e) {
        console.log("Error updating post");
        console.log(e);
        return error(500, e);
      }

      // if success, return the updated post
      const updatedPost = db
        .query("SELECT * FROM posts WHERE post_id = $post_id")
        .get({ post_id: body.post_id }) as Post;

      return updatedPost;
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
  .post(
    "/api/users",
    ({ body, error }) => {
      console.log(`Creating user with username: ${body.username}`);

      const insertUser = `
			INSERT INTO users (user_id, username, password) VALUES ($user_id, $username, $password)
			`;
      if (
        !body.password?.trim() ||
        !body.username.trim() ||
        !body.user_id.trim()
      ) {
        return error(400, "Bad data provided");
      }

      try {
        db.query(insertUser).run({
          user_id: body.user_id,
          username: body.username,
          password: Bun.password.hashSync(body.password),
        });
      } catch (e) {
        console.error(e);
        return error(500, e);
      }

      // if success, return the created user
      const createdUser = db
        .query("SELECT user_id, username FROM users WHERE user_id = $user_id")
        .get({ user_id: body.user_id }) as User;

      return createdUser;
    },
    { body: UserModel },
  )
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
