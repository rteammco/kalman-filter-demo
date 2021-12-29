import { useEffect, useRef } from 'react';
import { Point, SimulationState } from '../simulation/SimulationData';
import { arePointsEqual } from '../utils/Utils';

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
  userInputSamplingRateFPS: number;
  onCursorPositionChanged: (position: Point) => void;
}

export default function SimulationCanvas(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCursorPositionRef = useRef<Point | null>(null);

  const { simulationState } = props;
  const simulationStateRef = useRef<SimulationState>(simulationState);
  simulationStateRef.current = simulationState;

  // Start the animation loop:
  const animationFrameRequestRef = useRef<number | null>(null);
  useEffect(() => {
    animationFrameRequestRef.current = requestAnimationFrame(animateFrame);
    return () => {
      if (animationFrameRequestRef.current != null) {
        cancelAnimationFrame(animationFrameRequestRef.current);
      }
    };
  }, []);

  // Start a mouse position sampling loop at the desired framerate, since using the canvas
  // onMouseMove event floods the callback event queue and creates a lot of lag:
  useEffect(() => {
    const userInputSamplingInterval = setInterval(
      sampleCursorPosition,
      Math.round(1000 / props.userInputSamplingRateFPS)
    );
    return () => {
      clearInterval(userInputSamplingInterval);
    };
  }, []);

  function sampleCursorPosition(): void {
    if (
      simulationStateRef.current.controls.isSimulationRunning &&
      canvasCursorPositionRef.current != null &&
      !arePointsEqual(
        simulationStateRef.current.realCursorPosition,
        canvasCursorPositionRef.current
      )
    ) {
      props.onCursorPositionChanged(canvasCursorPositionRef.current);
    }
  }

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
    animationFrameRequestRef.current = requestAnimationFrame(animateFrame);
  }

  function handleMouseMoved(event: React.MouseEvent<Element, MouseEvent>): void {
    event.preventDefault();
    const canvas = canvasRef.current;
    if (canvas == null) {
      return;
    }
    const canvasBoundingRect = canvas.getBoundingClientRect();
    const x = event.clientX - canvasBoundingRect.left;
    const y = event.clientY - canvasBoundingRect.top;
    canvasCursorPositionRef.current = { x, y };
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
