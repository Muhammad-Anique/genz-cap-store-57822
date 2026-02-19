import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'GenZ Cap Store | Unique Headwear Drops',
  description: 'Join the waitlist for exclusive Gen Z cap drops. Premium headwear designed for the bold and unique.',
  keywords: ['caps', 'headwear', 'Gen Z', 'streetwear', 'fashion', 'accessories'],
  openGraph: {
    title: 'GenZ Cap Store | Unique Headwear Drops',
    description: 'Join the waitlist for exclusive Gen Z cap drops. Premium headwear designed for the bold and unique.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}