// TODO: apply different types of noise, e.g. Gaussian
export function applyRandomNoise(value: number, noiseAmount: number): number {
  return value + Math.round(noiseAmount * Math.random() - noiseAmount / 2);
}
