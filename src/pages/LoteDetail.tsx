import React from 'react'
import { useParams } from "react-router-dom";


const LoteDetail = () => {
    const { loteId } = useParams();

  return (
    <div>LoteDetail: {loteId}</div>
  )
}

export default LoteDetail