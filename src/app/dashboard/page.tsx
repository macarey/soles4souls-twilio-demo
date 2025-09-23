'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, TrendingUp, TrendingDown, Users, MessageCircle, Clock, Star } from 'lucide-react'
import Link from 'next/link'

interface MetricCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  color: string
}

function MetricCard({ title, value, change, icon, color }: MetricCardProps) {
  const isPositive = change > 0
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600'
  const changeIcon = isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <div className={`flex items-center ${changeColor}`}>
          {changeIcon}
          <span className="text-sm font-medium ml-1">{Math.abs(change)}%</span>
        </div>
        <span className="text-sm text-gray-500 ml-2">vs last month</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(true)

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const metrics = [
    {
      title: 'Deflection Rate',
      value: '32%',
      change: 8.2,
      icon: <MessageCircle className="h-6 w-6 text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      title: 'Avg Handle Time',
      value: '2.4 min',
      change: -20.5,
      icon: <Clock className="h-6 w-6 text-green-600" />,
      color: 'bg-green-100'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.7/5',
      change: 12.3,
      icon: <Star className="h-6 w-6 text-yellow-600" />,
      color: 'bg-yellow-100'
    },
    {
      title: 'Active Conversations',
      value: '1,247',
      change: 15.8,
      icon: <Users className="h-6 w-6 text-purple-600" />,
      color: 'bg-purple-100'
    }
  ]

  const conversationData = [
    { time: '9:00 AM', total: 45, ai: 32, human: 13 },
    { time: '10:00 AM', total: 67, ai: 48, human: 19 },
    { time: '11:00 AM', total: 89, ai: 62, human: 27 },
    { time: '12:00 PM', total: 78, ai: 55, human: 23 },
    { time: '1:00 PM', total: 92, ai: 68, human: 24 },
    { time: '2:00 PM', total: 85, ai: 59, human: 26 },
    { time: '3:00 PM', total: 73, ai: 51, human: 22 },
    { time: '4:00 PM', total: 68, ai: 47, human: 21 },
    { time: '5:00 PM', total: 55, ai: 38, human: 17 },
  ]

  const topQueries = [
    { query: 'Order status tracking', count: 234, deflection: '89%' },
    { query: 'Return and exchange process', count: 189, deflection: '76%' },
    { query: 'Store hours and location', count: 156, deflection: '95%' },
    { query: 'Shipping information', count: 143, deflection: '82%' },
    { query: 'Size guide and fitting', count: 127, deflection: '71%' },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-gray-600 hover:text-primary-600 mr-4">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Store
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
              <p className="text-gray-600">AI Assistant Performance Metrics</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Conversation Volume */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-6">Conversation Volume (Today)</h2>
            <div className="space-y-4">
              {conversationData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 w-16">{data.time}</span>
                  <div className="flex-1 mx-4">
                    <div className="flex h-8 bg-gray-200 rounded-lg overflow-hidden">
                      <div 
                        className="bg-primary-600 flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(data.ai / data.total) * 100}%` }}
                      >
                        {data.ai}
                      </div>
                      <div 
                        className="bg-gray-400 flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${(data.human / data.total) * 100}%` }}
                      >
                        {data.human}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12">{data.total}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary-600 rounded mr-2"></div>
                <span>AI Handled</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded mr-2"></div>
                <span>Human Escalated</span>
              </div>
            </div>
          </div>

          {/* Top Queries */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-6">Top Customer Queries</h2>
            <div className="space-y-4">
              {topQueries.map((query, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{query.query}</p>
                    <p className="text-sm text-gray-600">{query.count} queries</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-green-600">{query.deflection}</span>
                    <p className="text-xs text-gray-500">deflected</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Success Metrics */}
        <div className="mt-8 card">
          <h2 className="text-lg font-semibold mb-6">90-Day Success Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">30%</div>
              <div className="text-sm text-green-800">Target Deflection Rate</div>
              <div className="text-xs text-green-600 mt-1">✅ Achieved: 32%</div>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">$45K</div>
              <div className="text-sm text-blue-800">Cost Savings</div>
              <div className="text-xs text-blue-600 mt-1">Reduced support costs</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">2.4min</div>
              <div className="text-sm text-purple-800">Avg Response Time</div>
              <div className="text-xs text-purple-600 mt-1">Down from 3.2min</div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8 card">
          <h2 className="text-lg font-semibold mb-6">AI Assistant Recommendations</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-blue-900">Expand Knowledge Base</p>
                <p className="text-sm text-blue-800">Add more FAQ entries for size guide and product specifications to increase deflection rate.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-green-900">Optimize Return Process</p>
                <p className="text-sm text-green-800">Implement automated return label generation to reduce human intervention for returns.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-yellow-900">Peak Hour Scaling</p>
                <p className="text-sm text-yellow-800">Consider adding more AI capacity during 11AM-2PM peak hours to maintain response times.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
