import React, { CSSProperties } from "react";
import { useDrag } from "react-dnd";
import { ColorType } from "../../stores";
import "./index.css";

export const COLORS_MAP: { [key in ColorType]: string } = {
  orange: "#D89F4Fdd",
  green: "#57BC69dd",
  blue: "#222FA7dd",
  violet: "#9F47C3dd",
};

interface IProps {
  id?: number;
  color: ColorType;
  style?: CSSProperties;
}

export const Token: React.FunctionComponent<IProps> = ({
  id,
  color,
  style,
}) => {
  const [, drag] = useDrag({
    item: { id, type: color },
  });

  return (
    <div
      ref={drag}
      className="token"
      style={{
        ...style,
        borderRadius: Number.MAX_SAFE_INTEGER,
        backgroundColor: COLORS_MAP[color],
        boxShadow: "1px 1px 2px #0009",
        transform: "translate(0,0)",
      }}
    />
  );
};
