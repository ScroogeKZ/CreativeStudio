import { useEffect, useRef } from "react";

export function Hero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
      };
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    let time = 0;
    const particles: Array<{ x: number; y: number; z: number; size: number }> = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
        z: (Math.random() - 0.5) * 2,
        size: Math.random() * 2 + 1,
      });
    }

    const draw = () => {
      ctx.fillStyle = getComputedStyle(canvas).getPropertyValue("background-color") || "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.25;

      time += 0.005;
      const rotationX = mouseRef.current.y * 0.5 + time;
      const rotationY = mouseRef.current.x * 0.5 + time;

      const isDark = document.documentElement.classList.contains("dark");
      const primaryColor = isDark ? "rgba(239, 68, 68, 0.8)" : "rgba(239, 68, 68, 0.8)";
      const secondaryColor = isDark ? "rgba(251, 146, 60, 0.6)" : "rgba(251, 146, 60, 0.6)";

      particles.forEach((particle) => {
        let x = particle.x * radius;
        let y = particle.y * radius;
        let z = particle.z * radius;

        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);
        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);

        const y1 = y * cosX - z * sinX;
        const z1 = y * sinX + z * cosX;
        const x1 = x * cosY - z1 * sinY;
        const z2 = x * sinY + z1 * cosY;

        const scale = 1000 / (1000 + z2);
        const x2d = centerX + x1 * scale;
        const y2d = centerY + y1 * scale;

        const opacity = (z2 + radius) / (radius * 2);
        const size = particle.size * scale;

        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size);
        gradient.addColorStop(0, primaryColor);
        gradient.addColorStop(1, secondaryColor);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = opacity * 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full bg-background/50"
      style={{ touchAction: "none" }}
    />
  );
}
