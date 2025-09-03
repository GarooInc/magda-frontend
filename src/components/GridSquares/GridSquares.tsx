
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
  thresholds?: number[];
}

const GridSquares = ({ data, columns = 5, showNumbers = false, clickeable = false, thresholds }: GridSquaresProps) => {

  const thresholdsitem = thresholds || [-0.5,0, 0.5, 1];
  const colors = ["#106b47", "#7ddf8f",  "#f97316", "#e53935"];

  const getColorLote = (v: number): string => {
    if (v < thresholdsitem[0]) return colors[3]; //crítico
    if (v < thresholdsitem[1]) return colors[2]; //malo
    if (v < thresholdsitem[2]) return colors[1]; //medio
    return colors[0]; //bueno
  };

  const getColorFinca = (v: number): string => {
    if (v > thresholdsitem[0]) return colors[0];
    if (v > thresholdsitem[1]) return colors[1];
    if (v > thresholdsitem[2]) return colors[2];
    return colors[3];
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
          color={ thresholds ? getColorFinca(finca.numero) : getColorLote(finca.numero) }
          showNumbers={showNumbers}
          nombre={finca.nombre}
          clickeable={clickeable}
        />
      ))}
    </div>
  );
}

export default  GridSquares;