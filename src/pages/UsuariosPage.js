import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmpresaSelector from '../components/EmpresaSelector';
import { useToast } from '../components/Toast';
import { motion } from 'framer-motion';
import { UsuarioService } from '../services';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [refreshKey, setRefreshKey] = useState(0); // Para forzar re-renders
  
  // Hook para las notificaciones
  const { showToast, ToastComponent } = useToast();

  // Configuración de columnas para la tabla
  const columns = [
    { key: '#', label: '#' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'linea', label: 'Línea' },
    { key: 'plan', label: 'Plan' },
    { key: 'empresa_nombre', label: 'Empresa' }
  ];

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando usuarios...');
      const data = await UsuarioService.getAll();
      console.log('✅ Usuarios recibidos:', data);
      
      // Agregar números ordinales a los usuarios
      const usuariosConNumeros = data.map((usuario, index) => ({
        ...usuario,
        '#': index + 1
      }));
      
      setUsuarios([...usuariosConNumeros]); // Crear una nueva referencia del array
      setRefreshKey(prev => prev + 1); // Forzar re-render
      setError(null);
      console.log('📊 Estado de usuarios actualizado:', usuariosConNumeros.length, 'usuarios');
    } catch (err) {
      console.error('❌ Error al cargar usuarios:', err);
      setError('Error al cargar usuarios: ' + err.message);
      console.error('Error loading usuarios:', err);
    } finally {
      setLoading(false);
      console.log('✅ Carga de usuarios completada');
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
    const usuario = usuarios.find(item => item.id === id);
    setFormData(usuario || {});
  };

  const handleView = (id) => {
    const usuario = usuarios.find(item => item.id === id);
    setCurrentUser(usuario);
    setIsViewing(true);
  };

  const handleDelete = (id) => {
    const usuario = usuarios.find(item => item.id === id);
    setCurrentUser(usuario);
    setCurrentId(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await UsuarioService.delete(currentId);
      await loadUsuarios(); // Recargar la lista
      showToast('Usuario eliminado correctamente', 'success');
    } catch (err) {
      showToast('Error al eliminar usuario: ' + err.message, 'error');
    }
  };

  const handleSave = async (data) => {
    try {
      console.log('💾 Datos recibidos en handleSave:', data);
      
      // Limpiar los datos para enviar a la API con la estructura correcta
      const cleanData = {
        nombre: data.nombre,
        email: data.email,
        linea: data.linea,
        plan: data.plan,
        empresa_id: data.empresa_id
      };

      console.log('🧹 Datos limpiados:', cleanData);

      if (isAdding) {
        console.log('➕ Creando usuario...');
        const result = await UsuarioService.create(cleanData);
        console.log('✅ Usuario creado:', result);
        showToast('Usuario creado correctamente', 'success');
      } else {
        console.log('✏️ Actualizando usuario con ID:', currentId);
        const result = await UsuarioService.update(currentId, cleanData);
        console.log('✅ Usuario actualizado:', result);
        showToast('Usuario actualizado correctamente', 'success');
      }
      
      console.log('🔄 Recargando lista de usuarios...');
      await loadUsuarios(); // Recargar la lista
      console.log('🚪 Cerrando formulario...');
      handleCancel(); // Cerrar el formulario
    } catch (err) {
      console.error('❌ Error en handleSave:', err);
      showToast('Error al guardar usuario: ' + err.message, 'error');
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setIsViewing(false);
    setCurrentId(null);
    setCurrentUser(null);
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
          <div className="text-xl text-gray-600">Cargando usuarios...</div>
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
            onClick={loadUsuarios}
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
          key={`usuarios-table-${refreshKey}`}
          title="Listado de Usuarios"
          data={usuarios}
          columns={columns}
          onAdd={handleAdd}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          error={error}
          onRetry={loadUsuarios}
        />
      </motion.div>

      {/* Modal para agregar usuario */}
      <Modal
        isOpen={isAdding}
        onClose={handleCancel}
        title="Añadir Nuevo Usuario"
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-4">
              <div>
                <label htmlFor="add-nombre" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="add-nombre"
                  name="nombre"
                  value={formData.nombre || ''}
                  onChange={handleChange}
                  className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="Ingresa el nombre completo"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="add-email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  id="add-email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="usuario@email.com"
                  required
                />
              </div>
            </div>
            
            {/* Columna derecha */}
            <div className="space-y-4">
              <div>
                <label htmlFor="add-linea" className="block text-sm font-semibold text-gray-700 mb-2">
                  Línea Telefónica *
                </label>
                <input
                  type="tel"
                  id="add-linea"
                  name="linea"
                  value={formData.linea || ''}
                  onChange={handleChange}
                  className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="555-0000"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="add-plan" className="block text-sm font-semibold text-gray-700 mb-2">
                  Plan
                </label>
                <select
                  id="add-plan"
                  name="plan"
                  value={formData.plan || ''}
                  onChange={handleChange}
                  className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Seleccionar plan...</option>
                  <option value="Básico">Básico</option>
                  <option value="Premium">Premium</option>
                  <option value="Empresarial">Empresarial</option>
                  <option value="Corporativo">Corporativo</option>
                  <option value="Plan 1">Plan 1</option>
                  <option value="Plan 2">Plan 2</option>
                  <option value="Plan 3">Plan 3</option>
                  <option value="Plan 4">Plan 4</option>
                  <option value="Plan 5">Plan 5</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="add-empresa" className="block text-sm font-semibold text-gray-700 mb-2">
                  Empresa *
                </label>
                <EmpresaSelector
                  value={formData.empresa_nombre || ''}
                  onChange={(nombre, empresa_id) => setFormData(prev => ({ 
                    ...prev, 
                    empresa_nombre: nombre,
                    empresa_id: empresa_id 
                  }))}
                  placeholder="Seleccionar empresa..."
                />
              </div>
            </div>
          </div>
          
          {/* Nota informativa */}
          <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              <span className="font-medium">Nuevo Usuario:</span> Los campos marcados con asterisco (*) son obligatorios.
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
              Crear Usuario
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para editar usuario */}
      <Modal
        isOpen={isEditing}
        onClose={handleCancel}
        title="Editar Usuario"
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-nombre" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="edit-nombre"
                  name="nombre"
                  value={formData.nombre || ''}
                  onChange={handleChange}
                  className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="Ingresa el nombre completo"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="usuario@email.com"
                  required
                />
              </div>
            </div>
            
            {/* Columna derecha */}
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-linea" className="block text-sm font-semibold text-gray-700 mb-2">
                  Línea Telefónica *
                </label>
                <input
                  type="tel"
                  id="edit-linea"
                  name="linea"
                  value={formData.linea || ''}
                  onChange={handleChange}
                  className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="555-0000"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-plan" className="block text-sm font-semibold text-gray-700 mb-2">
                  Plan
                </label>
                <select
                  id="edit-plan"
                  name="plan"
                  value={formData.plan || ''}
                  onChange={handleChange}
                  className="shadow-sm border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Seleccionar plan...</option>
                  <option value="Básico">Básico</option>
                  <option value="Premium">Premium</option>
                  <option value="Empresarial">Empresarial</option>
                  <option value="Corporativo">Corporativo</option>
                  <option value="Plan 1">Plan 1</option>
                  <option value="Plan 2">Plan 2</option>
                  <option value="Plan 3">Plan 3</option>
                  <option value="Plan 4">Plan 4</option>
                  <option value="Plan 5">Plan 5</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="edit-empresa" className="block text-sm font-semibold text-gray-700 mb-2">
                  Empresa *
                </label>
                <EmpresaSelector
                  value={formData.empresa_nombre || ''}
                  onChange={(nombre, empresa_id) => setFormData(prev => ({ 
                    ...prev, 
                    empresa_nombre: nombre,
                    empresa_id: empresa_id 
                  }))}
                  placeholder="Seleccionar empresa..."
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
              Actualizar Usuario
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para ver detalles del usuario */}
      <Modal
        isOpen={isViewing}
        onClose={handleCancel}
        title="Detalles del Usuario"
        size="lg"
      >
        {currentUser && (
          <div className="space-y-6">
            {/* Información principal */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      ID de Usuario
                    </label>
                    <p className="text-xl font-medium text-gray-900">{currentUser.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Nombre Completo
                    </label>
                    <p className="text-xl font-medium text-gray-900">{currentUser.nombre}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Correo Electrónico
                    </label>
                    <p className="text-lg text-blue-600 break-all">{currentUser.email}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Línea Telefónica
                    </label>
                    <p className="text-lg text-gray-900">
                      {currentUser.linea || (
                        <span className="text-gray-400 italic">No especificado</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Plan
                    </label>
                    <p className="text-lg text-gray-900">
                      {currentUser.plan || (
                        <span className="text-gray-400 italic">No especificado</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Empresa
                    </label>
                    <p className="text-lg text-gray-900">
                      {currentUser.empresa_nombre || (
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
                    {new Date(currentUser.created_at).toLocaleString('es-ES', {
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
                    {new Date(currentUser.updated_at).toLocaleString('es-ES', {
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
                  setTimeout(() => handleEdit(currentUser.id), 100);
                }}
                className="px-6 py-2 text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-xl font-medium transition-colors"
              >
                Editar Usuario
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
        title="Eliminar Usuario"
        message={`¿Estás seguro de que quieres eliminar al usuario "${currentUser?.nombre}"? Esta acción no se puede deshacer.`}
        type="danger"
      />

      {/* Componente de notificaciones */}
      <ToastComponent />
    </div>
  );
};

export default UsuariosPage;
