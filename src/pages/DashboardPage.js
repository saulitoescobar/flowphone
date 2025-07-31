import React from 'react';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import { Users, Phone, Building, Briefcase, Settings } from 'lucide-react';

const DashboardPage = () => {
  const stats = [
    { name: 'Usuarios', value: '1,234', icon: Users, color: 'from-blue-500 to-blue-600' },
    { name: 'Líneas', value: '567', icon: Phone, color: 'from-green-500 to-green-600' },
    { name: 'Proveedores', value: '12', icon: Building, color: 'from-purple-500 to-purple-600' },
    { name: 'Empresas', value: '45', icon: Briefcase, color: 'from-orange-500 to-orange-600' },
    { name: 'Planes', value: '23', icon: Settings, color: 'from-red-500 to-red-600' },
  ];

  return (
    <div className="flex-1 p-8">
      <Header title="Dashboard" />
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg flex items-center justify-between`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.5, duration: 0.4 }}
            whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
          >
            <div>
              <p className="text-lg font-medium opacity-90">{stat.name}</p>
              <h3 className="text-4xl font-bold mt-2">{stat.value}</h3>
            </div>
            <stat.icon className="w-12 h-12 opacity-70" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default DashboardPage;