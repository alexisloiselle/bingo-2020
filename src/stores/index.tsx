import React, { createContext, useContext, useEffect, useState } from "react";
import { prng } from "seedrandom";
import cells from "../services/cells";
import { getGrid, getSeed } from "../services/seed";
import { getState, saveState } from "../services/storage";

export type ColorType = "orange" | "violet" | "blue" | "green";

export type CellType = {
  id: number;
  value: string;
  tokenized?: ColorType;
};

export const Context = createContext<{
  name?: string;
  setName: (name: string) => void;
  prng?: prng;
  grid: CellType[];
  tokenizeCell: (color: ColorType, id?: number, from?: number) => void;
  setSource: (source: { id: number; value: string }[]) => void;
  bingoCount: number;
  f?: string;
  setF: (f?: string) => void;
}>({
  grid: [],
  setName: () => {},
  tokenizeCell: () => {},
  setSource: () => {},
  bingoCount: 0,
  setF: () => {},
});

export const useName = (): [
  string | undefined,
  ((name: string) => void) | undefined
] => {
  const { name, setName } = useContext(Context);
  return [name, setName];
};

export const usePrng = (): prng | undefined => {
  const { prng } = useContext(Context);
  return prng;
};

export const useGrid = (): CellType[] => {
  const { grid } = useContext(Context);
  return grid;
};

export const useTokenizeCell = () => {
  const { tokenizeCell } = useContext(Context);
  return tokenizeCell;
};

export const ContextProvider: React.FunctionComponent = ({ children }) => {
  const [name, setName] = useState<string | undefined>();
  const [prng, setPrng] = useState<prng | undefined>();
  const [grid, setGrid] = useState<CellType[]>([]);
  const [source, setSource] = useState<{ id: number; value: string }[]>([]);
  const [bingoCount, setBingoCount] = useState<number>(0);
  const [f, setF] = useState<string | undefined>();

  useEffect(() => {
    setSource(cells(f));
  }, [f]);

  useEffect(() => {
    if (!name) {
      return;
    }

    setBingoCount(0);

    const randomValue = getSeed(name);
    setPrng(randomValue);

    const tmpGrid = getGrid(randomValue, source);

    const existingGrid = getState(name, f);

    setGrid(
      [
        ...tmpGrid.slice(0, 12),
        { id: 25, value: "GRATUIT" },
        ...tmpGrid.slice(12, 24),
      ].map((cell) => {
        const existingToken = existingGrid?.find((c) => c.id === cell.id);
        return { ...cell, tokenized: existingToken?.tokenized };
      })
    );
  }, [name, source, f]);

  useEffect(() => {
    if (grid.length === 0) {
      return;
    }

    const dimension = Math.sqrt(grid.length);

    // Rows and columns
    let bc = 0;
    for (let i = 0; i < dimension; i++) {
      // Row
      let rowBingo = true;
      for (let j = 0; j < dimension; j++) {
        if (!grid[i * dimension + j].tokenized) {
          rowBingo = false;
          break;
        }
      }

      if (rowBingo) {
        bc++;
      }

      // Column
      let columnBingo = true;
      for (let j = 0; j < dimension; j++) {
        if (!grid[j * dimension + i].tokenized) {
          columnBingo = false;
          break;
        }
      }

      if (columnBingo) {
        bc++;
      }
    }

    // Diagonal 1
    let diagonal1Bingo = true;
    for (let i = 0; i < grid.length; i += dimension + 1) {
      if (!grid[i].tokenized) {
        diagonal1Bingo = false;
        break;
      }
    }
    if (diagonal1Bingo) {
      bc++;
    }

    // Diagonal 2
    let diagonal2Bingo = true;
    for (
      let i = dimension - 1;
      i < grid.length - (dimension - 1);
      i += dimension - 1
    ) {
      if (!grid[i].tokenized) {
        diagonal2Bingo = false;
        break;
      }
    }
    if (diagonal2Bingo) {
      bc++;
    }

    setBingoCount(bc);

    name &&
      saveState(
        grid
          .filter((g) => !!g.tokenized)
          .map((g) => ({ id: g.id, tokenized: g.tokenized as ColorType })),
        name,
        f
      );
  }, [grid, name, f]);

  const tokenizeCell = (color: ColorType, id?: number, from?: number) => {
    const newGrid = grid.map((c) => {
      if (c.id === id) {
        return { ...c, tokenized: color };
      } else if (c.id === from) {
        return { ...c, tokenized: undefined };
      } else {
        return c;
      }
    });
    setGrid(newGrid);
  };

  return (
    <Context.Provider
      value={{
        name,
        setName,
        prng,
        grid,
        tokenizeCell,
        setSource,
        bingoCount,
        f,
        setF,
      }}
    >
      {children}
    </Context.Provider>
  );
};
