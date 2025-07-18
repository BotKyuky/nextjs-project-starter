'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface ChartData {
  name: string
  views: number
  revenue: number
}

interface AnalyticsChartProps {
  data: ChartData[]
  type?: 'line' | 'bar'
  showRevenue?: boolean
  showViews?: boolean
}

export default function AnalyticsChart({ 
  data, 
  type = 'line', 
  showRevenue = true, 
  showViews = true 
}: AnalyticsChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === 'views' ? 'Views' : 'Revenue'}: {entry.value}
              {entry.dataKey === 'revenue' && '$'}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          {showViews && (
            <Bar 
              dataKey="views" 
              fill="#8B5CF6" 
              radius={[2, 2, 0, 0]}
            />
          )}
          {showRevenue && (
            <Bar 
              dataKey="revenue" 
              fill="#06B6D4" 
              radius={[2, 2, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="name" 
          stroke="#9CA3AF"
          fontSize={12}
        />
        <YAxis 
          stroke="#9CA3AF"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        {showViews && (
          <Line 
            type="monotone" 
            dataKey="views" 
            stroke="#8B5CF6" 
            strokeWidth={3}
            dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
          />
        )}
        {showRevenue && (
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#06B6D4" 
            strokeWidth={3}
            dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#06B6D4', strokeWidth: 2 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
