import { Link } from "react-router-dom";



interface CellComponentProps {
  value: number;
  color: string;
  showNumbers: boolean;
  nombre: string;
  id?: string;
  clickeable?: boolean;
  nubosidad?: boolean;
}

const CellComponent = ({ value, color, showNumbers, nombre, id, clickeable, nubosidad }: CellComponentProps) => {
  const bgColor = nubosidad ? '#6b7280' : color;

  return (
    clickeable ? (
      <Link to={`/panel-lote/${id}`}>
        <div
          className={`rounded-xl tooltip flex items-center justify-center font-semibold text-white  xl:text-xl text-sm cursor-pointer hover:scale-105 transition-transform duration-200`}
          data-tip={`${nombre}`}
          style={{ backgroundColor: bgColor , aspectRatio: "1 / 1" }}
        >
        {showNumbers ? <span>{value.toFixed(4)}</span> : null}
      </div>
      </Link>
    ) : (
      <div
        className={`rounded-xl tooltip flex items-center justify-center font-semibold text-white text-xl`}
        data-tip={`${nombre}`}
        style={{ backgroundColor: bgColor , aspectRatio: "1 / 1" }}
      >
      {showNumbers ? <span>{value}</span> : null}
    </div>
    )
  )
}

export default CellComponent;