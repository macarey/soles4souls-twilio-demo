import { Inter } from 'next/font/google'
import './globals.css'
import ChatProvider from '@/components/chat/ChatProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Soles4Souls - Fighting Poverty Through Shoes',
  description: 'Join Soles4Souls to turn unwanted shoes into opportunities, providing relief and creating jobs worldwide',
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
