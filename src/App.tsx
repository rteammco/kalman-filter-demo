import './App.css';
import SimulationCanvas from './components/SimulationCanvas';
import SimulationControls from './components/SimulationControls';
import { Point, SimulationState } from './simulation/Simulation';
import { useState } from 'react';

const CANVAS_HEIGHT = 600;
const CANVAS_WIDTH = 900;

function App() {
  const [simulationState, setSimulationState] = useState<SimulationState>({
    realCursorPosition: { x: 0, y: 0 },
  });

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
      <SimulationControls panelWidth={CANVAS_WIDTH} />
    </div>
  );
}

export default App;
