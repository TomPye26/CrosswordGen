// src/components/Crossword.tsx
import React, { useState } from 'react';
import { fetchCrosswordGrid } from './api';

const Crossword: React.FC = () => {
  const [grid, setGrid] = useState<string[][] | null>(null);

  const handleFetchCrossword = async () => {
    try {
      const crosswordData = await fetchCrosswordGrid(9, 9);
      setGrid(crosswordData);
    } catch (error) {
      console.error('Error fetching crossword:', error);
    }
  };

  return (
    <div>
      <button onClick={handleFetchCrossword}>Generate Crossword</button>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: grid ? `repeat(${grid[0].length}, 40px)` : 'auto',
          marginTop: '10px',
        }}
      >
        {grid &&
          grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  width: '40px',
                  height: '40px',
                  border: '1px solid black',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: cell === '#' ? 'black' : 'white',
                  color: cell === '#' ? 'white' : 'black',
                }}
              >
                {cell !== '#' ? cell : ''}
              </div>
            ))
          )}
      </div>
    </div>
  );
};

export default Crossword;
