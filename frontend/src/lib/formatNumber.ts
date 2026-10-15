export function formatCompactNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return '0';
  if (num < 1000) return num.toLocaleString();
  if (num < 1_000_000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
}

export function formatExactNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString();
}
