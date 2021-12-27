export interface Point {
  x: number;
  y: number;
}

export type SimulationMatrixRow = [number, number, number, number];
export type SimulationMatrix = [
  SimulationMatrixRow,
  SimulationMatrixRow,
  SimulationMatrixRow,
  SimulationMatrixRow
];

export type SimulationMatrixKey = 'A' | 'B' | 'H' | 'Q' | 'R';
interface SimulationStateMatrices {
  A: SimulationMatrix;
  B: SimulationMatrix;
  H: SimulationMatrix;
  Q: SimulationMatrix;
  R: SimulationMatrix;
}

export interface SimulationStateControls {
  isSimulationRunning: boolean;
  matrices: SimulationStateMatrices;
  matrixInputsRefCounter: number; // increases to force re-rendering
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
    matrices: {
      A: [
        [1, 0, 0.2, 0],
        [0, 1, 0, 0.2],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ],
      B: [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ],
      H: [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ],
      Q: [
        [0.001, 0, 0, 0],
        [0, 0.001, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      R: [
        [0.1, 0, 0, 0],
        [0, 0.1, 0, 0],
        [0, 0, 0.1, 0],
        [0, 0, 0, 0.1],
      ],
    },
    matrixInputsRefCounter: 0,
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

export function updateSimulationStateMatrix(
  matrices: SimulationStateMatrices,
  matrixKey: SimulationMatrixKey,
  newMatrixValues: SimulationMatrix
): SimulationStateMatrices {
  const simulationStateMatrices = { ...matrices };
  simulationStateMatrices[matrixKey] = newMatrixValues;
  return simulationStateMatrices;
}

export { initialSimulationState };
