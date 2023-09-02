

export function getClosestNumber(x: number, range: number[]) {
  const closest = range.reduce((prev, curr) => Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev);
  return closest
}