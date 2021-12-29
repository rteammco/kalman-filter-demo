import {
  SimulationMatrix,
  SimulationVector,
  SimulationStateControlMatrices,
  identityMatrix,
  SimulationState,
  Point,
} from './SimulationData';

const matrix = require('matrix-js');

function runPredictionStep(
  controlMatrices: SimulationStateControlMatrices,
  priorState: SimulationVector,
  priorCovariance: SimulationMatrix,
  controlInputVector: SimulationVector
): { predictedState: SimulationVector; predictedCovariance: SimulationMatrix } {
  const x = matrix(priorState); // prior state [xPos, yPos, xVel, yVel]
  const P = matrix(priorCovariance); // prior covariance matrix
  const u = matrix(controlInputVector); // control vector
  const A = matrix(controlMatrices.A); // state transition matrix
  const B = matrix(controlMatrices.B); // input control matrix
  const Q = matrix(controlMatrices.Q); // action uncertainty matrix (expected variance)

  const predictedState = A.mul(x).add(B).mul(matrix(u)); // x' = Ax + Bu
  const predictedCovariance = A.mul(P).mul(A.trans()).add(Q); // P' = APA^ + Q

  return { predictedState, predictedCovariance };
}

function runCorrectionStep(
  controlMatrices: SimulationStateControlMatrices,
  measurementVector: SimulationVector,
  predictedState: SimulationVector,
  predictedCovariance: SimulationMatrix
): { correctedState: SimulationVector; correctedCovariance: SimulationMatrix } {
  const m = matrix(measurementVector);
  const x = matrix(predictedState);
  const P = matrix(predictedCovariance);
  const H = matrix(controlMatrices.H); // measurement matrix
  const R = matrix(controlMatrices.R); // sensor noise matrix
  const I = matrix(identityMatrix); // identity matrix

  // Compute the Kalman gain matrix K:
  const S = matrix(H.mul(P).mul(H.trans()).add(R)); // S = HPH^ + R
  const K = matrix(P.mul(H.trans()).mul(S.inv())); // K = PH^(HPH^ + R)`

  // Use K to compute the corrected state and covariance matrix:
  const correctedState = x.add(K.mul(m.sub(H.mul(x)))); // x' = x + K(m - Hx)
  const correctedCovariance = I.sub(K.mul(H)).mul(P); // P' = (I - KH)P

  return { correctedState, correctedCovariance };
}

// Applies simulated noise and returns the measurement vector
export function getSimulatedMeasurementVector(
  realCursorPosition: Point,
  previousMeasurementVector: SimulationVector
): SimulationVector {
  // TODO: apply noise
  return [
    realCursorPosition.x,
    realCursorPosition.y,
    realCursorPosition.x - previousMeasurementVector[0],
    realCursorPosition.y - previousMeasurementVector[1],
  ];
}

// TODO: implement tests first
export function runSimulationStep(simulationState: SimulationState): {
  predictedState: SimulationVector;
  predictedCovariance: SimulationMatrix;
} {
  const {
    predictedCovariance: priorCovariance,
    predictedState: priorState,
    sensorReadings,
  } = simulationState;
  const { matrices: controlMatrices } = simulationState.controls;

  const { predictedState, predictedCovariance } = runPredictionStep(
    controlMatrices,
    priorState,
    priorCovariance,
    [0, 0, 0, 0] // control vector, not used in this simulation since we're only observing a sensor
  );

  const { correctedState, correctedCovariance } = runCorrectionStep(
    controlMatrices,
    sensorReadings.measurementVector,
    predictedState,
    predictedCovariance
  );

  if (simulationState.controls.showPrediction) {
    // TODO: iterate over prediction step
  }

  // return: predictedState => simulationState.predictedState
  // return: predictedCovariance => simulationState.predictedCovariance
  return { predictedState: correctedState, predictedCovariance: correctedCovariance };
}
