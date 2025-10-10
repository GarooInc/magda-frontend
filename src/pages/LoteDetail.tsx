import { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { IoCloseCircle } from "react-icons/io5";
import { getDetallePoligono } from '../lib/analysis/analysis'
import { motion, AnimatePresence } from 'framer-motion';
import { FaCircleCheck } from "react-icons/fa6";
import { FaFileImage } from "react-icons/fa6";
import LiveIndicesChart from '../components/LiveIndicesChart/LiveIndicesChart';




type NDVIMetricas = { [key: string]: number };
type PSMItem = {
  id_poligono: string;
  causa: string;
  solucion: string;
  fotos: string[];
  id_notificacion: string;
  fecha: string; 
};

type HistoricoPSM = {
  fecha: string;
  ndvi_mean: number | null;
  ndwi_mean: number | null;
};

const LoteDetail = () => {
  const { loteId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<{
    base_color?: string;
    poligono: { finca: string; lote: string; region: string; admin: string; area: number; },
    data: { ndvi_metricas?:  NDVIMetricas | null; ndwi_mean?: number | null ; ndvi_mean?: number | null ; img_ndwi: string; img_ndvi: string; },
    fecha_toma?: string
    psm?: PSMItem[];
    historico?: HistoricoPSM[];
  } | null>(null)


  const handleClose = () => navigate(-1);

  useEffect(() => {
  const token = localStorage.getItem('cognitoToken') || '';
  const temporada = Number(localStorage.getItem('selectedTemporada') || '1');

  setLoading(true);
  setError(null);

  getDetallePoligono(token, loteId ?? '', temporada)
    .then(resp => {
      const historico = [...(resp.historico ?? [])];

      const fechaActual =
        resp.fecha_toma ??
        new Date().toISOString().slice(0, 10);

      if (resp.data?.ndvi_mean != null) {
        historico.push({
            fecha: fechaActual,
            ndvi_mean: resp.data.ndvi_mean,
            ndwi_mean: resp.data?.ndwi_mean ?? null,
          });
      }

      historico.sort((a, b) => a.fecha.localeCompare(b.fecha));

      setData({
        ...resp,
        historico,
      });
    })
    .catch((err) => {
      console.error(err);
      setError(err?.message ?? 'Error al cargar los datos del lote');
    })
    .finally(() => setLoading(false));
}, [loteId]);


  const handleViewImage = (url: string | undefined) => {
    if (url) {
      window.open(url, '_self');
    }
  }

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);


  return (
    <div className='bg-white h-[100vh] flex justify-center items-center'>
      <div className='flex-col bg-white'>

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
              className='flex flex-col shadow-2xl rounded-2xl  p-10 w-4xl max-h-[80vh]'
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <div className='justify-between flex w-full items-center'>
                <img src="/assets/images/logos/logomagda.png" className='h-16' />
                <IoCloseCircle className='h-10 w-10 text-[#200085] cursor-pointer' onClick={handleClose} />
              </div>

              <div className='h-[1px] w-full bg-gray-500 mt-4'></div>

              <div className='flex flex-col gap-4 overflow-y-auto'>
                <div className='flex flex-col gap-2 py-4'>
                  <div className='justify-between flex w-full'>
                    <span className='font-semibold text-black text-2xl'>
                      {data.poligono.finca} | Lote {data.poligono.lote}
                    </span>

                    {
                      data.base_color && (
                        <div className='flex gap-2 items-center'>
                          <FaFileImage className='text-gray-500 w-5 h-5' />
                          <span className='font-light text-gray-500 text-lg cursor-pointer hover:underline'
                            onClick={() => handleViewImage(data.base_color)}
                          >
                            Imagen satelital
                          </span>
                        </div>
                      )
                    }
                  </div>
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

                  <div className='flex flex-col gap-4'>
                    <div className='flex justify-between gap-4'>
                      {data.data.ndvi_metricas && Object.entries(data.data.ndvi_metricas).map(([key, value]) => (
                        <div key={key} className='w-full font-light text-gray-500 text-lg p-2 border border-gray-300 rounded-lg flex flex-col justify-center items-center'>
                          <span>{Number(value).toFixed(4)}</span>
                          <span className='capitalize'>{key}</span>
                        </div>
                      ))}
                    </div>

                    {data.data.ndvi_mean && (
                      <div className='w-1/3 font-light text-gray-500 text-lg p-2 border border-gray-300 rounded-lg flex flex-col justify-center items-center'>
                        <span>{Number(data.data.ndvi_mean).toFixed(4)}</span>
                        <span className='capitalize'>Promedio</span>
                      </div>
                    )}
                  </div>

                  <LiveIndicesChart data={(data.historico ?? []).map(h => ({ fecha: h.fecha, value: h.ndvi_mean || 0 }))} title="Evolución NDVI" color="orange" yAxisLabel="NDVI" />
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

                  <LiveIndicesChart data={(data.historico ?? []).map(h => ({ fecha: h.fecha, value: h.ndwi_mean || 0 }))} title="Evolución NDWI" color="blue" yAxisLabel="NDWI" />
                </div>

                {/* TIMELINE */}
              <div className='flex flex-col w-full gap-4'>
                <div className='flex items-center justify-between py-2'>
                  <span className='font-semibold text-[#0F172A] text-xl'>Cronología</span>
                  <span className='text-sm text-gray-500'>
                    {data.psm?.length ? `${data.psm.length} evento(s)` : 'Sin eventos'}
                  </span>
                </div>

                {data.psm?.length ? (
                  <ul className="timeline timeline-vertical ">
                    {data.psm.map((item, idx) => {
                      const leftSide = idx % 2 === 0;
                      return (
                        <li key={`${item.id_notificacion}-${idx}`}>
                          {idx !== 0 && <hr className='bg-gray-300' />}
                          <div className="timeline-middle">
                            <FaCircleCheck className="timeline-icon text-gray-500" />
                          </div>

                          <div className={`${leftSide ? 'timeline-start' : 'timeline-end'} timeline-box border-none shadow-xl w-full md:w-auto bg-transparent`}>
                            <div className="flex flex-col text-black">
                              <div className="text-xs text-gray-500">{item.fecha}</div>
                              <div className='flex flex-col'>
                                <div className="font-semibold">Causa</div>
                                <div className="text-sm text-gray-700">{item.causa}</div>
                              </div>
                              <div className='flex flex-col'>
                                <div className="font-semibold mt-2">Solución</div>
                                <div className="text-sm text-gray-700">{item.solucion}</div>
                              </div>

                              {item.fotos?.length > 0 && (
                                <button
                                  onClick={() => {
                                    setLightboxImages(item.fotos);
                                    setLightboxOpen(true);
                                  }}
                                  className="btn btn-sm mt-3 rounded-lg bg-[#200085] hover:text-white"
                                >
                                  Ver fotos ({item.fotos.length})
                                </button>
                              )}
                            </div>
                          </div>
                          <hr className='bg-gray-300' />
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="text-gray-500 text-sm">No hay eventos de cronología para mostrar.</div>
                )}
              </div>
              </div>

                  {/* POPUP FOTOS */}
                    <AnimatePresence>
                      {lightboxOpen && (
                        <motion.div
                          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setLightboxOpen(false)} 
                        >
                          <motion.div
                            className="bg-white p-4 rounded-xl max-w-2xl w-full flex flex-wrap gap-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {lightboxImages.map((url, i) => (
                              <img
                                key={i}
                                src={url}
                                alt={`foto ${i + 1}`}
                                className="w-1/4 rounded-md cursor-pointer"
                                onClick={() => window.open(url, '_blank')}
                              />
                            ))}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
      </div>
    </div>
  )
}

export default LoteDetail