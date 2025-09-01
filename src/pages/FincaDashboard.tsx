import React from 'react'
import Header from '../components/Header/Header'
import { RiArrowDownSLine } from "react-icons/ri";
import GridComponent from '../components/GridComponent/GridComponent';

const FincaDashboard = () => {

    const fincas = [
    { nombre: "Finca El Paraíso", cantidad_lotes: 5, area: 120 },
    { nombre: "Finca Los Pinos", cantidad_lotes: 8, area: 200 },
    { nombre: "Finca La Esperanza", cantidad_lotes: 20, area: 150 },
    { nombre: "Finca San Miguel", cantidad_lotes: 10, area: 250 },
    { nombre: "Finca El Roble", cantidad_lotes: 4, area: 90 },
    { nombre: "Finca Santa Rosa", cantidad_lotes: 12, area: 300 },
    { nombre: "Finca Los Laureles", cantidad_lotes: 7, area: 180 },
    { nombre: "Finca El Progreso", cantidad_lotes: 9, area: 220 },
    { nombre: "Finca La Fortuna", cantidad_lotes: 5, area: 130 },
    { nombre: "Finca Buenavista", cantidad_lotes: 11, area: 275 },
    { nombre: "Finca El Nogal", cantidad_lotes: 3, area: 80 },
    { nombre: "Finca San José", cantidad_lotes: 6, area: 160 },
    { nombre: "Finca El Manantial", cantidad_lotes: 8, area: 210 },
    { nombre: "Finca La Pradera", cantidad_lotes: 7, area: 190 },
    { nombre: "Finca Los Cedros", cantidad_lotes: 20, area: 230 },
    { nombre: "Finca La Cumbre", cantidad_lotes: 10, area: 260 },
    { nombre: "Finca San Rafael", cantidad_lotes: 4, area: 100 },
    { nombre: "Finca Las Palmas", cantidad_lotes: 6, area: 170 },
    { nombre: "Finca El Olivo", cantidad_lotes: 5, area: 140 },
    { nombre: "Finca Los Álamos", cantidad_lotes: 8, area: 240 }
  ];

  const temporadas: string[] = ['Hace 5 días', 'Hace 10 días', 'Hace 15 días'];


  return (
    <div className='min-h-[100dvh] bg-white p-4'>
        <Header />
        <div className='p-20 flex flex-col gap-10 lg:px-40'>
            <div className='flex gap-4'>
              <div className="dropdown cursor-pointer">
                <div tabIndex={0} role="button" className=" px-6 py-2 bg-[#EBE8E8] border-0 rounded-xl text-black font-poppins shadow-none"> Temporada <RiArrowDownSLine className='inline text-gray-500' /></div>
                <ul tabIndex={0} className="dropdown-content bg-[#EBE8E8] text-black mt-2 menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                  {temporadas.map((temporada, index) => (
                    <li 
                    className='hover:bg-[#200085] hover:text-white rounded-lg'
                    key={index}><a>{temporada}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <GridComponent data={fincas} />
        </div>
    </div>
  )
}

export default FincaDashboard