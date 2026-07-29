const palette = [
  "#ff9ed8",
  "#b8a1ff",
  "#7df9ff",
  "#a7ff83",
  "#ffd37d",
  "#ffad7d",
];

export function randomTagColor() {
  return palette[Math.floor(Math.random() * palette.length)];
}
