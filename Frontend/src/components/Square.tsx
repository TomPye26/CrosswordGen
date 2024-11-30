import React, {useState} from "react";
import './Square.css';

interface SquareProps {
 realValue: string // letter it is supposed to be in the solved puzzle
 currentValue?: string // letter put in by the user
 isLocked: boolean // user can change its value
 wordNum?: number // number corresponding to clue
 displayCorrect: boolean // whether or not to change style of correct square
 onClick: ()=> void // func to handle when user is clicked into this square
}

const Square: React.FC<SquareProps> = ({realValue, currentValue, isLocked, wordNum, displayCorrect, onClick}) => {
    const [value, setValue] = useState(currentValue || '')
    
    const isCorrect: boolean = (realValue === value);

    const handleValueChangeKeyEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
        
        const newValue = e.key;
        if (newValue === "Backspace") {
            setValue('');
            e.preventDefault();
        } 
        else if (/^[A-Za-z]$/.test(newValue)) {
            setValue(newValue.toUpperCase())
        }
    };

    const handleValueChangeChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (/^[A-Za-z]$/.test(e.target.value)) {
            setValue(e.target.value.toUpperCase())
        }
    }

    const className: string = (realValue !== '#') ? 'square' : 'black-square';
    const squareStyle: string = (isCorrect && displayCorrect) ? 'correct' : '' 
    isLocked = (realValue === '#')//(realValue !== "");
    return (
        <div className={`${className} ${squareStyle}`} onFocus={onClick}>
            {isLocked ? (
                <span>{currentValue}</span>
            ) : (
                <input
                    type="text"
                    maxLength={1}
                    value={value}
                    onChange={handleValueChangeChangeEvent}
                    pattern="[A-Za-z]"
                    onKeyDown={handleValueChangeKeyEvent}
                />
            )}
            {wordNum && <span className="word-number">{wordNum}</span>}

        </div>
    );
};

export default Square;