// App.tsx
import React, { useEffect, useState } from "react";
import { fetchCrosswordGrid } from "./api";
import Grid from "./components/Grid";
import ClueBox, {Clue} from "./components/ClueBox";
import GenerateButton from "./components/GenerateButton";
import SettingsBar from "./components/SettingsBar";
import "./App.css"

const App: React.FC = () => {
    
    const [requestedGrid, setRequestedGrid] = useState<boolean>(false)
    const [grid, setGrid] = useState<string[][]>([]);
    const [wordsAcrossList, setwordsAcrossList] = useState<Clue[]>([]);
    const [wordsDownList, setwordsDownList] = useState<Clue[]>([]);
    const handleGenerate = (
        newGrid: string[][],
        wordsAcrossList: Clue[],
        wordsDownList: Clue[]
    ) => {
        setRequestedGrid(true)  
        setGrid(newGrid);
        setwordsAcrossList(wordsAcrossList);
        setwordsDownList(wordsDownList);
    };
    console.log(wordsAcrossList);

    const [autoCheckOn, setAutoCheckOn] = useState<boolean>(false);
    const toggleAutoCheck = (newState: boolean) => {
        setAutoCheckOn(newState);
    }

    const [clickedSquare, setClickedSqure] = useState<number[]>([])
    const [facingDirection, setFacingDirection] = useState<string>("across")
    const handleSquareClick = (x: number, y: number) => {
        setClickedSqure([x,y]);
        
        let newDir: string = ((facingDirection === "down") ? "across" : "down");
        setFacingDirection(newDir)
     }

     console.log(facingDirection)


    // test clues
    const acrossClues = [
        { number: 1, clue: "A large body of water", direction: 'across'},
        { number: 5, clue: "A color of the sky", direction: 'across'},
        { number: 8, clue: "Not soft", direction: 'across'},
      ];
   
    const downClues = [
    { number: 1, clue: "Not night", direction: 'down'},
    { number: 2, clue: "Something you eat", direction: 'down'},
    { number: 4, clue: "A large animal", direction: 'down'},
    // More down clues
    ];

    const minGridWidth: number = (grid.length * 45) + (grid.length * 2.1)
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
                                <div className="grid-and-clues">
                                    <div className="grid">
                                        <Grid
                                            gridArray={grid}
                                            autoCheck={autoCheckOn}
                                            handleSquareClick={handleSquareClick}
                                            />
                                    </div>
                                    <div className="clue-box">
                                        <ClueBox
                                            acrossClues={wordsAcrossList}
                                            downClues={wordsDownList}
                                            highlightClueNumber={8}
                                            highlightClueDirection="across"
                                            />
                                    </div>
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
