import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import UsuarioSelector from '../components/UsuarioSelector';
import EmpresaSelector from '../components/EmpresaSelector';
import PlanSelector from '../components/PlanSelector';
import { motion } from 'framer-motion';
import { LineaService } from '../services';

const LineasPage = () => {
  const [lineas, setLineas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentLinea, setCurrentLinea] = useState(null);
  const [formData, setFormData] = useState({});
  const [refreshKey, setRefreshKey] = useState(0); // Para forzar re-renders
  
  // Hook para las notificaciones
  const { showToast, ToastComponent } = useToast();

  // Configuración de columnas para la tabla con más información
  const columns = [
    { key: '#', label: '#' },
    { key: 'numero', label: 'Número' },
    { key: 'usuario_display', label: 'USUARIO' },
    { key: 'empresa_display', label: 'EMPRESA' },
    { key: 'plan_display', label: 'PLAN' },
    { key: 'costo_display', label: 'COSTO' },
    { key: 'estado_display', label: 'Estado' }
  ];

  // Cargar líneas al montar el componente
  useEffect(() => {
    loadLineas();
  }, []);

  const loadLineas = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando líneas...');
      const data = await LineaService.getAll();
      console.log('✅ Líneas recibidas:', data);
      
      // Agregar números ordinales y campos display mejorados a las líneas
      const lineasConNumeros = data.map((linea, index) => ({
        ...linea,
        '#': index + 1,
        usuario_display: linea.usuario_nombre ? 
          `${linea.usuario_nombre}${linea.usuario_dpi ? ` • DPI: ${linea.usuario_dpi}` : ''}` : 
          'Disponible',
        empresa_display: linea.empresa_nombre ?
          `${linea.empresa_nombre}${linea.empresa_nit ? ` • NIT: ${linea.empresa_nit}` : ''}` :
          'Sin empresa',
        plan_display: linea.plan_nombre || 'Sin plan',
        costo_display: linea.precio ? `Q${Number(linea.precio).toLocaleString()}` : 'Sin costo',
        estado_display: linea.estado || 'activa'
      }));
      
      setLineas([...lineasConNumeros]); // Crear una nueva referencia del array
      setRefreshKey(prev => prev + 1); // Forzar re-render
      setError(null);
      console.log('📊 Estado de líneas actualizado:', lineasConNumeros.length, 'líneas');
    } catch (err) {
      console.error('❌ Error al cargar líneas:', err);
      setError('Error al cargar líneas: ' + err.message);
      console.error('Error loading lineas:', err);
    } finally {
      setLoading(false);
      console.log('✅ Carga de líneas completada');
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
    const linea = lineas.find(item => item.id === id);
    setFormData(linea || {});
  };

  const handleView = (id) => {
    const linea = lineas.find(item => item.id === id);
    setCurrentLinea(linea);
    setIsViewing(true);
  };

  const handleDelete = (id) => {
    const linea = lineas.find(item => item.id === id);
    setCurrentLinea(linea);
    setCurrentId(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await LineaService.delete(currentId);
      await loadLineas();
      showToast('Línea eliminada correctamente', 'success');
    } catch (err) {
      showToast('Error al eliminar línea: ' + err.message, 'error');
    }
  };

  const handleSave = async (data) => {
    try {
      console.log('💾 Datos recibidos en handleSave:', data);
      
      // Limpiar los datos para enviar a la API con la estructura correcta
      const cleanData = {
        numero: data.numero,
        usuario_id: data.usuario_id,
        empresa_id: data.empresa_id,
        plan_id: data.plan_id,
        estado: data.estado || 'activa',
        fecha_activacion: data.fecha_activacion || null
      };

      console.log('🧹 Datos limpiados:', cleanData);

      if (isAdding) {
        console.log('➕ Creando línea...');
        const result = await LineaService.create(cleanData);
        console.log('✅ Línea creada:', result);
        showToast('Línea creada correctamente', 'success');
      } else {
        console.log('✏️ Actualizando línea con ID:', currentId);
        const result = await LineaService.update(currentId, cleanData);
        console.log('✅ Línea actualizada:', result);
        showToast('Línea actualizada correctamente', 'success');
      }
      
      console.log('🔄 Recargando lista de líneas...');
      await loadLineas(); // Recargar la lista
      console.log('🚪 Cerrando formulario...');
      handleCancel(); // Cerrar el formulario
    } catch (err) {
      console.error('❌ Error en handleSave:', err);
      showToast('Error al guardar línea: ' + err.message, 'error');
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setIsViewing(false);
    setCurrentId(null);
    setCurrentLinea(null);
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
          <div className="text-xl text-gray-600">Cargando líneas...</div>
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
            onClick={loadLineas}
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
          key={`lineas-table-${refreshKey}`}
          title="Listado de Líneas Telefónicas"
          data={lineas}
          columns={columns}
          onAdd={handleAdd}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          error={error}
          onRetry={loadLineas}
        />
      </motion.div>

      {/* Modal para agregar línea */}
      <Modal
        isOpen={isAdding}
        onClose={handleCancel}
        title="Añadir Nueva Línea"
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }}>
          <div className="space-y-6">
            <div>
              <label htmlFor="add-numero" className="block text-sm font-semibold text-gray-700 mb-2">
                Número de Línea *
              </label>
              <input
                type="text"
                id="add-numero"
                name="numero"
                value={formData.numero || ''}
                onChange={handleChange}
                className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                placeholder="Ej: 3001234567"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Usuario (Opcional)
              </label>
              <UsuarioSelector
                value={formData.usuario_id}
                onChange={(id, nombre) => setFormData(prev => ({ 
                  ...prev, 
                  usuario_id: id,
                  usuario_nombre: nombre 
                }))}
                placeholder="Línea disponible (sin usuario asignado)"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Deja vacío para línea disponible
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Empresa *
              </label>
              <EmpresaSelector
                value={formData.empresa_nombre || ''}
                onChange={(nombre, empresa_id) => setFormData(prev => ({ 
                  ...prev, 
                  empresa_nombre: nombre,
                  empresa_id: empresa_id 
                }))}
                placeholder="Selecciona una empresa"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Plan *
              </label>
              <PlanSelector
                value={formData.plan_id}
                onChange={(id, nombre) => setFormData(prev => ({ 
                  ...prev, 
                  plan_id: id,
                  plan_nombre: nombre 
                }))}
                placeholder="Selecciona un plan"
              />
            </div>
            
            <div>
              <label htmlFor="add-estado" className="block text-sm font-semibold text-gray-700 mb-2">
                Estado *
              </label>
              <select
                id="add-estado"
                name="estado"
                value={formData.estado || ''}
                onChange={handleChange}
                className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                required
              >
                <option value="">Seleccionar estado</option>
                <option value="activa">Activa</option>
                <option value="suspendida">Suspendida</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="add-fecha_activacion" className="block text-sm font-semibold text-gray-700 mb-2">
                Fecha de Activación
              </label>
              <input
                type="date"
                id="add-fecha_activacion"
                name="fecha_activacion"
                value={formData.fecha_activacion || ''}
                onChange={handleChange}
                className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>
          
          {/* Nota informativa */}
          <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              <span className="font-medium">Nueva Línea:</span> Los campos marcados con asterisco (*) son obligatorios.
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
              Crear Línea
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para editar línea */}
      <Modal
        isOpen={isEditing}
        onClose={handleCancel}
        title="Editar Línea"
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }}>
          <div className="space-y-6">
            <div>
              <label htmlFor="edit-numero" className="block text-sm font-semibold text-gray-700 mb-2">
                Número de Línea *
              </label>
              <input
                type="text"
                id="edit-numero"
                name="numero"
                value={formData.numero || ''}
                onChange={handleChange}
                className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                placeholder="Ej: 3001234567"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Usuario (Opcional)
              </label>
              <UsuarioSelector
                value={formData.usuario_id}
                onChange={(id, nombre) => setFormData(prev => ({ 
                  ...prev, 
                  usuario_id: id,
                  usuario_nombre: nombre 
                }))}
                placeholder="Línea disponible (sin usuario asignado)"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Deja vacío para línea disponible
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Empresa *
              </label>
              <EmpresaSelector
                value={formData.empresa_nombre || ''}
                onChange={(nombre, empresa_id) => setFormData(prev => ({ 
                  ...prev, 
                  empresa_nombre: nombre,
                  empresa_id: empresa_id 
                }))}
                placeholder="Selecciona una empresa"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Plan *
              </label>
              <PlanSelector
                value={formData.plan_id}
                onChange={(id, nombre) => setFormData(prev => ({ 
                  ...prev, 
                  plan_id: id,
                  plan_nombre: nombre 
                }))}
                placeholder="Selecciona un plan"
              />
            </div>
            
            <div>
              <label htmlFor="edit-estado" className="block text-sm font-semibold text-gray-700 mb-2">
                Estado *
              </label>
              <select
                id="edit-estado"
                name="estado"
                value={formData.estado || ''}
                onChange={handleChange}
                className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                required
              >
                <option value="">Seleccionar estado</option>
                <option value="activa">Activa</option>
                <option value="suspendida">Suspendida</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="edit-fecha_activacion" className="block text-sm font-semibold text-gray-700 mb-2">
                Fecha de Activación
              </label>
              <input
                type="date"
                id="edit-fecha_activacion"
                name="fecha_activacion"
                value={formData.fecha_activacion || ''}
                onChange={handleChange}
                className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
              />
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
              Actualizar Línea
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para ver detalles de la línea */}
      <Modal
        isOpen={isViewing}
        onClose={handleCancel}
        title="Detalles de la Línea"
        size="lg"
      >
        {currentLinea && (
          <div className="space-y-6">
            {/* Información principal */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    ID de Línea
                  </label>
                  <p className="text-xl font-medium text-gray-900">{currentLinea.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Número
                  </label>
                  <p className="text-xl font-medium text-gray-900">{currentLinea.numero}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Estado
                  </label>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    currentLinea.estado === 'activa' ? 'bg-green-100 text-green-800' :
                    currentLinea.estado === 'suspendida' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {currentLinea.estado}
                  </span>
                </div>
              </div>
            </div>

            {/* Información de relaciones */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Información de Asignación</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Usuario
                  </label>
                  <p className="text-base text-gray-700">
                    {currentLinea.usuario_nombre || (
                      <span className="text-gray-400 italic">No asignado</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Empresa
                  </label>
                  <p className="text-base text-gray-700">
                    {currentLinea.empresa_nombre || (
                      <span className="text-gray-400 italic">No asignada</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Plan
                  </label>
                  <p className="text-base text-gray-700">
                    {currentLinea.plan_nombre || (
                      <span className="text-gray-400 italic">No asignado</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Información de fechas */}
            <div className="bg-purple-50 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Información de Fechas</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Fecha de Activación
                  </label>
                  <p className="text-base text-gray-700">
                    {currentLinea.fecha_activacion ? new Date(currentLinea.fecha_activacion).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : (
                      <span className="text-gray-400 italic">No especificada</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Fecha de Creación
                  </label>
                  <p className="text-base text-gray-700">
                    {new Date(currentLinea.created_at).toLocaleDateString('es-ES', {
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
                    {new Date(currentLinea.updated_at).toLocaleDateString('es-ES', {
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
                  setTimeout(() => handleEdit(currentLinea.id), 100);
                }}
                className="px-6 py-2 text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-xl font-medium transition-colors"
              >
                Editar Línea
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
        title="Eliminar Línea"
        message={`¿Estás seguro de que quieres eliminar la línea "${currentLinea?.numero}"? Esta acción no se puede deshacer.`}
        type="danger"
      />

      {/* Componente de notificaciones */}
      <ToastComponent />
    </div>
  );
};

export default LineasPage;
