""" API for crossword """

#%%
import json
from random import randint
from time import time
from typing import Annotated

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

# from pydantic import BaseModel

from Wrappers.Python.libWizium import Wizium


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


@app.get("/generate_puzzle")
def generate_puzzle(
    x_size: Annotated[int, Query(ge=5, le=15)],
    y_size: Annotated[int, Query(ge=5, le=15)],
) -> list[list[str]]:
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

    return return_grid
