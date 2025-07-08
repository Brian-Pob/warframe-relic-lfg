const response = await fetch("https://drops.warframestat.us/data/relics.json");

if (!response.ok) {
  throw new Error(`Failed to fetch relics: ${response.statusText}`);
}

const relics = await response.json();
const path = "src/server/relics.json"; // Path to save the relics JSON file
console.log(`Saving relics to ${path}`);
await Bun.write(path, JSON.stringify(relics, null, 2));
