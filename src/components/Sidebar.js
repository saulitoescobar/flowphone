import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Users, Phone, Building, Briefcase, LayoutGrid, Settings, UserCheck } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: LayoutGrid, path: '/' },
  { name: 'Usuarios', icon: Users, path: '/usuarios' },
  { name: 'Líneas', icon: Phone, path: '/lineas' },
  { name: 'Proveedores', icon: Building, path: '/proveedores' },
  { name: 'Asesores', icon: UserCheck, path: '/asesores' },
  { name: 'Empresas', icon: Briefcase, path: '/empresas' },
  { name: 'Planes', icon: Settings, path: '/planes' },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Función para determinar si una ruta está activa
  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Detectar si es móvil
  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 }
  };

  return (
    <>
      {/* Botón hamburguesa - solo visible en móvil */}
      <motion.button
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-blue-600 text-white shadow-lg md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      <motion.div
        className={`${
          isMobile 
            ? 'fixed inset-y-0 left-0 w-64 bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 shadow-2xl z-40'
            : 'relative w-64 bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 shadow-2xl'
        }`}
        initial={false}
        animate={isMobile ? (isOpen ? "open" : "closed") : "open"}
        variants={isMobile ? sidebarVariants : {}}
      >
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            PhoneFlow
          </h2>
          {isMobile && (
            <button onClick={() => setIsOpen(false)}>
              <X className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>
          )}
        </div>
        <nav>
          <ul className="space-y-4">
            {navItems.map((item, index) => (
              <motion.li
                key={item.name}
                variants={itemVariants}
                initial="closed"
                animate="open"
                transition={{ delay: index * 0.05 + 0.2 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${
                    isActivePath(item.path)
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-blue-700 hover:text-white'
                  }`}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <item.icon className={`w-6 h-6 transition-colors ${
                    isActivePath(item.path)
                      ? 'text-white'
                      : 'text-blue-400 group-hover:text-white'
                  }`} />
                  <span className="text-lg font-medium">{item.name}</span>
                  {isActivePath(item.path) && (
                    <motion.div
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
      </motion.div>
    </>
  );
};

export default Sidebar;