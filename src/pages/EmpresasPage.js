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
  
  // Hook para las notificaciones
  const { showToast, ToastComponent } = useToast();

  // Configuración de columnas para la tabla
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'direccion', label: 'Dirección' },
    { key: 'contacto', label: 'Contacto' },
    { key: 'nit', label: 'NIT' }
  ];

  // Cargar empresas al montar el componente
  useEffect(() => {
    loadEmpresas();
  }, []);

  const loadEmpresas = async () => {
    try {
      setLoading(true);
      const data = await EmpresaService.getAll();
      setEmpresas(data);
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

  const handleView = (id) => {
    const empresa = empresas.find(item => item.id === id);
    setCurrentEmpresa(empresa);
    setIsViewing(true);
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
