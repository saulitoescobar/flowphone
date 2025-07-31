import React from 'react';
import { motion } from 'framer-motion';
import { Save, XCircle } from 'lucide-react';

const FormSection = ({ title, children, onSave, onCancel }) => {
  return (
    <motion.div
      className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
      <form onSubmit={onSave} className="space-y-6">
        {children}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <motion.button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl shadow-md hover:bg-gray-300 hover:scale-105 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <XCircle size={20} />
            Cancelar
          </motion.button>
          <motion.button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Save size={20} />
            Guardar
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default FormSection;