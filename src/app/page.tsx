'use client'

import dynamic from 'next/dynamic'

const OracleDeck = dynamic(() => import('@/components/OracleDeck'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-16 h-16 border-2 border-white/20 border-t-white/50 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/40 text-sm font-sans font-light">正在准备...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  return <OracleDeck />
}
