import { Elysia, t } from "elysia";
import { PostModel, type PostDB } from "@/types/Post";
import { UserModel, type User } from "@/types/User";
import db from "./db";

export const app = new Elysia()
  .get("/api", () => "Welcome to the Warframe Relic LFG API")
  .get(
    "/api/posts",
    ({ query }) => {
      // ?relic= should be in the form RELIC-TIER_RELIC-NAME
      // Example: meso_a2 / axi_B11
      console.log(query.relic);

      if (!query.relic) {
        console.log("No relic provided, returning all posts...");
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
                    r.id,
                    r.state,
                    u.username
                FROM
                    posts p
                JOIN
                    relics r ON p.relic_id = r.id
                JOIN
                    users u ON p.user_id = u.user_id
            `,
          )
          .all() as (PostDB & {
          relic_tier: string;
          relic_name: string;
          username: string;
          state: string;
        })[];
        return posts;
      }

      const relic_tier = query.relic?.split("_")[0];
      const relic_name = query.relic?.split("_")[1];
      const posts = db
        .query(
          `
                SELECT
                    p.post_id,
                    p.updated_at,
                    p.open_slots,
                    r.relic_name,
                    r.tier,
                    r.id,
                    r.state,
                    u.username
                FROM
                    posts p
                JOIN
                    relics r ON p.relic_id = r.id
                JOIN
                    users u ON p.user_id = u.user_id
                WHERE
                    r.relic_name LIKE $relic_name AND
                    r.tier LIKE $relic_tier
            `,
        )
        .all({
          relic_name: relic_name,
          relic_tier: relic_tier,
        }) as (PostDB & {
        relic_tier: string;
        relic_name: string;
        username: string;
        state: string;
      })[];

      return posts ?? [];
    },
    {
      query: t.Object({
        relic: t.Optional(t.String()),
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
    { body: PostModel.DB },
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
        .get({ post_id: body.post_id }) as PostDB;

      return updatedPost;
    },
    { body: PostModel.DB },
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
  .listen(Bun.env.SERVER_PORT ?? 5174);

console.log(`🦊 Elysia is running on port ${app.server?.port}...`);
