export type Relic = {
  relic_id: string;
  tier: string;
  relic_name: string;
  refinement: string;
  rewards: Array<Item>;
};

export type Item = {
  _id: string;
  item_name: string;
  rarity: string;
  chance: number;
};
