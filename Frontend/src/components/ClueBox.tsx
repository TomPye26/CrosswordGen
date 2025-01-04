import React from 'react';
import './ClueBox.css'

export interface Clue {
  number: number;
  word: string
  clue: string;
  direction: string;
  positions: number[][]
};

interface ClueBoxDirectionProps {
  clueList: Clue[];
  direction: string;
  highlightClueNumber: number;
  highlightClueDirection: 'down' | 'across';
};

interface ClueBoxProps {
  acrossClues: Clue[];
  downClues: Clue[];
  highlightClueNumber: number;
  highlightClueDirection: 'down' | 'across';
};

const ClueBoxDirection: React.FC<ClueBoxDirectionProps> = ({
  clueList, direction, highlightClueNumber, highlightClueDirection
}) => {
  return (
    <div className="clue-list-container-direction">
    {clueList.map((clue) => (
      <p 
        key={clue.number} 
        className={
          ((clue.number === highlightClueNumber) && (clue.direction === highlightClueDirection)) ? 'clue-highlighted' : 'clue'}
      >
        <div className='clue-number'>{clue.number}.</div>
        <div className='clue-text'>{clue.clue}</div>
      </p>
    ))}
  </div>
  )
}

const ClueBox: React.FC<ClueBoxProps> = ({
  acrossClues, downClues, highlightClueNumber, highlightClueDirection
}) => {
  return (
    <div className='clue-list-container'>
      <h3>Across</h3>
      <ClueBoxDirection
        clueList={acrossClues}
        direction='across'
        highlightClueNumber={highlightClueNumber}
        highlightClueDirection={highlightClueDirection}
      />
    
      <h3>Down</h3>
      <ClueBoxDirection
        clueList={downClues}
        direction='down'
        highlightClueNumber={highlightClueNumber}
        highlightClueDirection={highlightClueDirection}
      />

    </div>
    
  );
};

export default ClueBox;
