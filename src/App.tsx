import './App.css';
import SimulationCanvas from './components/SimulationCanvas';
import SimulationControls from './components/SimulationControls';

const CANVAS_HEIGHT = 400;
const CANVAS_WIDTH = 650;

function App() {
  return (
    <div className="App">
      <SimulationCanvas canvasHeight={CANVAS_HEIGHT} canvasWidth={CANVAS_WIDTH} />
      <SimulationControls panelWidth={CANVAS_WIDTH} />
    </div>
  );
}

export default App;
