export function formatOpCode(op?: string) {
  if (!op) return "UNKNOWN";
  return op.split("_").join(" ").toUpperCase();
}