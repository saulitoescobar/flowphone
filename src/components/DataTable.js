import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit, Trash2, Eye, PlusCircle } from 'lucide-react';

const DataTable = ({ title, data, columns, onAdd, onView, onEdit, onDelete, loading, error, onRetry }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Función para normalizar texto (quitar tildes y convertir a minúsculas)
  const normalizeText = (text) => {
    return String(text)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Elimina los diacríticos (tildes)
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(value => {
      const normalizedValue = normalizeText(value);
      const normalizedSearch = normalizeText(searchTerm);
      return normalizedValue.includes(normalizedSearch);
    })
  );

  // Variantes optimizadas para animaciones más rápidas y fluidas
  const itemVariants = {
    hidden: { opacity: 0, y: 3 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <motion.div
        className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-xl text-gray-600">Cargando...</div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              Reintentar
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <motion.button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.1 }}
          >
            <PlusCircle size={20} />
            <span className="hidden sm:block">Añadir</span>
          </motion.button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl overflow-hidden">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <AnimatePresence mode="wait">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <motion.tr
                    key={item.id || index}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={itemVariants}
                    transition={{ duration: 0.15 }}
                    className="hover:bg-gray-50"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {col.key === 'proveedor_display' ? (
                          <div className="flex flex-col">
                            {item.proveedor_nombre ? (
                              <div>
                                <span className="font-medium text-orange-900 block">
                                  {item.proveedor_nombre}
                                </span>
                                {item.proveedor_contacto && (
                                  <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                    {item.proveedor_contacto}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">{item.proveedor_display || 'Sin proveedor'}</span>
                            )}
                          </div>
                        ) : col.key === 'usuario_display' ? (
                          <div className="flex flex-col">
                            {item[col.key]?.includes('Disponible') ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Disponible
                              </span>
                            ) : (
                              <div>
                                <span className="font-medium text-blue-900 block">
                                  {item.usuario_nombre}
                                </span>
                                {item.usuario_dpi && (
                                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                    DPI: {item.usuario_dpi}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ) : col.key === 'empresa_display' ? (
                          <div className="flex flex-col">
                            {item.empresa_nombre ? (
                              <div>
                                <span className="font-medium text-purple-900 block">
                                  {item.empresa_nombre}
                                </span>
                                {item.empresa_nit && (
                                  <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                                    NIT: {item.empresa_nit}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">Sin empresa</span>
                            )}
                          </div>
                        ) : col.key === 'plan_display' ? (
                          <div className="flex flex-col">
                            {item.plan_nombre ? (
                              <div>
                                <span className="font-medium text-indigo-900">{item.plan_nombre}</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.datos && (
                                    <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                      {item.datos}
                                    </span>
                                  )}
                                  {item.llamadas && (
                                    <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                      {item.llamadas}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">Sin plan</span>
                            )}
                          </div>
                        ) : col.key === 'costo_display' ? (
                          <div className="flex flex-col">
                            {item.precio ? (
                              <span className="text-green-700 font-bold bg-green-50 px-2 py-1 rounded">
                                Q{Number(item.precio).toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-gray-400 italic">Sin costo</span>
                            )}
                          </div>
                        ) : col.key === 'estado_display' ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.estado === 'activa' ? 'bg-green-100 text-green-800' :
                            item.estado === 'suspendida' ? 'bg-yellow-100 text-yellow-800' :
                            item.estado === 'cancelada' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.estado || 'activa'}
                          </span>
                        ) : col.key === 'numero' ? (
                          <span className="font-mono text-gray-900 font-medium">
                            {item[col.key]}
                          </span>
                        ) : col.key === 'nombre_display' && item.proveedor_nombre ? (
                          // Renderizado específico para asesores
                          <div className="flex flex-col">
                            <span className="font-bold text-blue-900 text-lg">
                              {item.nombre}
                            </span>
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1 inline-block w-fit">
                              👨‍💼 Asesor #{item.id}
                            </span>
                          </div>
                        ) : col.key === 'nombre_display' ? (
                          // Renderizado para proveedores
                          <div className="flex flex-col">
                            <span className="font-bold text-orange-900 text-lg">
                              {item.nombre}
                            </span>
                            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded mt-1 inline-block w-fit">
                              🏢 Proveedor #{item.id}
                            </span>
                          </div>
                        ) : col.key === 'puesto_display' ? (
                          <div className="flex flex-col">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.puesto === 'ventas' ? 'bg-green-100 text-green-800' :
                              item.puesto === 'post_ventas' ? 'bg-blue-100 text-blue-800' :
                              item.puesto === 'soporte' ? 'bg-purple-100 text-purple-800' :
                              item.puesto === 'gerencia' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item.puesto === 'ventas' ? '💰 Ventas' :
                               item.puesto === 'post_ventas' ? '🛠️ Post-Ventas' :
                               item.puesto === 'soporte' ? '🔧 Soporte' :
                               item.puesto === 'gerencia' ? '👔 Gerencia' :
                               '📋 Otro'}
                            </span>
                          </div>
                        ) : col.key === 'contacto_display' && item.correo ? (
                          // Renderizado específico para contacto de asesores
                          <div className="flex flex-col">
                            <span className="font-medium text-indigo-900 block text-sm">
                              📧 {item.correo}
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.telefono_movil && (
                                <span className="text-xs text-pink-600 bg-pink-50 px-2 py-1 rounded">
                                  📱 {item.telefono_movil}
                                </span>
                              )}
                              {item.telefono_fijo && (
                                <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                  📞 {item.telefono_fijo}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : col.key === 'contacto_display' ? (
                          <div className="flex flex-col">
                            {item.contacto ? (
                              <div>
                                <span className="font-medium text-blue-900 block">
                                  {item.contacto}
                                </span>
                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block mt-1">
                                  📞 Contacto
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">Sin contacto</span>
                            )}
                          </div>
                        ) : col.key === 'telefono_display' ? (
                          <div className="flex flex-col">
                            {item.telefono ? (
                              <div>
                                <span className="font-mono text-green-900 font-bold bg-green-50 px-3 py-2 rounded-lg border border-green-200 block">
                                  {item.telefono}
                                </span>
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded inline-block mt-1">
                                  📱 Teléfono
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">Sin teléfono</span>
                            )}
                          </div>
                        ) : (
                          item[col.key]
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={() => onView(item.id)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.1 }}
                        >
                          <Eye size={18} />
                        </motion.button>
                        <motion.button
                          onClick={() => onEdit(item.id)}
                          className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-100 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.1 }}
                        >
                          <Edit size={18} />
                        </motion.button>
                        <motion.button
                          onClick={() => onDelete(item.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.1 }}
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={itemVariants}
                  transition={{ duration: 0.3 }}
                >
                  <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-500 text-lg">
                    No hay datos para mostrar. ¡Qué vacío!
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default DataTable;