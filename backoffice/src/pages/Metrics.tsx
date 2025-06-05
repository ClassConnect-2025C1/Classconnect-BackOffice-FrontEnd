import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  Users, 
  UserX, 
  Shield, 
  Coffee, 
  Headphones, 
  Cat,
  TrendingUp,
  Activity,
  BarChart3
} from 'lucide-react';
import { Flex } from '@chakra-ui/react';

const MetricsDashboard = () => {
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Datos de métricas
  const metricsData = [
    { name: 'Usuarios Registrados', value: 1287, icon: Users, color: '#3B82F6', trend: '+12%' },
    { name: 'Usuarios Bloqueados', value: 34, icon: UserX, color: '#EF4444', trend: '-8%' },
    { name: 'Admins Activos', value: 5, icon: Shield, color: '#10B981', trend: '+0%' },
    { name: 'Tazas de Café', value: 9821, icon: Coffee, color: '#F59E0B', trend: '+23%' },
    { name: 'Tickets Resueltos', value: 412, icon: Headphones, color: '#8B5CF6', trend: '+15%' },
    { name: 'Gatos en Reuniones', value: 17, icon: Cat, color: '#EC4899', trend: '+41%' }
  ];

  // Datos para gráfico de barras
  const barData = metricsData.map(metric => ({
    name: metric.name.split(' ')[0],
    valor: metric.value,
    color: metric.color
  }));

  
  // Datos para gráfico circular
  const pieData = [
    { name: 'Usuarios Activos', value: 1287 - 34, fill: '#3B82F6' },
    { name: 'Usuarios Bloqueados', value: 34, fill: '#EF4444' }
  ];

  // Datos para gráfico de línea temporal
  const timeData = [
    { mes: 'Ene', usuarios: 1100, tickets: 380, cafe: 8200 },
    { mes: 'Feb', usuarios: 1150, tickets: 395, cafe: 8900 },
    { mes: 'Mar', usuarios: 1200, tickets: 405, cafe: 9300 },
    { mes: 'Abr', usuarios: 1250, tickets: 410, cafe: 9600 },
    { mes: 'May', usuarios: 1287, tickets: 412, cafe: 9821 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
  <Flex minH="100vh" w="100vw" align="center" justify="center" bg="gray.100">
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📊 Dashboard de Métricas
          </h1>
          <p className="text-gray-600">Panel de control administrativo - Últimos 30 días</p>
        </div>

        {/* Métricas Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-8">
          {metricsData.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4"
                style={{ borderLeftColor: metric.color }}
                onClick={() => setSelectedMetric(metric.name)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${metric.color}20` }}
                  >
                    <IconComponent 
                      size={24} 
                      style={{ color: metric.color }}
                    />
                  </div>
                  <span 
                    className="text-sm font-semibold px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: metric.trend.includes('+') ? '#10B98120' : '#EF444420',
                      color: metric.trend.includes('+') ? '#10B981' : '#EF4444'
                    }}
                  >
                    {metric.trend}
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{metric.name}</h3>
                <p className="text-3xl font-bold text-gray-800">{metric.value.toLocaleString()}</p>
              </div>
            );
          })}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Gráfico de Barras */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <BarChart3 className="mr-2 text-blue-600" size={20} />
              <h2 className="text-xl font-semibold text-gray-800">Distribución de Métricas</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#666' }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#666' }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="valor" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                >
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico Circular */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Activity className="mr-2 text-green-600" size={20} />
              <h2 className="text-xl font-semibold text-gray-800">Estado de Usuarios</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Tendencias */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="mr-2 text-purple-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-800">Tendencias Mensuales</h2>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="mes" 
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="usuarios" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                name="Usuarios"
              />
              <Line 
                type="monotone" 
                dataKey="tickets" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                name="Tickets"
              />
              <Line 
                type="monotone" 
                dataKey="cafe" 
                stroke="#F59E0B" 
                strokeWidth={3}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                name="Café"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Última actualización: {new Date().toLocaleDateString('es-ES')} • Dashboard v2.0</p>
        </div>
      </div>
    </div>
    </Flex>
  );
};

export default MetricsDashboard;