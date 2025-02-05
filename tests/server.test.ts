import { expect, test, describe } from "bun:test";
import { PostModel } from "../src/types/Post";
import { app } from "../src/server/server";
import { Value } from "@sinclair/typebox/value";

describe("Elysia server", () => {
  test("get all posts", async () => {
    const response = await app.handle(
      new Request("http://localhost:5174/api/posts", {
        method: "GET",
      }),
    );
    const allPosts = await response.json();
    console.log(allPosts[0]);
    Value.Assert(PostModel.UI, allPosts[0]);

    expect(allPosts).toBeDefined();
    expect(allPosts).not.toBeNull();
    expect(allPosts.length).toBeGreaterThan(0);
  });
});
