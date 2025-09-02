import React from 'react'
import Header from '../components/Header/Header'
import { RiArrowDownSLine } from "react-icons/ri";
import GridComponent from '../components/GridComponent/GridComponent';

const FincaDashboard = () => {

    const fincas = [
    { nombre: "Finca El Paraíso", numero: 5, area: 120 },
    { nombre: "Finca Los Pinos", numero: 8, area: 200 },
    { nombre: "Finca La Esperanza", numero: 20, area: 150 },
    { nombre: "Finca San Miguel", numero: 10, area: 250 },
    { nombre: "Finca El Roble", numero: 4, area: 90 },
    { nombre: "Finca Santa Rosa", numero: 12, area: 300 },
    { nombre: "Finca Los Laureles", numero: 7, area: 180 },
    { nombre: "Finca El Progreso", numero: 9, area: 220 },
    { nombre: "Finca La Fortuna", numero: 5, area: 130 },
    { nombre: "Finca Buenavista", numero: 11, area: 275 },
    { nombre: "Finca El Nogal", numero: 3, area: 80 },
    { nombre: "Finca San José", numero: 6, area: 160 },
    { nombre: "Finca El Manantial", numero: 8, area: 210 },
    { nombre: "Finca La Pradera", numero: 7, area: 190 },
    { nombre: "Finca Los Cedros", numero: 20, area: 230 },
    { nombre: "Finca La Cumbre", numero: 10, area: 260 },
    { nombre: "Finca San Rafael", numero: 4, area: 100 },
    { nombre: "Finca Las Palmas", numero: 6, area: 170 },
    { nombre: "Finca El Olivo", numero: 5, area: 140 },
    { nombre: "Finca Los Álamos", numero: 8, area: 240 }
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