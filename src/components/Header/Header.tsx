import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { IoNotifications, IoExitOutline } from 'react-icons/io5';
import { signOut } from '../../lib/auth';
import { getAlertas } from '../../lib/analysis/analysis';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationMssg {
  finca: string;
  lote: string;
  causa_probable: string;
  recomendaciones: string[];
}

const Header = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationMssg[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAlertas()
      .then((data: NotificationMssg[]) => {
        const list: NotificationMssg[] = (data || []).map((n: any) => {
          const src = n?.notificacion_poligono ?? n;
          return {
            finca: src?.finca ?? '',
            lote: src?.lote ?? '',
            causa_probable: src?.causa_probable ?? '',
            recomendaciones: src?.recomendaciones ?? [],
          };
        });
        setNotifications(list);
      })
      .catch((err) => {
        console.error('Error fetching notifications:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleToggleNotifications = () => {
    setShowNotifications((s) => !s);
  };

  const MENU_ITEMS = [
    { key: 'finca', label: 'Panel Finca', to: '/panel-finca' },
    { key: 'lote', label: 'Panel Lote', to: '/panel-lote' },
  ];

  const baseBtn =
    'btn border-0 rounded-xl font-poppins shadow-none transition-colors';
  const idle =
    'bg-[#EBE8E8] text-black hover:bg-[#200085] hover:text-white';
  const active = 'bg-[#200085] text-white';

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (e) {
      console.error(e);
    }
  };

  const count = notifications.length;

  return (
    <div className="flex items-center justify-between p-4 relative">
      <div className="flex items-center gap-20 justify-center">
        <img
          src="assets/images/logos/logomagda.png"
          className="w-40"
          alt="logo"
        />
        <div className="flex gap-6">
          {MENU_ITEMS.map((item) => (
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

      <div className="flex justify-center items-center">
        <button
          type="button"
          aria-label="Abrir notificaciones"
          onClick={handleToggleNotifications}
          className="relative"
        >
          <IoNotifications className="h-6 w-6 cursor-pointer text-[#200085]" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              {count}
            </span>
          )}
        </button>
        <IoExitOutline
          className="h-6 w-6 text-gray-600 cursor-pointer mx-4"
          onClick={handleSignOut}
        />
      </div>

      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setShowNotifications(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Panel */}
            <motion.aside
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-xl font-semibold text-black">Notificaciones</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  aria-label="Cerrar panel"
                  className="rounded-full p-1 hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <div className="p-8 flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center gap-3 text-black justify-center">
                    <span className="h-5 w-5 animate-spin rounded-full  border-t-transparent" />
                    Cargando...
                  </div>
                ) : notifications.length === 0 ? (
                  <p className="text-gray-500">No hay notificaciones.</p>
                ) : (
                  <ul className="space-y-3">
                    {notifications.map((n, i) => (
                      <li
                        key={i}
                        className="rounded-xl border p-4 shadow-sm"
                      >
                        <p className="font-medium text-black">
                          Finca <span className="font-semibold">{n.finca}</span>{' '}
                          / Lote <span className="font-semibold">{n.lote}</span>
                        </p>
                        <p className="mt-1">
                          <span className="font-semibold text-black">
                            Causa probable: {n.causa_probable}
                          </span>
                        </p>
                        {n.recomendaciones?.length > 0 && (
                          <ul className="mt-2 ml-2 list-disc list-inside text-sm text-gray-600 space-y-1">
                            {n.recomendaciones.map((rec, idx) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
