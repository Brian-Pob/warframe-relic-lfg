import { t } from "elysia";

const PostModelDB = t.Object({
  post_id: t.String(),
  relic_id: t.String(),
  user_id: t.String(),
  created_at: t.Number(),
  updated_at: t.Number(),
  open_slots: t.Number({
    minimum: 1,
    maximum: 3,
  }),
});

export type PostDB = typeof PostModelDB.static;

const PostModelUI = t.Object({
  post_id: t.String(),
  username: t.String(),
  relic_name: t.String(),
  tier: t.String(),
  refinement: t.String(),
  updated_at: t.Number(),
  open_slots: t.Number({
    minimum: 1,
    maximum: 3,
  }),
});

export type PostUI = typeof PostModelUI.static;

export const PostModel = {
  UI: PostModelUI,
  DB: PostModelDB,
};
