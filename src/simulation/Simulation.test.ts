import React from 'react';
import { runSimulationStep } from './Simulation';
import { initialSimulationState, SimulationState } from './SimulationData';

test('runSimulationStep predicts no changes without movement or noise', () => {
  const simulationState = initialSimulationState;
  const { predictedState, predictedCovariance } = runSimulationStep(simulationState);
  expect(predictedState).toEqual([0, 0, 0, 0]);
  expect(predictedCovariance).toEqual([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
});
