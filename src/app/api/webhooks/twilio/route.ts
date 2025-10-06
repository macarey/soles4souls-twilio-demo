import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle Twilio AI Assistant webhook
    if (body.type === 'assistant.message') {
      const { message, conversationSid } = body
      
      // Process the message and determine response
      const response = await processAssistantMessage(message)
      
      // Send response back to Twilio
      await client.conversations.v1
        .conversations(conversationSid)
        .messages
        .create({
          body: response,
          author: 'assistant'
        })
      
      return NextResponse.json({ success: true })
    }
    
    // Handle tool execution requests
    if (body.type === 'tool.execution') {
      const { toolName, parameters } = body
      const result = await executeTool(toolName, parameters)
      
      return NextResponse.json({ result })
    }
    
    return NextResponse.json({ error: 'Unknown webhook type' }, { status: 400 })
    
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function processAssistantMessage(message: string): Promise<string> {
  // This is where you'd integrate with your actual Twilio AI Assistant
  // For now, we'll simulate the AI processing
  
  const lowerMessage = message.toLowerCase()
  
  // Donation lookup tool
  if (lowerMessage.includes('donation') && (lowerMessage.includes('status') || lowerMessage.includes('track'))) {
    const donationId = message.match(/DON-\d+/)?.[0] || 'DON-001'
    return `I found your donation ${donationId}! It has been successfully distributed and is making a positive impact. Your donation helped support our micro-enterprise programs. Would you like me to help with anything else?`
  }
  
  // Volunteer opportunities
  if (lowerMessage.includes('volunteer') || lowerMessage.includes('help')) {
    return `I can help you find volunteer opportunities! We have several ways to get involved:\n• Warehouse sorting and processing\n• Community shoe drives\n• Event coordination\n• Administrative support\n\nWhat type of volunteer work interests you most?`
  }
  
  // Drop-off locations and hours
  if (lowerMessage.includes('drop') || lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('close')) {
    return `I can help you with drop-off locations and hours! Here are our main locations:\n\n**Nashville Distribution Center**\n• Address: 319 Martingale Dr, Old Hickory, TN 37138\n• Hours: Monday-Friday 8AM-5PM, Saturday 9AM-2PM\n• Phone: (615) 391-5723\n\n**Los Angeles Warehouse**\n• Address: 1234 Industrial Blvd, Los Angeles, CA 90058\n• Hours: Monday-Friday 9AM-4PM\n• Phone: (323) 555-0123\n\nWould you like me to find locations in a specific city or get more detailed information?`
  }
  
  // Impact stories and programs
  if (lowerMessage.includes('impact') || lowerMessage.includes('stories') || lowerMessage.includes('programs')) {
    return `I'd love to share our impact with you! Soles4Souls has distributed over 73 million pairs of shoes and pieces of clothing worldwide. Our programs include:\n• 4Relief: Disaster recovery and emergency aid\n• 4Opportunity: Micro-enterprise job creation\n• 4EveryKid: School shoe programs\n• Circularity: Sustainability initiatives\n\nWould you like to hear specific impact stories from any of these programs?`
  }
  
  // Escalation
  if (lowerMessage.includes('agent') || lowerMessage.includes('human') || lowerMessage.includes('speak to someone')) {
    return `I understand you'd like to speak with a human representative. Let me connect you with one of our Soles4Souls team members. Please hold while I transfer you...`
  }
  
  // Default response
  return `I understand you're asking about "${message}". While I can help with donations, volunteer opportunities, impact stories, and drop-off locations, I might need to connect you with a team member for more specific assistance. How else can I help you today?`
}

async function executeTool(toolName: string, parameters: any): Promise<any> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://soles4souls-demo.vercel.app'
  
  switch (toolName) {
    case 'donation_lookup':
      return await callToolEndpoint(`${baseUrl}/api/tools/donation-lookup`, { donation_id: parameters.donation_id })
    case 'volunteer_scheduler':
      return await callToolEndpoint(`${baseUrl}/api/tools/volunteer-scheduler`, parameters)
    case 'impact_report':
      return await callToolEndpoint(`${baseUrl}/api/tools/impact-report`, {})
    case 'dropoff_locations':
      return await callToolEndpoint(`${baseUrl}/api/tools/dropoff-locations`, parameters)
    default:
      throw new Error(`Unknown tool: ${toolName}`)
  }
}

async function callToolEndpoint(url: string, data: any): Promise<any> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error(`Tool endpoint returned ${response.status}: ${response.statusText}`)
    }
    
    const result = await response.json()
    return result
  } catch (error) {
    console.error(`Error calling tool endpoint ${url}:`, error)
    throw error
  }
}

