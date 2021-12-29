import { useEffect, useRef } from 'react';
import { Point, SimulationState } from '../simulation/SimulationData';

const CANVAS_CONFIG = {
  backgroundColor: 'black',
  cursorColor: 'red',
  cursorRadius: 5,
  predictionColor: 'green',
  predictionRadius: 10,
  predictionStrokeSize: 4,
} as const;

interface Props {
  canvasHeight: number;
  canvasWidth: number;
  simulationState: SimulationState;
  onCursorPositionChanged: (position: Point) => void;
}

export default function SimulationCanvas(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { simulationState } = props;
  const simulationStateRef = useRef<SimulationState>(simulationState);
  simulationStateRef.current = simulationState;

  useEffect(() => {
    requestAnimationFrame(animateFrame);
  }, [props.simulationState]);

  function clearBackground(context: CanvasRenderingContext2D): void {
    const { width, height } = context.canvas;
    context.clearRect(0, 0, width, height);
    context.beginPath();
    context.rect(0, 0, width, height);
    context.fillStyle = CANVAS_CONFIG.backgroundColor;
    context.fill();
  }

  function drawCursorPosition(context: CanvasRenderingContext2D): void {
    const position = simulationStateRef.current.realCursorPosition;
    context.beginPath();
    context.arc(position.x, position.y, CANVAS_CONFIG.cursorRadius, 0, 2 * Math.PI);
    context.fillStyle = CANVAS_CONFIG.cursorColor;
    context.fill();
  }

  function drawPredictedPosition(context: CanvasRenderingContext2D): void {
    const predictedPosition = simulationStateRef.current.predictedState;
    context.beginPath();
    context.arc(
      predictedPosition[0],
      predictedPosition[1],
      CANVAS_CONFIG.predictionRadius,
      0,
      2 * Math.PI
    );
    context.strokeStyle = CANVAS_CONFIG.predictionColor;
    context.lineWidth = CANVAS_CONFIG.predictionStrokeSize;
    context.stroke();
  }

  function animateFrame(): void {
    const context = canvasRef.current?.getContext('2d');
    if (context != null) {
      clearBackground(context);
      drawCursorPosition(context);
      drawPredictedPosition(context);
    }
  }

  function handleMouseMoved(event: React.MouseEvent<Element, MouseEvent>): void {
    if (!simulationState.controls.isSimulationRunning) {
      return;
    }
    event.preventDefault();
    const canvas = canvasRef.current;
    if (canvas == null) {
      return;
    }
    const canvasBoundingRect = canvas.getBoundingClientRect();
    const x = event.clientX - canvasBoundingRect.left;
    const y = event.clientY - canvasBoundingRect.top;
    props.onCursorPositionChanged({ x, y });
  }

  return (
    <div>
      <canvas
        height={props.canvasHeight}
        ref={canvasRef}
        width={props.canvasWidth}
        onMouseMove={handleMouseMoved}
      >
        Oops! Your browser doesn't support the canvas element.
      </canvas>
    </div>
  );
}
