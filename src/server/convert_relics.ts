import { Database } from "bun:sqlite";

// Load the JSON file
const loadJsonFile = async (filePath: string) => {
  const data = Bun.file(filePath);
  return await data.json();
};

// Function to display the progress bar
const displayProgressBar = (current: number, total: number) => {
  const totalSteps = 50; // Total steps in the progress bar
  const progress = Math.floor((current / total) * totalSteps);
  const bar = "=".repeat(progress) + "-".repeat(totalSteps - progress);
  const percentage = ((current / total) * 100).toFixed(2);
  process.stdout.write(`\r[${bar}] ${percentage}%`);
};

// Function to display the spinner
// const displaySpinner = (index: number) => {
// 	const spinnerStates = ["|", "/", "-", "\\"];
// 	const spinnerIndex = index % spinnerStates.length;
// 	process.stdout.write(`\r${spinnerStates[spinnerIndex]} Processing...`);
// };

/**
 * This is how the relics appear in the original JSON file. I rename
 * some of the keys to make it closer to what I want.
 */
type UnprocessedRelic = {
  _id: string;
  tier: number;
  relicName: string;
  state: string;
  rewards: {
    _id: string;
    itemName: string;
    rarity: string;
    chance: number;
  }[];
};

// Insert relics, items, and rewards into the database
const insertData = (db: Database, relics: UnprocessedRelic[]) => {
  console.log("Adding relics...");

  for (const [index, relic] of relics.entries()) {
    // Insert relic
    db.run(
      "INSERT OR IGNORE INTO relics (relic_id, tier, relic_name, refinement) VALUES (?, ?, ?, ?)",
      [relic._id, relic.tier, relic.relicName, relic.state],
    );

    // Update progress bar for relics
    displayProgressBar(index + 1, relics.length);
    // displaySpinner(index); // Update spinner
  }
  process.stdout.write("\n\n");

  let reward_index = 0;
  const totalRewards = relics.reduce(
    (sum, relic) => sum + relic.rewards.length,
    0,
  );

  console.log("Adding rewards...");
  for (const relic of relics) {
    for (const reward of relic.rewards) {
      // Insert item
      db.run("INSERT OR IGNORE INTO items (id, item_name) VALUES (?, ?)", [
        reward._id,
        reward.itemName,
      ]);

      // Insert reward
      db.run(
        "INSERT OR IGNORE INTO rewards (relic_id, item_id, rarity, chance) VALUES (?, ?, ?, ?)",
        [relic._id, reward._id, reward.rarity, reward.chance],
      );
      reward_index++;

      // Update progress bar for rewards
      displayProgressBar(reward_index, totalRewards);
      // displaySpinner(reward_index); // Update spinner
    }
  }
  process.stdout.write("\n\n");
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
