import { NextRequest, NextResponse } from 'next/server'
import { mockDropOffLocations } from '@/lib/data'

export async function POST(request: NextRequest) {
  try {
    const { city } = await request.json()
    
    // Filter locations based on city parameter
    let filteredLocations = mockDropOffLocations
    
    if (city) {
      filteredLocations = filteredLocations.filter(location => 
        location.address.toLowerCase().includes(city.toLowerCase()) ||
        location.name.toLowerCase().includes(city.toLowerCase())
      )
    }
    
    // If no locations found, return all locations with a helpful message
    if (filteredLocations.length === 0 && city) {
      return NextResponse.json({
        success: true,
        locations: mockDropOffLocations,
        message: `No specific locations found for "${city}". Here are all our available drop-off locations:`
      })
    }
    
    return NextResponse.json({
      success: true,
      locations: filteredLocations.map(location => ({
        id: location.id,
        name: location.name,
        address: location.address,
        hours: location.hours,
        phone: location.phone,
        acceptsItems: location.acceptsItems,
        services: [
          'Donation drop-off',
          'Volunteer opportunities',
          'Shoe drive materials',
          'Impact tours'
        ]
      })),
      donationGuidelines: {
        acceptedItems: [
          'Shoes (all types and sizes)',
          'Clothing (clean and wearable)',
          'Accessories (belts, bags, etc.)'
        ],
        notAccepted: [
          'Damaged or heavily worn items',
          'Items with holes or tears',
          'Wet or soiled clothing'
        ],
        preparation: [
          'Clean items before donating',
          'Tie shoe laces together',
          'Pack items in bags or boxes',
          'Include a note with your contact info for impact updates'
        ]
      },
      shippingOption: {
        available: true,
        description: 'Can\'t drop off in person? We accept shipped donations!',
        address: 'Soles4Souls, 319 Martingale Dr, Old Hickory, TN 37138',
        instructions: 'Include your contact information inside the package for impact updates'
      }
    })
    
  } catch (error) {
    console.error('Error fetching drop-off locations:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch drop-off locations',
      success: false 
    }, { status: 500 })
  }
}
