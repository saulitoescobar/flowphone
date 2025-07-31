import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { EmpresaService } from '../services';

const EmpresaSelector = ({ value, onChange, placeholder = "Seleccionar empresa...", className = "" }) => {
  const [empresas, setEmpresas] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Función para normalizar texto (quitar tildes)
  const normalizeText = (text) => {
    return String(text)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  useEffect(() => {
    loadEmpresas();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadEmpresas = async () => {
    try {
      setLoading(true);
      const data = await EmpresaService.getAll();
      setEmpresas(data);
    } catch (error) {
      console.error('Error loading empresas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmpresas = empresas.filter(empresa => {
    const normalizedName = normalizeText(empresa.nombre);
    const normalizedSearch = normalizeText(searchTerm);
    return normalizedName.includes(normalizedSearch);
  });

  const handleSelect = (empresa) => {
    onChange(empresa.nombre);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  const selectedEmpresa = empresas.find(emp => emp.nombre === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 cursor-pointer bg-white flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {value || placeholder}
        </span>
        <div className="flex items-center">
          {value && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 mr-2"
              type="button"
            >
              <X size={16} />
            </button>
          )}
          <ChevronDown
            size={20}
            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-hidden">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar empresa..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="p-3 text-center text-gray-500">Cargando...</div>
            ) : filteredEmpresas.length > 0 ? (
              filteredEmpresas.map((empresa) => (
                <div
                  key={empresa.id}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors flex items-center justify-between"
                  onClick={() => handleSelect(empresa)}
                >
                  <div>
                    <div className="font-medium text-gray-900">{empresa.nombre}</div>
                    {empresa.contacto && (
                      <div className="text-sm text-gray-500">{empresa.contacto}</div>
                    )}
                  </div>
                  {selectedEmpresa?.id === empresa.id && (
                    <div className="text-blue-500">✓</div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500">
                No se encontraron empresas
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpresaSelector;
