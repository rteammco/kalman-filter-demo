import { runKalmanFilter } from './Simulation';
import { initialSimulationState, SimulationMatrix } from './SimulationData';

// Matrix approximate value comparator since the calcluations aren't exact:
declare global {
  namespace jest {
    interface Matchers<R> {
      matrixToBeCloseTo(value: SimulationMatrix): CustomMatcherResult;
    }
  }
}
expect.extend({
  matrixToBeCloseTo(expected: SimulationMatrix, actual: SimulationMatrix) {
    for (let i = 0; i < expected.length; i++) {
      const expectedRow = expected[i];
      const actualRow = actual[i];
      for (let j = 0; j < expectedRow.length; j++) {
        const expectedVal = expectedRow[j];
        const actualVal = actualRow[j];
        if (Math.abs(expectedVal - actualVal) > 0.005) {
          return {
            message: () =>
              `Incorrect matrix value at row ${i}, col ${j}: expected ${expectedVal}, got ${actualVal}`,
            pass: false,
          };
        }
      }
    }
    return {
      message: () => 'Matrices were roughly equal',
      pass: true,
    };
  },
});

test('runKalmanFilter predicts no changes without movement or noise', () => {
  const simulationState = initialSimulationState;
  const { predictedState, predictedCovariance } = runKalmanFilter(simulationState);
  expect(predictedState).toEqual([0, 0, 0, 0]);
  expect(predictedCovariance).matrixToBeCloseTo([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
});
