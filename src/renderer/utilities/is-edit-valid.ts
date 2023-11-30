/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
export default function isEditValid(oldText: string, newText: string): boolean {
  const stringLength = Math.max(oldText.length, newText.length);
  let insideBrackets = false;

  let oldTextIterator = 0;
  let newTextIterator = 0;

  while (Math.max(oldTextIterator, newTextIterator) < stringLength) {
    if (newText[newTextIterator] === ']') {
      insideBrackets = false;
      newTextIterator++;
    }
    if (insideBrackets) {
      newTextIterator++;
      continue;
    }

    if (newText[newTextIterator] === '[') {
      insideBrackets = true;
      newTextIterator++;
    } else if (oldText[oldTextIterator] !== newText[newTextIterator]) {
      return false;
    } else {
      oldTextIterator++;
      newTextIterator++;
    }
  }

  return true;
}
