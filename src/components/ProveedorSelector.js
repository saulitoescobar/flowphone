import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { ProveedorService } from '../services';

const ProveedorSelector = ({ value, onChange, placeholder = "Seleccionar proveedor...", error = null }) => {
  const [proveedores, setProveedores] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProveedores();
  }, []);

  const loadProveedores = async () => {
    try {
      setLoading(true);
      const data = await ProveedorService.getAll();
      setProveedores(data);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (proveedor) => {
    onChange(proveedor.id, proveedor.nombre);
    setIsOpen(false);
    setSearchTerm('');
  };

  const filteredProveedores = proveedores.filter(proveedor =>
    proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.contacto?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProveedor = proveedores.find(p => p.id === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`shadow-sm border rounded-xl w-full py-3 px-4 text-left focus:outline-none focus:ring-2 transition-all duration-200 ${
          error 
            ? 'border-red-300 focus:ring-red-500/30 focus:border-red-500' 
            : 'border-gray-300 focus:ring-blue-500/30 focus:border-blue-500'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {selectedProveedor ? (
              <div>
                <span className="font-medium text-gray-900">{selectedProveedor.nombre}</span>
                {selectedProveedor.contacto && (
                  <div className="text-sm text-gray-500">{selectedProveedor.contacto}</div>
                )}
              </div>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg">
          {/* Buscador */}
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Buscar proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Lista de proveedores */}
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Cargando proveedores...
              </div>
            ) : filteredProveedores.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'No se encontraron proveedores' : 'No hay proveedores disponibles'}
              </div>
            ) : (
              <>
                {/* Opción para limpiar selección */}
                <button
                  type="button"
                  onClick={() => {
                    onChange(null, '');
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100"
                >
                  <span className="text-gray-500 italic">Sin proveedor</span>
                </button>

                {filteredProveedores.map((proveedor) => (
                  <button
                    key={proveedor.id}
                    type="button"
                    onClick={() => handleSelect(proveedor)}
                    className={`w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors ${
                      selectedProveedor?.id === proveedor.id ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{proveedor.nombre}</div>
                      {proveedor.contacto && (
                        <div className="text-sm text-gray-600">{proveedor.contacto}</div>
                      )}
                      {proveedor.telefono && (
                        <div className="text-sm text-gray-500">📞 {proveedor.telefono}</div>
                      )}
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* Overlay para cerrar el dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsOpen(false);
            setSearchTerm('');
          }}
        />
      )}
    </div>
  );
};

export default ProveedorSelector;
