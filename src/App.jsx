import React, { useState } from "react";
import SplitLines from "./Components/SplitLines/SplitLines";
import Pill from "./Components/Pill/Pill";

import {
  MIN_PILL_SIZE,
  MIN_PART_SIZE,
  BORDER_RADIUS,
  OFFSET,
  randomColor,
  generateId,
  verticalBorderRadius,
  horizontalBorderRadius,
} from "./utils/helpers";

export default function App() {
  const [pills, setPills] = useState([]);
  const [dragStart, setDragStart] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(null);

  const handleMouseMove = (e) => {
    setCursor({ x: e.clientX, y: e.clientY });

    if (dragging) {
      const { id, offsetX, offsetY } = dragging;
      setPills((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                x: Math.max(0, e.clientX - offsetX),
                y: Math.max(0, e.clientY - offsetY),
              }
            : p
        )
      );
    }
  };

  const handleMouseDown = (e) => {
    const targetPill = pills.find(
      (p) =>
        e.clientX >= p.x &&
        e.clientX <= p.x + p.width &&
        e.clientY >= p.y &&
        e.clientY <= p.y + p.height
    );

    if (targetPill) {
      setDragging({
        id: targetPill.id,
        offsetX: e.clientX - targetPill.x,
        offsetY: e.clientY - targetPill.y,
      });
    } else {
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = (e) => {
    if (dragging) {
      setDragging(null);
      return;
    }

    if (dragStart) {
      const width = Math.abs(e.clientX - dragStart.x);
      const height = Math.abs(e.clientY - dragStart.y);

      if (width >= MIN_PILL_SIZE && height >= MIN_PILL_SIZE) {
        const newPill = {
          id: generateId(),
          x: Math.min(dragStart.x, e.clientX),
          y: Math.min(dragStart.y, e.clientY),
          width,
          height,
          color: randomColor(),
          borderRadius: `${BORDER_RADIUS}px`,
        };
        setPills((prev) => [...prev, newPill]);
      }
      setDragStart(null);
    } else {
      setPills((prev) => {
        let newParts = [];

        prev.forEach((p) => {
          const verticalHit = cursor.x >= p.x && cursor.x <= p.x + p.width;
          const horizontalHit = cursor.y >= p.y && cursor.y <= p.y + p.height;

          if (verticalHit && horizontalHit) {
            const leftWidth = cursor.x - p.x;
            const rightWidth = p.x + p.width - cursor.x;
            const topHeight = cursor.y - p.y;
            const bottomHeight = p.y + p.height - cursor.y;

            const canSplitLeft = leftWidth >= MIN_PART_SIZE;
            const canSplitRight = rightWidth >= MIN_PART_SIZE;
            const canSplitTop = topHeight >= MIN_PART_SIZE;
            const canSplitBottom = bottomHeight >= MIN_PART_SIZE;

            if (
              canSplitLeft &&
              canSplitRight &&
              canSplitTop &&
              canSplitBottom
            ) {
              newParts.push({
                ...p,
                id: generateId(),
                x: p.x,
                y: p.y,
                width: leftWidth,
                height: topHeight,
                color: p.color,
                borderRadius: `${BORDER_RADIUS}px 0 0 ${BORDER_RADIUS}px`,
              });
              newParts.push({
                ...p,
                id: generateId(),
                x: cursor.x,
                y: p.y,
                width: rightWidth,
                height: topHeight,
                color: p.color,
                borderRadius: `0 ${BORDER_RADIUS}px ${BORDER_RADIUS}px 0`,
              });
              newParts.push({
                ...p,
                id: generateId(),
                x: p.x,
                y: cursor.y,
                width: leftWidth,
                height: bottomHeight,
                color: p.color,
                borderRadius: `${BORDER_RADIUS}px 0 0 ${BORDER_RADIUS}px`,
              });
              newParts.push({
                ...p,
                id: generateId(),
                x: cursor.x,
                y: cursor.y,
                width: rightWidth,
                height: bottomHeight,
                color: p.color,
                borderRadius: `0 ${BORDER_RADIUS}px ${BORDER_RADIUS}px 0`,
              });
              return;
            } else {
              newParts.push(p);
              return;
            }
          }

          if (verticalHit) {
            const leftWidth = cursor.x - p.x;
            const rightWidth = p.x + p.width - cursor.x;

            if (leftWidth < MIN_PART_SIZE) {
              newParts.push({
                ...p,
                id: generateId(),
                x: cursor.x + OFFSET,
                width: rightWidth - OFFSET,
                color: p.color,
                borderRadius: verticalBorderRadius(false),
              });
              return;
            }
            if (rightWidth < MIN_PART_SIZE) {
              newParts.push({
                ...p,
                id: generateId(),
                width: leftWidth - OFFSET,
                color: p.color,
                borderRadius: verticalBorderRadius(true),
              });
              return;
            }

            newParts.push({
              ...p,
              id: generateId(),
              width: leftWidth,
              color: p.color,
              borderRadius: verticalBorderRadius(true),
            });
            newParts.push({
              ...p,
              id: generateId(),
              x: cursor.x,
              width: rightWidth,
              color: p.color,
              borderRadius: verticalBorderRadius(false),
            });
            return;
          }

          if (horizontalHit) {
            const topHeight = cursor.y - p.y;
            const bottomHeight = p.y + p.height - cursor.y;

            if (topHeight < MIN_PART_SIZE) {
              newParts.push({
                ...p,
                id: generateId(),
                y: cursor.y + OFFSET,
                height: bottomHeight - OFFSET,
                color: p.color,
                borderRadius: horizontalBorderRadius(false),
              });
              return;
            }
            if (bottomHeight < MIN_PART_SIZE) {
              newParts.push({
                ...p,
                id: generateId(),
                height: topHeight - OFFSET,
                color: p.color,
                borderRadius: horizontalBorderRadius(true),
              });
              return;
            }

            newParts.push({
              ...p,
              id: generateId(),
              height: topHeight,
              color: p.color,
              borderRadius: horizontalBorderRadius(true),
            });
            newParts.push({
              ...p,
              id: generateId(),
              y: cursor.y,
              height: bottomHeight,
              color: p.color,
              borderRadius: horizontalBorderRadius(false),
            });
            return;
          }

          newParts.push(p);
        });

        return newParts;
      });
    }
  };

  return (
    <div
      className="w-screen h-screen relative bg-gray-100 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ userSelect: "none" }}
    >
      <SplitLines cursor={cursor} />
      {pills.map((p) => (
        <Pill
          key={p.id}
          pill={p}
          onDragStart={(e) => {
            e.stopPropagation();
            setDragging({
              id: p.id,
              offsetX: e.clientX - p.x,
              offsetY: e.clientY - p.y,
            });
          }}
          isDragging={dragging && dragging.id === p.id}
        />
      ))}
    </div>
  );
}
