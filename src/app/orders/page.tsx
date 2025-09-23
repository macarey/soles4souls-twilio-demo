'use client'

import { useState } from 'react'
import { ArrowLeft, Package, Truck, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { mockOrders } from '@/lib/data'

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Package className="h-5 w-5 text-yellow-500" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'shipped':
        return 'text-blue-600 bg-blue-100'
      case 'delivered':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/" className="flex items-center text-gray-600 hover:text-primary-600 mr-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Store
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Your Orders</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {mockOrders.map((order) => (
                  <div key={order.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(order.status)}
                        <div>
                          <h3 className="font-semibold text-lg">Order {order.id}</h3>
                          <p className="text-gray-600 text-sm">
                            Placed on {new Date(order.orderDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold text-lg">${order.total.toFixed(2)}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </div>
                        <button
                          onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          {selectedOrder === order.id ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>
                      
                      {selectedOrder === order.id && (
                        <div className="mt-4 bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>
                                  {item.product.name} (Size {item.size}, {item.color}) × {item.quantity}
                                </span>
                                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress.street}<br />
                              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                              {order.shippingAddress.country}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Status Guide */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Order Status Guide</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-yellow-500" />
                  <div>
                    <div className="font-medium text-gray-900">Pending</div>
                    <div className="text-sm text-gray-600">Order received, processing</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-900">Shipped</div>
                    <div className="text-sm text-gray-600">Order is on its way</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium text-gray-900">Delivered</div>
                    <div className="text-sm text-gray-600">Order has been delivered</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                <h3 className="font-medium text-primary-900 mb-2">Need Help?</h3>
                <p className="text-primary-800 text-sm mb-3">
                  Questions about your order? Our AI assistant can help you track orders, process returns, and answer any questions.
                </p>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Chat with Assistant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
