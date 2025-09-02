
import React from "react";
import CellComponent from "../CellComponent/CellComponent";

interface Finca {
  nombre: string;
  numero: number;
}

interface GridSquaresProps {
  data: Finca[];
  columns?: number;
  showNumbers?: boolean;
  clickeable?: boolean;
}

const GridSquares = ({ data, columns = 5, showNumbers = false, clickeable = false }: GridSquaresProps) => {

  const thresholds = [0.2, 0, -0.5, -0.5];
  const colors = ["#106b47", "#7ddf8f",  "#f97316", "#e53935"];

  const getColor = (v: number): string => {
    if (v >= thresholds[0]) return colors[0];
    if (v > thresholds[1] && v < thresholds[0]) return colors[1];
    if (v <= thresholds[1] && v > thresholds[2]) return colors[2];
    if (v <= thresholds[2]) return colors[3];
    return colors[0];
  };

  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {data.map((finca, i) => (
        <CellComponent
          key={i}
          value={finca.numero}
          color={getColor(finca.numero)}
          showNumbers={showNumbers}
          nombre={finca.nombre}
          clickeable={clickeable}
        />
      ))}
    </div>
  );
}

export default  GridSquares;