import React from 'react'
import { useNavigate } from 'react-router-dom'; 
import { IoNotifications } from "react-icons/io5";
import { IoExitOutline } from "react-icons/io5";
import { signOut } from '../../lib/auth';



const Header = () => {

    const navigate = useNavigate();

    interface MenuItem {
        key: string;
        label: string;
        to: string;
    }

    const MENU_ITEMS: MenuItem[] = [
    { key: 'finca', label: 'Panel Finca', to: '/panel-finca' },
    { key: 'lote',  label: 'Panel Lote',  to: '/panel-lote'  },
    ];

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    }

  return (
    <div className='flex items-center justify-between p-4'>
        <div className='flex items-center gap-20 justify-center'>
            <img src="src/assets/images/logos/logomagda.png" className="w-40" alt='logo' />
            <div className='flex gap-6'>
                {MENU_ITEMS.map(item => (
                    <button key={item.key} className='btn bg-[#EBE8E8] border-0 active:bg-[#200085] hover:bg-[#200085] hover:text-white rounded-xl text-black font-poppins shadow-none' onClick={() => navigate(item.to)}>
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
        

        <div className='flex justify-center items-center'>
            <div className='relative'>
                <IoNotifications className='h-6 w-6 cursor-pointer text-[#200085]' />
                <div className='absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full'>3</div>
            </div>
            <IoExitOutline className='h-6 w-6 text-gray-600 cursor-pointer mx-4' onClick={handleSignOut} />
        </div>


    </div>
  )
}

export default Header;