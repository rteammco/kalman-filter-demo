export interface Point {
  x: number;
  y: number;
}

export type SimulationVector = [number, number, number, number];
export type SimulationMatrixRow = [number, number, number, number];
export type SimulationMatrix = [
  SimulationMatrixRow,
  SimulationMatrixRow,
  SimulationMatrixRow,
  SimulationMatrixRow
];

const identityMatrix: SimulationMatrix = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
];

export type SimulationControlMatrixKey = 'A' | 'B' | 'H' | 'Q' | 'R';
export interface SimulationStateControlMatrices {
  A: SimulationMatrix; // state transition matrix
  B: SimulationMatrix; // input control matrix
  H: SimulationMatrix; // measurement matrix
  Q: SimulationMatrix; // action uncertainty matrix
  R: SimulationMatrix; // sensor noise matrix
}

export interface SimulationStateControls {
  isSimulationRunning: boolean;
  matrices: SimulationStateControlMatrices;
  matrixInputsRefCounter: number; // increases to force re-rendering
  noiseAmount: number;
  predictionSeconds: number;
  showPrediction: boolean;
}

export interface SimulationState {
  controls: SimulationStateControls;
  predictedCovariance: SimulationMatrix; // P matrix
  predictedFutureState: SimulationVector | null;
  predictedState: SimulationVector; // x vector
  realCursorPosition: Point; // used by the visualization
  sensorReadings: {
    measurementVector: SimulationVector;
    previousMeasurementVector: SimulationVector;
  };
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
        [0, 0, 0.001, 0],
        [0, 0, 0, 0.001],
      ],
      R: [
        [0.1, 0, 0, 0],
        [0, 0.1, 0, 0],
        [0, 0, 0.1, 0],
        [0, 0, 0, 0.1],
      ],
    },
    matrixInputsRefCounter: 0,
    noiseAmount: 5,
    predictionSeconds: 2,
    showPrediction: true,
  },
  predictedCovariance: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  predictedFutureState: null,
  predictedState: [0, 0, 0, 0],
  realCursorPosition: { x: 0, y: 0 },
  sensorReadings: {
    measurementVector: [0, 0, 0, 0],
    previousMeasurementVector: [0, 0, 0, 0],
  },
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
  matrices: SimulationStateControlMatrices,
  matrixKey: SimulationControlMatrixKey,
  newMatrixValues: SimulationMatrix
): SimulationStateControlMatrices {
  const simulationStateMatrices = { ...matrices };
  simulationStateMatrices[matrixKey] = newMatrixValues;
  return simulationStateMatrices;
}

export { identityMatrix, initialSimulationState };
