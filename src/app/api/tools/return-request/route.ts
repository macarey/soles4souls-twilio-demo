import { NextRequest, NextResponse } from 'next/server'
import { mockOrders } from '@/lib/data'

export async function POST(request: NextRequest) {
  try {
    const { order_id, reason } = await request.json()
    
    if (!order_id || !reason) {
      return NextResponse.json({ 
        error: 'Order ID and reason are required',
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
    
    // Check if order is eligible for return (within 30 days)
    const orderDate = new Date(order.orderDate)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    if (orderDate < thirtyDaysAgo) {
      return NextResponse.json({
        success: false,
        error: 'Order is outside the 30-day return window',
        order_id,
        orderDate: order.orderDate
      })
    }
    
    // Generate return label and process return
    const returnId = `RET-${order_id}-${Date.now()}`
    
    return NextResponse.json({
      success: true,
      return: {
        returnId,
        orderId: order_id,
        reason,
        status: 'approved',
        returnLabel: `https://levelpathshoes.com/return-labels/${returnId}`,
        instructions: [
          '1. Print the return label',
          '2. Package items in original packaging',
          '3. Attach return label to package',
          '4. Drop off at any UPS location',
          '5. Refund will be processed within 5-7 business days'
        ],
        refundAmount: order.total,
        refundMethod: 'Original payment method'
      }
    })
    
  } catch (error) {
    console.error('Error processing return:', error)
    return NextResponse.json({ 
      error: 'Failed to process return',
      success: false 
    }, { status: 500 })
  }
}
