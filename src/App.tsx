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
import { useState } from 'react';
import { getSimulatedMeasurementVector } from './simulation/Simulation';

const CANVAS_HEIGHT = 480;
const CANVAS_WIDTH = 720;

function App() {
  const [simulationState, setSimulationState] = useState<SimulationState>(initialSimulationState);

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
