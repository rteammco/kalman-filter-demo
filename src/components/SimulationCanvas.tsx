import React, { useEffect, useRef } from 'react';
import { Point, SimulationState } from '../simulation/SimulationData';
import { getRotationOfCircleTraveledBetweenTwoPoints } from '../utils/Utils';

const CANVAS_CONFIG = {
  backgroundColor: 'black',
  defaultCursorColor: 'red',
  defaultCursorRadius: 10,
  predictedPositionColor: 'yellow',
  predictedPositionRadius: 10,
  predictionColor: 'green',
  predictionRadius: 20,
  predictionStrokeSize: 4,
  soccerBallImageSize: 30,
  soccerBallPredictionImageAlpha: 0.5,
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
  const canvasCursorLockedRef = useRef<boolean>(false);

  const { simulationState } = props;
  const simulationStateRef = useRef<SimulationState>(simulationState);
  simulationStateRef.current = simulationState;

  const soccerBallImageRef = useRef<HTMLImageElement | null>(null);
  const lastCursorPositionRef = useRef<Point>(simulationState.realCursorPosition);
  const lastCursorRotationRef = useRef<number>(0);

  // Start the animation loop:
  const animationFrameRequestRef = useRef<number | null>(null);
  useEffect(() => {
    const soccerBallImage = new Image();
    soccerBallImage.src = 'soccer_ball.png';
    soccerBallImage.onload = () => {
      soccerBallImageRef.current = soccerBallImage;
    };
    animationFrameRequestRef.current = requestAnimationFrame(animateFrame);
    return () => {
      if (animationFrameRequestRef.current != null) {
        cancelAnimationFrame(animationFrameRequestRef.current);
      }
    };
  }, []);

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
    const soccerBallImage = soccerBallImageRef.current;
    if (soccerBallImage == null) {
      context.beginPath();
      context.arc(position.x, position.y, CANVAS_CONFIG.defaultCursorRadius, 0, 2 * Math.PI);
      context.fillStyle = CANVAS_CONFIG.defaultCursorColor;
      context.fill();
    } else {
      const { soccerBallImageSize } = CANVAS_CONFIG;
      const halfSoccerBallImageSize = soccerBallImageSize / 2;
      lastCursorRotationRef.current += getRotationOfCircleTraveledBetweenTwoPoints(
        lastCursorPositionRef.current,
        position,
        soccerBallImageSize // image size ~= diameter
      );
      context.save();
      context.translate(position.x, position.y);
      context.rotate(lastCursorRotationRef.current);
      context.drawImage(
        soccerBallImage,
        -halfSoccerBallImageSize,
        -halfSoccerBallImageSize,
        soccerBallImageSize,
        soccerBallImageSize
      );
      context.restore();
    }
    lastCursorPositionRef.current = position;
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
      const predictedFuturePositionPoint: Point = {
        x: predictedFuturePosition[0],
        y: predictedFuturePosition[1],
      };
      const soccerBallImage = soccerBallImageRef.current;
      if (soccerBallImage == null) {
        context.beginPath();
        context.arc(
          predictedFuturePositionPoint.x,
          predictedFuturePositionPoint.y,
          CANVAS_CONFIG.predictedPositionRadius,
          0,
          2 * Math.PI
        );
        context.fillStyle = CANVAS_CONFIG.predictedPositionColor;
        context.fill();
      } else {
        const { soccerBallImageSize, soccerBallPredictionImageAlpha } = CANVAS_CONFIG;
        const halfSoccerBallImageSize = soccerBallImageSize / 2;
        context.save();
        context.globalAlpha = soccerBallPredictionImageAlpha;
        context.drawImage(
          soccerBallImage,
          predictedFuturePositionPoint.x - halfSoccerBallImageSize,
          predictedFuturePositionPoint.y - halfSoccerBallImageSize,
          soccerBallImageSize,
          soccerBallImageSize
        );
        context.restore();
      }
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
    props.onCursorPositionChanged({ x, y });
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
