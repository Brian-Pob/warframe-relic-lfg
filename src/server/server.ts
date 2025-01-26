import { Elysia, t } from "elysia";
import { PostModel, type Post } from "@/types/Post";
import { UserModel, type User } from "@/types/User";
import db from "./db";

const app = new Elysia()
  .get("/api", () => "Welcome to the Warframe Relic LFG API")
  .get(
    "/api/posts",
    ({ query }) => {
      if (!query.relic_id) {
        console.log("No relic_id provided, returning all posts...");
        // return db.query("SELECT * FROM posts").all() as Post[];
        const posts = db
          .query(
            `
                SELECT
                    p.post_id,
                    p.updated_at,
                    p.open_slots,
                    r.relic_name,
                    r.tier,
                    u.username
                FROM
                    posts p
                JOIN
                    relics r ON p.relic_id = r.id
                JOIN
                    users u ON p.user_id = u.user_id
            `,
          )
          .all() as (Post & {
          relic_tier: string; // Adjust the type based on your actual data type
          relic_name: string; // Adjust the type based on your actual data type
          username: string; // Adjust the type based on your actual data type
        })[];
        return posts;
      }

      console.log(`Getting post with relic_id: ${query.relic_id}`);

      // Need to rewrite this to replace the relic_id with the relic_name from the relics table and user_id with username from the users table
      const post = db
        .query("SELECT * FROM posts WHERE relic_id = $relic_id")
        .get({ relic_id: query.relic_id }) as Post;

      return post ?? [];
    },
    {
      query: t.Object({
        relic_id: t.Optional(t.String()),
      }),
    },
  )
  .post(
    "/api/posts",
    ({ body, error }) => {
      console.log(body);

      const insertPost = `
			INSERT INTO posts (post_id, relic_id, user_id, created_at, updated_at, open_slots) VALUES ($post_id, $relic_id, $user_id, $created_at, $updated_at, $open_slots)
			`;
      const now = Date.now();
      try {
        db.query(insertPost).run({
          post_id: body.post_id,
          relic_id: body.relic_id,
          user_id: body.user_id,
          created_at: now,
          updated_at: now,
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
			UPDATE posts SET relic_id = $relic_id, updated_at = $updated_at, open_slots = $open_slots WHERE post_id = $post_id
			`;
      const now = Date.now();
      try {
        db.query(updatePost).run({
          relic_id: body.relic_id,
          updated_at: now,
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
  .get("/api/users/:user_id", ({ params: { user_id }, error }) => {
    console.log(`Getting user with id: ${user_id}`);
    const user = db
      .query("SELECT user_id, username FROM users WHERE user_id = $user_id")
      .get({ $user_id: user_id }) as User;

    return user ?? error(404, "User not found");
  })
  .onError(({ code }) => {
    if (code === "NOT_FOUND") {
      return "Invalid route - ≽^╥⩊╥^≼";
    }
  })
  .listen(5174);

console.log(`🦊 Elysia is running at on port ${app.server?.port}...`);
