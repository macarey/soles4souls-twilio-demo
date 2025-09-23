import { NextRequest, NextResponse } from 'next/server'
import { mockOrders } from '@/lib/data'

export async function POST(request: NextRequest) {
  try {
    const { order_id } = await request.json()
    
    if (!order_id) {
      return NextResponse.json({ 
        error: 'Order ID is required',
        success: false 
      }, { status: 400 })
    }
    
    // Look up order in our mock data
    const order = mockOrders.find(o => o.id === order_id)
    
    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Order not found',
        order_id
      })
    }
    
    // Return order details
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        total: order.total,
        orderDate: order.orderDate,
        items: order.items.map(item => ({
          name: item.product.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress: order.shippingAddress,
        trackingNumber: `TRK-${order.id}`,
        estimatedDelivery: order.status === 'shipped' ? 'December 25, 2024' : null
      }
    })
    
  } catch (error) {
    console.error('Error looking up order:', error)
    return NextResponse.json({ 
      error: 'Failed to look up order',
      success: false 
    }, { status: 500 })
  }
}
