import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { UsuarioService } from '../services';

const UsuarioSelector = ({ value, onChange, placeholder = "Seleccionar usuario...", className = "" }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Función para normalizar texto
  const normalizeText = (text) => {
    return String(text)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  useEffect(() => {
    loadUsuarios();
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

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const data = await UsuarioService.getAll();
      setUsuarios(data);
    } catch (error) {
      console.error('Error loading usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsuarios = usuarios.filter(usuario => {
    const searchText = `${usuario.nombre} ${usuario.email}`;
    const normalizedText = normalizeText(searchText);
    const normalizedSearch = normalizeText(searchTerm);
    return normalizedText.includes(normalizedSearch);
  });

  const handleSelect = (usuario) => {
    onChange(usuario.id, usuario.nombre);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null, '');
  };

  const selectedUsuario = usuarios.find(user => user.id === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 cursor-pointer bg-white flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedUsuario ? 'text-gray-900' : 'text-gray-500'}>
          {selectedUsuario ? selectedUsuario.nombre : placeholder}
        </span>
        <div className="flex items-center">
          {selectedUsuario && (
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
                placeholder="Buscar usuario..."
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
            ) : filteredUsuarios.length > 0 ? (
              filteredUsuarios.map((usuario) => (
                <div
                  key={usuario.id}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors flex items-center justify-between"
                  onClick={() => handleSelect(usuario)}
                >
                  <div>
                    <div className="font-medium text-gray-900">{usuario.nombre}</div>
                    <div className="text-sm text-gray-500">{usuario.email}</div>
                  </div>
                  {selectedUsuario?.id === usuario.id && (
                    <div className="text-blue-500">✓</div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500">
                No se encontraron usuarios
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuarioSelector;
