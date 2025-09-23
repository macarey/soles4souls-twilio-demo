import { NextRequest, NextResponse } from 'next/server'
import { storeInfo } from '@/lib/data'

export async function POST(request: NextRequest) {
  try {
    // Return store hours and location information
    return NextResponse.json({
      success: true,
      store: {
        name: storeInfo.name,
        hours: storeInfo.hours,
        phone: storeInfo.phone,
        email: storeInfo.email,
        address: storeInfo.address,
        fullAddress: `${storeInfo.address.street}, ${storeInfo.address.city}, ${storeInfo.address.state} ${storeInfo.address.zipCode}`,
        currentStatus: getCurrentStoreStatus(),
        specialHours: {
          holidays: 'Closed on Thanksgiving, Christmas Day, and New Year\'s Day',
          blackFriday: 'Open 6:00 AM - 10:00 PM',
          christmasEve: 'Open 9:00 AM - 5:00 PM'
        }
      }
    })
    
  } catch (error) {
    console.error('Error getting store hours:', error)
    return NextResponse.json({ 
      error: 'Failed to get store hours',
      success: false 
    }, { status: 500 })
  }
}

function getCurrentStoreStatus() {
  const now = new Date()
  const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const hour = now.getHours()
  
  // Simple logic to determine if store is open
  const isWeekend = day === 'saturday' || day === 'sunday'
  const isFriday = day === 'friday'
  
  if (isWeekend) {
    const openHour = day === 'saturday' ? 10 : 11
    const closeHour = day === 'saturday' ? 20 : 18
    return {
      isOpen: hour >= openHour && hour < closeHour,
      nextOpen: hour < openHour ? `${openHour}:00 AM` : null,
      closesAt: `${closeHour === 20 ? '8:00' : '6:00'} PM`
    }
  } else if (isFriday) {
    return {
      isOpen: hour >= 9 && hour < 21,
      nextOpen: hour < 9 ? '9:00 AM' : null,
      closesAt: '9:00 PM'
    }
  } else {
    return {
      isOpen: hour >= 9 && hour < 20,
      nextOpen: hour < 9 ? '9:00 AM' : null,
      closesAt: '8:00 PM'
    }
  }
}
