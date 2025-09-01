import React from 'react'

interface CellComponentProps {
  value: number;
  color: string;
  showNumbers: boolean;
  nombre: string;
}

const CellComponent = ({ value, color, showNumbers, nombre }: CellComponentProps) => {
  return (
    <div
      className="rounded-xl flex items-center justify-center font-semibold text-white text-sm"
      style={{ backgroundColor: color , aspectRatio: "1 / 1" }}
      title={`${nombre} - Lotes: ${value}`}
    >
      {showNumbers ? <span>{value}</span> : null}
    </div>
  )
}

export default CellComponent;