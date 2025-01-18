export type Relic = {
	_id: string;
	tier: string;
	relic_name: string;
	state: string;
	rewards: Array<Item>;
};

export type Item = {
	_id: string;
	item_name: string;
	rarity: string;
	chance: number;
};
