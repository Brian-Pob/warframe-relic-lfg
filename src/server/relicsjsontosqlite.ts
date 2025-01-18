import { Database } from "bun:sqlite";

// Load the JSON file
const loadJsonFile = async (filePath: string) => {
	const data = Bun.file(filePath);
	return await data.json();
};

// Insert relics, items, and rewards into the database
const insertData = (db: Database, relics: any[]) => {
	for (const relic of relics) {
		// Insert relic
		db.run(
			"INSERT OR IGNORE INTO relics (id, tier, relicName, state) VALUES (?, ?, ?, ?)",
			[relic._id, relic.tier, relic.relicName, relic.state],
		);
	}

	for (const relic of relics) {
		for (const reward of relic.rewards) {
			// Insert item
			db.run("INSERT OR IGNORE INTO items (id, itemName) VALUES (?, ?)", [
				reward._id,
				reward.itemName,
			]);

			// Insert reward
			db.run(
				"INSERT INTO rewards (relic_id, item_id, rarity, chance) VALUES (?, ?, ?, ?)",
				[relic._id, reward._id, reward.rarity, reward.chance],
			);
		}
	}
};

// Main function to run the script
const main = async () => {
	const db = new Database("database.sqlite"); // Replace with your database file
	const jsonFilePath = "src/server/relics.json"; // Replace with your JSON file path

	const data = await loadJsonFile(jsonFilePath);
	insertData(db, data.relics);

	console.log("Data imported successfully!");
	db.close();
};

// Execute the main function
main().catch((error) => {
	console.error("Error importing data:", error);
});
