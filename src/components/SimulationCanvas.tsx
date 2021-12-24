import { useEffect, useRef, useState } from 'react';

const CANVAS_HEIGHT = 400;
const CANVAS_WIDTH = 650;

const CANVAS_BACKGROUND_COLOR = 'black';

export default function SimulationCanvas() {
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
      <canvas height={CANVAS_HEIGHT} ref={canvasRef} width={CANVAS_WIDTH} />
    </div>
  );
}
