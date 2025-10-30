import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Heritage Academy - Learn Heritage Architecture',
  description: 'Interactive educational platform for learning about heritage architecture, cultural preservation, and architectural history.',
  keywords: ['heritage', 'architecture', 'education', 'learning', 'cultural preservation'],
  authors: [{ name: 'Heritage Academy' }],
  openGraph: {
    title: 'Heritage Academy',
    description: 'Learn heritage architecture through interactive lessons and quizzes',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
