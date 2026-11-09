// Number and time text shared by every screen.

// 1,234,567 in every language, so amounts read the same on every device.
export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

// Minutes and seconds, rounding a part second up: 61000 is 1:01, 0 is 0:00.
export function mmss(ms: number): string {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
