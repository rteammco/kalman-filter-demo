import './App.css';
import SimulationCanvas from './components/SimulationCanvas';
import SimulationControls from './components/SimulationControls';
import {
  initialSimulationState,
  Point,
  SimulationState,
  SimulationStateControls,
  updateSimulationStateControls,
} from './simulation/Simulation';
import { useState } from 'react';

const CANVAS_HEIGHT = 480;
const CANVAS_WIDTH = 720;

function App() {
  const [simulationState, setSimulationState] = useState<SimulationState>(initialSimulationState);

  function onSimulationControlsChanged(updatedControls: Partial<SimulationStateControls>): void {
    setSimulationState(updateSimulationStateControls(simulationState, updatedControls));
  }

  function onCursorPositionChanged(position: Point): void {
    setSimulationState({ ...simulationState, realCursorPosition: position });
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
