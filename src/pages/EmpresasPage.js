import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import { motion } from 'framer-motion';
import { EmpresaService } from '../services';

const EmpresasPage = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentEmpresa, setCurrentEmpresa] = useState(null);
  const [formData, setFormData] = useState({});
  
  // Estados para la vista detallada
  const [empresaUsuarios, setEmpresaUsuarios] = useState([]);
  const [empresaLineas, setEmpresaLineas] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // Hook para las notificaciones
  const { showToast, ToastComponent } = useToast();

  // Función para calcular el costo total mensual
  const calcularCostoTotal = () => {
    if (!empresaLineas || empresaLineas.length === 0) return 0;
    return empresaLineas.reduce((total, linea) => {
      const precio = parseFloat(linea.plan_precio) || 0;
      return total + precio;
    }, 0);
  };

  // Configuración de columnas para la tabla
  const columns = [
    { key: '#', label: '#' },
    { key: 'nombre_display', label: 'EMPRESA' },
    { key: 'nit_display', label: 'NIT' },
    { key: 'direccion_display', label: 'DIRECCIÓN' },
    { key: 'contacto_display', label: 'CONTACTO' },
    { key: 'usuarios_display', label: 'EMPLEADOS' },
    { key: 'lineas_display', label: 'LÍNEAS MÓVILES' }
  ];

  // Cargar empresas al montar el componente
  useEffect(() => {
    loadEmpresas();
  }, []);

  const loadEmpresas = async () => {
    try {
      setLoading(true);
      const data = await EmpresaService.getAll();
      
      // Agregar números ordinales y campos display mejorados
      const empresasConDisplay = data.map((empresa, index) => ({
        ...empresa,
        '#': index + 1,
        nombre_display: empresa.nombre || 'Sin nombre',
        nit_display: empresa.nit || 'Sin NIT',
        direccion_display: empresa.direccion || 'Sin dirección',
        contacto_display: empresa.contacto || 'Sin contacto',
        usuarios_display: empresa.total_usuarios || 0,
        lineas_display: empresa.total_lineas || 0
      }));
      
      setEmpresas(empresasConDisplay);
      setError(null);
    } catch (err) {
      setError('Error al cargar empresas: ' + err.message);
      console.error('Error loading empresas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(false);
    setFormData({});
  };

  const handleEdit = (id) => {
    setIsEditing(true);
    setIsAdding(false);
    setCurrentId(id);
    const empresa = empresas.find(item => item.id === id);
    setFormData(empresa || {});
  };

  const handleView = async (id) => {
    const empresa = empresas.find(item => item.id === id);
    setCurrentEmpresa(empresa);
    setIsViewing(true);
    
    // Cargar usuarios y líneas de la empresa
    setLoadingDetails(true);
    try {
      const [usuarios, lineas] = await Promise.all([
        EmpresaService.getUsuarios(id),
        EmpresaService.getLineas(id)
      ]);
      setEmpresaUsuarios(usuarios);
      setEmpresaLineas(lineas);
    } catch (err) {
      console.error('Error al cargar detalles de empresa:', err);
      showToast('Error al cargar detalles de la empresa', 'error');
      setEmpresaUsuarios([]);
      setEmpresaLineas([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDelete = (id) => {
    const empresa = empresas.find(item => item.id === id);
    setCurrentEmpresa(empresa);
    setCurrentId(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await EmpresaService.delete(currentId);
      await loadEmpresas();
      showToast('Empresa eliminada correctamente', 'success');
    } catch (err) {
      showToast('Error al eliminar empresa: ' + err.message, 'error');
    }
  };

  const handleSave = async (data) => {
    try {
      const cleanData = {
        nombre: data.nombre,
        direccion: data.direccion,
        contacto: data.contacto,
        nit: data.nit
      };

      if (isAdding) {
        await EmpresaService.create(cleanData);
        showToast('Empresa creada correctamente', 'success');
      } else {
        await EmpresaService.update(currentId, cleanData);
        showToast('Empresa actualizada correctamente', 'success');
      }
      
      await loadEmpresas();
      handleCancel();
    } catch (err) {
      showToast('Error al guardar empresa: ' + err.message, 'error');
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setIsViewing(false);
    setCurrentId(null);
    setCurrentEmpresa(null);
    setFormData({});
    
    // Limpiar estados de detalles
    setEmpresaUsuarios([]);
    setEmpresaLineas([]);
    setLoadingDetails(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        <div className="flex items-center justify-center pt-20">
          <div className="text-xl text-gray-600">Cargando empresas...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        <div className="flex items-center justify-center pt-20">
          <div className="text-xl text-red-600">{error}</div>
          <button 
            onClick={loadEmpresas}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 pt-20"
      >
        <DataTable
          title="Listado de Empresas"
          data={empresas}
          columns={columns}
          onAdd={handleAdd}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          error={error}
          onRetry={loadEmpresas}
        />
      </motion.div>

      {/* Modal para agregar empresa */}
      <Modal
        isOpen={isAdding}
        onClose={handleCancel}
        title="Añadir Nueva Empresa"
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-4">
              <div>
                <label htmlFor="add-nombre" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre de la Empresa *
                </label>
                <input
                  type="text"
                  id="add-nombre"
                  name="nombre"
                  value={formData.nombre || ''}
                  onChange={handleChange}
                  className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="Ingresa el nombre de la empresa"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="add-nit" className="block text-sm font-semibold text-gray-700 mb-2">
                  NIT *
                </label>
                <input
                  type="text"
                  id="add-nit"
                  name="nit"
                  value={formData.nit || ''}
                  onChange={handleChange}
                  className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="123456789-0"
                  required
                />
              </div>
            </div>
            
            {/* Columna derecha */}
            <div className="space-y-4">
              <div>
                <label htmlFor="add-direccion" className="block text-sm font-semibold text-gray-700 mb-2">
                  Dirección
                </label>
                <textarea
                  id="add-direccion"
                  name="direccion"
                  value={formData.direccion || ''}
                  onChange={handleChange}
                  rows={3}
                  className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="Dirección de la empresa"
                />
              </div>
              
              <div>
                <label htmlFor="add-contacto" className="block text-sm font-semibold text-gray-700 mb-2">
                  Contacto
                </label>
                <input
                  type="text"
                  id="add-contacto"
                  name="contacto"
                  value={formData.contacto || ''}
                  onChange={handleChange}
                  className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="Nombre del contacto"
                />
              </div>
            </div>
          </div>
          
          {/* Nota informativa */}
          <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              <span className="font-medium">Nueva Empresa:</span> Los campos marcados con asterisco (*) son obligatorios.
            </p>
          </div>
          
          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 text-white bg-green-500 hover:bg-green-600 rounded-xl font-medium transition-colors"
            >
              Crear Empresa
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para editar empresa */}
      <Modal
        isOpen={isEditing}
        onClose={handleCancel}
        title="Editar Empresa"
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-nombre" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre de la Empresa *
                </label>
                <input
                  type="text"
                  id="edit-nombre"
                  name="nombre"
                  value={formData.nombre || ''}
                  onChange={handleChange}
                  className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="Ingresa el nombre de la empresa"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-nit" className="block text-sm font-semibold text-gray-700 mb-2">
                  NIT *
                </label>
                <input
                  type="text"
                  id="edit-nit"
                  name="nit"
                  value={formData.nit || ''}
                  onChange={handleChange}
                  className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="123456789-0"
                  required
                />
              </div>
            </div>
            
            {/* Columna derecha */}
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-direccion" className="block text-sm font-semibold text-gray-700 mb-2">
                  Dirección
                </label>
                <textarea
                  id="edit-direccion"
                  name="direccion"
                  value={formData.direccion || ''}
                  onChange={handleChange}
                  rows={3}
                  className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="Dirección de la empresa"
                />
              </div>
              
              <div>
                <label htmlFor="edit-contacto" className="block text-sm font-semibold text-gray-700 mb-2">
                  Contacto
                </label>
                <input
                  type="text"
                  id="edit-contacto"
                  name="contacto"
                  value={formData.contacto || ''}
                  onChange={handleChange}
                  className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="Nombre del contacto"
                />
              </div>
            </div>
          </div>
          
          {/* Nota informativa */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Nota:</span> Los campos marcados con asterisco (*) son obligatorios.
            </p>
          </div>
          
          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-colors"
            >
              Actualizar Empresa
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para ver detalles de la empresa */}
      <Modal
        isOpen={isViewing}
        onClose={handleCancel}
        title="Detalles de la Empresa"
        size="lg"
      >
        {currentEmpresa && (
          <div className="space-y-6">
            {/* Información principal */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      ID de Empresa
                    </label>
                    <p className="text-xl font-medium text-gray-900">{currentEmpresa.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Nombre
                    </label>
                    <p className="text-xl font-medium text-gray-900">{currentEmpresa.nombre}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      NIT
                    </label>
                    <p className="text-lg text-gray-900">{currentEmpresa.nit || 'No especificado'}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Dirección
                    </label>
                    <p className="text-lg text-gray-900">
                      {currentEmpresa.direccion || (
                        <span className="text-gray-400 italic">No especificado</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Contacto
                    </label>
                    <p className="text-lg text-gray-900">
                      {currentEmpresa.contacto || (
                        <span className="text-gray-400 italic">No especificado</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de fechas */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Información de Registro</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Fecha de Creación
                  </label>
                  <p className="text-base text-gray-700">
                    {new Date(currentEmpresa.created_at).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Última Actualización
                  </label>
                  <p className="text-base text-gray-700">
                    {new Date(currentEmpresa.updated_at).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => {
                  handleCancel();
                  setTimeout(() => handleEdit(currentEmpresa.id), 100);
                }}
                className="px-6 py-2 text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-xl font-medium transition-colors"
              >
                Editar Empresa
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-xl font-medium transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal para ver detalles de empresa */}
      <Modal
        isOpen={isViewing}
        onClose={handleCancel}
        title={
          <div className="flex items-center">
            <span className="text-2xl mr-2">🏢</span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
              {currentEmpresa?.nombre || 'Empresa'}
            </span>
          </div>
        }
        size="lg"
      >
        {currentEmpresa && (
          <div className="space-y-6">
            {/* Información básica de la empresa */}
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-4 border border-indigo-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 border border-indigo-100">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide flex items-center">
                    <span className="mr-1">🆔</span> NIT Empresarial
                  </span>
                  <p className="text-sm font-bold text-indigo-800 mt-1">{currentEmpresa.nit || 'No especificado'}</p>
                  <span className="text-xs text-indigo-500">Identificación fiscal</span>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-100">
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wide flex items-center">
                    <span className="mr-1">📞</span> Contacto Principal
                  </span>
                  <p className="text-sm font-bold text-purple-800 mt-1">{currentEmpresa.contacto || 'No especificado'}</p>
                  <span className="text-xs text-purple-500">Teléfono de oficina</span>
                </div>
              </div>
              <div className="mt-3 bg-white rounded-lg p-3 border border-pink-100">
                <span className="text-xs font-bold text-pink-600 uppercase tracking-wide flex items-center">
                  <span className="mr-1">📍</span> Dirección Física
                </span>
                <p className="text-sm font-bold text-pink-800 mt-1">{currentEmpresa.direccion || 'No especificada'}</p>
                <span className="text-xs text-pink-500">Ubicación de oficinas</span>
              </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 text-center relative overflow-hidden">
                <div className="absolute top-1 right-1 text-blue-200 text-3xl opacity-50">👥</div>
                <div className="text-2xl font-bold text-blue-800">{currentEmpresa.total_usuarios || 0}</div>
                <div className="text-xs text-blue-600 font-medium">Empleados</div>
                <div className="text-xs text-blue-500 mt-1">Personal activo</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 text-center relative overflow-hidden">
                <div className="absolute top-1 right-1 text-green-200 text-3xl opacity-50">📱</div>
                <div className="text-2xl font-bold text-green-800">{currentEmpresa.total_lineas || 0}</div>
                <div className="text-xs text-green-600 font-medium">Líneas Móviles</div>
                <div className="text-xs text-green-500 mt-1">Servicios activos</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-lg p-4 border border-orange-200 text-center relative overflow-hidden">
                <div className="absolute top-1 right-1 text-orange-200 text-3xl opacity-50">💰</div>
                <div className="text-lg font-bold text-orange-800">Q{calcularCostoTotal().toLocaleString()}</div>
                <div className="text-xs text-orange-600 font-medium">Costo Mensual</div>
                <div className="text-xs text-orange-500 mt-1">Total en Quetzales</div>
              </div>
            </div>

            {loadingDetails ? (
              <div className="flex items-center justify-center py-4">
                <div className="text-gray-600">Cargando detalles...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Usuarios de la empresa */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
                    <h4 className="text-sm font-bold text-blue-800 flex items-center">
                      <span className="text-blue-600 mr-2">👥</span>
                      Empleados ({empresaUsuarios.length})
                      <span className="ml-2 text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded-full">Activos</span>
                    </h4>
                  </div>
                  <div className="p-3 max-h-40 overflow-y-auto">
                    {empresaUsuarios.length > 0 ? (
                      <div className="space-y-2">
                        {empresaUsuarios.slice(0, 5).map((usuario) => (
                          <div key={usuario.id} className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 hover:shadow-sm transition-all">
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-gray-900 flex items-center">
                                <span className="text-blue-500 mr-1">👤</span>
                                {usuario.nombre}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                <span className="text-blue-600">✉️</span> {usuario.email}
                              </div>
                              <div className="text-xs text-gray-400 mt-0.5">
                                DPI: {usuario.dpi || 'No registrado'}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
                                {usuario.total_lineas || 0} 📱
                              </span>
                              <div className="text-xs text-blue-500 mt-1">
                                {usuario.total_lineas === 1 ? 'línea' : 'líneas'}
                              </div>
                            </div>
                          </div>
                        ))}
                        {empresaUsuarios.length > 5 && (
                          <div className="text-center text-xs text-blue-600 pt-2 font-medium">
                            ➕ {empresaUsuarios.length - 5} empleados más...
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500 text-sm">
                        <div className="text-4xl mb-2">🏢</div>
                        <div>No hay empleados registrados</div>
                        <div className="text-xs text-gray-400 mt-1">Agrega empleados para comenzar</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Líneas de la empresa */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100 rounded-t-xl">
                    <h4 className="text-sm font-bold text-green-800 flex items-center">
                      <span className="text-green-600 mr-2">📱</span>
                      Líneas Móviles ({empresaLineas.length})
                      <span className="ml-2 text-xs bg-green-200 text-green-700 px-2 py-1 rounded-full">Servicios</span>
                    </h4>
                  </div>
                  <div className="p-3 max-h-40 overflow-y-auto">
                    {empresaLineas.length > 0 ? (
                      <div className="space-y-2">
                        {empresaLineas.slice(0, 5).map((linea) => (
                          <div key={linea.id} className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-100 hover:shadow-sm transition-all">
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-gray-900 flex items-center">
                                <span className="text-green-500 mr-1">📞</span>
                                {linea.numero}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                <span className="text-green-600">👤</span> {linea.usuario_nombre || 'Sin asignar'}
                              </div>
                              <div className="text-xs text-gray-400 mt-0.5">
                                📡 {linea.proveedor_nombre} • {linea.plan_nombre}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                linea.estado === 'activa' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {linea.estado === 'activa' ? '🟢 Activa' : '🔴 Inactiva'}
                              </span>
                              {linea.plan_precio && (
                                <div className="text-xs text-green-600 mt-1 font-bold">
                                  Q{parseInt(linea.plan_precio).toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {empresaLineas.length > 5 && (
                          <div className="text-center text-xs text-green-600 pt-2 font-medium">
                            ➕ {empresaLineas.length - 5} líneas más...
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500 text-sm">
                        <div className="text-4xl mb-2">📱</div>
                        <div>No hay líneas registradas</div>
                        <div className="text-xs text-gray-400 mt-1">Agrega líneas móviles para los empleados</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Dialog de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={confirmDelete}
        title="Eliminar Empresa"
        message={`¿Estás seguro de que quieres eliminar la empresa "${currentEmpresa?.nombre}"? Esta acción no se puede deshacer.`}
        type="danger"
      />

      {/* Componente de notificaciones */}
      <ToastComponent />
    </div>
  );
};

export default EmpresasPage;
