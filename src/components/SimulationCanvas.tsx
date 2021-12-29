import React, { useEffect, useRef } from 'react';
import { Point, SimulationState } from '../simulation/SimulationData';

const CANVAS_CONFIG = {
  backgroundColor: 'black',
  cursorColor: 'red',
  cursorRadius: 5,
  predictedPositionColor: 'yellow',
  predictedPositionRadius: 5,
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
  const canvasCursorLockedRef = useRef<boolean>(false);

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
      canvasCursorPositionRef.current != null
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

  function drawPredictedFuturePosition(context: CanvasRenderingContext2D): void {
    const predictedFuturePosition = simulationStateRef.current.predictedFutureState;
    if (predictedFuturePosition != null) {
      context.beginPath();
      context.arc(
        predictedFuturePosition[0],
        predictedFuturePosition[1],
        CANVAS_CONFIG.predictedPositionRadius,
        0,
        2 * Math.PI
      );
      context.fillStyle = CANVAS_CONFIG.predictedPositionColor;
      context.fill();
    }
  }

  function animateFrame(): void {
    const context = canvasRef.current?.getContext('2d');
    if (context != null) {
      clearBackground(context);
      drawPredictedPosition(context);
      drawPredictedFuturePosition(context);
      drawCursorPosition(context);
    }
    animationFrameRequestRef.current = requestAnimationFrame(animateFrame);
  }

  function handleMouseClicked(event: React.MouseEvent<Element, MouseEvent>): void {
    canvasCursorLockedRef.current = !canvasCursorLockedRef.current;
    handleMouseMoved(event);
  }

  function handleMouseMoved(event: React.MouseEvent<Element, MouseEvent>): void {
    event.preventDefault();
    const canvas = canvasRef.current;
    const isCursorLocked = canvasCursorLockedRef.current;
    if (canvas == null || isCursorLocked) {
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
        onClick={handleMouseClicked}
        onMouseMove={handleMouseMoved}
      >
        Oops! Your browser doesn't support the canvas element.
      </canvas>
    </div>
  );
}
