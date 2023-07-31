import { useEffect } from 'react';
import Slide from './slide';

export default function Group({
  cueGroup,
  lyrics,
}: {
  cueGroup: any;
  lyrics: any;
}) {
  const label: string = cueGroup.group.name;

  const slideElements = cueGroup.cueIdentifiers.map(
    (value: any, index: number) => {
      return (
        <Slide key={value.string} id={index + 1}>
          {lyrics[value.string]}
        </Slide>
      );
    }
  );

  useEffect(() => {
    let red = 0;
    let green = 0;
    let blue = 0;

    if (cueGroup.group.color) {
      if (cueGroup.group.color.red) red = cueGroup.group.color.red * 255;
      if (cueGroup.group.color.green) green = cueGroup.group.color.green * 255;
      if (cueGroup.group.color.blue) blue = cueGroup.group.color.blue * 255;
    }

    document.getElementById(
      cueGroup.group.uuid.string
    )!.style.background = `rgb(${red}, ${green}, ${blue})`;
  }, [cueGroup]);

  return (
    <div className="group">
      <div className="group-label">
        <div className="group-label-text">{label}</div>
        <div className="color-marker" id={cueGroup.group.uuid.string} />
      </div>
      <div className="slides">{slideElements}</div>
    </div>
  );
}
