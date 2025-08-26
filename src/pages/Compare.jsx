import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNEO } from '../contexts/NeoContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { ArrowLeft, BarChart3, Zap, Target, Ruler, Calendar, AlertTriangle, TrendingUp } from 'lucide-react'

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
        diameter_km: avgDiameter * 1000, // for better visualization when values are small
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
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No NEOs Selected</h2>
            <p className="text-gray-600 mb-6">
              Select at least one Near-Earth Object to compare their characteristics.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Browse NEOs
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mr-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              NEO Comparison ({selectedNEOs.length} objects)
            </h1>
          </div>
          <button
            onClick={clearSelectedNEOs}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Clear Selection
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Target className="text-blue-600 mr-3" size={24} />
              <div>
                <p className="text-sm text-gray-600">Objects</p>
                <p className="text-2xl font-bold text-gray-800">{selectedNEOs.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <AlertTriangle className="text-red-600 mr-3" size={24} />
              <div>
                <p className="text-sm text-gray-600">Hazardous</p>
                <p className="text-2xl font-bold text-gray-800">
                  {selectedNEOs.filter(neo => neo.is_potentially_hazardous_asteroid).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Ruler className="text-green-600 mr-3" size={24} />
              <div>
                <p className="text-sm text-gray-600">Max Diameter (km)</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.max(...chartData.map(d => d.diameter)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Zap className="text-purple-600 mr-3" size={24} />
              <div>
                <p className="text-sm text-gray-600">Max Velocity (km/h)</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatNumber(Math.max(...chartData.map(d => d.velocity)))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Diameter Comparison */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Ruler className="mr-2" size={20} />
              Diameter Comparison (km)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shortName" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="diameter" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Velocity Comparison */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Zap className="mr-2" size={20} />
              Velocity Comparison (km/h)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shortName" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="velocity" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Distance Comparison */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Target className="mr-2" size={20} />
              Miss Distance (Million km)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shortName" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="distance_millions" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart - Overall Comparison */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="mr-2" size={20} />
              Multi-dimensional Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis domain={[0, 100]} tick={false} />
                {chartData.map((_, index) => (
                  <Radar
                    key={index}
                    name={`NEO ${index + 1}`}
                    dataKey={`diameter`}
                    stroke={`hsl(${(index * 360) / chartData.length}, 70%, 50%)`}
                    fill={`hsl(${(index * 360) / chartData.length}, 70%, 50%)`}
                    fillOpacity={0.2}
                  />
                ))}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Approach Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="mr-2" size={20} />
            Approach Timeline
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.sort((a, b) => a.approach_timestamp - b.approach_timestamp)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="approach_date"
                tickFormatter={formatDate}
              />
              <YAxis />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-4 border rounded-lg shadow-lg">
                        <p className="font-semibold text-gray-800">{formatDate(label)}</p>
                        <p style={{ color: payload[0].color }}>
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
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Comparison Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Detailed Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Diameter (km)</th>
                  <th className="text-left py-2">Velocity (km/h)</th>
                  <th className="text-left py-2">Distance (million km)</th>
                  <th className="text-left py-2">Lunar Distance</th>
                  <th className="text-left py-2">Approach Date</th>
                  <th className="text-left py-2">Hazardous</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((neo, index) => (
                  <tr key={neo.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-medium">{neo.name}</td>
                    <td className="py-2">{neo.diameter.toFixed(3)}</td>
                    <td className="py-2">{formatNumber(neo.velocity)}</td>
                    <td className="py-2">{neo.distance_millions.toFixed(2)}</td>
                    <td className="py-2">{neo.lunar_distance.toFixed(2)}</td>
                    <td className="py-2">{formatDate(neo.approach_date)}</td>
                    <td className="py-2">
                      {neo.hazardous ? (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                          Yes
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          No
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