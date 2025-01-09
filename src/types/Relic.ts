export type Relic = {
	_id: string;
	tier: string;
	relicName: string;
	state: string;
	rewards: Array<Item>;
};

export type Item = {
	_id: string;
	itemName: string;
	rarity: string;
	chance: number;
};
