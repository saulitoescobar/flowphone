import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import { motion } from 'framer-motion';
import { PlanService } from '../services';

const PlanesPage = () => {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [formData, setFormData] = useState({});
  
  // Hook para las notificaciones
  const { showToast, ToastComponent } = useToast();

  // Configuración de columnas para la tabla
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre del Plan' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'precio', label: 'Precio (COP)', format: (value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value) }
  ];

  // Cargar planes al montar el componente
  useEffect(() => {
    loadPlanes();
  }, []);

  const loadPlanes = async () => {
    try {
      setLoading(true);
      const data = await PlanService.getAll();
      setPlanes(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar planes: ' + err.message);
      console.error('Error loading planes:', err);
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
    const plan = planes.find(item => item.id === id);
    setFormData(plan || {});
  };

  const handleView = (id) => {
    const plan = planes.find(item => item.id === id);
    setCurrentPlan(plan);
    setIsViewing(true);
  };

  const handleDelete = (id) => {
    const plan = planes.find(item => item.id === id);
    setCurrentPlan(plan);
    setCurrentId(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await PlanService.delete(currentId);
      await loadPlanes();
      showToast('Plan eliminado correctamente', 'success');
    } catch (err) {
      showToast('Error al eliminar plan: ' + err.message, 'error');
    }
  };

  const handleSave = async (data) => {
    try {
      const cleanData = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: parseFloat(data.precio) || 0
      };

      if (isAdding) {
        await PlanService.create(cleanData);
        showToast('Plan creado correctamente', 'success');
      } else {
        await PlanService.update(currentId, cleanData);
        showToast('Plan actualizado correctamente', 'success');
      }
      
      await loadPlanes();
      handleCancel();
    } catch (err) {
      showToast('Error al guardar plan: ' + err.message, 'error');
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setIsViewing(false);
    setCurrentId(null);
    setCurrentPlan(null);
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
          <div className="text-xl text-gray-600">Cargando planes...</div>
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
            onClick={loadPlanes}
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
          title="Listado de Planes"
          data={planes}
          columns={columns}
          onAdd={handleAdd}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          error={error}
          onRetry={loadPlanes}
        />
      </motion.div>

      {/* Modal para agregar plan */}
      <Modal
        isOpen={isAdding}
        onClose={handleCancel}
        title="Añadir Nuevo Plan"
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }}>
          <div className="space-y-6">
            <div>
              <label htmlFor="add-nombre" className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del Plan *
              </label>
              <input
                type="text"
                id="add-nombre"
                name="nombre"
                value={formData.nombre || ''}
                onChange={handleChange}
                className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                placeholder="Ej: Plan Básico, Plan Premium"
                required
              />
            </div>
            
            <div>
              <label htmlFor="add-descripcion" className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                id="add-descripcion"
                name="descripcion"
                value={formData.descripcion || ''}
                onChange={handleChange}
                rows="4"
                className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 resize-none"
                placeholder="Describe las características y beneficios del plan"
              />
            </div>
            
            <div>
              <label htmlFor="add-precio" className="block text-sm font-semibold text-gray-700 mb-2">
                Precio (COP) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  id="add-precio"
                  name="precio"
                  value={formData.precio || ''}
                  onChange={handleChange}
                  className="shadow-sm border border-gray-300 rounded-xl w-full py-3 pl-8 pr-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Nota informativa */}
          <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              <span className="font-medium">Nuevo Plan:</span> Los campos marcados con asterisco (*) son obligatorios.
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
              Crear Plan
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para editar plan */}
      <Modal
        isOpen={isEditing}
        onClose={handleCancel}
        title="Editar Plan"
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }}>
          <div className="space-y-6">
            <div>
              <label htmlFor="edit-nombre" className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del Plan *
              </label>
              <input
                type="text"
                id="edit-nombre"
                name="nombre"
                value={formData.nombre || ''}
                onChange={handleChange}
                className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                placeholder="Ej: Plan Básico, Plan Premium"
                required
              />
            </div>
            
            <div>
              <label htmlFor="edit-descripcion" className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                id="edit-descripcion"
                name="descripcion"
                value={formData.descripcion || ''}
                onChange={handleChange}
                rows="4"
                className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 resize-none"
                placeholder="Describe las características y beneficios del plan"
              />
            </div>
            
            <div>
              <label htmlFor="edit-precio" className="block text-sm font-semibold text-gray-700 mb-2">
                Precio (COP) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  id="edit-precio"
                  name="precio"
                  value={formData.precio || ''}
                  onChange={handleChange}
                  className="shadow-sm border border-gray-300 rounded-xl w-full py-3 pl-8 pr-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
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
              Actualizar Plan
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para ver detalles del plan */}
      <Modal
        isOpen={isViewing}
        onClose={handleCancel}
        title="Detalles del Plan"
        size="lg"
      >
        {currentPlan && (
          <div className="space-y-6">
            {/* Información principal */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    ID del Plan
                  </label>
                  <p className="text-xl font-medium text-gray-900">{currentPlan.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Nombre del Plan
                  </label>
                  <p className="text-xl font-medium text-gray-900">{currentPlan.nombre}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Descripción
                  </label>
                  <p className="text-lg text-gray-900 whitespace-pre-wrap">
                    {currentPlan.descripcion || (
                      <span className="text-gray-400 italic">No especificada</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Precio
                  </label>
                  <p className="text-2xl font-bold text-green-600">
                    {new Intl.NumberFormat('es-CO', { 
                      style: 'currency', 
                      currency: 'COP' 
                    }).format(currentPlan.precio)}
                  </p>
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
                    {new Date(currentPlan.created_at).toLocaleString('es-ES', {
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
                    {new Date(currentPlan.updated_at).toLocaleString('es-ES', {
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
                  setTimeout(() => handleEdit(currentPlan.id), 100);
                }}
                className="px-6 py-2 text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-xl font-medium transition-colors"
              >
                Editar Plan
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
        title="Eliminar Plan"
        message={`¿Estás seguro de que quieres eliminar el plan "${currentPlan?.nombre}"? Esta acción no se puede deshacer.`}
        type="danger"
      />

      {/* Componente de notificaciones */}
      <ToastComponent />
    </div>
  );
};

export default PlanesPage;
