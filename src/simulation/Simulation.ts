export interface Point {
  x: number;
  y: number;
}

export interface SimulationStateControls {
  isSimulationRunning: boolean;
  noisePercentage: number;
  predictionSeconds: number;
  showPrediction: boolean;
}

export interface SimulationState {
  controls: SimulationStateControls;
  realCursorPosition: Point;
}

const initialSimulationState: SimulationState = {
  controls: {
    isSimulationRunning: false,
    noisePercentage: 5,
    predictionSeconds: 2,
    showPrediction: true,
  },
  realCursorPosition: { x: 0, y: 0 },
};

export function updateSimulationStateControls(
  simulationState: SimulationState,
  updates: Partial<SimulationStateControls>
): SimulationState {
  return {
    ...simulationState,
    controls: {
      ...simulationState.controls,
      ...updates,
    },
  };
}

export { initialSimulationState };
