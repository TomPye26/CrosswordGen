import React from 'react';

// Define the type for clues
type Clue = {
  number: number;
  clue: string;
};

// Define the props type for ClueBox
type ClueBoxProps = {
  acrossClues: Clue[];
  downClues: Clue[];
};

const ClueBox: React.FC<ClueBoxProps> = ({ acrossClues, downClues }) => {
  return (
    <div className="clue-list-container">
      <div className="across-clues">
        <h3>Across</h3>
        <ul>
          {acrossClues.map((clue) => (
            <li key={clue.number}>
              <strong>{clue.number}. </strong>{clue.clue}
            </li>
          ))}
        </ul>
      </div>

      <div className="down-clues">
        <h3>Down</h3>
        <ul>
          {downClues.map((clue) => (
            <li key={clue.number}>
              <strong>{clue.number}. </strong>{clue.clue}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClueBox;
