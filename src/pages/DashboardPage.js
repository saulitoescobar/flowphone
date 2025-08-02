import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import { Users, Phone, Building, Briefcase, Settings, TrendingUp, TrendingDown, Activity, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import ApiService from '../services/ApiService';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    usuarios: 0,
    empresas: 0,
    lineas: 0,
    planes: 0,
    proveedores: 0,
    lineasActivas: 0,
    lineasInactivas: 0,
    lineasPorRenovar: 0,
    lineasVencidas: 0
  });
  
  const [renovaciones, setRenovaciones] = useState({
    proximos7Dias: 0,
    proximos30Dias: 0,
    vencidas: 0
  });
  
  const [lineasProximas, setLineasProximas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log('📊 Cargando datos del dashboard...');
      
      // Cargar estadísticas generales
      const statsData = await ApiService.get('/dashboard/stats');
      setStats(statsData);
      
      // Cargar resumen de renovaciones
      const renovacionesData = await ApiService.get('/dashboard/renovaciones');
      setRenovaciones(renovacionesData);
      
      // Cargar líneas próximas a renovarse (próximos 30 días)
      const lineasData = await ApiService.get('/lineas/renovaciones?dias=30');
      setLineasProximas(lineasData);
      
      console.log('📊 Datos cargados:', { stats: statsData, renovaciones: renovacionesData, lineas: lineasData.length });
      setError(null);
    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      setError('Error cargando información del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      name: 'Usuarios', 
      value: stats.usuarios, 
      icon: Users, 
      color: 'from-blue-500 to-blue-600',
      description: 'Usuarios registrados'
    },
    { 
      name: 'Líneas', 
      value: stats.lineas, 
      icon: Phone, 
      color: 'from-green-500 to-green-600',
      description: 'Total de líneas'
    },
    { 
      name: 'Empresas', 
      value: stats.empresas, 
      icon: Building, 
      color: 'from-purple-500 to-purple-600',
      description: 'Empresas cliente'
    },
    { 
      name: 'Proveedores', 
      value: stats.proveedores, 
      icon: Briefcase, 
      color: 'from-orange-500 to-orange-600',
      description: 'Proveedores activos'
    },
    { 
      name: 'Planes', 
      value: stats.planes, 
      icon: Settings, 
      color: 'from-red-500 to-red-600',
      description: 'Planes disponibles'
    },
  ];

  const statusCards = [
    {
      name: 'Líneas Activas',
      value: stats.lineasActivas,
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      description: 'Líneas en servicio'
    },
    {
      name: 'Líneas Inactivas',
      value: stats.lineasInactivas,
      icon: TrendingDown,
      color: 'from-slate-500 to-slate-600',
      description: 'Líneas suspendidas'
    }
  ];

  const renovacionCards = [
    {
      name: 'Próximas 7 días',
      value: renovaciones.proximos7Dias,
      icon: AlertTriangle,
      color: 'from-yellow-500 to-orange-500',
      description: 'Renovaciones urgentes'
    },
    {
      name: 'Próximos 30 días',
      value: renovaciones.proximos30Dias,
      icon: Clock,
      color: 'from-blue-500 to-indigo-500',
      description: 'Renovaciones próximas'
    },
    {
      name: 'Vencidas',
      value: renovaciones.vencidas,
      icon: TrendingDown,
      color: 'from-red-500 to-red-600',
      description: 'Requieren atención'
    }
  ];

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <Header title="Dashboard" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando estadísticas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8">
        <Header title="Dashboard" />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p>{error}</p>
          <button 
            onClick={loadDashboardData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <Header title="Dashboard" />
      
      {/* Estadísticas principales */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.name}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">{stat.name}</p>
                  <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
                  <p className="text-white/70 text-xs mt-1">{stat.description}</p>
                </div>
                <IconComponent className="h-8 w-8 text-white/80" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Estado de líneas */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {statusCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.name}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.7, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">{stat.name}</p>
                  <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
                  <p className="text-white/70 text-xs mt-1">{stat.description}</p>
                </div>
                <IconComponent className="h-8 w-8 text-white/80" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Renovaciones */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        {renovacionCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.name}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.9, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">{stat.name}</p>
                  <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
                  <p className="text-white/70 text-xs mt-1">{stat.description}</p>
                </div>
                <IconComponent className="h-8 w-8 text-white/80" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Lista de líneas próximas a renovar */}
      {lineasProximas.length > 0 && (
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <Clock className="h-6 w-6 text-orange-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Líneas Próximas a Renovar</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Número</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Usuario</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Empresa</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Fecha Renovación</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Días Restantes</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Estado</th>
                </tr>
              </thead>
              <tbody>
                {lineasProximas.slice(0, 10).map((linea) => (
                  <tr key={linea.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 font-medium">{linea.numero}</td>
                    <td className="py-2 px-3">{linea.usuario_nombre || 'Sin asignar'}</td>
                    <td className="py-2 px-3">{linea.empresa_nombre || 'Sin empresa'}</td>
                    <td className="py-2 px-3">{new Date(linea.fecha_renovacion).toLocaleDateString()}</td>
                    <td className="py-2 px-3">
                      <span className={`font-medium ${
                        linea.dias_para_renovacion < 0 ? 'text-red-600' : 
                        linea.dias_para_renovacion <= 7 ? 'text-orange-600' : 'text-blue-600'
                      }`}>
                        {linea.dias_para_renovacion < 0 ? 
                          `${Math.abs(linea.dias_para_renovacion)} días vencida` :
                          `${linea.dias_para_renovacion} días`
                        }
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        linea.estado_renovacion === 'vencida' ? 'bg-red-100 text-red-700' :
                        linea.estado_renovacion === 'urgente' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {linea.estado_renovacion === 'vencida' ? 'Vencida' :
                         linea.estado_renovacion === 'urgente' ? 'Urgente' : 'Próxima'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {lineasProximas.length > 10 && (
              <div className="mt-4 text-center">
                <p className="text-gray-600 text-sm">
                  Mostrando 10 de {lineasProximas.length} líneas próximas a renovar
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Información adicional */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="flex items-center mb-4">
          <Activity className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Estado del Sistema</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Total de entidades:</span>
            <span className="font-semibold text-gray-800">
              {stats.usuarios + stats.empresas + stats.lineas + stats.planes + stats.proveedores}
            </span>
          </div>
          <div className="flex justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-gray-600">Líneas activas:</span>
            <span className="font-semibold text-green-600">{stats.lineasActivas}</span>
          </div>
          <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
            <span className="text-gray-600">Eficiencia:</span>
            <span className="font-semibold text-blue-600">
              {stats.lineas > 0 ? Math.round((stats.lineasActivas / stats.lineas) * 100) : 0}%
            </span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Datos en tiempo real:</strong> Las estadísticas se actualizan automáticamente desde la base de datos.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;