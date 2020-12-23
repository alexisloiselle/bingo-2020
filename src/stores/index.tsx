import React, { createContext, useContext, useEffect, useState } from "react";
import { prng } from "seedrandom";
import { getGrid, getSeed } from "../services/seed";

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
  setSource: (
    source: readonly { readonly id: number; readonly value: string }[]
  ) => void;
  isBingo: boolean;
}>({
  grid: [],
  setName: () => {},
  tokenizeCell: () => {},
  setSource: () => {},
  isBingo: false,
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
  const [source, setSource] = useState<
    readonly { readonly id: number; readonly value: string }[]
  >([]);
  const [isBingo, setIsBingo] = useState<boolean>(false);

  useEffect(() => {
    if (!name) {
      return;
    }

    setIsBingo(false);

    const randomValue = getSeed(name);
    setPrng(randomValue);

    const tmpGrid = getGrid(randomValue, source);

    setGrid([
      ...tmpGrid.slice(0, 12),
      { id: 25, value: "GRATUIT" },
      ...tmpGrid.slice(12, 24),
    ]);
  }, [name, source]);

  useEffect(() => {
    if (grid.length === 0) {
      return;
    }

    const dimension = Math.sqrt(grid.length);

    // Rows and columns
    let lineBingo = false;
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
        lineBingo = true;
        break;
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
        lineBingo = true;
        break;
      }
    }

    if (lineBingo) {
      setIsBingo(true);
      return;
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
      setIsBingo(true);
      return;
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
      setIsBingo(true);
      return;
    }

    setIsBingo(false);
  }, [grid]);

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
      value={{ name, setName, prng, grid, tokenizeCell, setSource, isBingo }}
    >
      {children}
    </Context.Provider>
  );
};
