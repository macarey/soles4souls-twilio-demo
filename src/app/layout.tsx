import { Inter } from 'next/font/google'
import './globals.css'
import ChatProvider from '@/components/chat/ChatProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Levelpath Shoes - Premium Footwear',
  description: 'Discover premium shoes for every occasion at Levelpath Shoes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ChatProvider />
      </body>
    </html>
  )
}
