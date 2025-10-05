import { NextRequest, NextResponse } from 'next/server'
import { mockOrders } from '@/lib/data'

export async function POST(request: NextRequest) {
  try {
    const { donation_id } = await request.json()
    
    if (!donation_id) {
      return NextResponse.json({ 
        error: 'Donation ID is required',
        success: false 
      }, { status: 400 })
    }
    
    // Look up donation in our mock data
    const donation = mockOrders.find(d => d.id === donation_id)
    
    if (!donation) {
      return NextResponse.json({
        success: false,
        error: 'Donation not found',
        donation_id
      })
    }
    
    // Return donation details with impact information
    return NextResponse.json({
      success: true,
      donation: {
        id: donation.id,
        status: donation.status,
        items: donation.items.map(item => ({
          name: item.product.name,
          category: item.product.category,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        })),
        donationDate: donation.orderDate,
        dropOffLocation: donation.shippingAddress,
        impact: {
          familiesHelped: donation.items.reduce((sum, item) => sum + item.quantity, 0),
          program: donation.items[0].product.category === 'casual' ? '4EveryKid' : '4Relief',
          estimatedLivesImpacted: donation.items.reduce((sum, item) => sum + item.quantity, 0) * 3
        }
      }
    })
    
  } catch (error) {
    console.error('Error looking up donation:', error)
    return NextResponse.json({ 
      error: 'Failed to look up donation',
      success: false 
    }, { status: 500 })
  }
}
