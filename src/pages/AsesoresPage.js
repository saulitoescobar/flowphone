import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import ProveedorSelector from '../components/ProveedorSelector';
import { useToast } from '../components/Toast';
import { motion } from 'framer-motion';
import { AsesorService } from '../services';

const AsesoresPage = () => {
  const [asesores, setAsesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentAsesor, setCurrentAsesor] = useState(null);
  const [formData, setFormData] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [puestos, setPuestos] = useState([]);
  
  // Hook para las notificaciones
  const { showToast, ToastComponent } = useToast();

  // Configuración de columnas para la tabla
  const columns = [
    { key: '#', label: '#' },
    { key: 'nombre_display', label: 'Asesor' },
    { key: 'proveedor_display', label: 'Proveedor' },
    { key: 'puesto_display', label: 'Puesto' },
    { key: 'contacto_display', label: 'Contacto' }
  ];

  // Cargar asesores al montar el componente
  useEffect(() => {
    loadAsesores();
    loadPuestos();
  }, []);

  const loadAsesores = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando asesores...');
      const data = await AsesorService.getAll();
      console.log('✅ Asesores recibidos:', data);
      console.log('🔍 Primer asesor de ejemplo:', data[0]);
      
      // Agregar números ordinales y campos display con colores
      const asesoresConNumeros = data.map((asesor, index) => ({
        ...asesor,
        '#': index + 1,
        nombre_display: asesor.nombre,
        proveedor_display: asesor.proveedor_nombre || 'Sin proveedor',
        puesto_display: asesor.puesto,
        contacto_display: `${asesor.correo || 'Sin email'} • ${asesor.telefono_movil || asesor.telefono_fijo || 'Sin teléfono'}`
      }));
      
      console.log('🔍 Primer asesor procesado:', asesoresConNumeros[0]);
      
      setAsesores([...asesoresConNumeros]);
      setRefreshKey(prev => prev + 1);
      setError(null);
      console.log('📊 Estado de asesores actualizado:', asesoresConNumeros.length, 'asesores');
    } catch (err) {
      console.error('❌ Error al cargar asesores:', err);
      setError('Error al cargar asesores: ' + err.message);
    } finally {
      setLoading(false);
      console.log('✅ Carga de asesores completada');
    }
  };

  const loadPuestos = async () => {
    try {
      const data = await AsesorService.getPuestos();
      setPuestos(data);
    } catch (err) {
      console.error('❌ Error al cargar puestos:', err);
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
    const asesor = asesores.find(item => item.id === id);
    setFormData(asesor || {});
  };

  const handleView = (id) => {
    const asesor = asesores.find(item => item.id === id);
    setCurrentAsesor(asesor);
    setIsViewing(true);
  };

  const handleDelete = (id) => {
    const asesor = asesores.find(item => item.id === id);
    setCurrentAsesor(asesor);
    setCurrentId(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      console.log('🗑️ Eliminando asesor con ID:', currentId);
      await AsesorService.delete(currentId);
      console.log('✅ Asesor eliminado correctamente');
      console.log('🔄 Recargando lista de asesores...');
      await loadAsesores();
      console.log('🚪 Cerrando diálogo de confirmación...');
      setShowConfirmDelete(false);
      showToast('Asesor eliminado correctamente', 'success');
    } catch (err) {
      console.error('❌ Error al eliminar asesor:', err);
      showToast('Error al eliminar asesor: ' + err.message, 'error');
    }
  };

  const handleSave = async (data) => {
    try {
      console.log('💾 Datos recibidos en handleSave:', data);
      
      // Validar formulario antes de enviar
      const validationErrors = validateForm(data);
      if (validationErrors.length > 0) {
        showToast('Errores de validación: ' + validationErrors.join(', '), 'error');
        return;
      }
      
      // Limpiar los datos para enviar a la API
      const cleanData = {
        proveedor_id: data.proveedor_id,
        nombre: data.nombre.trim(),
        puesto: data.puesto,
        correo: data.correo ? data.correo.trim() : '',
        telefono_fijo: data.telefono_fijo ? data.telefono_fijo.trim() : '',
        telefono_movil: data.telefono_movil ? data.telefono_movil.trim() : ''
      };

      console.log('🧹 Datos limpiados:', cleanData);

      if (isAdding) {
        console.log('➕ Creando asesor...');
        const result = await AsesorService.create(cleanData);
        console.log('✅ Asesor creado:', result);
        showToast('Asesor creado correctamente', 'success');
      } else {
        console.log('✏️ Actualizando asesor con ID:', currentId);
        const result = await AsesorService.update(currentId, cleanData);
        console.log('✅ Asesor actualizado:', result);
        showToast('Asesor actualizado correctamente', 'success');
      }
      
      console.log('🔄 Recargando lista de asesores...');
      await loadAsesores();
      console.log('🚪 Cerrando formulario...');
      handleCancel();
    } catch (err) {
      console.error('❌ Error en handleSave:', err);
      showToast('Error al guardar asesor: ' + err.message, 'error');
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setIsViewing(false);
    setCurrentId(null);
    setCurrentAsesor(null);
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    console.log(`📝 Campo ${name} actualizado:`, value);
  };

  // Validación mejorada de formularios
  const validateForm = (data) => {
    const errors = [];
    
    if (!data.proveedor_id) {
      errors.push('Debe seleccionar un proveedor');
    }
    
    if (!data.nombre || data.nombre.trim().length < 2) {
      errors.push('El nombre del asesor debe tener al menos 2 caracteres');
    }
    
    if (!data.puesto) {
      errors.push('Debe seleccionar un puesto');
    }
    
    if (data.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo)) {
      errors.push('El correo electrónico no tiene un formato válido');
    }
    
    if (data.telefono_fijo && !/^[\d\s\-\+\(\)]+$/.test(data.telefono_fijo)) {
      errors.push('El teléfono fijo solo debe contener números, espacios, guiones, paréntesis y el signo +');
    }
    
    if (data.telefono_movil && !/^[\d\s\-\+\(\)]+$/.test(data.telefono_movil)) {
      errors.push('El teléfono móvil solo debe contener números, espacios, guiones, paréntesis y el signo +');
    }
    
    return errors;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        <div className="flex items-center justify-center pt-20">
          <div className="text-xl text-gray-600">Cargando asesores...</div>
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
            onClick={loadAsesores}
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
          key={refreshKey}
          title="Listado de Asesores"
          data={asesores}
          columns={columns}
          onAdd={handleAdd}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          error={error}
          onRetry={loadAsesores}
        />
      </motion.div>

      {/* Modal para agregar asesor */}
      <Modal
        isOpen={isAdding}
        onClose={handleCancel}
        title="Añadir Nuevo Asesor"
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }}>
          <div className="space-y-6">
            <div>
              <label htmlFor="add-proveedor" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-8 0H3m2 0h6M9 7h6m-6 4h6m-6 4h6"></path>
                </svg>
                Proveedor *
              </label>
              <ProveedorSelector
                id="add-proveedor"
                value={formData.proveedor_id || ''}
                onChange={(value) => setFormData(prev => ({ ...prev, proveedor_id: value }))}
                required
              />
            </div>
            
            <div>
              <label htmlFor="add-nombre" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Nombre del Asesor *
              </label>
              <input
                type="text"
                id="add-nombre"
                name="nombre"
                value={formData.nombre || ''}
                onChange={handleChange}
                className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                placeholder="Ej: María González"
                required
                maxLength="100"
              />
            </div>
            
            <div>
              <label htmlFor="add-puesto" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6"></path>
                </svg>
                Puesto *
              </label>
              <select
                id="add-puesto"
                name="puesto"
                value={formData.puesto || ''}
                onChange={handleChange}
                className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-200"
                required
              >
                <option value="">Seleccionar puesto...</option>
                {puestos.map((puesto) => (
                  <option key={puesto.value} value={puesto.value}>
                    {puesto.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="add-correo" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                Correo Electrónico
              </label>
              <input
                type="email"
                id="add-correo"
                name="correo"
                value={formData.correo || ''}
                onChange={handleChange}
                className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200"
                placeholder="maria.gonzalez@proveedor.com"
                maxLength="100"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="add-telefono-fijo" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  Teléfono Fijo
                </label>
                <input
                  type="tel"
                  id="add-telefono-fijo"
                  name="telefono_fijo"
                  value={formData.telefono_fijo || ''}
                  onChange={handleChange}
                  className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 font-mono"
                  placeholder="2333-1001"
                  maxLength="20"
                />
              </div>
              
              <div>
                <label htmlFor="add-telefono-movil" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                  Teléfono Móvil
                </label>
                <input
                  type="tel"
                  id="add-telefono-movil"
                  name="telefono_movil"
                  value={formData.telefono_movil || ''}
                  onChange={handleChange}
                  className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 transition-all duration-200 font-mono"
                  placeholder="5555-1001"
                  maxLength="20"
                />
              </div>
            </div>
          </div>
          
          {/* Nota informativa */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p className="text-sm text-green-700 font-medium">Nuevo Asesor</p>
                <p className="text-sm text-green-600">Los campos marcados con asterisco (*) son obligatorios. El asesor será asociado al proveedor seleccionado.</p>
              </div>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 text-white bg-green-500 hover:bg-green-600 rounded-xl font-medium transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Crear Asesor
            </button>
          </div>
        </form>
      </Modal>

      {/* Dialog de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={confirmDelete}
        title="Eliminar Asesor"
        message={`¿Estás seguro de que quieres eliminar al asesor "${currentAsesor?.nombre}"?`}
        description="Esta acción marcará el asesor como inactivo en el sistema."
        type="danger"
      />

      {/* Modal para ver asesor */}
      <Modal
        isOpen={isViewing}
        onClose={() => setIsViewing(false)}
        title="Información del Asesor"
        size="lg"
      >
        {currentAsesor && (
          <div className="space-y-6">
            {/* Encabezado con información principal */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">{currentAsesor.nombre}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      currentAsesor.puesto === 'ventas' ? 'bg-green-100 text-green-800' :
                      currentAsesor.puesto === 'post_ventas' ? 'bg-blue-100 text-blue-800' :
                      currentAsesor.puesto === 'soporte' ? 'bg-purple-100 text-purple-800' :
                      currentAsesor.puesto === 'gerencia' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {currentAsesor.puesto === 'ventas' ? '💰 Ventas' :
                       currentAsesor.puesto === 'post_ventas' ? '🛠️ Post-Ventas' :
                       currentAsesor.puesto === 'soporte' ? '🔧 Soporte' :
                       currentAsesor.puesto === 'gerencia' ? '👔 Gerencia' :
                       '📋 Otro'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">ID: {currentAsesor.id}</span>
                </div>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  📧 Información de Contacto
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium w-20">Email:</span>
                    <span className="text-gray-800">{currentAsesor.correo || 'No especificado'}</span>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium w-20">Móvil:</span>
                    <span className="text-gray-800 font-mono">{currentAsesor.telefono_movil || 'No especificado'}</span>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium w-20">Fijo:</span>
                    <span className="text-gray-800 font-mono">{currentAsesor.telefono_fijo || 'No especificado'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  🏢 Información Empresarial
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <span className="text-orange-600 font-medium w-24">Proveedor:</span>
                    <span className="text-orange-800 font-medium">{currentAsesor.proveedor_nombre || 'No especificado'}</span>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium w-24">Creado:</span>
                    <span className="text-gray-800">{new Date(currentAsesor.created_at).toLocaleDateString('es-GT')}</span>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium w-24">Actualizado:</span>
                    <span className="text-gray-800">{new Date(currentAsesor.updated_at).toLocaleDateString('es-GT')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón para cerrar */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsViewing(false)}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal para editar asesor */}
      <Modal
        isOpen={isEditing}
        onClose={handleCancel}
        title="Editar Asesor"
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }}>
          <div className="space-y-6">
            {/* Información básica */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={formData.nombre || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="Nombre del asesor"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proveedor *
                </label>
                <ProveedorSelector
                  value={formData.proveedor_id || ''}
                  onChange={(value) => setFormData(prev => ({ ...prev, proveedor_id: value }))}
                  required
                />
              </div>
            </div>

            {/* Puesto y contacto */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puesto *
                </label>
                <select
                  value={formData.puesto || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, puesto: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  required
                >
                  <option value="">Seleccionar puesto</option>
                  {puestos.map((puesto) => (
                    <option key={puesto.value} value={puesto.value}>
                      {puesto.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  value={formData.correo || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, correo: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
            </div>

            {/* Teléfonos */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono Móvil
                </label>
                <input
                  type="tel"
                  value={formData.telefono_movil || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefono_movil: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="5555-1234"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono Fijo
                </label>
                <input
                  type="tel"
                  value={formData.telefono_fijo || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefono_fijo: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="2333-1234"
                />
              </div>
            </div>
          </div>
          
          {/* Nota informativa */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p className="text-sm text-yellow-700 font-medium">Editando Asesor</p>
                <p className="text-sm text-yellow-600">Los campos marcados con asterisco (*) son obligatorios. Los cambios se guardarán al hacer clic en "Actualizar".</p>
              </div>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              Actualizar Asesor
            </button>
          </div>
        </form>
      </Modal>

      {/* Componente de notificaciones */}
      <ToastComponent />
    </div>
  );
};

export default AsesoresPage;
