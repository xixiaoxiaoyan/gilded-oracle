'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shuffle, RefreshCw, Sparkles, Lock, BookOpen, Volume2, VolumeX } from 'lucide-react'
import { lenormandCards } from '@/data/lenormandData'
import { generateOracleReading } from './oracleReadingEngine'

const SPREADS = {
  single: {
    name: '每日一抽',
    count: 1,
    layout: 'single',
    positionMeanings: ['核心指引']
  },
  three: {
    name: '经典三牌',
    count: 3,
    layout: 'horizontal',
    positionMeanings: ['起因·过去', '现状·核心', '发展·建议']
  },
  nine: {
    name: '命运九宫格',
    count: 9,
    layout: 'grid',
    positionMeanings: [
      '现状', '挑战', '远期',
      '近期', '核心', '外部影响',
      '潜意识', '环境', '结局'
    ]
  }
}

export default function OracleDeck() {
  const [deck, setDeck] = useState([...lenormandCards])
  const [drawnCards, setDrawnCards] = useState<any[]>([])
  const [selectedSpread, setSelectedSpread] = useState('single')
  const [question, setQuestion] = useState('')
  const [isShuffling, setIsShuffling] = useState(false)
  const [oracleRevealed, setOracleRevealed] = useState(false)
  const [reading, setReading] = useState<any>(null)
  const [isRevealing, setIsRevealing] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [isShufflePressed, setIsShufflePressed] = useState(false)
  const [shuffleProgress, setShuffleProgress] = useState(0)
  const shuffleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const shuffleIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // 环境音系统 - 天空之城
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [audioLoading, setAudioLoading] = useState(false)

  const currentSpread = SPREADS[selectedSpread as keyof typeof SPREADS]
  const canDraw = drawnCards.length < currentSpread.count
  const isComplete = drawnCards.length === currentSpread.count
  const hasQuestion = question.trim().length > 0
  const isDeckLocked = !hasQuestion

  // 加载YouTube API
  useEffect(() => {
    // 动态加载YouTube iframe API
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    // 全局回调函数
    ;(window as any).onYouTubeIframeAPIReady = () => {
      console.log('YouTube API ready')
    }
  }, [])

  // YouTube播放器管理
  useEffect(() => {
    if (soundEnabled && !(window as any).YT) {
      setAudioLoading(true)
      // 等待YouTube API加载
      const checkYT = setInterval(() => {
        if ((window as any).YT && (window as any).YT.Player) {
          clearInterval(checkYT)
          initPlayer()
        }
      }, 100)
      return () => clearInterval(checkYT)
    } else if (soundEnabled && !(window as any).player) {
      initPlayer()
    } else if (!soundEnabled && (window as any).player) {
      ;(window as any).player.stopVideo()
      setAudioLoading(false)
    }

    function initPlayer() {
      if ((window as any).player) return

      setAudioLoading(true)
      ;(window as any).player = new (window as any).YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: 'h5R5701ti1g', // 天空之城 - 久石让
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: 'h5R5701ti1g',
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(30)
            event.target.playVideo()
            setAudioLoading(false)
            console.log('✅ 天空之城播放成功')
          },
          onError: (event: any) => {
            console.log('❌ YouTube播放错误:', event.data)
            setAudioLoading(false)
          }
        }
      })
    }

    return () => {
      if ((window as any).player && !soundEnabled) {
        ;(window as any).player.stopVideo()
      }
    }
  }, [soundEnabled])

  const shuffleDeck = () => {
    setIsShuffling(true)
    setOracleRevealed(false)
    setReading(null)
    setShowWarning(false)
    setTimeout(() => {
      const shuffled = [...lenormandCards].sort(() => Math.random() - 0.5)
      setDeck(shuffled)
      setDrawnCards([])
      setIsShuffling(false)
    }, 800)
  }

  // 长按洗牌处理
  const startShufflePress = () => {
    setIsShufflePressed(true)
    setShuffleProgress(0)

    // 进度条动画 - 2秒内完成
    shuffleIntervalRef.current = setInterval(() => {
      setShuffleProgress(prev => {
        if (prev >= 100) {
          clearInterval(shuffleIntervalRef.current!)
          return 100
        }
        return prev + 1.5 // 2秒内完成 (100 / 66.67 intervals * 30ms)
      })
    }, 30)

    // 2秒后触发洗牌
    shuffleTimerRef.current = setTimeout(() => {
      shuffleDeck()
      setIsShufflePressed(false)
      setShuffleProgress(0)
    }, 2000)
  }

  const endShufflePress = () => {
    if (shuffleTimerRef.current) {
      clearTimeout(shuffleTimerRef.current)
    }
    if (shuffleIntervalRef.current) {
      clearInterval(shuffleIntervalRef.current)
    }
    setIsShufflePressed(false)
    setShuffleProgress(0)
  }

  const changeSpread = (spreadKey: string) => {
    setSelectedSpread(spreadKey)
    setDrawnCards([])
    setOracleRevealed(false)
    setReading(null)
    setShowWarning(false)
    setDeck([...lenormandCards])
  }

  const tryDrawCard = (card: any, index: number) => {
    if (!canDraw) return

    if (isDeckLocked) {
      setShowWarning(true)
      setTimeout(() => setShowWarning(false), 3000)
      return
    }

    const newDeck = deck.filter((_, i) => i !== index)
    const newDrawnCards = [...drawnCards, card]
    setDeck(newDeck)
    setDrawnCards(newDrawnCards)

    if (oracleRevealed) {
      setOracleRevealed(false)
      setReading(null)
    }
  }

  const returnCard = (cardIndex: number) => {
    const cardToReturn = drawnCards[cardIndex]
    const newDrawnCards = drawnCards.filter((_, i) => i !== cardIndex)
    setDeck([...deck, cardToReturn])
    setDrawnCards(newDrawnCards)
    setOracleRevealed(false)
    setReading(null)
  }

  const revealGuidance = () => {
    if (!isComplete) return

    setIsRevealing(true)

    setTimeout(() => {
      const oracleReading = generateOracleReading(question, drawnCards, selectedSpread)
      setReading(oracleReading)
      setOracleRevealed(true)
      setIsRevealing(false)

      setTimeout(() => {
        document.getElementById('oracle-reading')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }, 100)
    }, 1500)
  }

  const getReadingLayoutClass = () => {
    if (currentSpread.layout === 'grid') return 'grid grid-cols-3 gap-6 max-w-2xl mx-auto'
    if (currentSpread.layout === 'horizontal') return 'flex flex-wrap justify-center gap-8 max-w-4xl mx-auto'
    return 'flex justify-center'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1614]">
      {/* 环境音控制 - 右上角（天空之城） */}
      <div className="fixed top-8 right-8 z-50">
        <div className="flex items-center gap-3">
          {/* 隐藏的YouTube播放器 */}
          <div id="youtube-player" style={{ display: 'none' }}></div>

          <div className="relative">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              disabled={audioLoading}
              className="w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white/60 hover:text-white/80 hover:border-white/20 transition-all disabled:opacity-50"
              title={soundEnabled ? "关闭天空之城" : "播放天空之城"}
            >
              {audioLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white/60 rounded-full animate-spin" />
              ) : soundEnabled ? (
                <Volume2 size={20} />
              ) : (
                <VolumeX size={20} />
              )}
            </button>
            {/* 音频状态提示 */}
            {soundEnabled && !audioLoading && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#d4af37]/80 rounded-full"
                style={{ boxShadow: '0 0 8px rgba(212, 175, 55, 0.4)' }}
              />
            )}
          </div>
        </div>
        {/* 音频提示 */}
        {!soundEnabled && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] font-sans text-white/30 mt-2 text-right font-light"
          >
            点击播放天空之城
          </motion.p>
        )}
        {soundEnabled && !audioLoading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] font-sans text-white/50 mt-2 text-right font-light"
          >
            正在播放：天空之城
          </motion.p>
        )}
      </div>

      <div className="w-full max-w-full px-4 py-20">
        {/* 标题 - 增加呼吸感 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <h1 className="text-7xl font-display font-bold mb-6 bg-gradient-to-b from-white/95 via-white/70 to-white/40 bg-clip-text text-transparent tracking-tight">
            Echo & Mirror
          </h1>
          <p className="text-lg font-sans text-white/40 tracking-wide font-light">
            倾听内心的雷诺曼
          </p>
        </motion.div>

        {/* 主面板 */}
        <div className="max-w-4xl mx-auto">
          {/* 问题输入区 - 日记本风格 */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="glass-strong rounded-[2.5rem] p-12">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen size={20} className="text-white/40" />
                <label className="text-sm font-sans text-white/50 font-light">
                  诚实地面对自己，您现在最关心的事是？
                </label>
              </div>
              <textarea
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value)
                  if (showWarning) setShowWarning(false)
                }}
                placeholder="在这里写下您的问题..."
                className="w-full px-8 py-6 font-sans text-base resize-none bg-white/[0.02] border border-white/10 rounded-3xl focus:outline-none focus:ring-2 focus:ring-white/10 transition-all placeholder:text-white/20 font-light leading-relaxed"
                style={{
                  color: '#ffffff',
                  minHeight: '120px',
                  boxShadow: hasQuestion ? '0 0 30px rgba(255, 255, 255, 0.08)' : 'none',
                }}
              />
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs font-sans text-white/30 font-light">
                  {hasQuestion ? '✓ 已建立内心链接' : '请先写下您的问题'}
                </p>
                {hasQuestion && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-[#d4af37]/80 rounded-full"
                    style={{ boxShadow: '0 0 12px rgba(212, 175, 55, 0.4)' }}
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* 警告提示 */}
          <AnimatePresence>
            {showWarning && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 p-5 glass rounded-2xl flex items-start gap-4"
              >
                <Lock size={20} className="text-white/50 flex-shrink-0 mt-0.5" />
                <p className="font-sans text-sm text-white/60 font-light">
                  请先诚实地写下您心中的困惑。
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 控制面板 */}
          <div className="glass rounded-[2.5rem] p-10 mb-10">
            {/* 牌阵选择器 */}
            <div className="mb-10">
              <label className="block text-sm font-sans mb-5 text-white/50 font-light">
                选择牌阵
              </label>
              <div className="inline-flex bg-[#2d1810]/30 rounded-2xl p-2 border border-white/8">
                {Object.entries(SPREADS).map(([key, spread]) => (
                  <button
                    key={key}
                    onClick={() => changeSpread(key)}
                    className={`px-10 py-4 font-sans text-sm rounded-xl transition-all font-light ${
                      selectedSpread === key
                        ? 'bg-white text-black shadow-lg'
                        : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    {spread.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 控制按钮 */}
            <div className="flex justify-center gap-6">
              {/* 长按洗牌按钮 */}
              <button
                onMouseDown={startShufflePress}
                onMouseUp={endShufflePress}
                onMouseLeave={endShufflePress}
                onTouchStart={startShufflePress}
                onTouchEnd={endShufflePress}
                disabled={isShuffling}
                className="relative overflow-hidden px-10 py-5 font-sans text-sm bg-white/8 hover:bg-white/10 border border-white/10 rounded-2xl text-white/80 transition-all flex items-center gap-4 font-light min-w-[200px] justify-center"
              >
                {isShuffling ? (
                  <>
                    <Shuffle className="animate-spin" size={18} />
                    正在洗牌...
                  </>
                ) : isShufflePressed ? (
                  <>
                    <Shuffle size={18} />
                    正在同步您的心流...
                  </>
                ) : (
                  <>
                    <Shuffle size={18} />
                    长按洗牌 (2s)
                  </>
                )}

                {/* 进度条 - 哑光金呼吸效果 */}
                {isShufflePressed && (
                  <>
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37]/70 to-transparent"
                      initial={{ width: '0%' }}
                      animate={{ width: `${shuffleProgress}%` }}
                      transition={{ duration: 0.03 }}
                      style={{
                        boxShadow: '0 0 12px rgba(212, 175, 55, 0.5), 0 0 24px rgba(212, 175, 55, 0.3)'
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0, 0.3, 0],
                        boxShadow: [
                          'inset 0 0 20px rgba(212, 175, 55, 0)',
                          'inset 0 0 30px rgba(212, 175, 55, 0.4)',
                          'inset 0 0 20px rgba(212, 175, 55, 0)'
                        ]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </>
                )}
              </button>

              <button
                onClick={() => { changeSpread(selectedSpread) }}
                className="px-10 py-5 font-sans text-sm bg-white/5 hover:bg-white/8 border border-white/8 hover:border-[#d4af37]/20 rounded-2xl text-white/70 hover:text-white/80 transition-all flex items-center gap-4 font-light"
              >
                <RefreshCw size={18} />
                重置
              </button>
            </div>
          </div>

          {/* 牌堆区 - 网格布局 */}
          <div className="glass rounded-[2.5rem] p-10 mb-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-display text-white/80 font-light">
                牌堆 ({deck.length} 张) - 网格布局
              </h2>
              {drawnCards.length > 0 && (
                <span className="text-sm font-sans text-white/40 font-light">
                  已抽取 {drawnCards.length} / {currentSpread.count}
                </span>
              )}
            </div>

            {/* 封印提示 */}
            {isDeckLocked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8 p-5 bg-[#2d1810]/30 border border-white/8 rounded-2xl flex items-center justify-center gap-3"
              >
                <Lock size={18} className="text-white/30" />
                <p className="font-sans text-sm text-white/40 font-light">
                  请先诚实地写下您心中的困惑。
                </p>
              </motion.div>
            )}

            {/* 网格布局容器 - 响应式6列网格 */}
            <div
              className={`relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pb-8 w-full transition-all ${
                isDeckLocked ? 'opacity-20' : ''
              } ${drawnCards.length > 0 ? 'opacity-40' : ''}`}
              onClick={() => {
                if (isDeckLocked) {
                  setShowWarning(true)
                  setTimeout(() => setShowWarning(false), 3000)
                }
              }}
            >
              {deck.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={isDeckLocked || drawnCards.length > 0 ? {} : { scale: 1.05, y: -4 }}
                  whileTap={isDeckLocked || drawnCards.length > 0 ? {} : { scale: 0.98 }}
                  onClick={() => tryDrawCard(card, index)}
                  className="relative"
                  style={{
                    cursor: isDeckLocked || drawnCards.length > 0 ? 'default' : 'pointer'
                  }}
                >
                  {/* 卡背 - 极简几何 */}
                  <div
                    className="w-full aspect-[3/4] bg-gradient-to-br from-white/8 to-white/3 border border-white/15 rounded-[1.5rem] flex items-center justify-center relative overflow-hidden"
                    style={{
                      boxShadow: (isDeckLocked || drawnCards.length > 0) ? 'none' : '0 8px 24px rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    {/* 极简几何图案 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-white/10 rounded-full" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {deck.length === 0 && (
                <div className="w-full text-center py-16 text-white/30 font-sans font-light">
                  牌堆已空，请点击"重置"开始新的探索
                </div>
              )}
            </div>

            {/* 唤醒按钮 */}
            {isComplete && !isRevealing && !oracleRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 text-center"
              >
                <button
                  onClick={revealGuidance}
                  className="px-16 py-6 font-sans text-lg bg-gradient-to-r from-white/10 to-white/8 hover:from-white/12 hover:to-white/8 border border-white/15 rounded-3xl text-white transition-all flex items-center gap-4 mx-auto font-light"
                  style={{ boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)' }}
                >
                  <Sparkles size={24} className="text-[#d4af37]/70" />
                  开始解读
                </button>
              </motion.div>
            )}

            {/* 加载状态 */}
            {isRevealing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-10 py-16 text-center"
              >
                <div className="flex items-center justify-center gap-5 mb-5">
                  <Sparkles className="animate-pulse" size={32} style={{ color: 'rgba(212, 175, 55, 0.5)' }} />
                  <p className="font-sans text-lg text-white/60 font-light">
                    正在解读...
                  </p>
                  <Sparkles className="animate-pulse" size={32} style={{ color: 'rgba(212, 175, 55, 0.5)' }} />
                </div>
                <div className="w-56 h-0.5 bg-white/10 rounded-full mx-auto overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </motion.div>
            )}

            {isComplete && oracleRevealed && !isRevealing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-10 py-6 text-center"
              >
                <p className="font-sans text-white/30 font-light">↓ 向下查看解读 ↓</p>
              </motion.div>
            )}
          </div>

          {/* 解牌区 */}
          {drawnCards.length > 0 && (
            <div className="glass rounded-[2.5rem] p-10 mb-10">
              <h2 className="text-xl font-display mb-10 text-center text-white/80 font-light">
                {currentSpread.name}
              </h2>

              <div className={getReadingLayoutClass()}>
                <AnimatePresence>
                  {drawnCards.map((card, index) => {
                    const positionLabel = currentSpread.positionMeanings[index]

                    return (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ delay: index * 0.12 }}
                        className="flex flex-col items-center"
                      >
                        {/* 位置标签 */}
                        <span className="text-xs font-sans mb-5 text-center text-white/40 max-w-[120px] font-light leading-relaxed">
                          {positionLabel}
                        </span>

                        {/* 卡牌 */}
                        <div
                          className="relative bg-gradient-to-br from-white/10 to-white/4 border border-white/15 rounded-[2rem] transition-all"
                          style={{
                            width: '168px',
                            height: '252px',
                            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)'
                          }}
                        >
                          {/* 卡片内容 */}
                          <div className="h-full flex flex-col items-center justify-center p-8">
                            {/* 编号 */}
                            <div
                              className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center mb-5 bg-white/8"
                            >
                              <span className="font-display font-bold text-2xl text-white/90">
                                {card.id}
                              </span>
                            </div>

                            {/* 名称 */}
                            <h3 className="text-xl font-display text-center mb-3 text-white/90 font-light">
                              {card.name}
                            </h3>

                            {/* 法文名 */}
                            <p className="text-xs font-sans text-center mb-6 text-white/40 font-light">
                              {card.frenchName}
                            </p>

                            {/* 关键词 */}
                            <div className="flex flex-wrap justify-center gap-2">
                              {card.keywords.slice(0, 2).map((keyword: string, i: number) => (
                                <span
                                  key={i}
                                  className="text-xs px-4 py-2 font-sans bg-white/8 border border-white/10 rounded-2xl text-white/60 font-light"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* 返回按钮 */}
                          <button
                            onClick={() => returnCard(index)}
                            className="absolute -top-4 -right-4 w-10 h-10 bg-black/70 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white/70 hover:bg-white hover:text-black transition-all text-xl font-light"
                            style={{ lineHeight: 1 }}
                          >
                            ×
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* 心灵洞察报告 */}
          <AnimatePresence>
            {oracleRevealed && reading && !isRevealing && (
              <motion.div
                id="oracle-reading"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -60 }}
                transition={{ duration: 0.6 }}
                className="glass-strong rounded-[2.5rem] p-12"
              >
                {/* 报告头部 */}
                <div className="text-center mb-12 pb-10 border-b border-white/10">
                  <h3 className="text-4xl font-display mb-5 bg-gradient-to-b from-white/80 to-white/30 bg-clip-text text-transparent font-light">
                    心灵洞察
                  </h3>
                  <p className="text-sm font-sans text-white/30 font-light">
                    {reading.timestamp}
                  </p>
                </div>

                {/* 解读内容 */}
                <div className="mb-12 p-10 bg-black/20 rounded-3xl space-y-8">
                  <div className="font-sans leading-loose whitespace-pre-line text-white/70 font-light" style={{ fontSize: '15px', lineHeight: '1.9' }}>
                    {reading.readingText}
                  </div>
                </div>

                {/* 报告尾部 */}
                <div className="pt-10 border-t border-white/10 text-center">
                  <p className="font-display text-sm text-white/40 font-light leading-relaxed">
                    这些牌是您内心的一面镜子<br />
                    愿您在反思中找到方向
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 页脚 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-32 text-white/20 font-sans text-sm font-light"
        >
          <p>Echo & Mirror</p>
          <p className="mt-2 text-white/15">倾听内心的雷诺曼</p>
        </motion.div>
      </div>
    </div>
  )
}
