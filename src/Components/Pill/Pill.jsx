export default function Pill({ pill, onDragStart, isDragging }) {
  return (
    <div
      className="absolute border-4 border-black"
      style={{
        left: pill.x,
        top: pill.y,
        width: pill.width,
        height: pill.height,
        backgroundColor: pill.color,
        borderRadius: pill.borderRadius,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
      }}
      onMouseDown={onDragStart}
    />
  );
}
