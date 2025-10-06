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
  
  // Order lookup tool
  if (lowerMessage.includes('order') && (lowerMessage.includes('status') || lowerMessage.includes('track'))) {
    const orderId = message.match(/ORD-\d+/)?.[0] || 'ORD-001'
    return `I found your order ${orderId}! It's currently shipped and on its way. You can track it with tracking number TRK-${orderId}. Would you like me to help with anything else?`
  }
  
  // Return request tool
  if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
    return `I can help you process a return! To start a return, I'll need your order ID. Once you provide it, I can generate a return label and walk you through the process. Our return policy allows returns within 30 days for unworn items in original packaging.`
  }
  
  // Store hours knowledge
  if (lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('close')) {
    return `Our store hours are:\n• Monday-Thursday: 9AM-8PM\n• Friday: 9AM-9PM\n• Saturday: 10AM-8PM\n• Sunday: 11AM-6PM\n\nWe're located at 789 Fashion Blvd, San Francisco, CA 94102. You can also reach us at (555) 123-4567.`
  }
  
  // Escalation
  if (lowerMessage.includes('agent') || lowerMessage.includes('human') || lowerMessage.includes('speak to someone')) {
    return `I understand you'd like to speak with a human agent. Let me connect you with one of our customer service representatives. Please hold while I transfer you...`
  }
  
  // Default response
  return `I understand you're asking about "${message}". While I can help with order tracking, returns, store hours, and general questions, I might need to connect you with a human agent for more specific assistance. How else can I help you today?`
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

