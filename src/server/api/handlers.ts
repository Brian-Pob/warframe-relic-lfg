import db from "../db";
import type { error as ElysiaError } from "elysia";
import SQL_QUERIES from "./queries";
import type { PostDB, PostUI } from "@/types/Post";
import type { User } from "@/types/User";
// Handlers for different routes
const handlers = {
  getPosts: ({ query }: { query: { relic?: string } }) => {
    if (!query.relic) {
      return db.query(SQL_QUERIES.GET_ALL_POSTS).all() as PostUI[];
    }

    const [relic_tier, relic_name] = query.relic.split("_");
    return db
      .query(SQL_QUERIES.GET_POSTS_BY_RELIC)
      .all({ relic_name, relic_tier }) as PostUI[];
  },

  createPost: ({
    body,
    error,
  }: { body: PostDB; error: typeof ElysiaError }) => {
    const now = Date.now();
    try {
      db.query(SQL_QUERIES.INSERT_POST).run({
        ...body,
        created_at: now,
        updated_at: now,
      });
      return body;
    } catch (e) {
      console.error("Error creating post:", e);
      return error(500, e);
    }
  },

  updatePost: ({
    body,
    error,
  }: { body: PostDB; error: typeof ElysiaError }) => {
    const now = Date.now();
    try {
      db.query(SQL_QUERIES.UPDATE_POST).run({
        relic_id: body.relic_id,
        updated_at: now,
        open_slots: body.open_slots,
        post_id: body.post_id,
      });

      return db
        .query(SQL_QUERIES.GET_POST_BY_ID)
        .get({ post_id: body.post_id }) as PostUI;
    } catch (e) {
      console.error("Error updating post:", e);
      return error(500, e);
    }
  },

  getUsers: () => {
    return db.query(SQL_QUERIES.GET_ALL_USERS).all() as User[];
  },

  createUser: ({ body, error }: { body: User; error: typeof ElysiaError }) => {
    if (
      !body.password?.trim() ||
      !body.username.trim() ||
      !body.user_id.trim()
    ) {
      return error(400, "Missing required fields");
    }

    try {
      db.query(SQL_QUERIES.INSERT_USER).run({
        user_id: body.user_id,
        username: body.username,
        password: Bun.password.hashSync(body.password),
      });

      return db
        .query(SQL_QUERIES.GET_USER_BY_ID)
        .get({ user_id: body.user_id }) as User;
    } catch (e) {
      console.error("Error creating user:", e);
      return error(500, e);
    }
  },

  getUserById: ({
    params,
    error,
  }: { params: { user_id: string }; error: typeof ElysiaError }) => {
    const user = db
      .query(SQL_QUERIES.GET_USER_BY_ID)
      .get({ user_id: params.user_id }) as User;
    return user ?? error(404, "User not found");
  },
};

export default handlers;
