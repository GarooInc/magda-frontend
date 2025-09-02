import React, {useState} from 'react'
import Header from '../components/Header/Header'
import GridComponent from '../components/GridComponent/GridComponent'
import { RiArrowDownSLine } from 'react-icons/ri'

const LoteDashboard = () => {
  const [selectedFinca, setSelectedFinca] = useState<string | null>(null);

  const fincas = [
  { 
    nombre: "Finca El Paraíso", 
    area: 120,
    lotes: [
      { nombre: "1", numero: 0.65},
      { nombre: "2", numero: 0.58},
      { nombre: "3", numero: 0.70, ndwi: 0.35 , area: 28},
      { nombre: "4", numero: 0.61, ndwi: 0.28 , area: 22},
      { nombre: "5", numero: 0.67, ndwi: 0.30 , area: 26}
    ]
  },
  { 
    nombre: "Finca Los Pinos", 
    area: 200,
    lotes: [
      { nombre: "1", numero: 0.45},
      { nombre: "2", numero: 0.52, ndwi: 0.18 , area: 38},
      { nombre: "3", numero: 0.46, ndwi: 0.12 , area: 42},
      { nombre: "4", numero: 0.50, ndwi: 0.14 , area: 40},
      { nombre: "5", numero: 0.49, ndwi: 0.10 , area: 40}
    ]
  }
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
              <div className="dropdown cursor-pointer">
                <div tabIndex={0} role="button" className=" px-6 py-2 bg-[#EBE8E8] border-0 rounded-xl text-black font-poppins shadow-none"> Finca <RiArrowDownSLine className='inline text-gray-500' /></div>
                <ul tabIndex={0} className="dropdown-content bg-[#EBE8E8] text-black mt-2 menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                  {fincas.map((finca, index) => (
                    <li 
                    onClick={() => setSelectedFinca(finca.nombre)}
                    className='hover:bg-[#200085] hover:text-white rounded-lg'
                    key={index}><a>{finca.nombre}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <GridComponent 
            data={selectedFinca ? fincas.find(f => f.nombre === selectedFinca)?.lotes || [] : []} 
            titulo={selectedFinca || "Magdalena Guatemala"}
            clickeable
            />
        </div>
    </div>
  )
}

export default LoteDashboard