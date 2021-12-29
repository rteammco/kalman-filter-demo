import { arePointsEqual } from './Utils';

test('arePointsEqual correctly identifies equal points', () => {
  expect(arePointsEqual({ x: 0, y: 0 }, { x: 0, y: 0 })).toEqual(true);
  expect(arePointsEqual({ x: 0, y: 0 }, { x: 1, y: 0 })).toEqual(false);
  expect(arePointsEqual({ x: 1, y: 1 }, { x: 1, y: 0 })).toEqual(false);
  expect(arePointsEqual({ x: 99.9, y: 99.9 }, { x: 99.9, y: 99.9 })).toEqual(true);
});
