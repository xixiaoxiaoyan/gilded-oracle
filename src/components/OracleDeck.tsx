'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shuffle, RefreshCw, Sparkles, Lock, BookOpen, Volume2, VolumeX } from 'lucide-react'
import { lenormandCards } from '@/data/lenormandData'

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

/**
 * 深度解读引擎 - 资深心理占卜师口吻
 * 从【现状】、【阻碍】、【指引】三个维度给出真诚的长文本建议
 */
const generateOracleReading = (question: string, drawnCards: any[], spreadType: string) => {
  const cards = drawnCards

  // 【现状】分析
  const buildCurrentSituation = () => {
    let situation = ""

    if (spreadType === 'single') {
      const card = cards[0]
      situation = `现在，让我们真诚地面对您当下的处境。

${card.name}这张牌出现在您面前，并非偶然。它映照出您生命中最真实的那个面向。从牌面上看，您正处于一个与${card.keywords[0]}和${card.keywords[1]}密切相关的阶段。

这张牌在告诉您：您现在所经历的一切——无论是内心的感受还是外在的境遇——都是真实的、值得被看见的。${card.meaning}

${question ? `当您问起「${question}」时，这张牌回应说：您对${card.keywords[0]}的关注和感受是合理的，是值得被认真对待的。` : '这张牌在提醒您：不要忽视当下的感受和处境，它们都是您生命旅程中重要的一部分。'}`
    } else if (spreadType === 'three') {
      const [past, present, future] = cards
      situation = `现在，让我们真诚地面对您当下的处境。

这组牌展现了一个完整的故事。${past.name}代表您走过的路，${present.name}是您此刻的立足点，而${future.name}则指向未来的可能性。

从${past.keywords[0]}的经历出发，您经历了转变和成长，最终抵达了${present.keywords[0]}的当下。${present.meaning}

${present.name}在告诉您：您现在所经历的一切——无论是内心的感受还是外在的境遇——都是真实的、值得被看见的。${past.name}的过去没有消失，它成为了您现在的一部分；而${future.name}的未来也并非遥不可及，它正在从您当下的每一刻中孕育而生。

${question ? `当您问起「${question}」时，这组牌回应说：从${past.keywords[0]}的过去到${present.keywords[0]}的当下，您已经走了一段重要的路。而${future.keywords[0]}的未来，正在从您现在的每一个选择中逐渐成形。` : '这组牌在提醒您：不要割裂地看待过去、现在和未来，它们是一个连续的流动，共同构成了您生命的完整图景。'}`
    } else if (spreadType === 'nine') {
      situation = `现在，让我们真诚地面对您当下的处境。

这九张牌构成了一个完整的生命图景。让我们先看看您当下的立足点——${cards[4].name}（核心）这张牌。${cards[4].meanings}

${cards[0].name}（现状）与${cards[3].name}（近期）共同描述了您现在的处境。${cards[0].meaning}而${cards[3].keywords[0]}则显示，在最近的时光里，您正在经历与${cards[3].keywords[1]}相关的体验。

${cards[7].name}（环境）和${cards[5].name}（外部影响）也在塑造着您现在的处境。${cards[7].keywords[0]}和${cards[5].keywords[0]}的力量交织在一起，构成了您当下的生活场域。

${question ? `当您问起「${question}」时，这个九宫格回应说：您当下的处境是多维度的，${cards[4].keywords[0]}是核心议题，而${cards[0].keywords[0]}和${cards[3].keywords[0]}则描述了它的具体表现。` : '这个九宫格在提醒您：您当下的处境是多层次的，内在感受、外在环境、过去经历和未来期待都在同时起作用。'}`
    }

    return situation
  }

  // 【阻碍】分析
  const buildObstacles = () => {
    let obstacles = ""

    // 识别挑战牌
    const challengeCards = cards.filter(c =>
      ['云', '蛇', '老鼠', '棺材', '山', '十字架', '鞭子'].includes(c.name)
    )

    if (challengeCards.length === 0) {
      obstacles = `关于阻碍，我想告诉您：从这组牌来看，您现在并没有遇到明显的内在或外在阻力。

但这并不意味着没有挑战。很多时候，最大的阻碍是我们自己的恐惧、犹豫或自我怀疑。即使牌面上没有出现明显的挑战牌，您仍然可能在内心深处感到不安或困惑。

如果您确实感到有什么在阻碍着您，那么这种阻碍很可能来自于：
• 对未知的恐惧
• 对自己能力的不信任
• 对变化的抗拒
• 对他人期待的内在化

请记住：这些感受都是正常的。它们不是您软弱的表现，而是您真实人性的一部分。允许自己感受这些情绪，不评判它们，这本身就是跨越障碍的第一步。`
    } else {
      const obstacleDescriptions: string[] = []

      challengeCards.forEach(card => {
        if (card.name === '云') {
          obstacleDescriptions.push(`${card.name}出现在这里，说明您正在经历困惑和不确定。这种迷茫感可能让一切都变得不清晰，您不知道该往哪个方向走。但我想告诉您：困惑是成长的前奏。当旧的认知不再适用，而新的理解尚未形成时，困惑就会自然产生。它不是错误，而是转变的信号。`)
        } else if (card.name === '蛇') {
          obstacleDescriptions.push(`${card.name}的出现，提示您需要警惕可能存在的欺骗或复杂情况。这可能来自他人，也可能来自您自己的自我欺骗。有时候，我们会欺骗自己，假装一切都好，或者逃避面对真相。这张牌在温和地提醒您：诚实地面对自己和他人，即使真相并不总是令人愉悦。`)
        } else if (card.name === '老鼠') {
          obstacleDescriptions.push(`${card.name}在这里，表示有一些事情正在逐渐侵蚀您的能量、资源或信心。这可能不是一次大的打击，而是许多小事的累积——那些被忽视的细节、未被表达的感受、被推迟的决定。它们看似微不足道，但长期积累下来，却可能造成实质性的损耗。这张牌在提醒您：关注那些细小的问题，在它们变得无法处理之前。`)
        } else if (card.name === '棺材') {
          obstacleDescriptions.push(`${card.name}的出现，可能让您感到不安。但我想告诉您：这张牌并不总是代表消极的意义。它更多是在提示您，某个阶段、某种模式、某个关系或某种心态正在或需要结束。这种结束可能让人感到痛苦，但它也是新生的必要条件。没有结束，就没有开始。`)
        } else if (card.name === '山') {
          obstacleDescriptions.push(`${card.name}在这里，清晰地显示了您面临的障碍。这是一座需要攀登的山，一个需要克服的挑战。它可能是一个实际的困难，也可能是一个内心的阻碍——恐惧、自我怀疑、或不安全感。无论这座山是什么，我想告诉您：它不是不可逾越的。它需要时间、耐心和坚持，但它是可以跨越的。`)
        } else if (card.name === '十字架') {
          obstacleDescriptions.push(`${card.name}出现在这里，说明您正在承担某种责任或负担。这可能是一种道德责任，一个对他人的承诺，或是一个您无法推卸的义务。这种负担可能让您感到沉重，但它也是您生命意义的一部分。这张牌在提醒您：您不需要独自承担一切，寻求支持是明智的，不是软弱的表现。`)
        } else if (card.name === '鞭子') {
          obstacleDescriptions.push(`${card.name}在这里，提示可能存在冲突、争论或重复性困境。这可能是一个外在的冲突——与他人的分歧或争执；也可能是一个内在的冲突——您自己内心的矛盾和纠结。无论是哪种，这张牌都在提醒您：真正的解决不是来自对抗，而是来自理解和整合。`)
        }
      })

      obstacles = `关于阻碍，我想真诚地与您探讨。

这组牌显示了一些挑战性的力量。让我为您解读：

${obstacleDescriptions.join('\n\n')}

${challengeCards.length > 1 ? `当多张挑战牌同时出现时，这些障碍之间可能存在关联。它们可能不是独立的问题，而是同一困境的不同面向。我建议您：先处理最紧迫的那个，其他的往往会随之松动。` : '这个障碍是真实的，但它不是故事的全部。它只是您当前处境中的一个面向，不是全部。'}

请记住：承认障碍的存在，不等于向它屈服。相反，只有诚实地看见它，您才能找到跨越它的方法。`
    }

    return obstacles
  }

  // 【指引】建议
  const buildGuidance = () => {
    let guidance = ""

    // 识别积极牌
    const positiveCards = cards.filter(c =>
      ['太阳', '星星', '幸运草', '花束', '心', '钥匙', '狗', '鹳鸟', '百合'].includes(c.name)
    )

    // 识别行动牌
    const actionCards = cards.filter(c =>
      ['骑士', '船', '路', '镰刀', '鸟', '鱼'].includes(c.name)
    )

    guidance = `现在，让我为您提供一些真诚的指引。

首先，我想确认您的资源。${positiveCards.length > 0 ? `这组牌中有一些非常积极的能量：${positiveCards.map(c => c.name).join('、')}。这些牌显示，您拥有${positiveCards[0].keywords[0]}的内在资源，${positiveCards.length > 1 ? '以及' + positiveCards[1].keywords[0] + '的支持。' : ''}信任这些力量，它们会为您指引方向。` : '即使牌面中没有明显的积极牌，这也不意味着您没有资源。您本身——您的勇气、智慧、和求问的意愿——就是最重要的资源。'}

${actionCards.length > 0 ? `其次，这组牌提示了一些可能的行动方向：${actionCards.map(c => c.name).join('、')}。${actionCards[0].keywords[0]}和${actionCards[0].keywords[1]}是值得您关注的生命面向。` : '关于行动，我建议您从小步开始。不要急于大的改变，而是从日常中可以立即实施的小行动开始。'}

基于这组牌，我想给您以下具体建议：

• 关注您的${cards[0].keywords[0]}。这张牌是整个解读的入口，它指出了最需要您关注和投入的那个生命面向。

${cards.length >= 2 ? `• 注意您与${cards[1].keywords[0]}的关系。这张牌在提示您，${cards[1].keywords[1]}可能在您现在的处境中扮演重要角色。` : ''}

${cards.length >= 3 ? `• 特别关注${cards[Math.floor(cards.length / 2)].name}（${cards[Math.floor(cards.length / 2)].keywords[0]}）。这张牌位于中心位置，${cards[Math.floor(cards.length / 2)].meaning}` : ''}

• ${cards[cards.length - 1].keywords[0]}指向了未来的可能性。${cards[cards.length - 1].meaning}

最后，我想说：这些牌不是宿命的判决，而是当下视角的映射。它们在告诉您"现在是什么"和"可能是什么"，但它们不能决定"将要是什么"。真正的力量始终在您手中。

${question ? `关于「${question}」，这组牌的建议是：从${cards[0].keywords[0]}开始，信任${cards[cards.length - 1].keywords[0]}的可能性。您拥有面对这个问题的智慧和勇气。` : '信任这个过程。有时候，答案不是立即显现的，但只要您保持诚实和耐心，方向会逐渐清晰。'}

愿您在反思中找到力量，在行动中找到方向。

您并不孤单，这本身就是一个重要的真相。`

    return guidance
  }

  const readingText = `
【现状】

${buildCurrentSituation()}


【阻碍】

${buildObstacles()}


【指引】

${buildGuidance()}
`

  return {
    opening: `让我们真诚地面对您的问题。`,
    readingText,
    timestamp: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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

  // 环境音系统
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [selectedSound, setSelectedSound] = useState<'fireplace' | 'rain'>('fireplace')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentSpread = SPREADS[selectedSpread as keyof typeof SPREADS]
  const canDraw = drawnCards.length < currentSpread.count
  const isComplete = drawnCards.length === currentSpread.count
  const hasQuestion = question.trim().length > 0
  const isDeckLocked = !hasQuestion

  // 音效管理
  useEffect(() => {
    if (soundEnabled) {
      if (!audioRef.current) {
        audioRef.current = new Audio()
        audioRef.current.loop = true
        audioRef.current.volume = 0.15 // 极低分贝
      }

      // 根据选择设置音效源（使用免费的音效资源）
      if (selectedSound === 'fireplace') {
        audioRef.current.src = 'https://assets.mixkit.co/active_storage/sfx/2418/2418-preview.m4a'
      } else {
        audioRef.current.src = 'https://assets.mixkit.co/active_storage/sfx/2450/2450-preview.m4a'
      }

      audioRef.current.play().catch(() => {
        console.log('Audio autoplay was prevented')
      })
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [soundEnabled, selectedSound])

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
      {/* 环境音控制 - 右上角 */}
      <div className="fixed top-8 right-8 z-50">
        <div className="flex items-center gap-3">
          {soundEnabled && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2"
            >
              <button
                onClick={() => setSelectedSound(selectedSound === 'fireplace' ? 'rain' : 'fireplace')}
                className={`text-xs font-sans px-3 py-1.5 rounded-xl transition-all font-light ${
                  selectedSound === 'fireplace'
                    ? 'bg-white/20 text-white/90'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                壁炉
              </button>
              <button
                onClick={() => setSelectedSound(selectedSound === 'rain' ? 'fireplace' : 'rain')}
                className={`text-xs font-sans px-3 py-1.5 rounded-xl transition-all font-light ${
                  selectedSound === 'rain'
                    ? 'bg-white/20 text-white/90'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                细雨
              </button>
            </motion.div>
          )}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white/60 hover:text-white/80 hover:border-white/20 transition-all"
          >
            {soundEnabled ? (
              <Volume2 size={20} />
            ) : (
              <VolumeX size={20} />
            )}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-20">
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

          {/* 牌堆区 */}
          <div className="glass rounded-[2.5rem] p-10 mb-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-display text-white/80 font-light">
                牌堆 ({deck.length} 张)
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

            {/* 横向滚动容器 */}
            <div
              className={`relative flex items-center gap-6 overflow-x-auto pb-8 transition-all ${
                isDeckLocked ? 'opacity-20' : ''
              } ${drawnCards.length > 0 ? 'opacity-40' : ''}`}
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255, 255, 255, 0.15) transparent' }}
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
                  whileHover={isDeckLocked || drawnCards.length > 0 ? {} : { scale: 1.06, y: -12 }}
                  whileTap={isDeckLocked || drawnCards.length > 0 ? {} : { scale: 0.98 }}
                  onClick={() => tryDrawCard(card, index)}
                  className="relative flex-shrink-0"
                  style={{
                    width: '128px',
                    height: '192px',
                    cursor: isDeckLocked || drawnCards.length > 0 ? 'default' : 'pointer'
                  }}
                >
                  {/* 卡背 - 极简几何 */}
                  <div
                    className="w-full h-full bg-gradient-to-br from-white/8 to-white/3 border border-white/15 rounded-[2rem] flex items-center justify-center relative overflow-hidden"
                    style={{
                      boxShadow: (isDeckLocked || drawnCards.length > 0) ? 'none' : '0 12px 40px rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    {/* 极简几何图案 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 border border-white/20 rounded-full flex items-center justify-center">
                        <div className="w-14 h-14 bg-white/10 rounded-full" />
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
