import React, { useState, useEffect, useMemo, useRef } from 'react'
import Header from '../components/Header/Header'
import GridComponent from '../components/GridComponent/GridComponent'
import { RiArrowDownSLine } from 'react-icons/ri'
import { getDiferenciaLotesMalos, getFincas } from '../lib/analysis/analysis'
import { motion, AnimatePresence } from 'framer-motion'

const LoteDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<{ resultado: { lotes: { id: string; diferencia: number }[] }, fecha_toma?: string } | null>(null)

  const [fincas, setFincas] = useState<string[]>([])
  const [selectedFinca, setSelectedFinca] = useState<string | null>(null)
  const [selectedTemporada, setSelectedTemporada] = useState<'Medición Actual' | 'Medición Anterior'>('Medición Actual')

  const temporadas: { [k in typeof selectedTemporada]: number } = {
    'Medición Actual': 1,
    'Medición Anterior': 2,
  }

  const initialized = useRef(false)

  const loadData = async (token: string, finca: string, temporada: typeof selectedTemporada) => {
    setLoading(true)
    setError(null)
    try {
      const resp = await getDiferenciaLotesMalos(token, temporadas[temporada], finca)
      setData(resp)
    } catch (err: any) {
      console.error(err)
      setError(err?.message ?? 'Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('cognitoToken') || ''
    ;(async () => {
      try {
        const resp = await getFincas(token)
        const names: string[] = resp.fincas ?? []
        setFincas(names)
        const first = names[0] ?? null
        setSelectedFinca(first)

        if (first) {
          await loadData(token, first, 'Medición Actual')
        }
        initialized.current = true
      } catch (err: any) {
        console.error(err)
        setError(err?.message ?? 'Error al cargar las fincas')
      }
    })()
  }, [])

  useEffect(() => {
    if (!initialized.current) return
    if (!selectedFinca) return

    const token = localStorage.getItem('cognitoToken') || ''
    loadData(token, selectedFinca, selectedTemporada)
  }, [selectedTemporada, selectedFinca])

  const transformedData = useMemo(
    () =>
      data?.resultado.lotes?.map(lote => ({
        nombre: lote.id,
        numero: Number(lote.diferencia),
      })) ?? [],
    [data]
  )

  return (
    <div className='min-h-[100dvh] bg-white p-4'>
      <Header />
      <div className='p-20 flex flex-col gap-10 lg:px-40'>

        {/* Filtros */}
        <div className='flex gap-4'>
          {/* Temporada */}
          <div className='dropdown cursor-pointer'>
            <div tabIndex={0} role='button' className='px-6 py-2 bg-[#EBE8E8] border-0 rounded-xl text-black font-poppins shadow-none'>
              {selectedTemporada} <RiArrowDownSLine className='inline text-gray-500' />
            </div>
            <ul tabIndex={0} className='dropdown-content bg-[#EBE8E8] text-black mt-2 menu rounded-box z-10 w-56 p-2 shadow-sm'>
              {(['Medición Actual', 'Medición Anterior'] as const).map((t, i) => (
                <li key={i} className='hover:bg-[#200085] hover:text-white rounded-lg' onClick={() => setSelectedTemporada(t)}>
                  <a>{t}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Finca */}
          <div className='dropdown cursor-pointer'>
            <div tabIndex={0} role='button' className='px-6 py-2 bg-[#EBE8E8] border-0 rounded-xl text-black font-poppins shadow-none'>
              {selectedFinca ?? 'Finca'} <RiArrowDownSLine className='inline text-gray-500' />
            </div>
            <ul tabIndex={0} className='dropdown-content bg-[#EBE8E8] text-black mt-2 menu rounded-box z-10 w-56 p-2 shadow-sm'>
              {fincas.map((finca, i) => (
                <li key={i} className='hover:bg-[#200085] hover:text-white rounded-lg' onClick={() => setSelectedFinca(finca)}>
                  <a>{finca}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contenido */}
        <div className='min-h-[200px] relative'>
          <AnimatePresence mode='wait'>
            {loading && (
              <motion.div
                key='loader'
                className='flex flex-col items-center justify-center py-16'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className='w-12 h-12 rounded-full border-4 border-gray-300 border-t-[#200085]'
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
                />
                <motion.span className='mt-4 text-gray-600 font-medium'>Cargando datos…</motion.span>
              </motion.div>
            )}

            {!loading && error && (
              <motion.div
                key='error'
                className='bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl'
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                {error}
              </motion.div>
            )}

            {!loading && !error && (
              <motion.div key='grid' initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <GridComponent
                  data={transformedData}
                  titulo={selectedFinca ?? undefined}
                  clickeable
                  fecha={data?.fecha_toma}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default LoteDashboard
