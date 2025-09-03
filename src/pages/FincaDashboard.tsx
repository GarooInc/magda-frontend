import React, { useState, useEffect } from 'react'
import Header from '../components/Header/Header'
import { RiArrowDownSLine } from "react-icons/ri";
import GridComponent from '../components/GridComponent/GridComponent';
import { getFincasLotesMalos } from '../lib/analysis/analysis';
import { motion, AnimatePresence } from 'framer-motion';

const FincaDashboard = () => {

  const temporadas: { [key: string]: number } = {'Medición Actual':1, 'Medición Anterior':2};
  const [data, setData] = useState<{ resultado: { nombre: string; lotes_malos: number; }[]; fecha_toma?: string } | null>(null);
  const [selectedTemporada, setSelectedTemporada] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("cognitoToken") || "";
    setLoading(true);
    setError(null);

    getFincasLotesMalos(token, selectedTemporada ? temporadas[selectedTemporada] : 1)
      .then((resp) => setData(resp))
      .catch((err) => {
        console.error(err);
        setError(err?.message ?? 'Error al cargar los datos');
      })
      .finally(() => setLoading(false));
  }, [selectedTemporada]);

  const transformedData = data?.resultado.map(finca => ({
    nombre: finca.nombre,
    numero: Number(finca.lotes_malos)
  })) ?? [];

  return (
    <div className='min-h-[100dvh] bg-white p-4'>
      <Header />
      <div className='p-20 flex flex-col gap-10 lg:px-40'>

        <div className='flex gap-4'>
          <div className="dropdown cursor-pointer">
            <div tabIndex={0} role="button" className="px-6 py-2 bg-[#EBE8E8] border-0 rounded-xl text-black font-poppins shadow-none">
              {selectedTemporada || "Temporada"}
               <RiArrowDownSLine className='inline text-gray-500' />
            </div>
            <ul tabIndex={0} className="dropdown-content bg-[#EBE8E8] text-black mt-2 menu rounded-box z-10 w-52 p-2 shadow-sm">
              {Object.keys(temporadas).map((temporada, index) => (
                <li className='hover:bg-[#200085] hover:text-white rounded-lg' key={index} onClick={() => setSelectedTemporada(temporada)}>
                  <a>{temporada}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='min-h-[200px] relative'>
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

            {!loading && !error && (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <GridComponent data={transformedData}  fecha={data?.fecha_toma} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default FincaDashboard
