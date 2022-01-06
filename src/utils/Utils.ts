import { Point } from '../simulation/SimulationData';

// TODO: apply different types of noise, e.g. Gaussian
export function applyRandomNoise(value: number, noiseAmount: number): number {
  return value + Math.round(noiseAmount * Math.random() - noiseAmount / 2);
}

function getDistanceBetweenPoints(point1: Point, point2: Point): number {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

export function getRotationOfCircleTraveledBetweenTwoPoints(
  start: Point,
  end: Point,
  circleDiameter: number
): number {
  const distanceTraveled = getDistanceBetweenPoints(start, end);
  const distanceSign = start.x < end.x ? 1 : -1;
  const circleCircumference = circleDiameter * Math.PI;
  const numRotations = (distanceSign * distanceTraveled) / circleCircumference;
  return 2 * Math.PI * numRotations;
}
