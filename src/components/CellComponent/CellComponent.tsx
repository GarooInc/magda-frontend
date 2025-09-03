import { Link } from "react-router-dom";



interface CellComponentProps {
  value: number;
  color: string;
  showNumbers: boolean;
  nombre: string;
  clickeable?: boolean;
}

const CellComponent = ({ value, color, showNumbers, nombre, clickeable }: CellComponentProps) => {
  return (
    clickeable ? (
      <Link to={`/panel-lote/${nombre}`}>
        <div
          className={`rounded-xl flex items-center justify-center font-semibold text-white text-xl cursor-pointer hover:scale-105 transition-transform duration-200`}
          style={{ backgroundColor: color , aspectRatio: "1 / 1" }}
          title={`${nombre} - Lotes: ${value}`}
        >
        {showNumbers ? <span>{value.toFixed(2)}</span> : null}
      </div>
      </Link>
    ) : (
      <div
        className={`rounded-xl flex items-center justify-center font-semibold text-white text-xl`}
        style={{ backgroundColor: color , aspectRatio: "1 / 1" }}
        title={`${nombre} - Lotes: ${value}`}
      >
      {showNumbers ? <span>{value}</span> : null}
    </div>
    )
  )
}

export default CellComponent;