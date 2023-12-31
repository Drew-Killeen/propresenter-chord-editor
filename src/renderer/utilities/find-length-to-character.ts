export default function findLengthToCharacter({
  text,
  character,
  index,
  direction = 'forward',
}: {
  text: string;
  character: string;
  index: number;
  direction?: 'forward' | 'backward';
}) {
  let length = 0;
  let i = index;
  while (direction === 'forward' ? i < text.length : i >= 0) {
    if (text[i] === character) {
      break;
    }
    length++;
    direction === 'forward' ? i++ : i--;
  }
  return length;
}
