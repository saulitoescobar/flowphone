import React, { useState } from 'react';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import FormSection from '../components/FormSection';
import { motion } from 'framer-motion';

const GenericSectionPage = ({ title, columns, mockData, formFields }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({});

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(false);
    setFormData({});
  };

  const handleEdit = (id) => {
    setIsEditing(true);
    setIsAdding(false);
    setCurrentId(id);
    setFormData(mockData.find(item => item.id === id) || {});
  };

  const handleView = (id) => {
    alert(`Ver detalles de ${title.slice(0, -1)} con ID: ${id}`);
    // Aquí podrías implementar una vista de detalles más elaborada
  };

  const handleDelete = (id) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar este ${title.slice(0, -1)}?`)) {
      alert(`Eliminando ${title.slice(0, -1)} con ID: ${id}`);
      // Lógica para eliminar el elemento
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (isAdding) {
      alert(`Guardando nuevo ${title.slice(0, -1)}: ${JSON.stringify(formData)}`);
      // Lógica para añadir nuevo elemento
    } else if (isEditing) {
      alert(`Actualizando ${title.slice(0, -1)} con ID ${currentId}: ${JSON.stringify(formData)}`);
      // Lógica para actualizar elemento existente
    }
    setIsAdding(false);
    setIsEditing(false);
    setFormData({});
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex-1 p-8">
      <Header title={title} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {!isAdding && !isEditing ? (
          <DataTable
            title={`Listado de ${title}`}
            data={mockData}
            columns={columns}
            onAdd={handleAdd}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <FormSection
            title={isAdding ? `Añadir Nuevo ${title.slice(0, -1)}` : `Editar ${title.slice(0, -1)}`}
            onSave={handleSave}
            onCancel={handleCancel}
          >
            {formFields.map((field) => (
              <div key={field.name} className="mb-4">
                <label htmlFor={field.name} className="block text-gray-700 text-sm font-bold mb-2">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                  placeholder={field.placeholder}
                  required={field.required}
                />
              </div>
            ))}
          </FormSection>
        )}
      </motion.div>
    </div>
  );
};

export default GenericSectionPage;