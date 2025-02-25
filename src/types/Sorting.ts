export type SortField = "tier" | "refinement" | "open_slots" | "updated_at";
export type SortDirection = "asc" | "desc";

export interface SortOptions {
  field: SortField;
  direction: SortDirection;
}
