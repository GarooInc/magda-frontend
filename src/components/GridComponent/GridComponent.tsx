import React from "react";
import GridSquares from "../GridSquares/GridSquares";
import Legend from "../LegendComponent/LegendComponent";

interface GridComponentProps {
  data: { nombre: string; numero: number; }[];
  titulo?: string;
  clickeable?: boolean;
}

const GridComponent = ({data, titulo, clickeable}: GridComponentProps) => {

  return (
    <div className="bg-white text-gray-900 shadow-2xl p-10 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">{titulo || "Magdalena Guatemala"}</h1>

        <GridSquares
          data={data}
          columns={10}
          showNumbers
          clickeable={clickeable}
        />

        <Legend
          labels={["Bajo", "Medio", "Alto", "Crítico"]}
          colors={["#106b47", "#7ddf8f", "#f97316", "#e53935"]}
        />
      </div>
    </div>
  );
}

export default GridComponent;

