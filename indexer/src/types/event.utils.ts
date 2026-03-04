export function safeUnwrapToNumber(value: number | string): number | null {
  if (typeof value === "number") {
    return value;
  }
  if (!value) {
    return null;
  }
  return Number.parseFloat(value);
}

export function safeUnwrapToBigInt(
  value: number | bigint | string | null
): bigint | null {
  if (typeof value === "number") {
    return BigInt(value);
  }
  if (typeof value === "bigint") {
    return value;
  }
  if (typeof value === "string") {
    return BigInt(value);
  }
  return null;
}
