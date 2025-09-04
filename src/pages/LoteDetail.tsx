import { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { IoCloseCircle } from "react-icons/io5";
import { getDetallePoligono } from '../lib/analysis/analysis'
import { motion, AnimatePresence } from 'framer-motion';

const LoteDetail = () => {
  const { loteId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<{
    poligono: { finca: string; lote: string; region: string; admin: string; area: number; },
    data: { ndvi_metricas?: { [key: string]: number } | null; ndwi_mean?: number | null ; img_ndwi: string; img_ndvi: string; },
    fecha_toma?: string
  } | null>(null)

  const handleClose = () => navigate(-1);

  useEffect(() => {
    const token = localStorage.getItem('cognitoToken') || '';
    const temporada = Number(localStorage.getItem('selectedTemporada') || '1');

    setLoading(true);
    setError(null);

    getDetallePoligono(token, loteId ?? '', temporada)
      .then(resp => setData(resp))
      .catch((err) => {
        console.error(err);
        setError(err?.message ?? 'Error al cargar los datos del lote');
      })
      .finally(() => setLoading(false));
  }, [loteId]);

  const handleViewImage = (url : string) => {
    window.open(url, '_self');
  }

  return (
    <div className='bg-white h-[100vh] flex justify-center items-center'>
      <div className='p-20 lg:px-60 flex-col bg-white w-full'>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loader"
              className="flex flex-col items-center justify-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-[#200085]"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
              />
              <motion.span
                className="mt-4 text-gray-600 font-medium"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
              >
                Cargando datos…
              </motion.span>
            </motion.div>
          )}

          {!loading && error && (
            <motion.div
              key="error"
              className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              {error}
            </motion.div>
          )}

          {!loading && !error && data && (
            <motion.div
              key="content"
              className='flex flex-col shadow-2xl p-10 rounded-2xl'
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <div className='justify-between flex w-full items-center'>
                <img src="/assets/images/logos/logomagda.png" className='h-16' />
                <IoCloseCircle className='h-10 w-10 text-[#200085] cursor-pointer' onClick={handleClose} />
              </div>

              <div className='h-[1px] w-full bg-gray-500 mt-4'></div>

              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2 py-4'>
                  <span className='font-semibold text-black text-2xl'>
                    {data.poligono.finca} | Lote {data.poligono.lote}
                  </span>
                  <div className='flex gap-4'>
                    <span className='font-light text-gray-500 text-lg'>Región: {data.poligono.region}</span>
                    <span className='font-light text-gray-500 text-lg'>Admin: {data.poligono.admin}</span>
                  </div>
                  <span className='font-light text-gray-500 text-lg'>
                    Area: {Number(data.poligono.area).toFixed(2)}
                  </span>
                </div>

                {/* NDVI */}
                <div className='flex flex-col w-full gap-4'>
                  <div className='flex justify-between w-full'>
                    <span className='font-semibold text-[#FE4C00] text-xl'>NDVI</span>
                    <button className='btn bg-[#EBE8E8] border-0 active:bg-[#FE4C00] hover:bg-[#FE4C00] hover:text-white rounded-xl text-black font-poppins shadow-none'
                      onClick={() => handleViewImage(data.data.img_ndvi)}
                    >
                      Ver Imagen
                    </button>
                  </div>
                  <div className='flex justify-between gap-4'>
                    {data.data.ndvi_metricas && Object.entries(data.data.ndvi_metricas).map(([key, value]) => (
                      <div key={key} className='w-full font-light text-gray-500 text-lg p-2 border border-gray-300 rounded-lg flex flex-col justify-center items-center'>
                        <span>{Number(value).toFixed(4)}</span>
                        <span className='capitalize'>{key}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* NDWI */}
                <div className='flex flex-col w-full gap-4'>
                  <div className='flex justify-between w-full'>
                    <span className='font-semibold text-[#200085] text-xl'>NDWI</span>
                    <button className='btn bg-[#EBE8E8] border-0 active:bg-[#200085] hover:bg-[#200085] hover:text-white rounded-xl text-black font-poppins shadow-none'
                      onClick={() => handleViewImage(data.data.img_ndwi)}
                    >
                      Ver Imagen
                    </button>
                  </div>
                  <div className='flex justify-between gap-4'>
                    {data.data.ndwi_mean && (
                      <div className='w-1/3 font-light text-gray-500 text-lg p-2 border border-gray-300 rounded-lg flex flex-col justify-center items-center'>
                        <span>{Number(data.data.ndwi_mean).toFixed(4)}</span>
                        <span className='capitalize'>Promedio</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}

export default LoteDetail