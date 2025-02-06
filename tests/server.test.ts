import { expect, test, describe } from "bun:test";
import { app } from "../src/server/server";
import { PostModel } from "../src/types/Post";
import { Value } from "@sinclair/typebox/value";

describe("Elysia server", () => {
  test("GET /api/posts - should return all posts", async () => {
    const response = await app.handle(
      new Request("http://localhost:5174/api/posts", {
        method: "GET",
      }),
    );
    const allPosts = await response.json();

    expect(response.status).toBe(200);
    expect(allPosts).toBeDefined();
    expect(allPosts).not.toBeNull();
    expect(allPosts.length).toBeGreaterThan(0);
    Value.Assert(PostModel.UI, allPosts[0]);
  });

  test("GET /api/posts?relic=nonexistent - should return empty array", async () => {
    const response = await app.handle(
      new Request("http://localhost:5174/api/posts?relic=nonexistent", {
        method: "GET",
      }),
    );
    const posts = await response.json();

    expect(response.status).toBe(200);
    expect(posts).toBeDefined();
    expect(posts).toEqual([]); // Expecting an empty array
  });

  test("POST /api/posts - should create a new post", async () => {
    const newPost = {
      post_id: Bun.randomUUIDv7(),
      relic_id: "8220ce74edc095b4497ba1b05b649ec9",
      user_id: "0194db11-c789-7000-8652-d839ce9365d4",
      created_at: Date.now(),
      updated_at: Date.now(),
      open_slots: 2,
    };

    const response = await app.handle(
      new Request("http://localhost:5174/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      }),
    );

    const createdPost = await response.json();

    expect(response.status).toBe(200);
    expect(createdPost).toEqual(newPost);
  });

  test("POST /api/posts - should return error for missing fields", async () => {
    const invalidPost = {
      post_id: Bun.randomUUIDv7(),
      // Missing relic_id, user_id, etc.
    };

    const response = await app.handle(
      new Request("http://localhost:5174/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidPost),
      }),
    );

    expect(response.status).not.toBe(200); // Expecting a bad request
    console.log("Received status:", response.status);
    const errorResponse = await response.json();
    expect(errorResponse).toHaveProperty(
      "message",
      "Expected required property",
    );
  });

  test("GET /api/users - should return all users", async () => {
    const response = await app.handle(
      new Request("http://localhost:5174/api/users", {
        method: "GET",
      }),
    );
    const users = await response.json();

    expect(response.status).toBe(200);
    expect(users).toBeDefined();
    expect(users.length).toBeGreaterThan(0);
  });

  test("GET /api/users/:user_id - should return user by ID", async () => {
    const userId = "0194db11-c789-7000-8652-d839ce9365d4";
    const response = await app.handle(
      new Request(`http://localhost:5174/api/users/${userId}`, {
        method: "GET",
      }),
    );
    const user = await response.json();

    expect(response.status).toBe(200);
    expect(user).toBeDefined();
    expect(user.user_id).toBe(userId);
  });

  test("GET /api/users/:user_id - should return 404 for non-existent user", async () => {
    const response = await app.handle(
      new Request("http://localhost:5174/api/users/non-existent-id", {
        method: "GET",
      }),
    );

    expect(response.status).toBe(404);
    console.log(
      "GET /api/users/:user_id - should return 404 for non-existent user",
      response,
    );
    const errorResponse = await response.json();
    expect(errorResponse).toHaveProperty("message", "User not found");
  });
});
