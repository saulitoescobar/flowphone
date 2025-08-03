import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import { motion } from 'framer-motion';
import { UserCheck } from 'lucide-react';
import { ProveedorService, AsesorService, LineaService } from '../services';

const ProveedoresPage = () => {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentProveedor, setCurrentProveedor] = useState(null);
  const [formData, setFormData] = useState({});
  const [refreshKey, setRefreshKey] = useState(0); // Para forzar re-renders
  
  // Estados para datos relacionados del proveedor
  const [asesoresProveedor, setAsesoresProveedor] = useState([]);
  const [lineasProveedor, setLineasProveedor] = useState([]);
  const [loadingRelacionados, setLoadingRelacionados] = useState(false);
  
  // Hook para las notificaciones
  const { showToast, ToastComponent } = useToast();

  // Configuración de columnas para la tabla
  const columns = [
    { key: '#', label: '#' },
    { key: 'nombre_display', label: 'Proveedor' },
    { key: 'contacto_display', label: 'Contacto' },
    { key: 'telefono_display', label: 'Teléfono' }
  ];

  // Cargar proveedores al montar el componente
  useEffect(() => {
    loadProveedores();
  }, []);

  const loadProveedores = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando proveedores...');
      const data = await ProveedorService.getAll();
      console.log('✅ Proveedores recibidos:', data);
      console.log('🔍 Primer proveedor de ejemplo:', data[0]);
      
      // Agregar números ordinales y campos display con colores a los proveedores
      const proveedoresConNumeros = data.map((proveedor, index) => ({
        ...proveedor,
        '#': index + 1,
        nombre_display: proveedor.nombre,
        contacto_display: proveedor.contacto || 'Sin contacto',
        telefono_display: proveedor.telefono || 'Sin teléfono'
      }));
      
      console.log('🔍 Primer proveedor procesado:', proveedoresConNumeros[0]);
      
      setProveedores([...proveedoresConNumeros]); // Crear una nueva referencia del array
      setRefreshKey(prev => prev + 1); // Forzar re-render
      setError(null);
      console.log('📊 Estado de proveedores actualizado:', proveedoresConNumeros.length, 'proveedores');
    } catch (err) {
      console.error('❌ Error al cargar proveedores:', err);
      setError('Error al cargar proveedores: ' + err.message);
      console.error('Error loading proveedores:', err);
    } finally {
      setLoading(false);
      console.log('✅ Carga de proveedores completada');
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
    const proveedor = proveedores.find(item => item.id === id);
    setFormData(proveedor || {});
  };

  const handleView = async (id) => {
    const proveedor = proveedores.find(item => item.id === id);
    setCurrentProveedor(proveedor);
    setIsViewing(true);
    
    // Cargar datos relacionados del proveedor
    await loadProveedorRelacionados(id);
  };

  const loadProveedorRelacionados = async (proveedorId) => {
    try {
      setLoadingRelacionados(true);
      console.log(`🔄 Cargando datos relacionados del proveedor ${proveedorId}...`);
      
      // Cargar asesores del proveedor
      console.log(`📞 Llamando a AsesorService.getByProveedor(${proveedorId})`);
      const asesores = await AsesorService.getByProveedor(proveedorId);
      console.log(`✅ ${asesores.length} asesores encontrados:`, asesores);
      setAsesoresProveedor(asesores);
      
      // Cargar líneas del proveedor (necesitamos obtener líneas por planes del proveedor)
      console.log(`📱 Llamando a LineaService.getByProveedor(${proveedorId})`);
      const lineas = await LineaService.getByProveedor(proveedorId);
      console.log(`✅ ${lineas.length} líneas encontradas:`, lineas);
      setLineasProveedor(lineas);
      
    } catch (error) {
      console.error('❌ Error al cargar datos relacionados:', error);
      setAsesoresProveedor([]);
      setLineasProveedor([]);
      showToast('Error al cargar datos relacionados del proveedor', 'error');
    } finally {
      setLoadingRelacionados(false);
    }
  };

  const handleDelete = (id) => {
    const proveedor = proveedores.find(item => item.id === id);
    setCurrentProveedor(proveedor);
    setCurrentId(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      console.log('🗑️ Eliminando proveedor con ID:', currentId);
      await ProveedorService.delete(currentId);
      console.log('✅ Proveedor eliminado correctamente');
      console.log('🔄 Recargando lista de proveedores...');
      await loadProveedores(); // Recargar la lista
      console.log('🚪 Cerrando diálogo de confirmación...');
      setShowConfirmDelete(false);
      showToast('Proveedor eliminado correctamente', 'success');
    } catch (err) {
      console.error('❌ Error al eliminar proveedor:', err);
      showToast('Error al eliminar proveedor: ' + err.message, 'error');
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
      
      // Limpiar los datos para enviar a la API con la estructura correcta
      const cleanData = {
        nombre: data.nombre.trim(),
        contacto: data.contacto ? data.contacto.trim() : '',
        telefono: data.telefono ? data.telefono.trim() : ''
      };

      console.log('🧹 Datos limpiados:', cleanData);

      if (isAdding) {
        console.log('➕ Creando proveedor...');
        const result = await ProveedorService.create(cleanData);
        console.log('✅ Proveedor creado:', result);
        showToast('Proveedor creado correctamente', 'success');
      } else {
        console.log('✏️ Actualizando proveedor con ID:', currentId);
        const result = await ProveedorService.update(currentId, cleanData);
        console.log('✅ Proveedor actualizado:', result);
        showToast('Proveedor actualizado correctamente', 'success');
      }
      
      console.log('🔄 Recargando lista de proveedores...');
      await loadProveedores(); // Recargar la lista
      console.log('🚪 Cerrando formulario...');
      handleCancel(); // Cerrar el formulario
    } catch (err) {
      console.error('❌ Error en handleSave:', err);
      showToast('Error al guardar proveedor: ' + err.message, 'error');
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setIsViewing(false);
    setCurrentId(null);
    setCurrentProveedor(null);
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
    
    if (!data.nombre || data.nombre.trim().length < 2) {
      errors.push('El nombre del proveedor debe tener al menos 2 caracteres');
    }
    
    if (data.telefono && !/^[\d\s\-\+\(\)]+$/.test(data.telefono)) {
      errors.push('El teléfono solo debe contener números, espacios, guiones, paréntesis y el signo +');
    }
    
    return errors;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        <div className="flex items-center justify-center pt-20">
          <div className="text-xl text-gray-600">Cargando proveedores...</div>
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
            onClick={loadProveedores}
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
        {/* Botón para ir a Asesores */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-6"
        >
          <motion.button
            onClick={() => navigate('/asesores')}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <UserCheck className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="font-medium">Gestionar Asesores</span>
            <div className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
              Nuevo
            </div>
          </motion.button>
          <p className="text-sm text-gray-600 mt-2 ml-1">
            Administra los asesores de ventas y post-ventas de tus proveedores
          </p>
        </motion.div>

        <DataTable
          key={refreshKey} // Forzar re-render cuando cambie
          title="Listado de Proveedores"
          data={proveedores}
          columns={columns}
          onAdd={handleAdd}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          error={error}
          onRetry={loadProveedores}
        />
      </motion.div>

      {/* Modal para agregar proveedor */}
      <Modal
        isOpen={isAdding}
        onClose={handleCancel}
        title="Añadir Nuevo Proveedor"
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }}>
          <div className="space-y-6">
            <div>
              <label htmlFor="add-nombre" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-8 0H3m2 0h6M9 7h6m-6 4h6m-6 4h6"></path>
                </svg>
                Nombre del Proveedor *
              </label>
              <input
                type="text"
                id="add-nombre"
                name="nombre"
                value={formData.nombre || ''}
                onChange={handleChange}
                className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-200"
                placeholder="Ej: Tigo, Claro, Movistar..."
                required
                maxLength="100"
              />
              <p className="text-xs text-gray-500 mt-1">Nombre oficial del proveedor de telecomunicaciones</p>
            </div>
            
            <div>
              <label htmlFor="add-contacto" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Contacto
              </label>
              <input
                type="text"
                id="add-contacto"
                name="contacto"
                value={formData.contacto || ''}
                onChange={handleChange}
                className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                placeholder="Nombre del contacto principal"
                maxLength="100"
              />
              <p className="text-xs text-gray-500 mt-1">Persona de contacto en el proveedor (opcional)</p>
            </div>
            
            <div>
              <label htmlFor="add-telefono" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                Teléfono
              </label>
              <input
                type="tel"
                id="add-telefono"
                name="telefono"
                value={formData.telefono || ''}
                onChange={handleChange}
                className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 font-mono"
                placeholder="2333-4444 o +502 2333-4444"
                maxLength="20"
              />
              <p className="text-xs text-gray-500 mt-1">Número de teléfono de contacto (opcional)</p>
            </div>
          </div>
          
          {/* Nota informativa */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p className="text-sm text-green-700 font-medium">Nuevo Proveedor</p>
                <p className="text-sm text-green-600">Los campos marcados con asterisco (*) son obligatorios. Una vez creado, el proveedor estará disponible para asignar a líneas telefónicas.</p>
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
              Crear Proveedor
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para editar proveedor */}
      <Modal
        isOpen={isEditing}
        onClose={handleCancel}
        title="Editar Proveedor"
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }}>
          <div className="space-y-6">
            <div>
              <label htmlFor="edit-nombre" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-8 0H3m2 0h6M9 7h6m-6 4h6m-6 4h6"></path>
                </svg>
                Nombre del Proveedor *
              </label>
              <input
                type="text"
                id="edit-nombre"
                name="nombre"
                value={formData.nombre || ''}
                onChange={handleChange}
                className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all duration-200"
                placeholder="Ej: Tigo, Claro, Movistar..."
                required
                maxLength="100"
              />
              <p className="text-xs text-gray-500 mt-1">Nombre oficial del proveedor de telecomunicaciones</p>
            </div>
            
            <div>
              <label htmlFor="edit-contacto" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Contacto
              </label>
              <input
                type="text"
                id="edit-contacto"
                name="contacto"
                value={formData.contacto || ''}
                onChange={handleChange}
                className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                placeholder="Nombre del contacto principal"
                maxLength="100"
              />
              <p className="text-xs text-gray-500 mt-1">Persona de contacto en el proveedor (opcional)</p>
            </div>
            
            <div>
              <label htmlFor="edit-telefono" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                Teléfono
              </label>
              <input
                type="tel"
                id="edit-telefono"
                name="telefono"
                value={formData.telefono || ''}
                onChange={handleChange}
                className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all duration-200 font-mono"
                placeholder="2333-4444 o +502 2333-4444"
                maxLength="20"
              />
              <p className="text-xs text-gray-500 mt-1">Número de teléfono de contacto (opcional)</p>
            </div>
          </div>
          
          {/* Información del proveedor actual */}
          {currentProveedor && (
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-orange-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                <div>
                  <p className="text-sm text-orange-700 font-medium">Editando Proveedor #{currentProveedor.id}</p>
                  <p className="text-sm text-orange-600">Los campos marcados con asterisco (*) son obligatorios. Los cambios se aplicarán inmediatamente.</p>
                </div>
              </div>
            </div>
          )}
          
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
              className="flex-1 px-6 py-3 text-white bg-orange-500 hover:bg-orange-600 rounded-xl font-medium transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Actualizar Proveedor
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para ver detalles del proveedor */}
      <Modal
        isOpen={isViewing}
        onClose={handleCancel}
        title="Información Completa del Proveedor"
        size="xl"
      >
        {currentProveedor && (
          <div className="space-y-6">
            {/* Encabezado con información principal */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-orange-900 mb-2">{currentProveedor.nombre}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-orange-600 font-medium">📞 Contacto:</span>
                      <span className="text-gray-800">{currentProveedor.contacto || 'No especificado'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-600 font-medium">📱 Teléfono:</span>
                      {currentProveedor.telefono ? (
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-lg font-mono">
                          {currentProveedor.telefono}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">No especificado</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">ID: {currentProveedor.id}</span>
                  <div className="text-xs text-gray-400 mt-1">
                    Creado: {new Date(currentProveedor.created_at).toLocaleDateString('es-GT')}
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido con pestañas */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Sección de Asesores */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-blue-900 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.196-2.121l5.196 2.121zM9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Asesores ({asesoresProveedor.length})
                  </h4>
                  {loadingRelacionados && (
                    <div className="text-blue-600 text-sm">Cargando...</div>
                  )}
                </div>
                
                {asesoresProveedor.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {asesoresProveedor.map((asesor) => (
                      <div key={asesor.id} className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-bold text-blue-900">{asesor.nombre}</h5>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                asesor.puesto === 'ventas' ? 'bg-green-100 text-green-800' :
                                asesor.puesto === 'post_ventas' ? 'bg-blue-100 text-blue-800' :
                                asesor.puesto === 'soporte' ? 'bg-purple-100 text-purple-800' :
                                asesor.puesto === 'gerencia' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {asesor.puesto === 'ventas' ? '💰 Ventas' :
                                 asesor.puesto === 'post_ventas' ? '🛠️ Post-Ventas' :
                                 asesor.puesto === 'soporte' ? '🔧 Soporte' :
                                 asesor.puesto === 'gerencia' ? '👔 Gerencia' :
                                 '📋 Otro'}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mt-2 space-y-1">
                              {asesor.correo && (
                                <div>📧 {asesor.correo}</div>
                              )}
                              {asesor.telefono_movil && (
                                <div>📱 {asesor.telefono_movil}</div>
                              )}
                              {asesor.telefono_fijo && (
                                <div>📞 {asesor.telefono_fijo}</div>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded">
                            #{asesor.id}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.196-2.121l5.196 2.121zM9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p>No hay asesores registrados para este proveedor</p>
                    <button 
                      onClick={() => navigate('/asesores')}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Agregar asesores →
                    </button>
                  </div>
                )}
              </div>

              {/* Sección de Líneas */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-green-900 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    Líneas Activas ({lineasProveedor.length})
                  </h4>
                  {loadingRelacionados && (
                    <div className="text-green-600 text-sm">Cargando...</div>
                  )}
                </div>
                
                {lineasProveedor.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {lineasProveedor.map((linea) => (
                      <div key={linea.id} className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-bold text-green-900 font-mono text-lg">{linea.numero}</h5>
                            <div className="text-sm text-gray-600 mt-1 space-y-1">
                              {linea.usuario_nombre && (
                                <div>👤 {linea.usuario_nombre}</div>
                              )}
                              {linea.empresa_nombre && (
                                <div>🏢 {linea.empresa_nombre}</div>
                              )}
                              {linea.plan_nombre && (
                                <div>📋 {linea.plan_nombre}</div>
                              )}
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  linea.estado === 'activa' ? 'bg-green-100 text-green-800' :
                                  linea.estado === 'suspendida' ? 'bg-yellow-100 text-yellow-800' :
                                  linea.estado === 'cancelada' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {linea.estado || 'activa'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-green-500 bg-green-100 px-2 py-1 rounded">
                            #{linea.id}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <p>No hay líneas activas para este proveedor</p>
                    <button 
                      onClick={() => navigate('/lineas')}
                      className="mt-2 text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Gestionar líneas →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Información de fechas */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Información de Registro
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                    Fecha de Creación
                  </label>
                  <p className="text-base text-gray-700">
                    {currentProveedor.created_at ? new Date(currentProveedor.created_at).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'No disponible'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                    Última Actualización
                  </label>
                  <p className="text-base text-gray-700">
                    {currentProveedor.updated_at ? new Date(currentProveedor.updated_at).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'No disponible'}
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  handleCancel();
                  setTimeout(() => handleEdit(currentProveedor.id), 100);
                }}
                className="px-6 py-2 text-orange-600 bg-orange-100 hover:bg-orange-200 rounded-xl font-medium transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Editar Proveedor
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-xl font-medium transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
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
        title="Eliminar Proveedor"
        message={`¿Estás seguro de que quieres eliminar el proveedor "${currentProveedor?.nombre}"?`}
        description="Esta acción eliminará permanentemente el proveedor del sistema. Si hay líneas asignadas a este proveedor, es recomendable reasignarlas antes de eliminarlo."
        type="danger"
      />

      {/* Componente de notificaciones */}
      <ToastComponent />
    </div>
  );
};

export default ProveedoresPage;
