// Remove duplicate items from given array thanks to JS Set constructor and spread syntax.
export default function deduplicateArray<T>(array: Array<T>): Array<T> {
  return [...new Set(array)]
}