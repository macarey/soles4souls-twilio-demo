import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching all conversations...')

    // Get all conversations from the default service
    const conversations = await client.conversations.v1.conversations.list({
      limit: 100 // Adjust as needed
    })

    console.log(`✅ Found ${conversations.length} conversations`)

    const formattedConversations = conversations.map(conv => ({
      sid: conv.sid,
      friendlyName: conv.friendlyName,
      state: conv.state,
      dateCreated: conv.dateCreated?.toISOString()
    }))

    return NextResponse.json({
      conversations: formattedConversations,
      count: conversations.length
    })

  } catch (error) {
    console.error('❌ Error fetching conversations:', error)
    return NextResponse.json({
      error: 'Failed to fetch conversations',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { conversationSid } = await request.json()

    if (!conversationSid) {
      return NextResponse.json({
        error: 'Conversation SID is required'
      }, { status: 400 })
    }

    console.log('🗑️ Deleting conversation:', conversationSid)

    // Delete the conversation
    await client.conversations.v1.conversations(conversationSid).remove()

    console.log('✅ Conversation deleted successfully:', conversationSid)

    return NextResponse.json({
      success: true,
      message: `Conversation ${conversationSid} deleted successfully`
    })

  } catch (error) {
    console.error('❌ Error deleting conversation:', error)
    return NextResponse.json({
      error: 'Failed to delete conversation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
