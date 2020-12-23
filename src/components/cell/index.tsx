import React from "react";
import { CellType, ColorType, useTokenizeCell } from "../../stores";
import cn from "classnames";
import { useDrop } from "react-dnd";
import "./index.css";
import { Token } from "../token";

interface IProps {
  statement: CellType;
}

export const Cell: React.FunctionComponent<IProps> = ({ statement }) => {
  const tokenizeCell = useTokenizeCell();

  const [{ canDrop, isOver }, drop] = useDrop<
    { id: number; type: ColorType },
    void,
    { canDrop: boolean; isOver: boolean }
  >({
    accept: ["orange", "violet", "green", "blue"],
    drop: (item) => tokenizeCell(item.type, statement.id, item.id),
    collect: (monitor) => ({
      itemType: monitor.getItemType(),
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} key={statement.id} className="cell">
      <div
        className={cn(
          "inner-cell",
          statement.id === 25 ? "free" : undefined,
          canDrop ? "droppable" : undefined,
          isOver ? "over" : undefined
        )}
      >
        {statement.value}
      </div>
      {statement.tokenized ? (
        <Token
          style={{ position: "absolute" }}
          id={statement.id}
          color={statement.tokenized}
        />
      ) : null}
    </div>
  );
};
