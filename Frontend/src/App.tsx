// App.tsx
import React, { useEffect, useState } from "react";
import { fetchCrosswordGrid } from "./api";
import Grid from "./components/Grid";
import ClueBox from "./components/ClueBox"
import GenerateButton from "./components/GenerateButton"
import SettingsBar from "./components/SettingsBar";
import "./App.css"

const App: React.FC = () => {
    const [requestedGrid, setRequestedGrid] = useState<boolean>(false)
    const [grid, setGrid] = useState<string[][]>([]);

    const handleGenerate = (newGrid: string[][]) => {
        setRequestedGrid(true)  
        setGrid(newGrid);
    };
    
    const [autoCheckOn, setAutoCheckOn] = useState<boolean>(false);
    const toggleAutoCheck = (newState: boolean) => {
        setAutoCheckOn(newState);
    }

    const [clickedSquare, setClickedSqure] = useState<number[]>([])
    const handleSquareClick = (x: number, y: number) => {
        setClickedSqure([x,y]);
    }


    // test clues
    const acrossClues = [
        { number: 1, clue: "A large body of water" },
        { number: 5, clue: "A color of the sky" },
        { number: 8, clue: "Not soft" },
        // More across clues
      ];
    
      const downClues = [
        { number: 1, clue: "Not night" },
        { number: 2, clue: "Something you eat" },
        { number: 4, clue: "A large animal" },
        // More down clues
      ];

    const minGridWidth: number = (grid.length * 45)
    document.documentElement.style.setProperty('--min-grid-width', `${minGridWidth}px`);

    return (
        <div className="app-container">
            <h1>Crossword Generator</h1>
            {
                <div>
                {(() => {
                    if (!requestedGrid) {
                        return (
                            <div className="generate-page">
                                <GenerateButton onGenerate={handleGenerate}/>
                            </div>
                        )
                    } else if (!grid && requestedGrid) {
                        return <h1>Loading...</h1>;
                    } else if (grid && requestedGrid) {
                        return (
                            <div className="main-body">
                                <div className="grid">
                                    <Grid
                                        gridArray={grid}
                                        autoCheck={autoCheckOn}
                                        handleSquareClick={handleSquareClick}
                                    />
                                </div>
                                <div className="clue-box">
                                    <ClueBox
                                        acrossClues={acrossClues}
                                        downClues={downClues}
                                    />
                                </div>
                                <div className="settings-bar">
                                   <SettingsBar 
                                       toggleAutoCheckFunc={toggleAutoCheck}
                                   />
                                </div>
                            </div>
                        )
                    }
                })()}
                </div>
            }
        </div>
    );
};

export default App;
