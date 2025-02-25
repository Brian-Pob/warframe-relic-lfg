import type { PostUI } from "@/types/Post";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import Scoper from "@/components/Scoper";
import css from "./index.css?raw";
import { PostRow } from "@/components/PostRow";
import type { SearchSchemaInput } from "@tanstack/react-router";
import RelicSearchBar from "@/components/RelicSearchBar";
import { SortControls } from "@/components/SortControls";
import { sortPosts } from "@/utils/sortRelics";
import type { SortOptions } from "@/types/Sorting";

export const Route = createFileRoute("/posts/")({
  component: App,
  validateSearch: (
    search?: Record<string, string> & SearchSchemaInput,
  ): { relic: string } => {
    return {
      relic: search?.relic ?? "",
    };
  },
});

function App() {
  const [posts, setPosts] = useState<PostUI[]>([]);
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: "tier",
    direction: "asc",
  });
  let { relic } = Route.useSearch();
  relic = relic.replace("%20", "_");
  const fetchPosts = useCallback(async () => {
    try {
      console.log(relic);
      let queryString = "/api/posts";
      if (relic) {
        queryString += `?relic=${relic}`;
      }
      const response = await fetch(queryString);
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
  }, [relic]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const sortedPosts = sortPosts(posts, sortOptions);

  return (
    <main>
      <Scoper style={css} />
      <h1 id="title">Warframe Relic LFG Active Posts</h1>
      <RelicSearchBar />
      <SortControls sortOptions={sortOptions} onSortChange={setSortOptions} />
      <ul className="results-grid">
        <li className="results-grid__header results-grid__row">
          <span>Relic</span>
          <span>Refinement</span>
          <span>Slots Left</span>
          <span>Username</span>
          <span>Updated</span>
        </li>
        {sortedPosts.map((post) => (
          <PostRow post={post} key={post.post_id} />
        ))}
      </ul>
    </main>
  );
}

export default App;
