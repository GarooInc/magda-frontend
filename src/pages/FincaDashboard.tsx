import React, {useState,useEffect} from 'react'
import Header from '../components/Header/Header'
import { RiArrowDownSLine } from "react-icons/ri";
import GridComponent from '../components/GridComponent/GridComponent';
import { getFincasLotesMalos } from '../lib/analysis/analysis';

const FincaDashboard = () => {


  const temporadas: { [key: string]: number } = {'Medición Actual':1, 'Medición Anterior':2};
  const [data, setData] = useState<{ resultado: { nombre: string; lotes_malos: number; }[] } | null>(null);
  const [selectedTemporada, setSelectedTemporada] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("cognitoToken") || "";
    getFincasLotesMalos(token, temporadas[selectedTemporada ?? 'Medición Actual'])
      .then(setData)
      .catch((err) => console.error(err));

  }, [selectedTemporada]);

  const transformedData = data?.resultado.map(finca => ({
    nombre: finca.nombre,
    numero: finca.lotes_malos
  }));

  return (
    <div className='min-h-[100dvh] bg-white p-4'>
        <Header />
        <div className='p-20 flex flex-col gap-10 lg:px-40'>
            <div className='flex gap-4'>
              <div className="dropdown cursor-pointer">
                <div tabIndex={0} role="button" className=" px-6 py-2 bg-[#EBE8E8] border-0 rounded-xl text-black font-poppins shadow-none"> 
                  {selectedTemporada || 'Temporada'}
                   <RiArrowDownSLine className='inline text-gray-500' />
                  </div>
                <ul tabIndex={0} className="dropdown-content bg-[#EBE8E8] text-black mt-2 menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                  {temporadas && Object.keys(temporadas).map((temporada, index) => (
                    <li 
                    className='hover:bg-[#200085] hover:text-white rounded-lg'
                    onClick={() => setSelectedTemporada(temporada)}
                    key={index}><a>{temporada}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {
              data ? <GridComponent data={transformedData ?? []} clickeable={false} /> : <div>Cargando...</div>
            }
        </div>
    </div>
  )
}

export default FincaDashboard