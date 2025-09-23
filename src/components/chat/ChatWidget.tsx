'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, X, MessageCircle, Bot, User, Phone } from 'lucide-react'
import { ChatMessage } from '@/types'

interface ChatWidgetProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi! I'm your AI assistant powered by Twilio AI Assistants. I can help you with order tracking, returns, store hours, and more. How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date().toISOString(),
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationSid, setConversationSid] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize Twilio conversation when chat opens
  useEffect(() => {
    if (isOpen && !conversationSid) {
      initializeConversation()
    }
  }, [isOpen, conversationSid])

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

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Try real Twilio integration first
    if (isConnected && conversationSid) {
      try {
        return await sendMessageToTwilio(userMessage)
      } catch (error) {
        console.error('Twilio integration failed, falling back to demo mode:', error)
      }
    }

    // Fallback to demo simulation
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    const lowerMessage = userMessage.toLowerCase()
    
    // Order lookup tool simulation
    if (lowerMessage.includes('order') && (lowerMessage.includes('status') || lowerMessage.includes('track'))) {
      const orderId = userMessage.match(/ORD-\d+/)?.[0] || 'ORD-001'
      return `I found your order ${orderId}! It's currently shipped and on its way. You can track it with tracking number TRK-${orderId}. Would you like me to help with anything else?`
    }
    
    // Return request tool simulation
    if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
      return `I can help you process a return! To start a return, I'll need your order ID. Once you provide it, I can generate a return label and walk you through the process. Our return policy allows returns within 30 days for unworn items in original packaging. What's your order ID?`
    }
    
    // Store hours knowledge simulation
    if (lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('close')) {
      return `Our store hours are:\n• Monday-Thursday: 9AM-8PM\n• Friday: 9AM-9PM\n• Saturday: 10AM-8PM\n• Sunday: 11AM-6PM\n\nWe're located at 789 Fashion Blvd, San Francisco, CA 94102. You can also reach us at (555) 123-4567. Is there anything else I can help you with?`
    }
    
    // Escalation trigger
    if (lowerMessage.includes('agent') || lowerMessage.includes('human') || lowerMessage.includes('speak to someone')) {
      return `I understand you'd like to speak with a human agent. Let me connect you with one of our customer service representatives. Please hold while I transfer you...`
    }
    
    // General responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hello! I'm here to help you with your Levelpath Shoes needs. I can assist with order tracking, returns, store information, and more. What can I help you with today?`
    }
    
    if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      return `We offer free shipping on orders over $100! Standard shipping is $9.99 for orders under $100 and takes 3-5 business days. Expedited shipping is available for $19.99 and takes 1-2 business days. Would you like to know more about our shipping options?`
    }
    
    if (lowerMessage.includes('size') || lowerMessage.includes('fit')) {
      return `Our shoes run true to size. If you're between sizes, I recommend sizing up. Each product page has a detailed size guide with measurements. You can also visit our store at 789 Fashion Blvd to try on shoes in person. Need help finding the right size for a specific product?`
    }
    
    // Default response
    return `I understand you're asking about "${userMessage}". While I can help with order tracking, returns, store hours, and general questions, I might need to connect you with a human agent for more specific assistance. Would you like me to help with something else, or would you prefer to speak with a customer service representative?`
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
      const aiResponse = await simulateAIResponse(inputValue)
      
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
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs text-primary-100">
              {isConnected ? 'Twilio AI Assistant' : 'Demo Mode'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-primary-200 transition-colors duration-200"
        >
          <X className="h-5 w-5" />
        </button>
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