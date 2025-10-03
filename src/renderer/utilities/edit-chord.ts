import { ChangeEvent } from 'react';
import isEditValid from './is-edit-valid';

export default function editChord(
  event: ChangeEvent<HTMLTextAreaElement>,
  oldLyricsPlusChords: string,
  originalLyrics: string,
  cueUuid: string,
  onEdit: (newLyrics: string, cueUuid: string) => void
) {
  const { selectionStart, selectionEnd } = event.target;
  const newText = event.target.value;

  const unmatchedBracketIndex = findBracketWithoutMatch(newText);

  // Check if editing inside of chord
  if (isSelectionInsideChord(newText, selectionStart, selectionEnd)) {
    if (isEditValid(originalLyrics, newText)) {
      onEdit(newText, cueUuid);
    }
  }

  // Check for opening or closing brackets without a matching pair
  else if (unmatchedBracketIndex !== -1) {
    let newLyrics: string;
    // Compare old text to new text to determine if chord is being inserted or deleted
    if (
      isChordBeingInserted(oldLyricsPlusChords, newText, unmatchedBracketIndex)
    ) {
      newLyrics = insertNewChord(newText, unmatchedBracketIndex);
    } else {
      newLyrics = deleteChord(newText, unmatchedBracketIndex, selectionStart);
    }
    onEdit(newLyrics, cueUuid);

    // Preserve cursor position
    setTimeout(() => {
      event.target.setSelectionRange(selectionStart, selectionStart);
    }, 0);
  }

  // Reset cursor if neither above condition is true
  else {
    // Preserve cursor position
    setTimeout(() => {
      event.target.setSelectionRange(selectionStart - 1, selectionStart - 1);
    }, 0);
  }
}

function isSelectionInsideChord(
  text: string,
  selectionStart: number,
  selectionEnd: number
) {
  // Check the text to the left of selectionStart. If a [ is found before a ], then the selection is inside a chord on the left
  const leftText = text.substring(0, selectionStart);
  const leftTextLeftBracketIndex = leftText.lastIndexOf('[');
  const leftTextRightBracketIndex = leftText.lastIndexOf(']');
  if (
    leftTextLeftBracketIndex < leftTextRightBracketIndex ||
    leftTextLeftBracketIndex === -1
  ) {
    return false;
  }

  // Check the text to the right of selectionEnd. If a ] is found before a [, then the selection is inside a chord on the right
  const rightText = text.substring(selectionEnd);
  const rightTextRightBracketIndex = rightText.indexOf(']');
  const rightTextLeftBracketIndex = rightText.indexOf('[');
  if (
    (rightTextRightBracketIndex > rightTextLeftBracketIndex &&
      rightTextLeftBracketIndex !== -1) ||
    rightTextRightBracketIndex === -1
  ) {
    return false;
  }

  return true;
}

function isBracketAlone(
  text: string,
  bracketIndex: number,
  bracketType: 'left' | 'right'
) {
  const bracket = bracketType === 'left' ? '[' : ']';
  const matchingBracket = bracketType === 'left' ? ']' : '[';

  if (bracketType === 'left') {
    const rightText = text.substring(bracketIndex + 1);
    const duplicateBracketIndex = rightText.indexOf(bracket);
    const matchingBracketIndex = rightText.indexOf(matchingBracket);

    if (
      matchingBracketIndex === -1 ||
      (duplicateBracketIndex < matchingBracketIndex &&
        duplicateBracketIndex !== -1)
    ) {
      return true;
    }
  }

  if (bracketType === 'right') {
    const leftText = text.substring(0, bracketIndex);
    const duplicateBracketIndex = leftText.lastIndexOf(bracket);
    const matchingBracketIndex = leftText.lastIndexOf(matchingBracket);

    if (
      matchingBracketIndex === -1 ||
      duplicateBracketIndex > matchingBracketIndex
    ) {
      return true;
    }
  }

  return false;
}

function findBracketWithoutMatch(text: string): number {
  let currentBracket: '[' | ']' = ']';
  let oppositeBracket: '[' | ']' = '[';
  let bracketIndex = 0;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === currentBracket) {
      if (currentBracket === ']') {
        bracketIndex = i;
      }
      return bracketIndex;
    }
    if (text[i] === oppositeBracket) {
      const tempBracket: '[' | ']' = currentBracket;
      currentBracket = oppositeBracket;
      oppositeBracket = tempBracket;
      bracketIndex = i;
    }
  }

  if (currentBracket === '[') {
    return bracketIndex;
  }
  return -1;
}

function isChordBeingInserted(
  oldText: string,
  newText: string,
  unmatchedBracketIndex: number
) {
  const bracket = newText[unmatchedBracketIndex];
  if (bracket === '[') {
    // Check the old text to see if a matching bracket used to exist. If so, assume the chord is being deleted.
    return isBracketAlone(oldText, unmatchedBracketIndex, 'left');
  }
  return isBracketAlone(oldText, unmatchedBracketIndex, 'right');
}

function insertNewChord(text: string, cursorIndex: number) {
  const bracketType = text[cursorIndex];
  const matchingBracket = bracketType === '[' ? ']' : '[';

  let leftText: string;
  let rightText: string;

  if (bracketType === '[') {
    leftText = text.substring(0, cursorIndex + 1);
    rightText = text.substring(cursorIndex + 1);
  } else {
    leftText = text.substring(0, cursorIndex);
    rightText = text.substring(cursorIndex);
  }
  return leftText + matchingBracket + rightText;
}

function deleteChord(
  text: string,
  unmatchedBracketIndex: number,
  cursorIndex: number
) {
  const bracketType = text[unmatchedBracketIndex];

  if (bracketType === '[') {
    const newLyrics =
      text.substring(0, unmatchedBracketIndex) + text.substring(cursorIndex);
    return newLyrics;
  }

  const leftText = text.substring(0, cursorIndex);
  let rightText = text.substring(cursorIndex);

  const rightBracketIndex = rightText.indexOf(']');

  rightText = rightText.substring(rightBracketIndex + 1);

  return leftText + rightText;
}
