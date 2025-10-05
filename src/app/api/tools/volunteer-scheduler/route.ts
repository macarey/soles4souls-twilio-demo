import { NextRequest, NextResponse } from 'next/server'
import { mockVolunteerOpportunities } from '@/lib/data'

export async function POST(request: NextRequest) {
  try {
    const { opportunity_id, volunteer_name, contact_info } = await request.json()
    
    if (!opportunity_id || !volunteer_name) {
      return NextResponse.json({ 
        error: 'Opportunity ID and volunteer name are required',
        success: false 
      }, { status: 400 })
    }
    
    // Look up volunteer opportunity
    const opportunity = mockVolunteerOpportunities.find(o => o.id === opportunity_id)
    
    if (!opportunity) {
      return NextResponse.json({
        success: false,
        error: 'Volunteer opportunity not found',
        opportunity_id
      })
    }
    
    if (opportunity.status !== 'available') {
      return NextResponse.json({
        success: false,
        error: 'This volunteer opportunity is no longer available',
        opportunity_id
      })
    }
    
    // Simulate successful scheduling
    const confirmationNumber = `VOL-${Date.now().toString().slice(-6)}`
    
    return NextResponse.json({
      success: true,
      confirmation: {
        number: confirmationNumber,
        volunteer: {
          name: volunteer_name,
          contact: contact_info || 'Not provided'
        },
        opportunity: {
          title: opportunity.title,
          description: opportunity.description,
          location: opportunity.location,
          timeCommitment: opportunity.timeCommitment,
          skills: opportunity.skills
        },
        nextSteps: [
          'You will receive an email confirmation within 24 hours',
          'Our volunteer coordinator will contact you to confirm details',
          'Please arrive 15 minutes early for orientation',
          'Bring a valid ID and comfortable clothing for warehouse work'
        ],
        contactInfo: {
          phone: '(615) 391-5723',
          email: 'volunteers@soles4souls.org'
        }
      }
    })
    
  } catch (error) {
    console.error('Error scheduling volunteer:', error)
    return NextResponse.json({ 
      error: 'Failed to schedule volunteer opportunity',
      success: false 
    }, { status: 500 })
  }
}
