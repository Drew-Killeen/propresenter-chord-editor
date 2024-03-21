export default function isEditValid(oldText: string, newText: string): boolean {
  let insideBrackets = false;

  let oldTextIterator = 0;
  let newTextIterator = 0;

  while (oldTextIterator < oldText.length) {
    if (newText[newTextIterator] === undefined) {
      return false;
    }
    if (newText[newTextIterator] === ']') {
      insideBrackets = false;
      newTextIterator++;
    }
    if (insideBrackets) {
      newTextIterator++;
    } else if (newText[newTextIterator] === '[') {
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
