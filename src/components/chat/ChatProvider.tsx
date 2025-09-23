'use client'

import { useState } from 'react'
import ChatWidget from './ChatWidget'

export default function ChatProvider() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <ChatWidget 
      isOpen={isChatOpen} 
      onClose={() => setIsChatOpen(!isChatOpen)} 
    />
  )
}
