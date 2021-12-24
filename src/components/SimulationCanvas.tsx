import { useEffect, useRef, useState } from 'react';

const CANVAS_BACKGROUND_COLOR = 'black';

interface Props {
  canvasHeight: number;
  canvasWidth: number;
}

export default function SimulationCanvas(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas != null) {
      const context = canvas.getContext('2d');
      setCanvasContext(canvas.getContext('2d'));
      clearBackground(context);
    }
  }, []);

  function clearBackground(context: CanvasRenderingContext2D | null): void {
    if (context == null) {
      return;
    }
    const { width, height } = context.canvas;
    context.clearRect(0, 0, width, height);
    context.beginPath();
    context.rect(0, 0, width, height);
    context.fillStyle = CANVAS_BACKGROUND_COLOR;
    context.fill();
  }

  return (
    <div>
      <canvas height={props.canvasHeight} ref={canvasRef} width={props.canvasWidth}>
        Oops! Your browser doesn't support the canvas element.
      </canvas>
    </div>
  );
}
