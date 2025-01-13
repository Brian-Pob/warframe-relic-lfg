import { t } from "elysia";

export const UserModel = t.Object({
  user_id: t.String(),
  username: t.String(),
  password: t.Optional(t.String()),
});

export type User = typeof UserModel.static;
