import { inverse, Matrix } from 'ml-matrix';
import { applyRandomNoise } from '../utils/Utils';
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

function predictFutureState(
  controlMatrices: SimulationStateControlMatrices,
  controlInputVector: SimulationVector,
  predictedState: SimulationVector
): SimulationVector {
  const A = new Matrix(controlMatrices.A); // state transition matrix
  const B = new Matrix(controlMatrices.B); // input control matrix
  const u = Matrix.columnVector(controlInputVector); // control vector

  let x = Matrix.columnVector(predictedState);
  // TODO: i < Math.round(FPS * predictionSeconds)
  for (let i = 0; i < 12; i++) {
    // TODO: fix this (doesn't work)
    x = A.mmul(x).add(B.mmul(u)); // x' = Ax + Bu
    console.log('next: ', x.to1DArray());
  }
  console.log('DONE');
  return x.to1DArray() as SimulationVector;
}

export function runKalmanFilter(simulationState: SimulationState): {
  predictedState: SimulationVector;
  predictedCovariance: SimulationMatrix;
  predictedFutureState: SimulationVector | null;
} {
  const {
    predictedCovariance: priorCovariance,
    predictedState: priorState,
    sensorReadings,
  } = simulationState;
  const { matrices: controlMatrices } = simulationState.controls;
  const controlVector: SimulationVector = [0, 0, 0, 0]; //  not used as we only obsere a sensor

  const { predictedState, predictedCovariance } = runPredictionStep(
    controlMatrices,
    priorState,
    priorCovariance,
    controlVector
  );

  const { correctedState, correctedCovariance } = runCorrectionStep(
    controlMatrices,
    sensorReadings.measurementVector,
    predictedState,
    predictedCovariance
  );

  let predictedFutureState = null;
  if (simulationState.controls.showPrediction) {
    predictedFutureState = predictFutureState(controlMatrices, controlVector, correctedState);
  }

  return {
    predictedState: correctedState,
    predictedCovariance: correctedCovariance,
    predictedFutureState,
  };
}

// Applies simulated noise and returns the measurement vector
export function getSimulatedMeasurementVector(
  simulationState: SimulationState,
  canvasWidth: number,
  canvasHeight: number,
  realCursorPosition: Point,
  previousMeasurementVector: SimulationVector
): SimulationVector {
  const measuredX = applyRandomNoise(
    realCursorPosition.x,
    simulationState.controls.noisePercentage,
    canvasWidth
  );
  const measuredY = applyRandomNoise(
    realCursorPosition.y,
    simulationState.controls.noisePercentage,
    canvasHeight
  );
  return [
    measuredX,
    measuredY,
    measuredX - previousMeasurementVector[0],
    measuredY - previousMeasurementVector[1],
  ];
}
