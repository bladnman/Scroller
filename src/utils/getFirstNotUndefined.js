export default function getFirstNotUndefined(...values) {
  return values && values.find(value => value !== null && value !== undefined);
}
