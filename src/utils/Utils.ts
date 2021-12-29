// TODO: apply different types of noise, e.g. Gaussian
export function applyRandomNoise(value: number, noisePercent: number, maxRange: number): number {
  const maxDeviationAmount = maxRange * (noisePercent / 100);
  return value + Math.round(maxDeviationAmount * Math.random() - maxDeviationAmount / 2);
}
