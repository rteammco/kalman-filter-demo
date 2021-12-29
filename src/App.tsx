import './App.css';
import SimulationCanvas from './components/SimulationCanvas';
import SimulationControls from './components/SimulationControls';
import {
  initialSimulationState,
  Point,
  SimulationState,
  SimulationStateControls,
  updateSimulationStateControls,
} from './simulation/SimulationData';
import { useEffect, useRef, useState } from 'react';
import { getSimulatedMeasurementVector, runKalmanFilter } from './simulation/Simulation';

// How many times per second we run the Kalman Filter logic and update the position estimate.
// This is not necessarily the same as frame rate, as rendering may run at a different frequency.
const KALMAN_FILTER_UPDATE_FPS = 10;

const CANVAS_HEIGHT = 480;
const CANVAS_WIDTH = 720;

function App() {
  const [simulationState, setSimulationState] = useState<SimulationState>(initialSimulationState);
  const simulationStateRef = useRef<SimulationState>(simulationState);
  simulationStateRef.current = simulationState;

  useEffect(() => {
    if (simulationState.controls.isSimulationRunning) {
      const simulationStepTimer = setInterval(
        runSimulationStep,
        Math.round(1000 / KALMAN_FILTER_UPDATE_FPS)
      );
      return () => {
        clearInterval(simulationStepTimer);
      };
    }
  }, [simulationState.controls.isSimulationRunning]);

  function runSimulationStep(): void {
    const currentSimulationState = simulationStateRef.current;
    const { predictedState, predictedCovariance } = runKalmanFilter(currentSimulationState);
    setSimulationState({ ...currentSimulationState, predictedState, predictedCovariance });
  }

  function onSimulationControlsChanged(updatedControls: Partial<SimulationStateControls>): void {
    setSimulationState(updateSimulationStateControls(simulationState, updatedControls));
  }

  function onCursorPositionChanged(newPosition: Point): void {
    const { sensorReadings } = simulationState;
    const newMeasurementVector = getSimulatedMeasurementVector(
      newPosition,
      sensorReadings.previousMeasurementVector
    );
    setSimulationState({
      ...simulationState,
      realCursorPosition: newPosition,
      sensorReadings: {
        measurementVector: newMeasurementVector,
        previousMeasurementVector: sensorReadings.measurementVector,
      },
    });
  }

  return (
    <div className="App">
      <SimulationCanvas
        canvasHeight={CANVAS_HEIGHT}
        canvasWidth={CANVAS_WIDTH}
        simulationState={simulationState}
        onCursorPositionChanged={onCursorPositionChanged}
      />
      <SimulationControls
        panelWidth={CANVAS_WIDTH}
        simulationState={simulationState}
        onSimulationControlsChanged={onSimulationControlsChanged}
      />
    </div>
  );
}

export default App;
