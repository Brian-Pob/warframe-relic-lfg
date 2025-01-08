import type { Relic } from "./Relic";
import type { User } from "./User";

export type Post = {
	id: string;
	relic: Relic;
	host: User;
	createdAt: Date;
	openSlots: number;
	status: string;
};
