export function formatViews(views) {
  const count = Number(views) || 0;

  if (count >= 1_000_000_000) {
    return formatCompact(
      count,
      1_000_000_000,
      "B"
    );
  }

  if (count >= 1_000_000) {
    return formatCompact(
      count,
      1_000_000,
      "M"
    );
  }

  if (count >= 1_000) {
    return formatCompact(
      count,
      1_000,
      "K"
    );
  }

  return count.toString();
}

function formatCompact(value, divisor, suffix) {
  const result = value / divisor;

  const formatted = Number.isInteger(result)
    ? result.toString()
    : result.toFixed(1);

  return `${formatted}${suffix}`;
}