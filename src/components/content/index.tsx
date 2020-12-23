import React, { createRef, useContext, useEffect } from "react";
import { ColorType, Context } from "../../stores";
import "./index.css";
import { Token } from "../token";
import { Cell } from "../cell";
import { useDrop } from "react-dnd";
import cn from "classnames";
import { useLocation } from "react-router-dom";
import cells from "../../services/cells";
import cellsLoiselle from "../../services/cells.loiselle";
import cellsMtlo from "../../services/cells.mtlo";

interface IProps {}

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export const Content: React.FunctionComponent<IProps> = () => {
  const { name, setName, grid, tokenizeCell, setSource, isBingo } = useContext(
    Context
  );

  const params = useQuery();
  useEffect(() => {
    const f = params.get("f");
    if (!f) {
      setSource(cells);
      return;
    }

    setSource(
      ["loiselle"].includes(f)
        ? cellsLoiselle
        : ["mtlo", "mont-lo", "mont-laurier", "tremblay", "vincent"].includes(f)
        ? cellsMtlo
        : cells
    );
  }, [setSource, params]);

  const inputRef = createRef<HTMLInputElement>();

  const [{ canDrop, isOver }, drop] = useDrop<
    { id: number; type: ColorType },
    void,
    { canDrop: boolean; isOver: boolean }
  >({
    accept: ["orange", "violet", "green", "blue"],
    drop: (item) => tokenizeCell(item.type, undefined, item.id),
    collect: (monitor) => ({
      itemType: monitor.getItemType(),
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const current = inputRef.current;
    const value = current?.value;
    if (!value || !setName) {
      return;
    }

    setName(value);
    inputRef.current && (inputRef.current.value = "");
  };

  return (
    <div className="content-container">
      {isBingo && (
        <div
          style={{
            position: "absolute",
            width: "100vw",
            height: "100vh",
            backgroundColor: "#ff07",
            fontSize: 128,
            zIndex: 999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          BINGO
        </div>
      )}
      <div className="left-container">
        <div className="form-container">
          <form onSubmit={onSubmit} className="form">
            <input className="input" ref={inputRef} />
            <input className="submit" type="submit" value="GO" />
          </form>
          {!!name && <div className="name-input">{name}</div>}
        </div>
        <div
          ref={drop}
          className={cn(
            "token-container",
            canDrop ? "droppable" : undefined,
            isOver ? "over" : undefined
          )}
        >
          <Token color={"blue"} />
          <Token color={"violet"} />
          <Token color={"green"} />
          <Token color={"orange"} />
        </div>
      </div>
      <div className="card">
        {grid.map((v) => (
          <Cell key={v.id} statement={v} />
        ))}
      </div>
    </div>
  );
};
