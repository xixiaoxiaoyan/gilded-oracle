/**
 * 严谨的雷诺曼占卜解读引擎
 * 遵循雷诺曼传统规则：诚实、具体、包含负面信息
 */
import { lenormandCards } from '@/data/lenormandData'

export const generateOracleReading = (question: string, drawnCards: any[], spreadType: string) => {
  const cards = drawnCards

  /**
   * 分析问题类型
   */
  const analyzeQuestion = () => {
    if (!question || question.trim().length === 0) {
      return { type: "general", topic: "整体运势" }
    }

    const q = question.toLowerCase()

    if (q.includes('怎么') && q.includes('看') && (q.includes('他') || q.includes('她') || q.includes('男朋友') || q.includes('女朋友') || q.includes('老公') || q.includes('老婆'))) {
      return { type: "perception", topic: "对方如何看待你" }
    }

    if (q.includes('爱') || q.includes('喜欢') || q.includes('感情') || q.includes('感觉')) {
      return { type: "feelings", topic: "感情状态" }
    }

    if (q.includes('在一起') || q.includes('结婚') || q.includes('未来') || q.includes('结果')) {
      return { type: "relationship_outcome", topic: "关系发展" }
    }

    if (q.includes('工作') || q.includes('事业') || q.includes('升职') || q.includes('辞职') || q.includes('offer')) {
      return { type: "career", topic: "事业发展" }
    }

    if (q.includes('选择') || q.includes('决定') || q.includes('要不要') || q.includes('如何')) {
      return { type: "decision", topic: "选择决定" }
    }

    if (q.includes('什么时候') || q.includes('何时') || q.includes('时间')) {
      return { type: "timing", topic: "时间预测" }
    }

    return { type: "general", topic: "整体运势" }
  }

  /**
   * 单张牌的完整解读（正面+负面）
   */
  const getSingleCardReading = (card: any, position: string = "general") => {
    const readings: { [key: string]: any } = {
      // 骑士 - 编号1
      '骑士': {
        positive: "好消息即将到来，可能是有利的消息、新的机会或重要人物的到来",
        negative: "消息可能来得快去得也快，或者消息不如预期。对方可能只是短暂兴趣，并非真心",
        timing: "1天、1周或1个月内",
        keywords: ["速度", "消息", "年轻男性"]
      },
      // 幸运草 - 编号2
      '幸运草': {
        positive: "好运和小确幸，机会出现但需要及时把握",
        negative: "运气短暂，机会稍纵即逝。不要期望太大的幸运，这只是小的好转",
        timing: "2天、2周或2个月内",
        keywords: ["幸运", "短暂", "小确幸"]
      },
      // 船 - 编号3
      '船': {
        positive: "即将有变化或远行，可能涉及出差、搬家或新的探索",
        negative: "可能面临分离、远离，或者关系中的一方要离开。船也可能代表逃避现实",
        timing: "3天、3周或3个月内",
        keywords: ["旅行", "探索", "分离"]
      },
      // 房子 - 编号4
      '房子': {
        positive: "稳定的家庭基础，安全感和归属感。可能涉及房产或家庭事务",
        negative: "可能被困在舒适区，或者家庭矛盾带来压力。房子也可能代表封闭、不与外界接触",
        timing: "4天、4周或4个月内",
        keywords: ["稳定", "家庭", "封闭"]
      },
      // 树 - 编号5
      '树': {
        positive: "健康、成长和长期稳定。根基牢固，利于长期发展",
        negative: "健康问题或成长停滞。也可能代表固守旧模式，拒绝改变",
        timing: "5天、5周或5个月内",
        keywords: ["健康", "成长", "固守"]
      },
      // 云 - 编号6
      '云': {
        positive: "困惑是暂时的，迷雾会散去。这个不确定的时期会过去",
        negative: "现在的情况非常不清晰，你可能在自欺欺人。不是做决定的好时机，容易出错",
        timing: "6天、6周或6个月内",
        keywords: ["困惑", "不确定", "迷雾"]
      },
      // 蛇 - 编号7
      '蛇': {
        positive: "你有足够的智慧应对复杂局面，能够看穿真相",
        negative: "警告！可能存在欺骗、背叛或第三者。有人可能在撒谎，或者你在欺骗自己。必须保持警惕",
        timing: "7天、7周或7个月内",
        keywords: ["智慧", "欺骗", "背叛"]
      },
      // 棺材 - 编号8
      '棺材': {
        positive: "某些事情必须结束，才能有新的开始。放下是必要的",
        negative: "明确的结束信号。关系、项目或阶段的终止。这不是暂时困难，是真的结束了",
        timing: "8天、8周或8个月内",
        keywords: ["结束", "死亡", "终止"]
      },
      // 花束 - 编号9
      '花束': {
        positive: "美好的事物即将到来，可能是礼物、赞美或愉快的社交",
        negative: "表面的美好，可能只是虚荣或短暂的快乐。不要被外表迷惑",
        timing: "9天、9周或9个月内",
        keywords: ["礼物", "赞美", "表面"]
      },
      // 镰刀 - 编号10
      '镰刀': {
        positive: "需要做出果断决定，或收获之前的努力成果",
        negative: "突然的切断或意外损失。有些事情会被强制结束，可能很痛",
        timing: "10天、10周或10个月内",
        keywords: ["切断", "决定", "意外"]
      },
      // 鞭子 - 编号11
      '鞭子': {
        positive: "通过努力和反复练习可以提升，或者冲突可以通过沟通解决",
        negative: "持续的冲突、争吵或折磨。关系可能存在暴力或虐待倾向",
        timing: "11天、11周或11个月内",
        keywords: ["冲突", "重复", "折磨"]
      },
      // 鸟 - 编号12
      '鸟': {
        positive: "重要的沟通、对话或好消息。可能有两件事同时发生",
        negative: "沟通不畅、八卦或焦虑。可能有两人同时在说闲话",
        timing: "12天、12周或12个月内",
        keywords: ["沟通", "对话", "八卦"]
      },
      // 小孩 - 编号13
      '小孩': {
        positive: "新的开始、纯真的快乐或新的可能性",
        negative: "不成熟、幼稚的行为或缺乏经验。新事物可能需要很长时间才能成长",
        timing: "13天、13周或13个月内",
        keywords: ["新开始", "不成熟", "纯真"]
      },
      // 狐狸 - 编号14
      '狐狸': {
        positive: "你有足够的智慧处理复杂情况，需要策略和谨慎",
        negative: "有人在欺骗你，或者你在自欺欺人。工作中可能有问题，保持警惕",
        timing: "14天、14周或14个月内",
        keywords: ["策略", "欺骗", "工作"]
      },
      // 熊 - 编号15
      '熊': {
        positive: "有力量或资源支持你，可能是权威人物的庇护",
        negative: "可能被压制或控制。权威人物可能带来压力，需要保持距离保护自己",
        timing: "15天、15周或15个月内",
        keywords: ["力量", "权威", "压制"]
      },
      // 星星 - 编号16
      '星星': {
        positive: "希望、梦想和指引。虽然现在不明亮，但星光在指引方向",
        negative: "梦想可能过于遥远或不切实际。不要只看星星，也要看脚下的路",
        timing: "16天、16周或16个月内",
        keywords: ["希望", "梦想", "遥远"]
      },
      // 鹳鸟 - 编号17
      '鹳鸟': {
        positive: "积极的改变、回归或改善。事情会向好的方向发展",
        negative: "改变可能让你不安，或者你不愿意离开舒适区。成长需要勇气",
        timing: "17天、17周或17个月内",
        keywords: ["改变", "回归", "成长"]
      },
      // 狗 - 编号18
      '狗': {
        positive: "忠诚的朋友、可靠的伙伴或信任的关系",
        negative: "可能被朋友背叛，或者你过于依赖他人。盲目的忠诚是危险的",
        timing: "18天、18周或18个月内",
        keywords: ["忠诚", "友谊", "依赖"]
      },
      // 塔 - 编号19
      '塔': {
        positive: "权威机构或官方事务可能对你有利，或者你需要独处时间",
        negative: "可能被孤立、排斥或受到官方压力。你感到孤独无助",
        timing: "19天、19周或19个月内",
        keywords: ["权威", "孤立", "官方"]
      },
      // 花园 - 编号20
      '花园': {
        positive: "社交活动、公众认可或在公开场合露面的机会",
        negative: "可能被公众批评或隐私被侵犯。不是所有人都真心对你",
        timing: "20天、20周或20个月内",
        keywords: ["社交", "公众", "公开"]
      },
      // 山 - 编号21
      '山': {
        positive: "虽然有障碍，但通过坚持和努力可以克服",
        negative: "巨大的障碍，可能无法克服。需要考虑是否值得继续坚持",
        timing: "21天、21周或21个月内",
        keywords: ["障碍", "困难", "延迟"]
      },
      // 路 - 编号22
      '路': {
        positive: "有选择的余地，新的路径和可能性",
        negative: "可能迷失方向，或者面临艰难的选择。选择太多也会让人困惑",
        timing: "22天、22周或22个月内",
        keywords: ["选择", "岔路", "方向"]
      },
      // 老鼠 - 编号23
      '老鼠': {
        positive: "小问题可以及时处理，防止恶化",
        negative: "逐渐的损失和侵蚀，小问题会累积成大灾难。需要立即行动",
        timing: "23天、23周或23个月内",
        keywords: ["损失", "侵蚀", "担忧"]
      },
      // 心 - 编号24
      '心': {
        positive: "爱情、热情和情感满足。感情关系美好",
        negative: "心碎、情感冷漠或关系出现问题。可能需要面对情感创伤",
        timing: "24天、24周或24个月内",
        keywords: ["爱情", "情感", "心碎"]
      },
      // 戒指 - 编号25
      '戒指': {
        positive: "承诺、契约或正式的协议。关系进入稳定阶段",
        negative: "契约可能破裂，关系可能结束。承诺被打破是痛苦的",
        timing: "25天、25周或25个月内",
        keywords: ["承诺", "契约", "束缚"]
      },
      // 书 - 编号26
      '书': {
        positive: "知识、学习或隐藏的信息即将被揭示",
        negative: "秘密被隐瞒，或者你不知道全部真相。有些事情你无法得知",
        timing: "26天、26周或26个月内",
        keywords: ["秘密", "知识", "隐瞒"]
      },
      // 信 - 编号27
      '信': {
        positive: "重要的书面文件、合同或信息。正式的沟通",
        negative: "文件可能有问题，信息可能错误。仔细检查所有文件",
        timing: "27天、27周或27个月内",
        keywords: ["文件", "信息", "书面"]
      },
      // 男人 - 编号28
      '男人': {
        positive: "男性角色（如果你是女性，代表重要男性；如果是男性，代表你自己）表现积极",
        negative: "男性角色带来问题或压力。如果代表你，说明你现在状态不佳",
        timing: "28天、28周或28个月内",
        keywords: ["男性", "当事人", "理性"]
      },
      // 女人 - 编号29
      '女人': {
        positive: "女性角色（如果你是男性，代表重要女性；如果是女性，代表你自己）表现积极",
        negative: "女性角色带来问题或压力。如果代表你，说明你现在状态不佳",
        timing: "29天、29周或29个月内",
        keywords: ["女性", "当事人", "感性"]
      },
      // 百合 - 编号30
      '百合': {
        positive: "和谐、成熟和和平。关系稳定发展",
        negative: "可能过于平淡，缺乏激情。或者和谐只是表面的，问题被掩盖",
        timing: "30天、30周或30个月内",
        keywords: ["和谐", "成熟", "平淡"]
      },
      // 太阳 - 编号31
      '太阳': {
        positive: "巨大的成功、幸福和能量。最积极的牌，一切都会好起来",
        negative: "即使是最积极的牌也可能有负面：成功可能让你骄傲，或者需要长时间等待阳光",
        timing: "31天、31周或31个月内",
        keywords: ["成功", "幸福", "能量"]
      },
      // 月亮 - 编号32
      '月亮': {
        positive: "直觉、情感认可或公众关注。你的感受是真实的",
        negative: "情绪不稳定，可能有不真实的感觉。公众关注也可能是负面的",
        timing: "32天、32周或32个月内",
        keywords: ["直觉", "情感", "情绪"]
      },
      // 钥匙 - 编号33
      '钥匙': {
        positive: "找到解决方案，关键所在。问题是可解的",
        negative: "可能找不到关键，或者解决方案带来新的问题。钥匙也可能代表被锁住",
        timing: "33天、33周或33个月内",
        keywords: ["解决方案", "关键", "开启"]
      },
      // 鱼 - 编号34
      '鱼': {
        positive: "财务丰富、商业机会或情感深度",
        negative: "财务可能流失，或者感情过于复杂。鱼也代表无法把握的东西",
        timing: "34天、34周或34个月内",
        keywords: ["财富", "丰富", "流动"]
      },
      // 锚 - 编号35
      '锚': {
        positive: "稳定、安全和坚持。你有坚实的基础",
        negative: "可能被困住，无法移动。过度追求稳定会让你错过机会",
        timing: "35天、35周或35个月内",
        keywords: ["稳定", "固定", "被困"]
      },
      // 十字架 - 编号36
      '十字架': {
        positive: "承担责任会带来成长，考验会让你更强大",
        negative: "沉重的负担和责任。你可能被压垮，需要考虑是否值得",
        timing: "36天、36周或36个月内（或一年内）",
        keywords: ["负担", "责任", "牺牲"]
      }
    }

    return readings[card.name] || {
      positive: `${card.name}带来积极的变化`,
      negative: `${card.name}也可能带来挑战`,
      timing: `${card.id}天、${card.id}周或${card.id}个月内`,
      keywords: card.keywords
    }
  }

  /**
   * 牌的组合解读（雷诺曼的核心）
   */
  const getCombinationReading = (card1: any, card2: any) => {
    const combinations: { [key: string]: string } = {
      // 骑士的组合
      '骑士-船': '快速离开或远行的消息。某人即将离开，或者有远方来的消息',
      '骑士-房子': '消息回到家中，或者关于家庭的消息',
      '骑士-心': '爱情的到来，或者感情方面的好消息',
      '骑士-戒指': '承诺的消息，或者关于关系的正式通知',
      '骑士-云': '令人困惑的消息，或者消息不明确',
      '骑士-蛇': '虚假的消息，或者有人在撒谎',
      '骑士-棺材': '坏消息，或者关于结束的消息',

      // 船的组合
      '船-房子': '离家，或者搬到外地',
      '船-心': '远距离恋情，或者感情上的旅行',
      '船-戒指': '异地关系的承诺',
      '船-云': '旅行计划不明确，或者对未来的困惑',

      // 房子的组合
      '房子-树': '家庭健康，或者稳固的家庭根基',
      '房子-心': '家庭幸福，或者在家中找到爱',
      '房子-戒指': '家庭承诺，或者婚姻',
      '房子-云': '家庭矛盾，或者家庭问题',

      // 树的组合
      '树-心': '情感健康，或者爱情对你有益',
      '树-戒指': '长期的健康关系',
      '树-云': '健康问题，或者对健康的担忧',

      // 心的组合
      '心-戒指': '订婚或结婚，正式的感情承诺',
      '心-太阳': '幸福的感情，或者爱情成功',
      '心-月亮': '浪漫的爱情，或者情感认可',
      '心-十字架': '感情带来痛苦，或者爱是负担',

      // 戒指的组合
      '戒指-太阳': '成功的承诺，或者幸福的婚姻',
      '戒指-月亮': '感情公开，或者关系被认可',
      '戒指-十字架': '承诺变成负担，或者关系困难',

      // 棺材的组合
      '棺材-心': '感情结束，或者心碎',
      '棺材-戒指': '关系结束，或者契约破裂',
      '棺材-太阳': '困难时期的结束，或者痛苦的终结',

      // 蛇的组合
      '蛇-心': '感情欺骗，或者第三者',
      '蛇-戒指': '不忠的承诺，或者关系中的谎言',
      '蛇-花园': '在社交场合要小心，或者有人背后说闲话',

      // 云的组合
      '云-太阳': '困惑即将结束，或者情况会明朗',
      '云-月亮': '情感困惑，或者情绪不稳定',
      '云-钥匙': '找不到解决方案，或者关键不清晰',

      // 老鼠的组合
      '老鼠-心': '感情逐渐流失，或者爱情被侵蚀',
      '老鼠-戒指': '关系逐渐恶化，或者承诺被破坏',
      '老鼠-鱼': '财务损失，或者金钱被侵蚀',
    }

    const key1 = `${card1.name}-${card2.name}`
    const key2 = `${card2.name}-${card1.name}`

    return combinations[key1] || combinations[key2] || `${card1.name}和${card2.name}的结合显示了${card1.keywords[0]}和${card2.keywords[0]}的双重影响`
  }

  /**
   * 时间预测
   */
  const getTimePrediction = (cards: any[], questionType: string) => {
    if (questionType === 'timing' || cards.some(c => c.id <= 12)) {
      // 使用前12张牌预测时间
      const timeCard = cards.find(c => c.id <= 12)
      if (timeCard) {
        const reading = getSingleCardReading(timeCard)
        return `时间预测：**${timeCard.name}**显示事情可能在${reading.timing}发生或完成。`
      }
    }
    return '时间预测：牌面没有明确显示时间框架，可能需要更长时间。'
  }

  /**
   * 综合解读
   */
  const generateReading = () => {
    const questionAnalysis = analyzeQuestion()
    const questionType = questionAnalysis.type

    let reading = `## 关于您的问题：${question || '（未提问）'}

**问题类型**：${questionAnalysis.topic}

---

### 【单张牌解读】
`

    // 单张牌解读
    cards.forEach((card, index) => {
      const cardReading = getSingleCardReading(card)
      reading += `
**第${index + 1}张牌 - ${card.name}**（编号${card.id}）

✅ **积极面**：${cardReading.positive}

⚠️ **消极面**：${cardReading.negative}

⏰ **时间**：${cardReading.timing}

📌 **关键词**：${cardReading.keywords.join('、')}
`
    })

    // 组合解读
    if (cards.length >= 2) {
      reading += `

### 【牌的组合解读】

`
      for (let i = 0; i < cards.length - 1; i++) {
        const combination = getCombinationReading(cards[i], cards[i + 1])
        reading += `**${cards[i].name} + ${cards[i + 1].name}**：${combination}\n\n`
      }
    }

    // 综合分析
    reading += `

### 【综合分析】

`

    // 统计积极和消极牌
    const positiveCards = cards.filter(c =>
      ['太阳', '心', '花束', '幸运草', '狗', '钥匙', '星星', '戒指', '百合'].includes(c.name)
    )
    const negativeCards = cards.filter(c =>
      ['棺材', '蛇', '老鼠', '云', '山', '镰刀', '鞭子', '十字架'].includes(c.name)
    )

    reading += `**牌面统计**：
- 积极牌：${positiveCards.length}张（${positiveCards.map(c => c.name).join('、') || '无'}）
- 消极牌：${negativeCards.length}张（${negativeCards.map(c => c.name).join('、') || '无'}）

`

    // 根据问题类型给出核心答案
    if (questionType === 'perception') {
      reading += `**核心答案**：
牌面显示了对方对你的看法。${getSingleCardReading(cards[0]).positive}
但也要注意：${getSingleCardReading(cards[0]).negative}

**两面的选择**：
- 如果你继续现在的做法，牌面显示：${getSingleCardReading(cards[cards.length - 1]).positive}
- 如果改变做法，可能：${getSingleCardReading(cards[1] || cards[0]).negative}

`
    } else if (questionType === 'relationship_outcome') {
      reading += `**关系前景**：
从牌面来看，${getSingleCardReading(cards[0]).positive}

**可能的结局**：
- 如果继续现在的相处模式：${getSingleCardReading(cards[cards.length - 1]).positive}
- 但也必须面对：${getSingleCardReading(cards[cards.length - 1]).negative}

**警告**：
如果牌面中出现${negativeCards.map(c => c.name).join('、')}，这是明确的问题信号。不要忽视它们。

`
    } else if (questionType === 'feelings') {
      reading += `**感情状态**：
${getSingleCardReading(cards[0]).positive}

**真实情况**：
但也要面对：${getSingleCardReading(cards[0]).negative}

**建议**：
不要只看表面。${getSingleCardReading(cards[cards.length - 1]).negative}

`
    } else if (questionType === 'career') {
      reading += `**工作前景**：
${getSingleCardReading(cards[0]).positive}

**需要注意**：
${getSingleCardReading(cards[cards.length - 1]).negative}

**行动建议**：
${positiveCards.length > negativeCards.length ? '牌面整体积极，可以继续推进' : '牌面有挑战，需要谨慎行事'}

`
    } else if (questionType === 'decision') {
      reading += `**选择分析**：

**选项A（继续现状）**：
- 可能性：${getSingleCardReading(cards[0]).positive}
- 风险：${getSingleCardReading(cards[0]).negative}

**选项B（做出改变）**：
- 可能性：${getSingleCardReading(cards[cards.length - 1]).positive}
- 风险：${getSingleCardReading(cards[cards.length - 1]).negative}

**最终建议**：
根据牌面，${cards[Math.floor(cards.length / 2)].name}是核心。${getSingleCardReading(cards[Math.floor(cards.length / 2)]).positive}

`
    } else {
      reading += `**整体情况**：
${getSingleCardReading(cards[0]).positive}

**核心挑战**：
${getSingleCardReading(cards[cards.length - 1]).negative}

**发展方向**：
${getSingleCardReading(cards[Math.floor(cards.length / 2)]).positive}

`
    }

    // 时间预测
    reading += `

### 【时间预测】
${getTimePrediction(cards, questionType)}
`

    // 最终结论
    reading += `

### 【最终结论】

**诚实的话**：
${negativeCards.length > positiveCards.length ?
  `牌面显示的挑战多于机会。这不是要打击你，而是让你有心理准备。${negativeCards.map(c => c.name).join('、')}这些牌需要你认真对待。` :
  `牌面整体相对积极，但不要盲目乐观。${negativeCards.length > 0 ? negativeCards.map(c => c.name).join('、') + '这些牌显示的问题需要面对。' : '仍然要保持清醒和谨慎。'}`}

**你的选择**：
雷诺曼不会告诉你"必须"做什么，而是告诉你"如果"这样选择会怎样。牌面显示了可能性，不是宿命。最终的决定权在你手中。

**行动建议**：
- ${positiveCards.length > 0 ? `利用${positiveCards[0].name}代表的${getSingleCardReading(positiveCards[0]).keywords[0]}能量` : '保持耐心和观察'}
- ${negativeCards.length > 0 ? `谨慎面对${negativeCards[0].name}代表的${getSingleCardReading(negativeCards[0]).keywords[0]}挑战` : '抓住当前的机会'}
- 在${getSingleCardReading(cards[0]).timing}内观察事态发展

---

*记住：占卜是提供洞察的工具，不是替代思考的捷径。用牌面的信息来辅助你的判断，而不是放弃你的判断。*
`

    return reading
  }

  return {
    opening: `关于"${question || '您的现状'}"的雷诺曼解读：`,
    readingText: generateReading(),
    timestamp: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}
