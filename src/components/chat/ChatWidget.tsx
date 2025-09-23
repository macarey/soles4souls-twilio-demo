'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, X, MessageCircle, Bot, User, Phone, ToggleLeft, ToggleRight } from 'lucide-react'
import { ChatMessage } from '@/types'

interface ChatWidgetProps {
  isOpen: boolean
  onClose: () => void
}

type AIMode = 'basic' | 'twilio'

export default function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi! I'm your AI assistant. I can help you with order tracking, returns, store hours, and more. How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date().toISOString(),
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationSid, setConversationSid] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [aiMode, setAiMode] = useState<AIMode>('basic')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize Twilio conversation when chat opens and mode is Twilio
  useEffect(() => {
    if (isOpen && !conversationSid && aiMode === 'twilio') {
      initializeConversation()
    }
  }, [isOpen, conversationSid, aiMode])

  const initializeConversation = async () => {
    try {
      const response = await fetch('/api/twilio/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assistantSid: process.env.NEXT_PUBLIC_TWILIO_AI_ASSISTANT_SID || 'demo-assistant'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setConversationSid(data.conversationSid)
        setIsConnected(true)
      } else {
        console.error('Failed to initialize conversation')
        // Fallback to demo mode
        setIsConnected(false)
      }
    } catch (error) {
      console.error('Error initializing conversation:', error)
      // Fallback to demo mode
      setIsConnected(false)
    }
  }

  const sendMessageToTwilio = async (message: string): Promise<string> => {
    if (!conversationSid) {
      throw new Error('No active conversation')
    }

    try {
      // Send message to Twilio conversation
      const response = await fetch('/api/twilio/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationSid,
          message,
          type: 'user_message'
        })
      })

      if (response.ok) {
        const data = await response.json()
        return data.response || 'I received your message and I\'m processing it.'
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message to Twilio:', error)
      throw error
    }
  }

  const getBasicAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
    
    const lowerMessage = userMessage.toLowerCase()
    
    // Basic AI - Limited knowledge, frequent escalations
    if (lowerMessage.includes('order') && (lowerMessage.includes('status') || lowerMessage.includes('track'))) {
      const orderId = userMessage.match(/ORD-\d+/)?.[0] || 'ORD-001'
      return `I found order ${orderId} in our system. It shows as "processing" but I don't have detailed tracking information. Let me connect you with a customer service agent who can provide more specific details about your order status.`
    }
    
    if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
      return `I understand you want to return an item. Our return policy is 30 days, but I need to connect you with a customer service representative to process your return request. They'll be able to help you with the return label and instructions.`
    }
    
    if (lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('close')) {
      return `Our store hours are Monday-Friday 9AM-8PM, Saturday 10AM-6PM, Sunday 11AM-5PM. However, I'm not sure about holiday hours or special events. Let me connect you with someone who can give you the most current information.`
    }
    
    if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      return `I know we offer shipping, but I don't have access to current shipping rates or delivery times. A customer service agent can provide you with accurate shipping information and help you choose the best option for your needs.`
    }
    
    if (lowerMessage.includes('size') || lowerMessage.includes('fit')) {
      return `I understand you have questions about sizing. Our sizing can vary by product, and I don't have access to detailed size charts. Let me connect you with a customer service representative who can help you find the right size.`
    }
    
    // Escalation triggers for basic AI
    if (lowerMessage.includes('agent') || lowerMessage.includes('human') || lowerMessage.includes('speak to someone')) {
      return `I understand you'd like to speak with a human agent. Let me connect you with one of our customer service representatives right away.`
    }
    
    // Default response for basic AI - always escalates
    return `I understand you're asking about "${userMessage}". I'm still learning and don't have enough information to help you with this specific question. Let me connect you with a customer service representative who can provide you with the assistance you need.`
  }

  const getTwilioAIResponse = async (userMessage: string): Promise<string> => {
    // Try real Twilio integration first
    if (isConnected && conversationSid) {
      try {
        return await sendMessageToTwilio(userMessage)
      } catch (error) {
        console.error('Twilio integration failed, falling back to enhanced demo mode:', error)
      }
    }

    // Enhanced demo simulation for Twilio AI
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    const lowerMessage = userMessage.toLowerCase()
    
    // Twilio AI - Advanced capabilities, intelligent responses
    if (lowerMessage.includes('order') && (lowerMessage.includes('status') || lowerMessage.includes('track'))) {
      const orderId = userMessage.match(/ORD-\d+/)?.[0] || 'ORD-001'
      return `I found your order ${orderId}! Here are the details:\n\n📦 **Order Status**: Shipped\n🚚 **Tracking Number**: TRK-${orderId}\n📅 **Estimated Delivery**: December 25, 2024\n📍 **Current Location**: In transit from our warehouse\n\nYour order contains:\n• Levelpath Runner Pro (Size 10, Black) - $129.99\n\nYou can track your package using the tracking number above. Is there anything else I can help you with regarding this order?`
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
      return `I can help you find the perfect fit! Here's our sizing guidance:\n\n👟 **General Sizing**:\n• Our shoes run true to size\n• If between sizes, we recommend sizing up\n• Each product page has detailed measurements\n\n📏 **Size Chart Available**:\n• Length measurements in inches\n• Width options (Narrow, Regular, Wide)\n• European and UK size conversions\n\n🏪 **Try Before You Buy**:\n• Visit our store at 789 Fashion Blvd\n• Free in-store fitting service\n• Expert staff to help with sizing\n\nWhich product are you interested in? I can provide specific sizing recommendations.`
    }
    
    // Escalation for Twilio AI - only when truly necessary
    if (lowerMessage.includes('agent') || lowerMessage.includes('human') || lowerMessage.includes('speak to someone')) {
      return `I understand you'd like to speak with a human agent. While I can handle most questions about orders, returns, shipping, and products, I'm happy to connect you with a customer service representative for more complex issues. Let me transfer you now.`
    }
    
    // Default response for Twilio AI - tries to help first
    return `I understand you're asking about "${userMessage}". Let me help you with that. While I can assist with order tracking, returns, store information, shipping, and product questions, I might need to connect you with a human agent for more specific assistance. Could you provide more details about what you need help with?`
  }

  const getAIResponse = async (userMessage: string): Promise<string> => {
    if (aiMode === 'basic') {
      return await getBasicAIResponse(userMessage)
    } else {
      return await getTwilioAIResponse(userMessage)
    }
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
    setInputValue('')
    setIsTyping(true)

    try {
      const aiResponse = await getAIResponse(inputValue)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
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
    
    // Add a system message when switching modes
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      content: `🔄 **Switched to ${newMode === 'basic' ? 'Basic AI' : 'Twilio AI Assistant'}**\n\n${newMode === 'basic' ? 'I\'m a basic AI with limited knowledge. I may need to connect you with a human agent for many questions.' : 'I\'m powered by Twilio AI Assistants with advanced Tools and Knowledge capabilities. I can help with most questions!'}`,
      sender: 'assistant',
      timestamp: new Date().toISOString(),
    }
    
    setMessages(prev => [...prev, systemMessage])
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => onClose()}
        className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors duration-200 z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">
              {aiMode === 'basic' ? 'Basic AI' : 'Twilio AI Assistant'}
            </h3>
            <p className="text-xs text-primary-100">
              {aiMode === 'basic' ? 'Limited capabilities' : 'Advanced AI with Tools & Knowledge'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* AI Mode Toggle */}
          <button
            onClick={toggleAIMode}
            className="flex items-center space-x-1 bg-primary-700 hover:bg-primary-800 px-2 py-1 rounded text-xs transition-colors duration-200"
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
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.sender === 'assistant' && (
                  <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                )}
                {message.sender === 'user' && (
                  <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setInputValue('Where is my order?')}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors duration-200"
          >
            Track Order
          </button>
          <button
            onClick={() => setInputValue('I want to return my shoes')}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors duration-200"
          >
            Start Return
          </button>
          <button
            onClick={() => setInputValue('What are your store hours?')}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors duration-200"
          >
            Store Hours
          </button>
        </div>
      </div>
    </div>
  )
}