/**
 *
 * @param timestamp UNIX time in milliseconds
 * @returns number of minutes since the timestamp
 */
export const minutesSince = (timestamp: number) => {
  const now = Date.now();
  const timeDiff = now - timestamp;
  const minutes = Math.floor(timeDiff / (1000 * 60));
  return minutes;
};
