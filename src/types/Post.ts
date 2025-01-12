import { t } from "elysia";

export const PostModel = t.Object({
	post_id: t.String(),
	relic_name: t.String(),
	user_id: t.String(),
	created_at: t.Date(),
	updated_at: t.Date(),
	open_slots: t.Number({
		minimum: 1,
		maximum: 3,
	}),
});

export type Post = typeof PostModel.static;
