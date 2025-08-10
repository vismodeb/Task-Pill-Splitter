export const MIN_PILL_SIZE = 40;
export const MIN_PART_SIZE = 20;
export const BORDER_RADIUS = 20;
export const OFFSET = 5;

export function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function generateId() {
  return Date.now() + Math.random();
}

export function verticalBorderRadius(isLeftPart) {
  return isLeftPart
    ? `${BORDER_RADIUS}px 0 0 ${BORDER_RADIUS}px`
    : `0 ${BORDER_RADIUS}px ${BORDER_RADIUS}px 0`;
}

export function horizontalBorderRadius(isTopPart) {
  return isTopPart
    ? `${BORDER_RADIUS}px ${BORDER_RADIUS}px 0 0`
    : `0 0 ${BORDER_RADIUS}px ${BORDER_RADIUS}px`;
}
