import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Echo & Mirror | 倾听内心的雷诺曼',
  description: '真诚的心灵指引，基于心理学视角的雷诺曼卡牌解读',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  )
}
