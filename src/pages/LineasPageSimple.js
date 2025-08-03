import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import { motion } from 'framer-motion';

const LineasPageSimple = () => {
  const [lineas, setLineas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const columns = [
    { key: '#', label: '#' },
    { key: 'numero', label: 'NÚMERO' },
    { key: 'estado', label: 'ESTADO' }
  ];

  const handleAdd = () => {
    console.log('Add clicked');
  };

  const handleEdit = (id) => {
    console.log('Edit clicked', id);
  };

  const handleView = (id) => {
    console.log('View clicked', id);
  };

  const handleDelete = (id) => {
    console.log('Delete clicked', id);
  };

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
          title="Listado de Líneas (Versión Simple)"
          data={lineas}
          columns={columns}
          onAdd={handleAdd}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          error={error}
        />
      </motion.div>
    </div>
  );
};

export default LineasPageSimple;
