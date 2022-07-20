export const findIndexNearestValue = (array: number[], item: number) => {
  let i = 0
  while (i < array.length && array[i] < item) {
    i++
  }
  return Math.abs(array[i] - item) <= Math.abs(array[i - 1] - item) ? i : i - 1
}
