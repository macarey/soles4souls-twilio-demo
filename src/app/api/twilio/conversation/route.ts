import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { assistantSid, conversationSid, message, type } = await request.json()

    // For demo purposes, we'll simulate Twilio integration
    // In production, you would use real Twilio credentials here
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      // Demo mode - return simulated response
      return NextResponse.json({
        conversationSid: conversationSid || `demo-conversation-${Date.now()}`,
        status: 'demo_mode',
        message: 'Running in demo mode. Set up Twilio credentials for full integration.'
      })
    }

    // Real Twilio integration would go here
    // For now, return demo response
    return NextResponse.json({
      conversationSid: conversationSid || `demo-conversation-${Date.now()}`,
      status: 'active',
      response: 'Demo mode: AI Assistant is ready to help!'
    })

  } catch (error) {
    console.error('Error in Twilio conversation:', error)
    return NextResponse.json(
      { error: 'Failed to process conversation' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationSid = searchParams.get('conversationSid')
    
    if (!conversationSid) {
      return NextResponse.json({ error: 'Conversation SID is required' }, { status: 400 })
    }
    
    // Demo mode - return simulated conversation data
    return NextResponse.json({
      conversation: {
        sid: conversationSid,
        friendlyName: 'Levelpath Shoes Customer Support',
        status: 'active',
        attributes: {
          assistantSid: 'demo-assistant',
          customerType: 'web',
          timestamp: new Date().toISOString()
        }
      },
      messages: [
        {
          sid: 'demo-message-1',
          body: 'Hi! I\'m your AI assistant. How can I help you today?',
          author: 'assistant',
          dateCreated: new Date().toISOString(),
          index: 0
        }
      ]
    })
    
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 })
  }
}