'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, X, MessageCircle, Bot, User, Phone, ToggleLeft, ToggleRight } from 'lucide-react'
import { ChatMessage } from '@/types'
import { Client, Conversation } from '@twilio/conversations'

interface ChatWidgetProps {
  isOpen: boolean
  onClose: () => void
}

type AIMode = 'basic' | 'twilio'

export default function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi! I'm your Soles4Souls AI assistant. I can help you with donations, volunteer opportunities, impact tracking, and more. How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date().toISOString(),
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [aiMode, setAiMode] = useState<AIMode>('basic')
  const [connectionState, setConnectionState] = useState<string>('disconnected')
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [assistantIsTyping, setAssistantIsTyping] = useState(false)
  const [client, setClient] = useState<Client | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize Twilio Conversations SDK when chat opens and mode is Twilio
  useEffect(() => {
    console.log('🔍 useEffect triggered:', {
      isOpen,
      aiMode,
      hasClient: !!client,
      hasConversation: !!conversation,
      isInitializing,
      shouldInitialize: isOpen && aiMode === 'twilio' && !client && !conversation && !isInitializing
    })
    
    if (isOpen && aiMode === 'twilio' && !client && !conversation && !isInitializing) {
      console.log('🚀 Initializing Twilio SDK for the first time...')
      initializeTwilioSDK()
    }
  }, [isOpen, aiMode])

  // Cleanup function to disconnect SDK when switching modes or closing chat
  useEffect(() => {
    return () => {
      if (client) {
        console.log('🧹 Cleaning up Twilio SDK connection...')
        client.shutdown()
      }
    }
  }, [client])

  const initializeTwilioSDK = async () => {
    if (isInitializing) {
      console.log('⏳ SDK initialization already in progress, skipping...')
      return
    }
    
    setIsInitializing(true)
    try {
      console.log('🚀 Initializing Twilio Conversations SDK...')
      
      // Get access token
      const tokenResponse = await fetch('/api/twilio/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identity: 'user00',
          password: 'lets-converse'
        })
      })

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json()
        throw new Error(errorData.error || 'Failed to get access token')
      }

      const { token, identity } = await tokenResponse.json()
      console.log('✅ Access token received for identity:', identity)
      console.log('🔑 Token preview:', token ? token.substring(0, 50) + '...' : 'null')

      // Initialize Conversations client
      console.log('🔧 Initializing Conversations client with token...')
      const conversationsClient = new Client(token)
      setClient(conversationsClient)

      // Set up event listeners (only once)
      conversationsClient.on('connectionStateChanged', (state) => {
        console.log('🔗 Connection state changed:', state)
        setConnectionState(state)
      })

      conversationsClient.on('conversationJoined', (conversation) => {
        console.log('💬 Joined conversation:', conversation.sid)
        setConversation(conversation)
      })

      // Create conversation via REST API, then join it with SDK
      console.log('🔄 Creating conversation via REST API...')
      
      // First, create conversation via our REST API
      console.log('📡 Calling /api/twilio/conversation to create conversation...')
      console.log('📋 Assistant SID being sent:', process.env.NEXT_PUBLIC_TWILIO_AI_ASSISTANT_SID)
      console.log('📋 Environment check:', {
        hasAssistantSid: !!process.env.NEXT_PUBLIC_TWILIO_AI_ASSISTANT_SID,
        assistantSidValue: process.env.NEXT_PUBLIC_TWILIO_AI_ASSISTANT_SID
      })
      
      const conversationResponse = await fetch('/api/twilio/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assistantSid: process.env.NEXT_PUBLIC_TWILIO_AI_ASSISTANT_SID || 'aia_asst_01997766-7285-7a77-b289-294ef8db7c19'
        })
      })
      
      console.log('📡 Conversation API response status:', conversationResponse.status)

      if (!conversationResponse.ok) {
        const errorData = await conversationResponse.json()
        throw new Error(errorData.error || 'Failed to create conversation via API')
      }

      const conversationData = await conversationResponse.json()
      console.log('📋 Full conversation API response:', conversationData)
      
      const { conversationSid } = conversationData
      console.log('✅ Conversation created via API:', conversationSid)
      console.log('🔍 Conversation SID format check:', conversationSid ? conversationSid.startsWith('CH') : 'null')

      // Now join the conversation using the SDK
      console.log('🔗 Joining conversation with SDK...')
      console.log('🔍 Attempting to get conversation with SID:', conversationSid)
      
      let conversation
      try {
        conversation = await conversationsClient.getConversationBySid(conversationSid)
        console.log('✅ Successfully got conversation object')
      } catch (getError) {
        console.error('❌ Detailed error getting conversation:', {
          error: getError,
          message: (getError as any)?.message,
          code: (getError as any)?.code,
          status: (getError as any)?.status,
          moreInfo: (getError as any)?.moreInfo,
          stack: (getError as any)?.stack
        })
        throw getError
      }
      
      console.log('✅ Joined conversation successfully!')
      console.log('📋 Conversation details:', {
        sid: conversation.sid,
        friendlyName: conversation.friendlyName,
        status: conversation.status,
        state: conversation.state
      })
      setConversation(conversation)
      
      // Set up conversation event listeners (only once per conversation)
      conversation.on('messageAdded', (message) => {
        console.log('📨 New message received:', {
          sid: message.sid,
          author: message.author,
          body: message.body
        })

        // Only add messages from the assistant, not from the current user
        // User messages are already added in handleSendMessage
        if (message.author === 'assistant' || message.author === 'system') {
          console.log('🤖 Received assistant/system message:', message.body, 'Author:', message.author)
          
          const newMessage: ChatMessage = {
            id: message.sid,
            content: message.body || '',
            sender: 'assistant',
            timestamp: message.dateCreated?.toISOString() || new Date().toISOString(),
          }

          setMessages(prev => [...prev, newMessage])
          // Turn off typing indicator when assistant responds (fallback since attributes aren't working)
          console.log('🛑 Turning off typing indicator due to assistant response')
          setAssistantIsTyping(false)
        } else {
          // This is a user message from the SDK - we already added it in handleSendMessage
          // So we ignore it to prevent duplicates
          console.log('📝 Ignoring user message from SDK (already added):', message.body)
        }
      })

        // Listen for conversation attribute changes to detect assistant typing
        conversation.on('updated', (updatedConversation) => {
          console.log('🔄 Conversation updated - full object:', updatedConversation)
          console.log('🔄 Conversation attributes raw:', updatedConversation.conversation.attributes)
          console.log('🔄 Conversation attributes type:', typeof updatedConversation.conversation.attributes)
          
          try {
            const attributesStr = typeof updatedConversation.conversation.attributes === 'string' 
              ? updatedConversation.conversation.attributes 
              : JSON.stringify(updatedConversation.conversation.attributes || {})
            const attributes = JSON.parse(attributesStr)
            console.log('📋 Parsed attributes:', attributes)
            console.log('📋 assistantIsTyping value:', attributes.assistantIsTyping)
            console.log('📋 assistantIsTyping type:', typeof attributes.assistantIsTyping)
            
            if (attributes.assistantIsTyping !== undefined) {
              console.log('⌨️ Assistant typing status changed:', attributes.assistantIsTyping)
              setAssistantIsTyping(attributes.assistantIsTyping)
            } else {
              console.log('❌ assistantIsTyping is undefined in attributes')
            }
          } catch (error) {
            console.log('⚠️ Could not parse conversation attributes:', error)
            console.log('⚠️ Raw attributes that failed to parse:', updatedConversation.conversation.attributes)
          }
        })

      // Load existing messages (only once)
      conversation.getMessages().then((paginator) => {
        console.log('📋 Loading existing messages:', paginator.items.length)
        const formattedMessages = paginator.items.map(msg => ({
          id: msg.sid,
          content: msg.body || '',
          sender: (msg.author === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
          timestamp: msg.dateCreated?.toISOString() || new Date().toISOString(),
        }))
        setMessages(prev => [...prev, ...formattedMessages])
      })

      // Client is ready to use
      console.log('✅ Twilio Conversations client initialized')
      setIsInitializing(false)

    } catch (error) {
      console.error('❌ Error initializing Twilio SDK:', error)
      console.error('❌ Full error details:', {
        error: error,
        message: (error as any)?.message,
        code: (error as any)?.code,
        status: (error as any)?.status,
        moreInfo: (error as any)?.moreInfo,
        stack: (error as any)?.stack
      })
      
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `❌ **Twilio SDK Error**: ${error instanceof Error ? error.message : 'Failed to initialize Twilio Conversations SDK'}\n\n**Full Error Details:**\n\`\`\`\n${JSON.stringify({
          message: (error as any)?.message,
          code: (error as any)?.code,
          status: (error as any)?.status,
          moreInfo: (error as any)?.moreInfo
        }, null, 2)}\n\`\`\``,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
      }
      
      setMessages(prev => [...prev, errorMessage])
      setIsInitializing(false)
    }
  }

  const getBasicAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const lowerMessage = userMessage.toLowerCase()
    
    // Basic AI - Limited knowledge, frequent escalations
    if (lowerMessage.includes('donation') && (lowerMessage.includes('status') || lowerMessage.includes('track'))) {
      const donationId = userMessage.match(/DON-\d+/)?.[0] || 'DON-001'
      return `I found donation ${donationId} in our system. It shows as "distributed" but I don't have detailed impact information. Let me connect you with a Soles4Souls representative who can provide more specific details about your donation's impact.`
    }
    
    if (lowerMessage.includes('volunteer') || lowerMessage.includes('help')) {
      return `I understand you want to volunteer with Soles4Souls. We have many opportunities available, but I need to connect you with our volunteer coordinator to find the best match for your interests and schedule.`
    }
    
    if (lowerMessage.includes('drop') || lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('close')) {
      return `I know we have drop-off locations, but I don't have access to current locations and hours. A Soles4Souls representative can provide you with the nearest drop-off location and specific guidelines.`
    }
    
    if (lowerMessage.includes('impact') || lowerMessage.includes('stories')) {
      return `I understand you want to learn about our impact. We've distributed over 73 million pairs of shoes worldwide, but I don't have access to detailed impact stories. Let me connect you with someone who can share inspiring stories from our programs.`
    }
    
    if (lowerMessage.includes('programs') || lowerMessage.includes('initiatives')) {
      return `I know Soles4Souls runs several programs like 4Relief, 4Opportunity, and 4EveryKid, but I don't have detailed information about each program. Let me connect you with a representative who can explain our programs in detail.`
    }
    
    // Escalation triggers for basic AI
    if (lowerMessage.includes('agent') || lowerMessage.includes('human') || lowerMessage.includes('speak to someone')) {
      return `I understand you'd like to speak with a human representative. Let me connect you with one of our Soles4Souls team members right away.`
    }
    
    // Default response for basic AI - always escalates
    return `I understand you're asking about "${userMessage}". I'm still learning about Soles4Souls and don't have enough information to help you with this specific question. Let me connect you with a team member who can provide you with the assistance you need.`
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    const messageToSend = inputValue
    setInputValue('')
    setIsTyping(true)

    try {
      if (aiMode === 'basic') {
        // Use basic AI response
        const aiResponse = await getBasicAIResponse(messageToSend)
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          sender: 'assistant',
          timestamp: new Date().toISOString(),
        }

        setMessages(prev => [...prev, assistantMessage])
      } else {
        // Use Twilio Conversations SDK
        if (conversation) {
          console.log('📤 Sending message via Twilio SDK:', messageToSend)
          await conversation.sendMessage(messageToSend)
          console.log('✅ Message sent via Twilio SDK')
          
          // Manually set typing indicator since conversation attributes aren't working
          setAssistantIsTyping(true)
        } else {
          throw new Error('No active conversation')
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `❌ **Error**: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleAIMode = () => {
    const newMode = aiMode === 'basic' ? 'twilio' : 'basic'
    setAiMode(newMode)
    
    // Reset SDK state when switching modes
    if (newMode === 'basic') {
      if (client) {
        console.log('🔄 Switching to Basic AI - cleaning up Twilio SDK...')
        client.shutdown()
        setClient(null)
        setConversation(null)
        setConnectionState('disconnected')
        setIsInitializing(false)
      }
    }
    
    // Clear previous chat and add welcome message
    if (newMode === 'twilio') {
      setMessages([{
        id: Date.now().toString(),
        content: "Hi! I'm your Soles4Souls AI assistant powered by Twilio. I can help you with donations, volunteer opportunities, impact tracking, drop-off locations, and more. How can I assist you today?",
        sender: 'assistant',
        timestamp: new Date().toISOString(),
      }])
    } else {
      setMessages([{
        id: Date.now().toString(),
        content: "🔄 **Switched to Basic AI** I'm a simple AI assistant for Soles4Souls. I can help with basic questions about donations and volunteering, but I'll connect you to a human representative for complex requests.",
        sender: 'assistant',
        timestamp: new Date().toISOString(),
      }])
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (client) {
        // Client cleanup - just reset state
        setClient(null)
        setConversation(null)
        setConnectionState('disconnected')
      }
    }
  }, [client])

  if (!isOpen) {
    return (
      <button
        onClick={() => onClose()}
        className={`fixed bottom-6 right-6 text-white p-4 rounded-full shadow-lg transition-colors duration-200 z-50 ${
          aiMode === 'twilio' 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-primary-600 hover:bg-primary-700'
        }`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className={`text-white p-4 rounded-t-lg flex items-center justify-between ${
        aiMode === 'twilio' ? 'bg-red-600' : 'bg-primary-600'
      }`}>
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">
              {aiMode === 'basic' ? 'Basic AI' : 'Twilio AI Assistant'}
            </h3>
            <p className="text-xs text-primary-100">
              {aiMode === 'basic' ? 'Limited capabilities' : `Advanced AI (${connectionState})`}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* AI Mode Toggle */}
          <button
            onClick={toggleAIMode}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors duration-200 ${
              aiMode === 'twilio' 
                ? 'bg-red-700 hover:bg-red-800' 
                : 'bg-primary-700 hover:bg-primary-800'
            }`}
            title={`Switch to ${aiMode === 'basic' ? 'Twilio AI' : 'Basic AI'}`}
          >
            {aiMode === 'basic' ? (
              <>
                <ToggleLeft className="h-3 w-3" />
                <span>Basic</span>
              </>
            ) : (
              <>
                <ToggleRight className="h-3 w-3" />
                <span>Twilio</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="text-white hover:text-primary-200 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg shadow-md ${
                message.sender === 'user'
                  ? `${aiMode === 'twilio' ? 'bg-red-500' : 'bg-primary-500'} text-white rounded-br-none`
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="block text-right text-xs mt-1 opacity-75">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[70%] p-3 rounded-lg shadow-md bg-gray-100 text-gray-800 rounded-bl-none">
              <p className="text-sm animate-pulse">AI Assistant is typing...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Assistant Typing Indicator */}
      {assistantIsTyping && aiMode === 'twilio' && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm">AI Assistant is typing...</span>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 p-4 flex items-center">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isTyping}
        />
        <button
          onClick={handleSendMessage}
          className={`ml-3 text-white p-3 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            aiMode === 'twilio' 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-primary-600 hover:bg-primary-700'
          }`}
          disabled={isTyping || !inputValue.trim()}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}