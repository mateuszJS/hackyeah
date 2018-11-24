const clamp = (min, value, max) =>
  Math.min(Math.max(value, min), max);

export default clamp;