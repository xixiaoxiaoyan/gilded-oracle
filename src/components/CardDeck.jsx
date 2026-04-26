import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shuffle, RefreshCw, Sparkles, AlertCircle } from 'lucide-react'
import { lenormandCards } from '../data/lenormandData'

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
 * 神谕解析引擎（Mock 版本）
 * 后期可替换为真实 LLM API 调用
 *
 * @param {string} question - 用户问题
 * @param {Array} drawnCards - 抽出的卡牌数组
 * @param {string} spreadType - 牌阵类型 ('single' | 'three' | 'nine')
 * @returns {Object} 解析报告对象
 */
const generateOracleReading = (question, drawnCards, spreadType) => {
  const spread = SPREADS[spreadType]

  // 以第一人称占卜师口吻生成解读
  const buildReading = () => {
    const cardNames = drawnCards.map(c => c.name).join('、')

    if (spreadType === 'single') {
      const card = drawnCards[0]
      return `
求问者您好，我是您的雷诺曼占卜师。关于您所问的「${question}」，命运为您指引了【${card.name}】这张牌。

从这张牌中，我感受到了${card.keywords.slice(0, 2).join('与')}的能量。${card.name}告诉您：${card.meaning}

作为占卜师，我要特别提醒您：${card.keywords[0]}是当前的关键。这张牌的出现不是巧合，而是宇宙对您问题的直接回应。请相信自己的直觉，${card.meaning.slice(0, 30)}...命运已在您手中。
`
    }

    if (spreadType === 'three') {
      const [card1, card2, card3] = drawnCards
      return `
求问者您好，我是您的雷诺曼占卜师。您就「${question}」这一问题，在经典三牌阵中抽到了${cardNames}。请听我为您解读命运的指引。

【起因·过去】：${card1.name}
在这个位置上，${card1.name}揭示了您问题的起源。从${card1.keywords[0]}开始，${card1.meaning}这是导致您当前处境的深层原因。

【现状·核心】：${card2.name}
${card2.name}出现在核心位置绝非偶然。我强烈感受到${card2.keywords.slice(0, 2).join('与')}的能量正在您生命中发挥作用。${card2.meaning}这是您当下最需要关注的核心羁绊。

【发展·建议】：${card3.name}
对于未来，${card3.name}为您指明了方向。${card3.meaning}命运建议您关注${card3.keywords[0]}所代表的面向。

【占卜师的总结】
综合这三张牌，我看到一条清晰的命运线：从${card1.keywords[0]}的起源，经过${card2.keywords[0]}的当前考验，最终向${card3.keywords[0]}的方向发展。求问者，请记住：您已看清过去，理解当下，未来掌握在您自己手中。${card3.name}是命运给您的指引，但如何行走，仍需您以勇气和智慧抉择。
`
    }

    if (spreadType === 'nine') {
      const cards = drawnCards
      return `
求问者您好，我是您的雷诺曼占卜师。您就「${question}」这一重大问题，在命运九宫格中抽到了${cardNames}。这是一个非常完整的牌阵，请耐心聆听我的解读。

【九宫格完整解析】

从【现状】位置${cards[0].name}来看，${cards[0].meaning}

【挑战】位置的${cards[1].name}告诉您：${cards[1].keywords[0]}是您必须面对的障碍。${cards[1].meaning}

在【远期】的位置，${cards[2].name}预示着${cards[2].keywords.slice(0, 2).join('与')}的影响。

【近期】${cards[3].name}的出现意味着${cards[3].keywords[0]}即将到来。

而整个牌阵的【核心】——${cards[4].name}，揭示了问题的本质：${cards[4].meaning}

【外部影响】位置的${cards[5].name}显示了环境对您的影响。

在【潜意识】层面，${cards[6].name}反映了您内心深处的${cards[6].keywords[0]}。

【环境】位置的${cards[7].name}提示您关注${cards[7].keywords[0]}。

最后，【结局】位置的${cards[8].name}为整个占卜画下句点：${cards[8].meaning}

【占卜师的总结】
求问者，九宫格已为您呈现了命运的完整图景。核心卡${cards[4].name}告诉我：${cards[4].keywords.slice(0, 2).join('与')}是解开问题的关键。而结局卡${cards[8].name}则预示着${cards[8].keywords[0]}的走向。命运已为您揭示所有可能，如何抉择，在于您自己。
`
    }

    return ''
  }

  const readingText = buildReading()

  return {
    opening: `求问者您好，我是您的雷诺曼占卜师。关于您所问的「${question}」，请听命运的指引。`,
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

const CardDeck = () => {
  const [deck, setDeck] = useState([...lenormandCards])
  const [drawnCards, setDrawnCards] = useState([])
  const [selectedSpread, setSelectedSpread] = useState('single')
  const [question, setQuestion] = useState('')
  const [isShuffling, setIsShuffling] = useState(false)
  const [oracleRevealed, setOracleRevealed] = useState(false)
  const [reading, setReading] = useState(null)
  const [isRevealing, setIsRevealing] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  const currentSpread = SPREADS[selectedSpread]
  const canDraw = drawnCards.length < currentSpread.count
  const isComplete = drawnCards.length === currentSpread.count
  const hasQuestion = question.trim().length > 0
  const isDeckLocked = !hasQuestion

  // 洗牌
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

  // 切换牌阵
  const changeSpread = (spreadKey) => {
    setSelectedSpread(spreadKey)
    setDrawnCards([])
    setOracleRevealed(false)
    setReading(null)
    setShowWarning(false)
    setDeck([...lenormandCards])
  }

  // 尝试抽牌（带验证）
  const tryDrawCard = (card, index) => {
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

  // 返回牌到牌堆
  const returnCard = (cardIndex) => {
    const cardToReturn = drawnCards[cardIndex]
    const newDrawnCards = drawnCards.filter((_, i) => i !== cardIndex)
    setDeck([...deck, cardToReturn])
    setDrawnCards(newDrawnCards)
    setOracleRevealed(false)
    setReading(null)
  }

  // 唤醒命运指引
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

  // 获取解牌区布局类名
  const getReadingLayoutClass = () => {
    if (currentSpread.layout === 'grid') return 'grid grid-cols-3 gap-4 max-w-2xl mx-auto'
    if (currentSpread.layout === 'horizontal') return 'flex flex-wrap justify-center gap-6 max-w-4xl mx-auto'
    return 'flex justify-center'
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-serif font-bold mb-3" style={{ color: '#c5a059' }}>
            雷诺曼占卜屋
          </h1>
          <p className="text-lg font-serif" style={{ color: '#8b7355' }}>Lenormand Divination</p>
        </motion.div>

        {/* 问题输入区 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto mb-10"
        >
          <label className="block text-sm font-serif mb-3" style={{ color: '#c5a059' }}>
            ✧ 您心中的困惑 ✧
          </label>
          <textarea
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value)
              if (showWarning) setShowWarning(false)
            }}
            placeholder="请在此输入您的问题，例如：我接下来的职业发展会怎样？"
            className="w-full px-4 py-4 font-serif text-base resize-none border-b bg-transparent focus:outline-none transition-colors"
            style={{
              color: '#d4d4d4',
              borderColor: hasQuestion ? '#c5a059' : 'rgba(197, 160, 89, 0.3)',
              backgroundColor: 'transparent',
              minHeight: '80px'
            }}
            onFocus={(e) => e.target.style.borderColor = '#c5a059'}
            onBlur={(e) => {
              e.target.style.borderColor = hasQuestion ? '#c5a059' : 'rgba(197, 160, 89, 0.3)'
            }}
          />
          <p className="text-xs font-serif mt-2 text-right" style={{ color: '#8b7355' }}>
            {hasQuestion ? '✓ 意念已锁定' : '请先写下您的问题'}
          </p>
        </motion.div>

        {/* 牌阵选择器 */}
        <div className="flex justify-center gap-3 mb-10">
          {Object.entries(SPREADS).map(([key, spread]) => (
            <button
              key={key}
              onClick={() => changeSpread(key)}
              className={`px-6 py-3 font-serif text-sm transition-all border ${
                selectedSpread === key
                  ? 'bg-[#c5a059] text-[#1a1a1a] border-[#c5a059]'
                  : 'bg-transparent text-[#c5a059] border-[#c5a059]/30 hover:border-[#c5a059]/60'
              }`}
            >
              {spread.name}
            </button>
          ))}
        </div>

        {/* 控制按钮 */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={shuffleDeck}
            disabled={isShuffling}
            className="flex items-center gap-2 px-8 py-3 font-serif border border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059] hover:text-[#1a1a1a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Shuffle className={isShuffling ? 'animate-spin' : ''} size={18} />
            注入意念并洗牌
          </button>

          <button
            onClick={() => { changeSpread(selectedSpread) }}
            className="flex items-center gap-2 px-8 py-3 font-serif border border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059] hover:text-[#1a1a1a] transition-all"
          >
            <RefreshCw size={18} />
            净化牌阵
          </button>
        </div>

        {/* 警告提示 */}
        <AnimatePresence>
          {showWarning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl mx-auto mb-6 p-4 border flex items-start gap-3"
              style={{
                backgroundColor: 'rgba(197, 160, 89, 0.1)',
                borderColor: '#c5a059',
                borderRadius: '4px'
              }}
            >
              <AlertCircle size={20} style={{ color: '#c5a059', flexShrink: 0 }} />
              <p className="font-serif text-sm" style={{ color: '#c5a059' }}>
                请先在上方写下您心中的困惑，以建立命运的连结。
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 牌堆区 - 横向滚动 */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-serif" style={{ color: '#c5a059' }}>
              牌堆 ({deck.length} 张)
            </h2>
            {drawnCards.length > 0 && (
              <span className="text-sm font-serif" style={{ color: '#8b7355' }}>
                已抽取 {drawnCards.length} / {currentSpread.count}
              </span>
            )}
          </div>

          {/* 封印提示 */}
          {isDeckLocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-4 py-3 border"
              style={{ borderColor: 'rgba(197, 160, 89, 0.2)', backgroundColor: 'rgba(26, 26, 26, 0.8)' }}
            >
              <p className="font-serif text-sm" style={{ color: '#8b7355' }}>
                🔒 牌堆已封印，请先输入问题以建立连结
              </p>
            </motion.div>
          )}

          {/* 横向滚动容器 */}
          <div
            className={`relative flex items-center gap-4 overflow-x-auto pb-4 px-2 transition-all ${
              isDeckLocked ? 'opacity-30 cursor-not-allowed' : ''
            }`}
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#c5a059 #2a2a2a' }}
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
                whileHover={isDeckLocked ? {} : { scale: 1.05 }}
                whileTap={isDeckLocked ? {} : { scale: 0.95 }}
                onClick={() => tryDrawCard(card, index)}
                className="relative flex-shrink-0"
                style={{
                  width: '96px',
                  height: '144px',
                  cursor: isDeckLocked ? 'not-allowed' : 'pointer'
                }}
              >
                {/* 卡背 */}
                <div
                  className="w-full h-full border flex items-center justify-center transition-all hover:shadow-2xl"
                  style={{
                    backgroundColor: '#2a2a2a',
                    borderColor: isDeckLocked ? 'rgba(197, 160, 89, 0.2)' : 'rgba(197, 160, 89, 0.4)',
                    borderRadius: '4px'
                  }}
                >
                  <div className="w-16 h-16 border flex items-center justify-center" style={{ borderColor: '#c5a059', borderRadius: '50%' }}>
                    <span className="text-2xl font-serif" style={{ color: '#c5a059', opacity: isDeckLocked ? 0.3 : 1 }}>✧</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {deck.length === 0 && (
              <div className="w-full text-center py-8 text-[#8b7355] font-serif">
                牌堆已空，请点击"净化牌阵"开始新的占卜
              </div>
            )}
          </div>

          {isComplete && !isRevealing && !oracleRevealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-6"
            >
              <button
                onClick={revealGuidance}
                className="px-12 py-4 font-serif text-lg flex items-center gap-3 mx-auto border-2 transition-all hover:shadow-2xl"
                style={{
                  backgroundColor: '#c5a059',
                  color: '#1a1a1a',
                  borderColor: '#c5a059',
                  borderRadius: '4px'
                }}
              >
                <Sparkles size={20} />
                🌟 唤醒命运指引 (Reveal Guidance)
              </button>
            </motion.div>
          )}

          {isRevealing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-6 py-8"
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <Sparkles className="animate-pulse" size={24} style={{ color: '#c5a059' }} />
                <p className="font-serif text-lg" style={{ color: '#c5a059' }}>
                  正在解读星辰与牌面的共鸣...
                </p>
                <Sparkles className="animate-pulse" size={24} style={{ color: '#c5a059' }} />
              </div>
              <p className="font-serif text-sm" style={{ color: '#8b7355' }}>
                请稍候，神谕正在为您揭示命运的指引
              </p>
            </motion.div>
          )}

          {isComplete && oracleRevealed && !isRevealing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-6 py-4 border rounded"
              style={{ borderColor: 'rgba(197, 160, 89, 0.3)', backgroundColor: '#2a2a2a' }}
            >
              <p className="font-serif" style={{ color: '#c5a059' }}>↓ 命运已揭示，请向下查看 ↓</p>
            </motion.div>
          )}
        </div>

        {/* 解牌区 */}
        {drawnCards.length > 0 && (
          <div>
            <h2 className="text-xl font-serif mb-6 text-center" style={{ color: '#c5a059' }}>
              {currentSpread.name}
            </h2>

            {/* 牌阵布局 */}
            <div className={getReadingLayoutClass()}>
              <AnimatePresence>
                {drawnCards.map((card, index) => {
                  const positionLabel = currentSpread.positionMeanings[index]

                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col items-center"
                    >
                      {/* 位置标签 */}
                      <span className="text-xs font-serif mb-3 text-center" style={{ color: '#8b7355', maxWidth: '120px' }}>
                        {positionLabel}
                      </span>

                      {/* 卡牌 */}
                      <div
                        className="relative border transition-all hover:shadow-2xl"
                        style={{
                          width: '128px',
                          height: '192px',
                          backgroundColor: '#2a2a2a',
                          borderColor: '#c5a059',
                          borderRadius: '4px'
                        }}
                      >
                        {/* 卡片内容 */}
                        <div className="h-full flex flex-col items-center justify-center p-3">
                          {/* 编号 */}
                          <div
                            className="w-10 h-10 border flex items-center justify-center mb-2"
                            style={{ borderColor: '#c5a059', borderRadius: '50%' }}
                          >
                            <span className="font-serif font-bold" style={{ color: '#c5a059' }}>
                              {card.id}
                            </span>
                          </div>

                          {/* 名称 */}
                          <h3 className="text-base font-serif text-center mb-2" style={{ color: '#c5a059' }}>
                            {card.name}
                          </h3>

                          {/* 法文名 */}
                          <p className="text-xs font-serif text-center mb-3" style={{ color: '#8b7355' }}>
                            {card.frenchName}
                          </p>

                          {/* 关键词 */}
                          <div className="flex flex-wrap justify-center gap-1">
                            {card.keywords.slice(0, 2).map((keyword, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-1 font-serif"
                                style={{
                                  backgroundColor: 'rgba(197, 160, 89, 0.1)',
                                  color: '#c5a059',
                                  border: '1px solid rgba(197, 160, 89, 0.3)',
                                  borderRadius: '2px'
                                }}
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* 返回按钮 */}
                        <button
                          onClick={() => returnCard(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-[#1a1a1a] border border-[#c5a059] rounded-full flex items-center justify-center text-[#c5a059] text-sm hover:bg-[#c5a059] hover:text-[#1a1a1a] transition-all"
                          style={{ fontSize: '14px', lineHeight: 1 }}
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

        {/* 神谕解析报告 */}
        <AnimatePresence>
          {oracleRevealed && reading && !isRevealing && (
            <motion.div
              id="oracle-reading"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="mt-16 border p-10"
              style={{
                backgroundColor: '#2a2a2a',
                borderColor: 'rgba(197, 160, 89, 0.4)',
                borderRadius: '4px'
              }}
            >
              {/* 报告头部 */}
              <div className="text-center mb-8 pb-6 border-b" style={{ borderColor: 'rgba(197, 160, 89, 0.2)' }}>
                <h3 className="text-3xl font-serif mb-3" style={{ color: '#c5a059' }}>
                  ✧ 命运指引 ✧
                </h3>
                <p className="text-sm font-serif" style={{ color: '#8b7355' }}>
                  {reading.timestamp}
                </p>
              </div>

              {/* 占卜师的解读 */}
              <div className="mb-8 p-6" style={{ backgroundColor: 'rgba(26, 26, 26, 0.5)', borderRadius: '4px' }}>
                <div className="font-serif leading-relaxed whitespace-pre-line" style={{ color: '#d4d4d4', fontSize: '15px', lineHeight: '1.8' }}>
                  {reading.readingText}
                </div>
              </div>

              {/* 报告尾部 */}
              <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: 'rgba(197, 160, 89, 0.2)' }}>
                <p className="font-serif text-sm" style={{ color: '#8b7355' }}>
                  ✧ 愿命运的星辰为您照亮前路 ✧
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default CardDeck
