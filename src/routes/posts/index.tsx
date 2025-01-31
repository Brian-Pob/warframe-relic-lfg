import type { Post } from "@/types/Post";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import Scoper from "@/components/Scoper";
import css from "./index.css?raw";
import PostRow from "@/components/PostRow";
export const Route = createFileRoute("/posts/")({
  component: App,
});

function App() {
  // Make get request to /api/posts
  // Can filter by relic id
  //
  const [posts, setPosts] = useState<
    (Post & {
      tier: string;
      relic_name: string;
      username: string;
    })[]
  >([]);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/posts");
      if (!response.ok) {
        throw new Error(`Response status ${response.status}`);
      }
      const postsJson = await response.json();
      console.log(postsJson);
      setPosts(postsJson);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      // setIsLoading(false)
      console.log("Posts fetched");
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  return (
    <main>
      <Scoper style={css} />
      <h1 id="title">Warframe Relic LFG Active Posts</h1>

      <ul className="results-grid">
        <li className="results-grid__header results-grid__row">
          <span>Relic</span>
          <span>Open Slots</span>
          <span>Username</span>
          <span>Updated</span>
          <span> </span>
        </li>
        {posts
          .toSorted((a, b) => a.updated_at - b.updated_at)
          .map((post) => (
            <PostRow post={post} key={post.post_id} />
          ))}
      </ul>
    </main>
  );
}

export default App;
