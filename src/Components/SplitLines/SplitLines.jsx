export default function SplitLines({ cursor }) {
  return (
    <>
      <div
        className="absolute bg-red-500 w-1 pointer-events-none"
        style={{ left: cursor.x, top: 0, height: "100%" }}
      />
      <div
        className="absolute bg-blue-500 h-1 pointer-events-none"
        style={{ top: cursor.y, left: 0, width: "100%" }}
      />
    </>
  );
}
