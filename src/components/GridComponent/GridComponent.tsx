import GridSquares from "../GridSquares/GridSquares";
import Legend from "../LegendComponent/LegendComponent";

interface GridComponentProps {
  data: { nombre: string; lote: string; numero: number; }[];
  titulo?: string;
  clickeable?: boolean;
  fecha?: string;
  thresholds?: number[];
  labels?: string[];
}

const GridComponent = ({data, titulo, clickeable, fecha, thresholds, labels}: GridComponentProps) => {

  return (
    <div className="bg-white text-gray-900 shadow-2xl p-10 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">{titulo || "Magdalena Guatemala"}</h1>

        <GridSquares
          data={data}
          columns={10}
          showNumbers
          clickeable={clickeable}
          thresholds ={thresholds}
        />

        <Legend
          labels={labels || ["Bueno", "Medio", "Malo", "Crítico"]}
          colors={["#106b47", "#7ddf8f", "#f97316", "#e53935"]}
          fecha={fecha}
        />
      </div>
    </div>
  );
}

export default GridComponent;

