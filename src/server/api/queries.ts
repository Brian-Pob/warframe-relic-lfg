// Reusable SQL queries
const SQL_QUERIES = {
  GET_ALL_POSTS: `
    SELECT
      p.post_id,
      p.updated_at,
      p.open_slots,
      r.relic_name,
      r.tier,
      r.relic_id,
      r.refinement,
      u.username
    FROM posts p
    JOIN relics r ON p.relic_id = r.relic_id
    JOIN users u ON p.user_id = u.user_id
  `,
  GET_POSTS_BY_RELIC: `
    SELECT
      p.post_id,
      p.updated_at,
      p.open_slots,
      r.relic_name,
      r.tier,
      r.relic_id,
      r.refinement,
      u.username
    FROM posts p
    JOIN relics r ON p.relic_id = r.relic_id
    JOIN users u ON p.user_id = u.user_id
    WHERE r.relic_name LIKE $relic_name 
    AND r.tier LIKE $relic_tier
  `,
  INSERT_POST: `
    INSERT INTO posts (
      post_id, 
      relic_id, 
      user_id, 
      created_at, 
      updated_at, 
      open_slots
    ) 
    VALUES (
      $post_id, 
      $relic_id, 
      $user_id, 
      $created_at, 
      $updated_at, 
      $open_slots
    )
  `,
  UPDATE_POST: `
    UPDATE posts 
    SET relic_id = $relic_id, 
        updated_at = $updated_at, 
        open_slots = $open_slots 
    WHERE post_id = $post_id
  `,
  GET_POST_BY_ID: `
    SELECT * FROM posts WHERE post_id = $post_id
  `,
  GET_ALL_USERS: `
    SELECT user_id, username FROM users
  `,
  INSERT_USER: `
    INSERT INTO users (user_id, username, password) 
    VALUES ($user_id, $username, $password)
  `,
  GET_USER_BY_ID: `
    SELECT user_id, username FROM users WHERE user_id = $user_id
  `,
};

export default SQL_QUERIES;
