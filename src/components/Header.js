import React from 'react';
import { motion } from 'framer-motion';

const Header = ({ title }) => {
  return (
    <motion.header
      className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 mb-8 shadow-lg flex items-center justify-between"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-700">
        {title}
      </h1>
      {/* Aquí puedes añadir elementos adicionales al encabezado si lo deseas */}
    </motion.header>
  );
};

export default Header;