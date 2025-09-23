import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export async function POST(request: NextRequest) {
  try {
    const { assistantSid } = await request.json()
    
    if (!assistantSid) {
      return NextResponse.json({ error: 'Assistant SID is required' }, { status: 400 })
    }
    
    // Create a new conversation with the AI Assistant
    const conversation = await client.conversations.v1.conversations.create({
      friendlyName: 'Levelpath Shoes Customer Support',
      attributes: JSON.stringify({
        assistantSid,
        customerType: 'web',
        timestamp: new Date().toISOString()
      })
    })
    
    // Add the AI Assistant to the conversation
    await client.conversations.v1
      .conversations(conversation.sid)
      .participants
      .create({
        messagingBinding: {
          identity: `assistant-${assistantSid}`
        },
        attributes: JSON.stringify({
          role: 'assistant',
          assistantSid
        })
      })
    
    return NextResponse.json({
      conversationSid: conversation.sid,
      status: 'active'
    })
    
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationSid = searchParams.get('conversationSid')
    
    if (!conversationSid) {
      return NextResponse.json({ error: 'Conversation SID is required' }, { status: 400 })
    }
    
    // Get conversation details
    const conversation = await client.conversations.v1
      .conversations(conversationSid)
      .fetch()
    
    // Get messages from the conversation
    const messages = await client.conversations.v1
      .conversations(conversationSid)
      .messages
      .list({ limit: 50 })
    
    return NextResponse.json({
      conversation: {
        sid: conversation.sid,
        friendlyName: conversation.friendlyName,
        status: conversation.state,
        attributes: JSON.parse(conversation.attributes || '{}')
      },
      messages: messages.map(msg => ({
        sid: msg.sid,
        body: msg.body,
        author: msg.author,
        dateCreated: msg.dateCreated,
        index: msg.index
      }))
    })
    
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 })
  }
}
