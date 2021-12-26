import { useCallback, useEffect, useRef, useState } from 'react';
import { Point, SimulationState } from '../simulation/Simulation';

const CANVAS_BACKGROUND_COLOR = 'black';
const ANIMATION_FRAMERATE_FPS = 30;

interface Props {
  canvasHeight: number;
  canvasWidth: number;
  simulationState: SimulationState;
  onCursorPositionChanged: (position: Point) => void;
}

export default function SimulationCanvas(props: Props) {
  // Refs used for animation loop:
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { simulationState } = props;
  const simulationStateRef = useRef<SimulationState>(simulationState);
  simulationStateRef.current = simulationState;

  useEffect(() => {
    animateFrame();
  }, []);

  function clearBackground(context: CanvasRenderingContext2D): void {
    const { width, height } = context.canvas;
    context.clearRect(0, 0, width, height);
    context.beginPath();
    context.rect(0, 0, width, height);
    context.fillStyle = CANVAS_BACKGROUND_COLOR;
    context.fill();
  }

  function drawCursorPosition(context: CanvasRenderingContext2D): void {
    // TODO: fix animation issues
    const position = simulationStateRef.current.realCursorPosition;
    context.beginPath();
    context.arc(position.x, position.y, 10, 0, 2 * Math.PI);
    context.fillStyle = 'red';
    context.fill();
  }

  function animateFrame(): void {
    const context = canvasRef.current?.getContext('2d');
    if (context != null) {
      clearBackground(context);
      drawCursorPosition(context);
    }
    setTimeout(animateFrame, 1000 / ANIMATION_FRAMERATE_FPS);
  }

  function handleMouseMoved(event: React.MouseEvent<Element, MouseEvent>): void {
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
