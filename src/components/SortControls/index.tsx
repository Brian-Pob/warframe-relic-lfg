import type { SortOptions, SortField } from "@/types/Sorting";
import Scoper from "../Scoper";
import css from "./SortControls.css?raw";

interface Props {
  sortOptions: SortOptions;
  onSortChange: (options: SortOptions) => void;
}

export function SortControls({ sortOptions, onSortChange }: Props) {
  return (
    <div className="sort-controls">
      <Scoper style={css} />
      <select
        value={sortOptions.field}
        onChange={(e) =>
          onSortChange({ ...sortOptions, field: e.target.value as SortField })
        }
      >
        <option value="tier">Tier</option>
        <option value="refinement">Refinement</option>
        <option value="open_slots">Open Slots</option>
        <option value="updated_at">Last Updated</option>
      </select>
      <button
        type="button"
        onClick={() =>
          onSortChange({
            ...sortOptions,
            direction: sortOptions.direction === "asc" ? "desc" : "asc",
          })
        }
      >
        {sortOptions.direction === "asc" ? "↑" : "↓"}
      </button>
    </div>
  );
}
