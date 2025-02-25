import type { PostUI } from "@/types/Post";
import type { SortOptions } from "@/types/Sorting";

export const relicTierOrder = {
  Lith: 0,
  Meso: 1,
  Neo: 2,
  Axi: 3,
} as const;

export function sortPosts(posts: PostUI[], options: SortOptions): PostUI[] {
  return [...posts].sort((a, b) => {
    let comparison = 0;

    switch (options.field) {
      case "tier":
        comparison =
          (relicTierOrder[a.tier as keyof typeof relicTierOrder] || 0) -
          (relicTierOrder[b.tier as keyof typeof relicTierOrder] || 0);
        if (comparison === 0) {
          comparison = a.relic_name.localeCompare(b.relic_name);
        }
        break;
      case "refinement":
        comparison = a.refinement.localeCompare(b.refinement);
        break;
      case "open_slots":
        comparison = a.open_slots - b.open_slots;
        break;
      case "updated_at":
        comparison =
          new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        break;
    }

    return options.direction === "asc" ? comparison : -comparison;
  });
}
