import { inverse, Matrix } from 'ml-matrix';
import {
  SimulationMatrix,
  SimulationVector,
  SimulationStateControlMatrices,
  identityMatrix,
  SimulationState,
  Point,
} from './SimulationData';

function runPredictionStep(
  controlMatrices: SimulationStateControlMatrices,
  priorState: SimulationVector,
  priorCovariance: SimulationMatrix,
  controlInputVector: SimulationVector
): { predictedState: SimulationVector; predictedCovariance: SimulationMatrix } {
  const x = Matrix.columnVector(priorState); // prior state [xPos, yPos, xVel, yVel]
  const P = new Matrix(priorCovariance); // prior covariance matrix
  const u = Matrix.columnVector(controlInputVector); // control vector
  const A = new Matrix(controlMatrices.A); // state transition matrix
  const B = new Matrix(controlMatrices.B); // input control matrix
  const Q = new Matrix(controlMatrices.Q); // action uncertainty matrix (expected variance)

  const predictedState = A.mmul(x).add(B.mmul(u)); // x' = Ax + Bu
  const predictedCovariance = A.mmul(P).mmul(A.transpose()).add(Q); // P' = APA^ + Q

  return {
    predictedState: predictedState.to1DArray() as SimulationVector,
    predictedCovariance: predictedCovariance.to2DArray() as SimulationMatrix,
  };
}

function runCorrectionStep(
  controlMatrices: SimulationStateControlMatrices,
  measurementVector: SimulationVector,
  predictedState: SimulationVector,
  predictedCovariance: SimulationMatrix
): { correctedState: SimulationVector; correctedCovariance: SimulationMatrix } {
  const m = Matrix.columnVector(measurementVector);
  const x = Matrix.columnVector(predictedState);
  const P = new Matrix(predictedCovariance);
  const H = new Matrix(controlMatrices.H); // measurement matrix
  const R = new Matrix(controlMatrices.R); // sensor noise matrix
  const I = new Matrix(identityMatrix); // identity matrix

  // Compute the Kalman gain matrix K:
  const S = H.mmul(P).mmul(H.transpose()).add(R); // S = HPH^ + R
  const K = P.mmul(H.transpose()).mmul(inverse(S)); // K = PH^(HPH^ + R)`

  // Use K to compute the corrected state and covariance matrix:
  const correctedState = x.add(K.mmul(m.sub(H.mmul(x)))); // x' = x + K(m - Hx)
  const correctedCovariance = I.sub(K.mmul(H)).mmul(P); // P' = (I - KH)P

  return {
    correctedState: correctedState.to1DArray() as SimulationVector,
    correctedCovariance: correctedCovariance.to2DArray() as SimulationMatrix,
  };
}

// Applies simulated noise and returns the measurement vector
function getSimulatedMeasurementVector(
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

export function runKalmanFilter(simulationState: SimulationState): {
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

  return { predictedState: correctedState, predictedCovariance: correctedCovariance };
}

export function getNextSimulationState(
  simulationState: SimulationState,
  realCursorPosition: Point
): SimulationState {
  const { sensorReadings } = simulationState;
  const newMeasurementVector = getSimulatedMeasurementVector(
    realCursorPosition,
    sensorReadings.previousMeasurementVector
  );
  const updatedSimulationState = {
    ...simulationState,
    realCursorPosition,
    sensorReadings: {
      measurementVector: newMeasurementVector,
      previousMeasurementVector: sensorReadings.measurementVector,
    },
  };
  const { predictedState, predictedCovariance } = runKalmanFilter(updatedSimulationState);
  return { ...updatedSimulationState, predictedState, predictedCovariance };
}
