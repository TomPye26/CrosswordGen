import React, { useState } from "react";

import Square from "./Square";
import "./Grid.css"

interface GridProps {
    gridArray: string[][];
    autoCheck: boolean;
    handleSquareClick: (x: number, y: number) => void;
}

const Grid: React.FC<GridProps> = ({ gridArray, autoCheck, handleSquareClick}) => {

    const [values, setValues] = useState<string[][]>(gridArray);

    return (
        <div className="grid">
            {values.map((row, rowIndex) => (
                <div key={rowIndex} className="grid-row">
                    {row.map((value, colIndex) => (
                        <Square
                            key={colIndex}
                            realValue={value}
                            currentValue=""
                            isLocked={false}
                            displayCorrect={autoCheck}
                            onClick={() => handleSquareClick(rowIndex, colIndex)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Grid;