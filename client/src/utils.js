
export function daysBetweenDates(earlier, later) {
  // Take the difference between the dates and divide by milliseconds per day.
  // Round to nearest whole number.
  return Math.round((later - earlier) / (1000 * 60 * 60 * 24));
}