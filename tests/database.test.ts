import { expect, test, describe, afterAll } from "bun:test";
import { Database } from "bun:sqlite";
import type { PostDB } from "../src/types/Post";
import type { User } from "../src/types/User";

const db = new Database("database.sqlite");
db.query("PRAGMA foreign_keys = ON").run();

const SAMPLE_POST_DATA: PostDB = await Bun.file(
  "tests/sample_post.json",
).json();
const USER_ID = SAMPLE_POST_DATA.user_id;
const USERNAME = USER_ID.split("-")[3];
const POST_ID = SAMPLE_POST_DATA.post_id;
const RELIC_ID = SAMPLE_POST_DATA.relic_id;

const NEW_USER_ID = Bun.randomUUIDv7();
const NEW_POST_ID = Bun.randomUUIDv7();

describe("Database Operations", () => {
  describe("READ operations", () => {
    test("GET all posts - should return array of posts", () => {
      const allPosts: PostDB[] = db
        .query("SELECT * FROM posts")
        .all() as PostDB[];
      expect(allPosts).toBeDefined();
      expect(allPosts.length).toBeGreaterThan(0);
    });

    test("GET all users - should return array of users", () => {
      const allUsers: User[] = db.query("SELECT * FROM users").all() as User[];
      expect(allUsers).toBeDefined();
      expect(allUsers.length).toBeGreaterThan(0);
    });

    test("GET user by ID - should return specific user", async () => {
      const user: User = db
        .query("SELECT * FROM users WHERE user_id = $user_id")
        .get({ $user_id: USER_ID }) as User;
      expect(user).not.toBeNull();
      expect(user.user_id).toBe(USER_ID);
      expect(user.username).toBe(USERNAME);

      const password_match = await Bun.password.verify(
        USERNAME,
        user.password as string,
      );
      expect(password_match).toBe(true);
    });

    test("GET post by ID - should return specific post", () => {
      const post: PostDB = db
        .query("SELECT * FROM posts WHERE post_id = $post_id")
        .get({ $post_id: POST_ID }) as PostDB;
      expect(post).not.toBeNull();
      expect(post.post_id).toBe(POST_ID);
      expect(post.relic_id).toBe(RELIC_ID);
      expect(post.user_id).toBe(USER_ID);

      const created_at = new Date(Number(post.created_at) * 1000); // Convert to milliseconds
      const updated_at = new Date(Number(post.updated_at) * 1000);
      expect(created_at instanceof Date).toBe(true);
      expect(updated_at instanceof Date).toBe(true);
      expect(post.open_slots).toBeGreaterThanOrEqual(0);
      expect(post.open_slots).toBeLessThanOrEqual(3);
    });

    test("GET posts by relic ID - should return matching posts", () => {
      const relic_id = SAMPLE_POST_DATA.relic_id;
      const searchPosts = `
        SELECT * FROM posts WHERE relic_id = $relic_id;
      `;
      const posts: PostDB[] = db
        .query(searchPosts)
        .all({ $relic_id: relic_id }) as PostDB[];
      expect(posts).toBeDefined();
      expect(posts.length).toBeGreaterThan(0);
      expect(posts.some((post) => post.relic_id === relic_id)).toBe(true);
    });

    test("GET posts by non-existent relic ID - should return empty array", () => {
      const relic_id = "non-existent-relic-id";
      const searchPosts = `
        SELECT * FROM posts WHERE relic_id = $relic_id;
      `;
      const posts: PostDB[] = db
        .query(searchPosts)
        .all({ $relic_id: relic_id }) as PostDB[];
      expect(posts).toBeDefined();
      expect(posts.length).toBe(0);
    });
  });

  describe("CREATE operations", () => {
    test("POST /users - should create new user", () => {
      console.log("Adding user:", NEW_USER_ID);
      const user_id = NEW_USER_ID;
      const username = user_id.split("-")[3];
      const password = username;
      const passwordHash = Bun.password.hashSync(password);
      const addUser = `
        INSERT INTO users (user_id, username, password) VALUES($user_id, $username, $password);
      `;
      db.query(addUser).run({
        $user_id: user_id,
        $username: username,
        $password: passwordHash,
      });

      const user: User = db
        .query("SELECT * FROM users WHERE user_id = $user_id")
        .get({ $user_id: user_id }) as User;
      expect(user).not.toBeNull();
      expect(user.user_id).toBe(user_id);
      expect(user.username).toBe(username);
      expect(user.password).toBe(passwordHash);
    });

    test("POST /posts - should create new post", () => {
      console.log("Adding post:", NEW_POST_ID);
      const post_id = NEW_POST_ID;
      const relic_id = RELIC_ID;
      const user_id = USER_ID;
      const created_at = Date.now();
      const updated_at = Date.now();
      const open_slots = 3;
      const addPost = `
        INSERT INTO posts (post_id, relic_id, user_id, created_at, updated_at, open_slots) VALUES ($post_id, $relic_id, $user_id, $created_at, $updated_at, $open_slots)
      `;
      db.query(addPost).run({
        $post_id: post_id,
        $relic_id: relic_id,
        $user_id: user_id,
        $created_at: created_at,
        $updated_at: updated_at,
        $open_slots: open_slots,
      });

      const post: PostDB = db
        .query("SELECT * FROM posts WHERE post_id = $post_id")
        .get({ $post_id: post_id }) as PostDB;
      expect(post).not.toBeNull();
      expect(post.post_id).toBe(post_id);
      expect(post.relic_id).toBe(relic_id);
      expect(post.user_id).toBe(user_id);

      // Date is stored as number in sqlite
      expect(Number(post.created_at)).toBe(created_at);
      expect(Number(post.updated_at)).toBe(updated_at);
      expect(post.open_slots).toBe(open_slots);
    });

    test("POST /posts - should fail with non-existent user_id", () => {
      const failing_post_id = Bun.randomUUIDv7();
      const relic_id = RELIC_ID;
      const user_id = "12345";
      const created_at = Date.now();
      const updated_at = Date.now();
      const open_slots = 3;

      const addPost = `
        INSERT INTO posts (post_id, relic_id, user_id, created_at, updated_at, open_slots) VALUES ($post_id, $relic_id, $user_id, $created_at, $updated_at, $open_slots)
      `;
      try {
        db.query(addPost).run({
          $post_id: failing_post_id,
          $relic_id: relic_id,
          $user_id: user_id,
          $created_at: created_at,
          $updated_at: updated_at,
          $open_slots: open_slots,
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.log("✅ Foreign key constraint enforced when adding post.");
      }

      const post: PostDB = db
        .query("SELECT * FROM posts WHERE post_id = $post_id")
        .get({ $post_id: failing_post_id }) as PostDB;
      expect(post).toBeNull();

      if (post) {
        db.query("DELETE FROM posts WHERE post_id = $post_id").run({
          $post_id: failing_post_id,
        });
      }
    });

    test("POST /posts - should fail with non-existent relic_id", () => {
      const failing_post_id = Bun.randomUUIDv7();
      const relic_id = "12345";
      const user_id = USER_ID;
      const created_at = Date.now();
      const updated_at = Date.now();
      const open_slots = 3;

      const addPost = `
        INSERT INTO posts (post_id, relic_id, user_id, created_at, updated_at, open_slots) VALUES ($post_id, $relic_id, $user_id, $created_at, $updated_at, $open_slots)
      `;
      try {
        db.query(addPost).run({
          $post_id: failing_post_id,
          $relic_id: relic_id,
          $user_id: user_id,
          $created_at: created_at,
          $updated_at: updated_at,
          $open_slots: open_slots,
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.log("✅ Foreign key constraint enforced when adding post.");
      }

      const post: PostDB = db
        .query("SELECT * FROM posts WHERE post_id = $post_id")
        .get({ $post_id: failing_post_id }) as PostDB;
      expect(post).toBeNull();

      if (post) {
        db.query("DELETE FROM posts WHERE post_id = $post_id").run({
          $post_id: failing_post_id,
        });
      }
    });
  });

  describe("UPDATE operations", () => {
    test("PUT /posts/:post_id - should update post details", () => {
      console.log("Updating post:", NEW_POST_ID);
      const post_id = NEW_POST_ID;
      const updated_at = Date.now();
      const open_slots = 2;
      const updatePost = `
        UPDATE posts SET updated_at = $updated_at, open_slots = $open_slots WHERE post_id = $post_id;
      `;
      db.query(updatePost).run({
        $updated_at: updated_at,
        $open_slots: open_slots,
        $post_id: post_id,
      });

      const post: PostDB = db
        .query("SELECT * FROM posts WHERE post_id = $post_id")
        .get({ $post_id: post_id }) as PostDB;
      expect(post).not.toBeNull();
      expect(post.post_id).toBe(post_id);

      // Date is stored as string in sqlite
      expect(Number(post.updated_at)).toBe(updated_at);
      expect(post.open_slots).toBe(open_slots);
    });

    test("PUT /users/:user_id - should update user details", () => {
      console.log("Updating user:", NEW_USER_ID);
      const user_id = NEW_USER_ID;
      const username = user_id.split("-")[0];
      const password = "username123";
      const passwordHash = Bun.password.hashSync(password);
      const updateUser = `
        UPDATE users SET username = $username, password = $password WHERE user_id = $user_id;
      `;
      db.query(updateUser).run({
        $username: username,
        $password: passwordHash,
        $user_id: user_id,
      });

      const user: User = db
        .query("SELECT * FROM users WHERE user_id = $user_id")
        .get({ $user_id: user_id }) as User;
      expect(user).not.toBeNull();
      expect(user.user_id).toBe(user_id);
      expect(user.username).toBe(username);
      expect(user.password).toBe(passwordHash);
    });
  });

  describe("DELETE operations", () => {
    test("DELETE /users/:user_id - should remove user", () => {
      console.log("Deleting user:", NEW_USER_ID);
      const user_id = NEW_USER_ID;
      const deleteUser = `
        DELETE FROM users WHERE user_id = $user_id;
      `;
      db.query(deleteUser).run({ $user_id: user_id });

      const user: User = db
        .query("SELECT * FROM users WHERE user_id = $user_id")
        .get({ $user_id: user_id }) as User;
      expect(user).toBeNull();
    });

    test("DELETE /posts/:post_id - should remove post", () => {
      console.log("Deleting post:", NEW_POST_ID);
      const post_id = NEW_POST_ID;
      const deletePost = `
        DELETE FROM posts WHERE post_id = $post_id;
      `;
      db.query(deletePost).run({ $post_id: post_id });

      const post: PostDB = db
        .query("SELECT * FROM posts WHERE post_id = $post_id")
        .get({ $post_id: post_id }) as PostDB;
      expect(post).toBeNull();
    });
  });

  describe("Security operations", () => {
    afterAll(() => {
      const deleteUser = `
        DELETE FROM users WHERE user_id = $user_id;
      `;
      db.query(deleteUser).run({ $user_id: 12345 });
    });

    test("POST /users - should prevent SQL injection in username", async () => {
      const user_id = "12345";
      const username = '" OR "1" = "1';
      const password = "password";
      const passwordHash = await Bun.password.hash(password);
      const addUser = `
        INSERT INTO users (user_id, username, password) VALUES($user_id, $username, $password);
      `;
      db.query(addUser).run({
        $user_id: user_id,
        $username: username,
        $password: passwordHash,
      });

      const user: User = db
        .query("SELECT * FROM users WHERE user_id = $user_id")
        .get({ $user_id: user_id }) as User;

      // If user exists it means injection attack failed
      expect(user).not.toBeNull();
    });
  });
});
