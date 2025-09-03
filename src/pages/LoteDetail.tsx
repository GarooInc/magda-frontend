import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { IoCloseCircle } from "react-icons/io5";
import { getDetallePoligono } from '../lib/analysis/analysis'
import { useNavigate } from 'react-router-dom'; 




const LoteDetail = () => {
    const { loteId } = useParams();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<{ poligono: { finca: string; lote: string; region: string; admin: string; area: number; }, data: { ndvi_metricas?: { [key: string]: number } | null; ndwi_metricas?: { [key: string]: number } | null; }, fecha_toma?: string } | null>(null)

    const navigate = useNavigate();

    const handleClose = () => {
        navigate(-1);
    }

    useEffect(() => {
        const token = localStorage.getItem('cognitoToken') || '';
        const temporada = localStorage.getItem('selectedTemporada') || '1';
        try {
            getDetallePoligono(token, loteId ?? '', Number(temporada)).then(resp => {
                setData(resp)
            }).catch(err => {
                console.error(err)
                setError(err?.message ?? 'Error al cargar los datos del lote')
            }).finally(() => {
                setLoading(false)
            })
        }
        catch (err) {
            console.error(err)
            setError('Error al cargar los datos del lote')
            setLoading(false)
        }
    }, [loteId])

  return (
    <div className='bg-white h-[100vh]'>
        <div className='p-20 lg:px-60 flex-col bg-white'>
            <div className='flex flex-col shadow-2xl p-10 rounded-2xl'>
                <div className='justify-between flex w-full items-center'>
                    <img src="/src/assets/images/logos/logomagda.png" className='h-16' />
                    <IoCloseCircle className='h-10 w-10 text-[#200085] cursor-pointer' onClick={handleClose} />
                </div>
                <div className='h-[1px] w-full bg-gray-500 mt-4'></div>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2 py-4'>
                        <span className='font-semibold text-black text-2xl'>
                            {data?.poligono.finca} | Lote {data?.poligono.lote}
                        </span>
                        <div className='flex gap-4'>
                            <span className='font-light text-gray-500 text-lg'>
                                Región: {data?.poligono.region}
                            </span>
                            <span className='font-light text-gray-500 text-lg'>
                                Admin: {data?.poligono.admin}
                            </span>
                        </div>
                        <span className='font-light text-gray-500 text-lg'>
                                Area: {data?.poligono.area.toFixed(2)}
                        </span>
                    </div>

                    <div className='flex flex-col w-full gap-4'>
                        <div className='flex justify-between w-full'>
                            <span className='font-semibold text-[#FE4C00] text-xl'>
                                NDVI
                            </span>
                            <button className='btn bg-[#EBE8E8] border-0 active:bg-[#FE4C00] hover:bg-[#FE4C00] hover:text-white rounded-xl text-black font-poppins shadow-none'>
                                Ver Imagen
                            </button>
                        </div>
                        <div className='flex justify-between gap-4'>
                        {
                            data?.data.ndvi_metricas && (
                                Object.entries(data.data.ndvi_metricas).map(([key, value]) => (
                                    <div key={key} className='w-full font-light text-gray-500 text-lg p-2 border border-gray-300 rounded-lg flex flex-col justify-center items-center'>
                                         <span>{value.toFixed(2)}</span>
                                         <span className='capitalize'>{key}</span>
                                    </div>
                                ))
                                )
                        }
                        </div>
                    </div>

                    <div className='flex flex-col w-full gap-4'>
                        <div className='flex justify-between w-full'>
                            <span className='font-semibold text-[#200085] text-xl'>
                                NDWI
                            </span>
                            <button className='btn bg-[#EBE8E8] border-0 active:bg-[#200085] hover:bg-[#200085] hover:text-white rounded-xl text-black font-poppins shadow-none'>
                                Ver Imagen
                            </button>
                        </div>
                        <div className='flex justify-between gap-4'>
                        {
                            data?.data.ndwi_metricas && (
                                Object.entries(data.data.ndwi_metricas).map(([key, value]) => (
                                    <div key={key} className='w-1/3 font-light text-gray-500 text-lg p-2 border border-gray-300 rounded-lg flex flex-col justify-center items-center'>
                                         <span>{value.toFixed(2)}</span>
                                         <span className='capitalize'>{key}</span>
                                    </div>
                                ))
                                )
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default LoteDetail