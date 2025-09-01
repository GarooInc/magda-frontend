
import React from "react";
import CellComponent from "../CellComponent/CellComponent";

interface Finca {
  nombre: string;
  cantidad_lotes: number;
}

interface GridSquaresProps {
  data: Finca[];
  columns?: number;
  showNumbers?: boolean;
  thresholds: number[];
  colors: string[];
}

const GridSquares = ({ data, columns = 5, showNumbers = false, thresholds, colors }: GridSquaresProps) => {
  const getColor = (v: number) => {
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (v >= thresholds[i]) return colors[i];
    }
    return colors[0];
  };

  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {data.map((finca, i) => (
        <CellComponent
          key={i}
          value={finca.cantidad_lotes}
          color={getColor(finca.cantidad_lotes)}
          showNumbers={showNumbers}
          nombre={finca.nombre}
        />
      ))}
    </div>
  );
}

export default  GridSquares;