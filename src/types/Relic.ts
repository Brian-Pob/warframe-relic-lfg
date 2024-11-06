export type Relic = {
	tier: string;
	relicName: string;
	state: string;
	rewards: Array<Item>;
	_id: string;
};

export type Item = {
	_id: string;
	itemName: string;
	rarity: string;
	chance: number;
};
