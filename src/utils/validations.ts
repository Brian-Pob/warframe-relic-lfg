import type { Post } from "@/types/Post";
// type Post = {
//   post_id: string;
//   relic_name: string;
//   user_id: string;
//   created_at: number;
//   updated_at: number;
//   open_slots: number;
// }
/**
 *
 * @param post The post to be validated
 * @returns false if the post contains invalid data. true if the post is valid
 */
export const isValidPost = (post: Post): boolean => {
	let is_valid = true;

	// 1. post_id
	// No need to check if format is valid because we look it up in db anyway.
	// Just check if empty.
	if (!post.post_id.trim()) is_valid = false;

	// 2. relic_id
	//NOTE - Writing this now but still need to switch to relic_id later.
	// Check if empty. Will also compare to db later.
	if (!post.relic_name.trim()) is_valid = false;

	// 3. user_id
	// Same thing. Check if empty.
	if (!post.user_id.trim()) is_valid = false;

	// 4. created_at
	// Check if number is a valid date.
	const created_at = new Date(post.created_at);
	if (Number.isNaN(created_at)) is_valid = false;

	// 5. updated_at
	// Check if number is a valid date and check if greater than created_at.
	const updated_at = new Date(post.updated_at);
	if (Number.isNaN(updated_at) || updated_at > created_at) is_valid = false;

	// 6. open_slots
	// A squad is min 2 players and max 4 players.
	// Can be 1 player but what's the point of making an LFG?
	if (post.open_slots > 4 || post.open_slots < 2) is_valid = false;

	return is_valid;
};
