import { NavLink, useNavigate } from 'react-router-dom'
import { IoNotifications, IoExitOutline } from "react-icons/io5";
import { signOut } from '../../lib/auth';

const Header = () => {
  const navigate = useNavigate();

  const MENU_ITEMS = [
    { key: 'finca', label: 'Panel Finca', to: '/panel-finca' },
    { key: 'lote',  label: 'Panel Lote',  to: '/panel-lote'  },
  ];

  const baseBtn =
    'btn border-0 rounded-xl font-poppins shadow-none transition-colors';
  const idle   = 'bg-[#EBE8E8] text-black hover:bg-[#200085] hover:text-white';
  const active = 'bg-[#200085] text-white';

  const handleSignOut = async () => {
    try { await signOut(); navigate('/login'); } catch (e) { console.error(e); }
  };

  return (
    <div className='flex items-center justify-between p-4'>
      <div className='flex items-center gap-20 justify-center'>
        <img src="src/assets/images/logos/logomagda.png" className="w-40" alt='logo' />
        <div className='flex gap-6'>
          {MENU_ITEMS.map(item => (
            <NavLink
              key={item.key}
              to={item.to}
              className={({ isActive }) =>
                `${baseBtn} ${isActive ? active : idle}`
              }
            >
              {item.label}
            </NavLink>
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
  );
};

export default Header;
