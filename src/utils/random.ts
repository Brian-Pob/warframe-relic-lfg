/**
 * Accepts a minimum and maximum number. Returns value where min <= value < max
 * @param min Inclusive minimum number
 * @param max Non-inclusive maximum number
 * @returns min <= value < max
 */
export function getRandomNumber(min: number, max: number): number {
	if (min >= max) {
		throw new Error("Min must be less than max.");
	}
	return Math.floor(Math.random() * (max - min)) + min;
}
