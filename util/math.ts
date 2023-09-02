

export function getClosestNumber(x: number, range: number[]) {
  const closest = range.reduce((prev, curr) => Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev);
  return closest
}

export function getAverageScore(num: number[]) {

  const scoring: number[] = num.map((_, i) => i);
  
  const thisScore = scoring.map((s, i) => num[i] * s).reduce((acc, cur) => acc + cur, 0);
  const maxScoreValue = Math.max(...scoring);
  const maxScore = num.map(n => n * maxScoreValue).reduce((acc, cur) => acc + cur, 0);

  if (maxScore === 0) {
    return 0;
  }
  
  const avg = thisScore / maxScore * 100;

  return avg;
}