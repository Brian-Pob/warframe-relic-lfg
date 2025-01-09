const server = Bun.serve({
	async fetch(req) {
		const path = new URL(req.url).pathname;

		if (path === "/api/posts") {
			return new Response("Getting all posts");
		}
		// 404s
		return new Response("Page not found", { status: 404 });
	},
});

console.log(`Server running on ${server.url}`);
