import React, { useState } from "react";
import { fetchCrosswordGrid } from "../api"
import { Clue } from "./ClueBox"
import "./GenerateButton.css"

interface GenerateButtonProps {
  onGenerate: (
    grid: string[][],
    wordAcrossList: Clue[],
    wordDownList: Clue[]
  ) => void;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ onGenerate }) => {
  const [width, setWidth] = useState<number>(10);
  
  const handleGenerate = async () => {
    const newGrid = await fetchCrosswordGrid(width, width);
    if (newGrid) {
      onGenerate(newGrid.grid, newGrid.words_across, newGrid.words_down);
    }
  }
  return (
    <div className="generate-button">
      Width: 
      <input 
        type="range"
        max={15}
        min={5}
        minLength={1}
        maxLength={2}
        onChange={(e) => setWidth(Number(e.target.value))}
        value={width}
        placeholder="width"
        />
        <span>{width}</span>
      <button onClick={handleGenerate}>
        Generate
      </button>
    </div>
  )
}

export default GenerateButton;