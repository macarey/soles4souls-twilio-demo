import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export async function POST(request: NextRequest) {
  try {
    const { assistantSid, conversationSid, message, type } = await request.json()

    // Check if we have Twilio credentials
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !assistantSid) {
      return NextResponse.json({
        error: 'Twilio credentials not configured',
        conversationSid: conversationSid || `demo-conversation-${Date.now()}`,
        status: 'demo_mode'
      }, { status: 400 })
    }

    // If this is a conversation initialization (no message)
    if (!message) {
      try {
        // Create a new conversation with Twilio
        const conversation = await client.conversations.v1.conversations.create({
          friendlyName: 'Levelpath Shoes Customer Support',
          attributes: JSON.stringify({
            assistantSid,
            customerType: 'web',
            timestamp: new Date().toISOString()
          })
        })

        return NextResponse.json({
          conversationSid: conversation.sid,
          status: 'active'
        })
      } catch (error) {
        console.error('Error creating Twilio conversation:', error)
        return NextResponse.json({
          error: 'Failed to create conversation',
          conversationSid: conversationSid || `demo-conversation-${Date.now()}`,
          status: 'demo_mode'
        }, { status: 500 })
      }
    }

    // Send message to Twilio conversation (AI Assistant will respond via webhook)
    try {
      if (!conversationSid) {
        throw new Error('No conversation SID provided')
      }

      // Send message to the conversation
      const messageResponse = await client.conversations.v1
        .conversations(conversationSid)
        .messages
        .create({
          body: message,
          author: 'customer'
        })

      // Wait for the AI Assistant to respond via webhook
      // We'll poll for the response since the webhook will trigger the AI Assistant
      let attempts = 0
      const maxAttempts = 10
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
        
        // Get the latest messages from the conversation
        const messages = await client.conversations.v1
          .conversations(conversationSid)
          .messages
          .list({ limit: 10 })

        // Find the latest assistant message (after our message)
        const assistantMessages = messages
          .filter(msg => 
            msg.author === 'assistant' && 
            new Date(msg.dateCreated) > new Date(messageResponse.dateCreated)
          )
          .sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())

        if (assistantMessages.length > 0) {
          return NextResponse.json({
            conversationSid,
            status: 'active',
            response: assistantMessages[0].body
          })
        }
        
        attempts++
      }

      // If no response after max attempts, return a waiting message
      return NextResponse.json({
        conversationSid,
        status: 'active',
        response: 'I received your message and I\'m processing it. Please give me a moment to respond.'
      })

    } catch (error) {
      console.error('Error sending message to Twilio:', error)
      
      // Fallback to demo mode if Twilio fails
      const response = await processUserMessage(message)
      return NextResponse.json({
        conversationSid: conversationSid || `demo-conversation-${Date.now()}`,
        status: 'demo_mode',
        response: response,
        error: 'Twilio API failed, using demo mode'
      })
    }

  } catch (error) {
    console.error('Error in Twilio conversation:', error)
    return NextResponse.json(
      { error: 'Failed to process conversation' },
      { status: 500 }
    )
  }
}

// Fallback demo function for when Twilio is not available
async function processUserMessage(userMessage: string): Promise<string> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
  
  const lowerMessage = userMessage.toLowerCase()
  
  // Twilio AI - Advanced capabilities, intelligent responses
  // More flexible order tracking patterns
  if (lowerMessage.includes('order') && (
    lowerMessage.includes('status') || 
    lowerMessage.includes('track') || 
    lowerMessage.includes('where') || 
    lowerMessage.includes('location') ||
    lowerMessage.includes('shipped') ||
    lowerMessage.includes('delivered') ||
    lowerMessage.includes('delivery')
  )) {
    const orderId = userMessage.match(/ORD-\d+/)?.[0] || 'ORD-001'
    return `I found your order ${orderId}! Here are the details:\n\n📦 **Order Status**: Shipped\n🚚 **Tracking Number**: TRK-${orderId}\n📅 **Estimated Delivery**: December 25, 2024\n📍 **Current Location**: In transit from our warehouse\n\nYour order contains:\n• Levelpath Runner Pro (Size 10, Black) - $129.99\n\nIs there anything else I can help you with regarding this order?`
  }
  
  if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
    return `I can help you process a return! Here's what I can do for you:\n\n✅ **Return Eligibility**: 30-day return policy for unworn items\n📦 **Return Process**: I can generate a return label for you\n💰 **Refund Method**: Original payment method\n\nTo get started, I'll need your order ID. Once you provide it, I can:\n• Generate a prepaid return label\n• Email you return instructions\n• Process your refund once the item is received\n\nWhat's your order ID?`
  }
  
  if (lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('close')) {
    return `Here are our current store hours and location:\n\n🕒 **Store Hours**:\n• Monday-Thursday: 9AM-8PM\n• Friday: 9AM-9PM\n• Saturday: 10AM-8PM\n• Sunday: 11AM-6PM\n\n📍 **Location**:\n789 Fashion Blvd\nSan Francisco, CA 94102\n\n📞 **Phone**: (555) 123-4567\n\nWe're also available 24/7 through this chat! Is there anything specific you'd like to know about visiting our store?`
  }
  
  if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
    return `Here are our shipping options:\n\n🚚 **Standard Shipping**:\n• Cost: $9.99 (Free on orders over $100)\n• Delivery: 3-5 business days\n• Available: All 50 states\n\n⚡ **Expedited Shipping**:\n• Cost: $19.99\n• Delivery: 1-2 business days\n• Available: Continental US\n\n🌍 **International Shipping**:\n• Available to select countries\n• Delivery: 7-14 business days\n• Customs fees may apply\n\nWould you like me to help you calculate shipping costs for a specific order?`
  }
  
  if (lowerMessage.includes('size') || lowerMessage.includes('fit')) {
    return `I can help you find the perfect fit! Here's our sizing guidance:\n\n👟 **General Sizing**:\n• Our shoes run true to size\n• If between sizes, we recommend sizing up\n• Each product page has a detailed size guide with measurements\n\n📏 **Size Chart Available**:\n• Length measurements in inches\n• Width options (Narrow, Regular, Wide)\n• European and UK size conversions\n\n🏪 **Try Before You Buy**:\n• Visit our store at 789 Fashion Blvd\n• Free in-store fitting service\n• Expert staff to help with sizing\n\nWhich product are you interested in? I can provide specific sizing recommendations.`
  }
  
  // Escalation for Twilio AI - only when truly necessary
  if (lowerMessage.includes('agent') || lowerMessage.includes('human') || lowerMessage.includes('speak to someone')) {
    return `I understand you'd like to speak with a human agent. While I can handle most questions about orders, returns, shipping, and products, I'm happy to connect you with a customer service representative for more complex issues. Let me transfer you now.`
  }
  
  // Default response for Twilio AI - tries to help first
  return `I understand you're asking about "${userMessage}". Let me help you with that. While I can assist with order tracking, returns, store information, shipping, and product questions, I might need to connect you with a human agent for more specific assistance. Could you provide more details about what you need help with?`
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationSid = searchParams.get('conversationSid')
    
    if (!conversationSid) {
      return NextResponse.json({ error: 'Conversation SID is required' }, { status: 400 })
    }
    
    // Try to get real conversation from Twilio
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        const conversation = await client.conversations.v1.conversations(conversationSid).fetch()
        const messages = await client.conversations.v1
          .conversations(conversationSid)
          .messages
          .list({ limit: 20 })

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
        console.error('Error fetching Twilio conversation:', error)
      }
    }
    
    // Fallback to demo mode
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