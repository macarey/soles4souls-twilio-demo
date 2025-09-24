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
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      return NextResponse.json({
        error: 'Twilio credentials not configured',
        conversationSid: conversationSid || `demo-conversation-${Date.now()}`,
        status: 'demo_mode'
      }, { status: 400 })
    }

    // For conversation creation, we need assistantSid
    if (!message && !assistantSid) {
      return NextResponse.json({
        error: 'Assistant SID is required for conversation creation',
        conversationSid: conversationSid || `demo-conversation-${Date.now()}`,
        status: 'error'
      }, { status: 400 })
    }

    // If this is a conversation initialization (no message)
    if (!message) {
      try {
        // Create a new conversation with Twilio
        console.log('🔄 Creating Twilio conversation with assistantSid:', assistantSid)
        const conversation = await client.conversations.v1.conversations.create({
          friendlyName: 'Levelpath Shoes Customer Support',
          attributes: JSON.stringify({
            assistantSid,
            customerType: 'web',
            timestamp: new Date().toISOString()
          })
        })

        console.log('✅ Conversation created successfully:', {
          sid: conversation.sid,
          friendlyName: conversation.friendlyName,
          status: conversation.state
        })

        // Add the user as a participant to the conversation
        console.log('👤 Adding user as participant to conversation...')
        try {
          const participant = await client.conversations.v1
            .conversations(conversation.sid)
            .participants
            .create({
              identity: 'user00' // The identity from the token
            })

          console.log('✅ Participant added successfully:', {
            sid: participant.sid,
            identity: participant.identity,
            type: participant.type
          })
        } catch (participantError) {
          console.error('❌ Error adding participant:', participantError)
          // Don't fail the whole request if participant creation fails
        }

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
      console.log('📤 Sending message to Twilio conversation:', {
        conversationSid,
        message,
        author: 'customer'
      })

      const messageResponse = await client.conversations.v1
        .conversations(conversationSid)
        .messages
        .create({
          body: message,
          author: 'customer'
        })

      console.log('✅ Message sent successfully:', {
        messageSid: messageResponse.sid,
        body: messageResponse.body,
        author: messageResponse.author,
        dateCreated: messageResponse.dateCreated
      })

      // Wait for the AI Assistant to respond via webhook
      // We'll poll for the response since the webhook will trigger the AI Assistant
      let attempts = 0
      const maxAttempts = 10
      
      while (attempts < maxAttempts) {
        console.log(`🔍 Polling attempt ${attempts + 1}/${maxAttempts}`)
        await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
        
        // Get the latest messages from the conversation
        const messages = await client.conversations.v1
          .conversations(conversationSid)
          .messages
          .list({ limit: 10 })

        console.log('📋 Current messages in conversation:', messages.map(msg => ({
          sid: msg.sid,
          author: msg.author,
          body: msg.body?.substring(0, 50) + '...',
          dateCreated: msg.dateCreated
        })))

        // Find the latest assistant message (after our message)
        const assistantMessages = messages
          .filter(msg => 
            msg.author === 'assistant' && 
            new Date(msg.dateCreated) > new Date(messageResponse.dateCreated)
          )
          .sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())

        if (assistantMessages.length > 0) {
          console.log('🎉 AI Assistant responded:', {
            messageSid: assistantMessages[0].sid,
            body: assistantMessages[0].body,
            author: assistantMessages[0].author,
            dateCreated: assistantMessages[0].dateCreated
          })
          
          return NextResponse.json({
            conversationSid,
            status: 'active',
            response: assistantMessages[0].body
          })
        }
        
        attempts++
      }
      
      console.log('⏰ Polling timeout - no AI response received after', maxAttempts, 'attempts')

      // If no response after max attempts, return a waiting message
      return NextResponse.json({
        conversationSid,
        status: 'active',
        response: 'I received your message and I\'m processing it. Please give me a moment to respond.'
      })

    } catch (error) {
      console.error('Error sending message to Twilio:', error)
      
      // Return error message instead of falling back to demo mode
      return NextResponse.json({
        conversationSid: conversationSid || `demo-conversation-${Date.now()}`,
        status: 'error',
        response: `❌ **Twilio Integration Error**\n\nI'm unable to connect to the Twilio AI Assistant at the moment. This could be due to:\n\n• Missing or invalid Twilio credentials\n• Network connectivity issues\n• Twilio service temporarily unavailable\n\nPlease check your Twilio configuration and try again. If the problem persists, contact your system administrator.`,
        error: 'Twilio API failed'
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