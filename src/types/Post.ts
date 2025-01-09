import type { Relic } from "./Relic";
import type { User } from "./User";

export type Post = {
	post_id: string;
	relic: Relic;
	user_id: User;
	created_at: Date;
	updated_at: Date;
	open_slots: number;
};
