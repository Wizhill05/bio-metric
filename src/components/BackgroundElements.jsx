import React, { useState, useEffect } from "react";

const ICONS = [
  // Heart
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" style={{ overflow: 'visible' }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  // Pill
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" style={{ overflow: 'visible' }}><path d="M10.5 20.5a7 7 0 1 1-9.9-9.9l9.9-9.9a7 7 0 0 1 9.9 9.9z"></path><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"></line></svg>,
  // Magnifying Glass
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" style={{ overflow: 'visible' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  // Medical Cross
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" style={{ overflow: 'visible' }}><path d="M10 2v8H2v4h8v8h4v-8h8v-4h-8V2h-4z"></path></svg>,
  // Microscope / Flask (simplified)
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" style={{ overflow: 'visible' }}><path d="M9 2h6M12 2v10l-4 8h8l-4-8"></path></svg>
];

function generatePoissonDisk(width, height, radius, k = 30) {
  const cellSize = radius / Math.SQRT2;
  const gridWidth = Math.ceil(width / cellSize);
  const gridHeight = Math.ceil(height / cellSize);
  const grid = new Array(gridWidth * gridHeight).fill(null);
  const points = [];
  const active = [];

  const addPoint = (p) => {
    points.push(p);
    active.push(p);
    const col = Math.floor(p[0] / cellSize);
    const row = Math.floor(p[1] / cellSize);
    grid[col + row * gridWidth] = p;
  };

  addPoint([Math.random() * width, Math.random() * height]);

  while (active.length > 0) {
    const activeIndex = Math.floor(Math.random() * active.length);
    const p = active[activeIndex];
    let found = false;

    for (let i = 0; i < k; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius + radius;
      const candidate = [p[0] + r * Math.cos(angle), p[1] + r * Math.sin(angle)];

      if (candidate[0] >= 0 && candidate[0] < width && candidate[1] >= 0 && candidate[1] < height) {
        const col = Math.floor(candidate[0] / cellSize);
        const row = Math.floor(candidate[1] / cellSize);
        let ok = true;

        const rowStart = Math.max(0, row - 2);
        const rowEnd = Math.min(gridHeight - 1, row + 2);
        const colStart = Math.max(0, col - 2);
        const colEnd = Math.min(gridWidth - 1, col + 2);

        for (let r2 = rowStart; r2 <= rowEnd; r2++) {
          for (let c2 = colStart; c2 <= colEnd; c2++) {
            const neighbor = grid[c2 + r2 * gridWidth];
            if (neighbor) {
              const dx = candidate[0] - neighbor[0];
              const dy = candidate[1] - neighbor[1];
              if (dx * dx + dy * dy < radius * radius) {
                ok = false;
              }
            }
          }
        }

        if (ok) {
          found = true;
          addPoint(candidate);
          break;
        }
      }
    }

    if (!found) {
      active.splice(activeIndex, 1);
    }
  }

  return points;
}

export default function BackgroundElements() {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    // Generate points on a 100x100 grid (percentages) with radius 15
    const points = generatePoissonDisk(100, 100, 15);
    const generated = points.map((p, i) => {
      const iconIndex = Math.floor(Math.random() * ICONS.length);
      const left = p[0];
      const top = p[1];
      const rotate = Math.random() * 360;
      const size = 30 + Math.random() * 40; // 30px to 70px
      const opacity = 0.05 + Math.random() * 0.05; // 0.05 to 0.10

      return { id: i, iconIndex, top, left, rotate, size, opacity };
    });
    setElements(generated);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: -1,
      overflow: 'hidden'
    }}>
      {elements.map(el => (
        <div key={el.id} style={{
          position: 'absolute',
          top: `${el.top}%`,
          left: `${el.left}%`,
          width: `${el.size}px`,
          height: `${el.size}px`,
          transform: `translate(-50%, -50%) rotate(${el.rotate}deg)`,
          opacity: el.opacity,
          color: 'var(--text-primary)'
        }}>
          {ICONS[el.iconIndex]}
        </div>
      ))}
    </div>
  );
}
