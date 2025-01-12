import { t } from "elysia";

export const PostModel = t.Object({
	post_id: t.String(),
	relic_name: t.String(),
	user_id: t.String(),
	created_at: t.Number(),
	updated_at: t.Number(),
	open_slots: t.Number({
		minimum: 1,
		maximum: 3,
	}),
});

export type Post = typeof PostModel.static;
