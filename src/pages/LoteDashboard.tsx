import { useState, useEffect, useMemo, useRef } from 'react'
import Header from '../components/Header/Header'
import GridComponent from '../components/GridComponent/GridComponent'
import { RiArrowDownSLine } from 'react-icons/ri'
import { getDiferenciaLotesMalos, getFincas } from '../lib/analysis/analysis'
import { motion, AnimatePresence } from 'framer-motion'

type Temporada = 'Medición Actual' | 'Medición Anterior'

const TEMPORADA_TO_NUM: Record<Temporada, number> = {
  'Medición Actual': 1,
  'Medición Anterior': 2,
}
const NUM_TO_TEMPORADA: Record<number, Temporada> = {
  1: 'Medición Actual',
  2: 'Medición Anterior',
}

const LS_KEYS = {
  finca: 'selectedFinca',
  temporada: 'selectedTemporada',
} as const

const LoteDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<{ resultado: { lotes: { id: string; lote: string; diferencia: number; nubosidad: boolean }[] }, fecha_toma?: string } | null>(null)

  const [fincas, setFincas] = useState<string[]>([])
  const [selectedFinca, setSelectedFinca] = useState<string | null>(null)
  const [selectedTemporada, setSelectedTemporada] = useState<Temporada>('Medición Actual')

  const initialized = useRef(false)

  const saveState = (finca: string | null, temporada: Temporada) => {
    const params = new URLSearchParams(window.location.search)
    if (finca) {
      params.set('finca', finca)
      localStorage.setItem(LS_KEYS.finca, finca)
    }
    params.set('temporada', String(TEMPORADA_TO_NUM[temporada]))
    localStorage.setItem(LS_KEYS.temporada, String(TEMPORADA_TO_NUM[temporada]))
    const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`
    window.history.replaceState(null, '', newUrl)
  }

  const loadData = async (token: string, finca: string, temporada: Temporada) => {
    setLoading(true)
    setError(null)

    localStorage.setItem(LS_KEYS.temporada, String(TEMPORADA_TO_NUM[temporada]))
    try {
      const resp = await getDiferenciaLotesMalos(token, TEMPORADA_TO_NUM[temporada], finca)
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

        const params = new URLSearchParams(window.location.search)
        const urlFinca = params.get('finca')
        const urlTemporadaNum = Number(params.get('temporada'))
        const lsFinca = localStorage.getItem(LS_KEYS.finca)
        const lsTemporadaNum = Number(localStorage.getItem(LS_KEYS.temporada))

        const fincaInicial =
          (urlFinca && names.includes(urlFinca) && urlFinca) ||
          (lsFinca && names.includes(lsFinca) && lsFinca) ||
          (names[0] ?? null)

        const temporadaInicialNum =
          (urlTemporadaNum === 1 || urlTemporadaNum === 2) ? urlTemporadaNum :
          (lsTemporadaNum === 1 || lsTemporadaNum === 2) ? lsTemporadaNum :
          1

        const temporadaInicial = NUM_TO_TEMPORADA[temporadaInicialNum]

        setSelectedFinca(fincaInicial)
        setSelectedTemporada(temporadaInicial)

        if (fincaInicial) {
          saveState(fincaInicial, temporadaInicial)
          await loadData(token, fincaInicial, temporadaInicial)
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
    saveState(selectedFinca, selectedTemporada)
    loadData(token, selectedFinca, selectedTemporada)
  }, [selectedTemporada, selectedFinca])

  const transformedData = useMemo(
    () =>
      data?.resultado.lotes?.map(lote => ({
        nombre: String(lote.id),
        lote: lote.lote,
        numero: Number(lote.diferencia),
        nubosidad: lote.nubosidad
      })) ?? [],
    [data]
  )

  const handleSelectedDate = (date: Temporada) => {
    setSelectedTemporada(date)
  }

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
                <li key={i} className='hover:bg-[#200085] hover:text-white rounded-lg' onClick={() => handleSelectedDate(t)}>
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
                  labels={["Bueno (1)", "Medio (0 a 0.5)", "Malo (0 a -0.5)", "Crítico (< -0.5)"]}
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
