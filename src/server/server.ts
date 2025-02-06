import { Elysia, t } from "elysia";
import { PostModel } from "@/types/Post";
import { UserModel } from "@/types/User";
import handlers from "./api/handlers";

// Create and configure the Elysia app
export const app = new Elysia()
  .get("/api", () => "Welcome to the Warframe Relic LFG API")
  .get("/api/posts", handlers.getPosts, {
    query: t.Object({
      relic: t.Optional(t.String()),
    }),
  })
  .post(
    "/api/posts",
    ({ body, error }) => handlers.createPost({ body, error }),
    {
      body: PostModel.DB,
      error({ code, error }) {
        console.error("Encountered error with code", code);
        const e = error as Readonly<Error>;
        console.log(e.message);
        const errorMessage = JSON.parse(e.message);

        return { message: errorMessage.message };
      },
    },
  )
  .put(
    "/api/posts",
    ({ body, error }) => handlers.updatePost({ body, error }),
    { body: PostModel.DB },
  )
  .get("/api/users", () => handlers.getUsers())
  .post(
    "/api/users",
    ({ body, error }) => handlers.createUser({ body, error }),
    { body: UserModel },
  )
  .get("/api/users/:user_id", ({ params, error }) =>
    handlers.getUserById({ params, error }),
  )
  .onError(({ code }) => {
    if (code === "NOT_FOUND") return "Invalid route - ≽^╥⩊╥^≼";
  })
  .listen(Bun.env.SERVER_PORT ?? 5174);

console.log(`🦊 Elysia is running on port ${app.server?.port}...`);
