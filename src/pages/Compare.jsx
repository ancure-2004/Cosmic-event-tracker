import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNEO } from '../contexts/NeoContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { ArrowLeft, BarChart3, Zap, Target, Ruler, Calendar, AlertTriangle, TrendingUp, Star, Globe } from 'lucide-react'

const ComparePage = () => {
  const navigate = useNavigate()
  const { selectedNEOs, clearSelectedNEOs } = useNEO()

  // Prepare data for charts
  const chartData = useMemo(() => {
    return selectedNEOs.map((neo, index) => {
      const closeApproach = neo.close_approach_data?.[0] || {}
      const diameter = neo.estimated_diameter?.kilometers || {}
      const avgDiameter = ((diameter.estimated_diameter_min || 0) + (diameter.estimated_diameter_max || 0)) / 2
      return {
        id: neo.id,
        name: neo.name?.replace(/[()]/g, '').substring(0, 20) + '...' || `NEO ${index + 1}`,
        shortName: `NEO ${index + 1}`,
        diameter: avgDiameter,
        diameter_km: avgDiameter * 1000,
        velocity: parseFloat(closeApproach.relative_velocity?.kilometers_per_hour || 0),
        distance: parseFloat(closeApproach.miss_distance?.kilometers || 0),
        distance_millions: parseFloat(closeApproach.miss_distance?.kilometers || 0) / 1000000,
        lunar_distance: parseFloat(closeApproach.miss_distance?.lunar || 0),
        hazardous: neo.is_potentially_hazardous_asteroid ? 1 : 0,
        approach_date: closeApproach.close_approach_date,
        approach_timestamp: closeApproach.close_approach_date ? new Date(closeApproach.close_approach_date).getTime() : 0
      }
    })
  }, [selectedNEOs])

  // Radar chart data
  const radarData = useMemo(() => {
    if (selectedNEOs.length === 0) return []
    
    const maxValues = chartData.reduce((max, neo) => ({
      diameter: Math.max(max.diameter, neo.diameter),
      velocity: Math.max(max.velocity, neo.velocity),
      distance: Math.max(max.distance_millions, neo.distance_millions),
      lunar: Math.max(max.lunar, neo.lunar_distance)
    }), { diameter: 0, velocity: 0, distance: 0, lunar: 0 })

    return chartData.map(neo => ({
      name: neo.shortName,
      diameter: maxValues.diameter > 0 ? (neo.diameter / maxValues.diameter) * 100 : 0,
      velocity: maxValues.velocity > 0 ? (neo.velocity / maxValues.velocity) * 100 : 0,
      distance: maxValues.distance > 0 ? (neo.distance_millions / maxValues.distance) * 100 : 0,
      lunar_distance: maxValues.lunar > 0 ? (neo.lunar_distance / maxValues.lunar) * 100 : 0
    }))
  }, [chartData])

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-lg">
          <p className="font-semibold text-white mb-1">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(Math.round(num))
  }

  if (selectedNEOs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cosmic-black via-slate-900 to-cosmic-black">
        <div className="max-w-4xl mx-auto p-6 relative z-10">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span className="text-white">Back</span>
            </button>
          </div>
          
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 text-center">
            <div className="mb-6">
              <BarChart3 size={64} className="mx-auto text-blue-400 mb-4" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">No NEOs Selected</h2>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Select at least one Near-Earth Object to compare their cosmic characteristics and orbital patterns.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-all transform hover:scale-105 font-semibold shadow-lg shadow-blue-600/25"
            >
              Explore Cosmic Objects
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cosmic-black via-slate-900 to-cosmic-black">
      <div className="max-w-7xl mx-auto p-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-col gap-2 items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors mr-6 mb-5"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span className="text-white">Back</span>
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Cosmic Object Analysis
              </h1>
              <p className="text-gray-300">
                Comparing {selectedNEOs.length} Near-Earth Objects
              </p>
            </div>
          </div>
          <button
            onClick={clearSelectedNEOs}
            className="bg-red-600/80 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-all backdrop-blur-sm border border-red-500/30"
          >
            Clear Selection
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-600/20 rounded-xl mr-4">
                <Target className="text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Objects Tracked</p>
                <p className="text-2xl font-bold text-white">{selectedNEOs.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-600/20 rounded-xl mr-4">
                <AlertTriangle className="text-red-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Potentially Hazardous</p>
                <p className="text-2xl font-bold text-white">
                  {selectedNEOs.filter(neo => neo.is_potentially_hazardous_asteroid).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-600/20 rounded-xl mr-4">
                <Ruler className="text-green-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Max Diameter (km)</p>
                <p className="text-2xl font-bold text-white">
                  {Math.max(...chartData.map(d => d.diameter)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-600/20 rounded-xl mr-4">
                <Zap className="text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Max Velocity (km/h)</p>
                <p className="text-2xl font-bold text-white">
                  {formatNumber(Math.max(...chartData.map(d => d.velocity)))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Diameter Comparison */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Ruler className="mr-3 text-blue-400" size={20} />
              Diameter Analysis (km)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="shortName" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="diameter" fill="#60A5FA" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Velocity Comparison */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Zap className="mr-3 text-purple-400" size={20} />
              Velocity Analysis (km/h)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="shortName" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="velocity" fill="#A78BFA" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Distance Comparison */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Globe className="mr-3 text-orange-400" size={20} />
              Miss Distance (Million km)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="shortName" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="distance_millions" fill="#FB923C" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart - Overall Comparison */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <TrendingUp className="mr-3 text-green-400" size={20} />
              Multi-dimensional Overview
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="name" stroke="#9CA3AF" />
                <PolarRadiusAxis domain={[0, 100]} tick={false} stroke="#6B7280" />
                {chartData.map((_, index) => (
                  <Radar
                    key={index}
                    name={`NEO ${index + 1}`}
                    dataKey={`diameter`}
                    stroke={`hsl(${(index * 360) / chartData.length}, 70%, 60%)`}
                    fill={`hsl(${(index * 360) / chartData.length}, 70%, 60%)`}
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                ))}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Approach Timeline */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-10">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Calendar className="mr-3 text-cyan-400" size={20} />
            Approach Timeline
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.sort((a, b) => a.approach_timestamp - b.approach_timestamp)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="approach_date"
                tickFormatter={formatDate}
                stroke="#9CA3AF"
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-lg">
                        <p className="font-semibold text-white mb-1">{formatDate(label)}</p>
                        <p style={{ color: payload[0].color }} className="text-sm">
                          Distance: {payload[0].value.toFixed(2)} million km
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line 
                type="monotone" 
                dataKey="distance_millions" 
                stroke="#06B6D4" 
                strokeWidth={3}
                dot={{ fill: '#06B6D4', strokeWidth: 2, r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Comparison Table */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <BarChart3 className="mr-3 text-blue-400" size={20} />
            Detailed Comparison Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 text-gray-300 font-semibold">Object Name</th>
                  <th className="text-left py-3 text-gray-300 font-semibold">Diameter (km)</th>
                  <th className="text-left py-3 text-gray-300 font-semibold">Velocity (km/h)</th>
                  <th className="text-left py-3 text-gray-300 font-semibold">Distance (M km)</th>
                  <th className="text-left py-3 text-gray-300 font-semibold">Lunar Distance</th>
                  <th className="text-left py-3 text-gray-300 font-semibold">Approach Date</th>
                  <th className="text-left py-3 text-gray-300 font-semibold">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((neo, index) => (
                  <tr key={neo.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 font-medium text-white">{neo.name}</td>
                    <td className="py-4 text-gray-300">{neo.diameter.toFixed(3)}</td>
                    <td className="py-4 text-gray-300">{formatNumber(neo.velocity)}</td>
                    <td className="py-4 text-gray-300">{neo.distance_millions.toFixed(2)}</td>
                    <td className="py-4 text-gray-300">{neo.lunar_distance.toFixed(2)}</td>
                    <td className="py-4 text-gray-300">{formatDate(neo.approach_date)}</td>
                    <td className="py-4">
                      {neo.hazardous ? (
                        <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-xs font-semibold border border-red-500/30">
                          HIGH RISK
                        </span>
                      ) : (
                        <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold border border-green-500/30">
                          LOW RISK
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparePage