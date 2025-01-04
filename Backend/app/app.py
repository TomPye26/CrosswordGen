""" API for crossword """

#%%
import json
from random import randint
from time import time
from typing import Annotated, Dict, List, Tuple

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

from Wrappers.Python.libWizium import Wizium

class Word(BaseModel):
    word: str
    clue: str
    direction: str
    number: int
    positions: List[Tuple[int, int]]


class PuzzleResponse(BaseModel):
    grid: List[List[str]]
    words_across: List[Word]
    words_down: List[Word]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BIN_PATH = "./Binaries/Windows/libWizium_x64.dll"
DICT_PATH = "./Dictionaries/dictionary_en_cleaned.json"

def load_dictionary_json(dict_path: str = DICT_PATH) -> list[str]:
    """ load and clean a file to a list of words"""

    with open(dict_path, encoding="utf-8", mode="r") as file:
        words_dict = json.load(file)

    return list(words_dict.keys())


def solve(wiz, max_black=0, heuristic_level=0, seed=0):
    """Solve the grid

    wiz             Wizium instance
    max_black       Max number of black cases to add (0 if not allowed)
    heuristic_level Heuristic level (0 if deactivated)
    seed            Random Number Generator seed (0: take at random)
    """

    if not seed:
        seed = randint(1, 1000000)

    # Configure the solver
    wiz.solver_start(
        seed=seed,
        black_mode="DIAG",
        max_black=max_black,
        heuristic_level=heuristic_level
    )

    tstart = time()

    # Solve with steps of 500ms max, in order to draw the grid content evolution
    while True:
        status = wiz.solver_step(max_time_ms=100)

        print(status)

        if status.fillRate == 100:
            print("SUCCESS!")
            break
        if status.fillRate == 0:
            print("FAILED!")
            break

    # Ensure to release grid content
    wiz.solver_stop()

    tend = time()
    print (f"Compute time: {(tend-tstart):.01f}s")

    return wiz

# TODO: impement in the c++ module
def find_words(grid: list[list[str]]) -> List[Word]:
    """Find the words in the grid and give each a clue number, including positions."""

    words_down = []
    clue_number = 1  # Start clue numbering at 1
    clue_map = {}  # Dictionary to store the clue numbers by starting position
    
    # Find words across
    for row_idx, row in enumerate(grid):
        word = ''
        positions = []  # To store the grid positions of this word
        for col_idx, cell in enumerate(row):
            if cell != '#':
                word += cell
                positions.append((row_idx, col_idx))  # Track the position
                # If this is the first letter of the word (starting position), assign a clue number
                if (row_idx, col_idx) not in clue_map:
                    clue_map[(row_idx, col_idx)] = clue_number
                    clue_number += 1
            else:
                if len(word) > 1:  # Only add words with more than 1 character
                    start_pos = (row_idx, col_idx - len(word))
                    words_down.append(
                        Word(
                            word=word,
                            clue=word,
                            direction="down",
                            number=clue_map[start_pos],
                            positions=positions
                        )
                    )
                word = ''
                positions = []  # Reset positions
        if len(word) > 1:  # Check the last word in the row
            start_pos = (row_idx, col_idx - len(word) + 1)
            words_down.append(
                Word(
                    word=word,
                    clue=word,
                    direction="down",
                    number=clue_map[start_pos],
                    positions=positions
                )
            )
    
    # Find words down
    words_across = []
    num_columns = len(grid[0]) if grid else 0
    for col_idx in range(num_columns):
        word = ''
        positions = []  # To store the grid positions of this word
        for row_idx, row in enumerate(grid):
            cell = row[col_idx]
            if cell != '#':
                word += cell
                positions.append((row_idx, col_idx))  # Track the position
                # If this is the first letter of the word (starting position), assign a clue number
                if (row_idx, col_idx) not in clue_map:
                    clue_map[(row_idx, col_idx)] = clue_number
                    clue_number += 1
            else:
                if len(word) > 1:  # Only add words with more than 1 character
                    start_pos = (row_idx - len(word), col_idx)
                    words_across.append(
                        Word(
                            word=word,
                            clue=word,
                            direction="across",
                            number=clue_map[start_pos],
                            positions=positions)
                    )
                word = ''
                positions = []  # Reset positions
        if len(word) > 1:  # Check the last word in the column
            start_pos = (row_idx - len(word) + 1, col_idx)
            words_across.append(
                Word(
                    word=word,
                    clue=word,
                    direction="across",
                    number=clue_map[start_pos],
                    positions=positions
                )
            )

    return (words_across, words_down)

@app.get("/generate_puzzle")
def generate_puzzle(
    x_size: Annotated[int, Query(ge=5, le=15)],
    y_size: Annotated[int, Query(ge=5, le=15)],
) -> PuzzleResponse:
    """ gernerate puzzle """

    wiz = Wizium(BIN_PATH)

    wiz.dic_add_entries(
        load_dictionary_json(DICT_PATH)
    )

    wiz.grid_set_size(width=x_size, height=y_size)

    max_black = int(x_size * y_size * 0.2)

    wiz = solve(wiz, max_black=max_black)

    grid = wiz.grid_read()
    grid = [word.strip() for word in grid]

    return_grid = [list(word) for word in grid]

    words_across, words_down = find_words(return_grid)

    return PuzzleResponse(
        grid=return_grid,
        words_across=words_across,
        words_down=words_down
    )
