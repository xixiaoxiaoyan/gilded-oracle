/**
 * 真诚的占卜解读引擎
 * 直接回答问题，不说空话
 */
import { lenormandCards } from '@/data/lenormandData'

export const generateOracleReading = (question: string, drawnCards: any[], spreadType: string) => {
  const cards = drawnCards

  /**
   * 分析问题类型
   */
  const analyzeQuestion = () => {
    if (!question || question.trim().length === 0) {
      return "general"
    }

    const q = question.toLowerCase()

    // 感情问题 - 他/她怎么看
    if (q.includes('怎么看') && (q.includes('他') || q.includes('她') || q.includes('男朋友') || q.includes('女朋友') || q.includes('老公') || q.includes('老婆'))) {
      return "how_they_see_me"
    }

    // 感情问题 - 他/她爱我吗
    if (q.includes('爱') || q.includes('喜欢') || q.includes('感情')) {
      return "love_feelings"
    }

    // 感情问题 - 会在一起吗
    if (q.includes('在一起') || q.includes('结婚') || q.includes('未来')) {
      return "relationship_future"
    }

    // 工作问题
    if (q.includes('工作') || q.includes('事业') || q.includes('升职') || q.includes('辞职') || q.includes('offer')) {
      return "career"
    }

    // 选择问题
    if (q.includes('选择') || q.includes('决定') || q.includes('要不要') || q.includes('如何')) {
      return "decision"
    }

    return "general"
  }

  /**
   * 具体的牌意解读 - 直接回答问题
   */
  const getConcreteAnswer = (questionType: string, cards: any[]) => {
    const mainCard = cards[0]
    const cardName = mainCard.name
    const keyword = mainCard.keywords[0]

    const concreteAnswers: { [key: string]: { [questionType: string]: string } } = {
      '骑士': {
        'how_they_see_me': '对方认为你是个有魅力、值得追求的人。但也在观察你——你是否有长期的吸引力。骑士代表行动和接近，说明对方有主动的意愿。',
        'love_feelings': '对方对你有好感，并且正在考虑采取行动。这不是被动的感觉，而是想要接近你的冲动。',
        'relationship_future': '关系会向前发展。如果你想知道"会不会在一起"，答案是会的，但需要有人主动迈出那一步。',
        'career': '工作中会有好消息传来，可能是offer、晋升机会或者重要的项目。机会正在接近你。',
        'decision': '答案是肯定的。行动比等待更重要。不要过度思考，先迈出第一步。',
        'general': '有些事情正在接近你。保持开放的心态，机会会来。'
      },
      '幸运草': {
        'how_they_see_me': '对方觉得你是个轻松愉快的人，和你在一起很开心。你给TA带来好心情，这是你的优势。',
        'love_feelings': '对方对你有很不错的印象，觉得和你在一起很幸运。感情基础是轻松愉快的。',
        'relationship_future': '关系发展会很顺利，小确幸很多。不要期待轰轰烈烈，平平淡淡才是真。',
        'career': '工作上会有一些小的好运，比如遇到好同事、好项目。抓住这些小的机会。',
        'decision': '两个选择都不错，选择让你更开心的那个。不要太纠结，结果都不会太差。',
        'general': '幸运正在靠近你，保持乐观的心态。'
      },
      '船': {
        'how_they_see_me': '对方认为你是个有想法、愿意探索的人。但也可能觉得你不够稳定，或者让TA捉摸不定。',
        'love_feelings': '对方对你有好奇心，想要了解你更多。但也可能有些距离感，不够深入。',
        'relationship_future': '关系会有变化和发展。可能是好的变化，比如关系进入新阶段；也可能是需要面对距离或变化。',
        'career': '工作上会有变动或旅行相关的机会。可能需要出差、调动，或者换个环境。',
        'decision': '选择那个能让你成长的方向，即使它看起来更冒险。留在舒适区不是答案。',
        'general': '你即将踏上一段新的旅程，做好准备。'
      },
      '房子': {
        'how_they_see_me': '对方认为你是个靠谱、稳定的人。你给TA安全感，这是长期关系的重要基础。',
        'love_feelings': '对方把你当作家人一样看待，感情很稳定。即使不激烈，但很踏实。',
        'relationship_future': '关系会走向稳定。如果要考虑同居、结婚，现在是合适的时机。',
        'career': '工作中寻找稳定的发展机会。不要频繁跳槽，在一个地方深耕会更好。',
        'decision': '选择更稳定的那个选项。现在不是冒险的时候，安全感更重要。',
        'general': '关注你的根基和家庭，它们给你力量。'
      },
      '树': {
        'how_they_see_me': '对方认为你是个稳重、可靠的人。但也可能觉得你不够灵活，或者太固执。',
        'love_feelings': '对方的感情是长期培养的，不是一见钟情。但正因为如此，感情很稳固。',
        'relationship_future': '关系会慢慢成长，需要时间。不要着急，好的感情需要慢慢培养。',
        'career': '工作中需要耐心。你现在做的事情是在为未来打基础，坚持下去会有收获。',
        'decision': '选择长期来看更好的那个选项，不要只看眼前的利益。',
        'general': '你的根基很重要，健康和稳定是关键。'
      },
      '云': {
        'how_they_see_me': '对方对你的看法不太清晰，或者说TA自己也很困惑。可能TA还没有想清楚对你的感觉。',
        'love_feelings': '对方的心情很矛盾，不清楚自己到底想要什么。给TA一些时间想清楚。',
        'relationship_future': '关系的未来现在还不明朗。可能需要等待一些事情澄清，或者需要坦诚的沟通。',
        'career': '工作中现在看不清方向。不要做重大决定，等等再说。迷雾中的决定往往会后悔。',
        'decision': '现在不是做决定的好时机。信息不够，先等等，过段时间再说。',
        'general': '现在情况不清晰，保持耐心。'
      },
      '蛇': {
        'how_they_see_me': '对方可能对你有些复杂的感觉，既有吸引力又有戒心。或者TA觉得你不够真诚。',
        'love_feelings': '这份感情可能有一些复杂的因素。可能是三角关系，或者是对方在感情中不够诚实。',
        'relationship_future': '关系面临挑战。可能是第三者，或者是信任问题。需要认真面对这些问题。',
        'career': '工作中要小心同事或合作伙伴。不是所有人都希望你成功，保持警惕。',
        'decision': '仔细考虑所有选项，不要被表面现象迷惑。相信你的直觉。',
        'general': '有些事情不像看起来那么简单，保持警觉。'
      },
      '棺材': {
        'how_they_see_me': '对方可能认为你们的关系已经结束了，或者已经没有新的可能性了。这是个艰难的事实。',
        'love_feelings': '对方的感情可能已经冷淡了，或者TA已经决定放下。这不是你愿意听到的，但需要面对。',
        'relationship_future': '关系可能需要结束，或者进入一个全新的阶段。旧的相处模式已经不行了。',
        'career': '工作中某个项目或阶段需要结束。不要死守着不放，接受结束才能开始新的。',
        'decision': '可能需要放弃某个选择。这很痛苦，但如果已经不行了，放手可能是最好的选择。',
        'general': '某些事情需要结束，接受这个事实。'
      },
      '花束': {
        'how_they_see_me': '对方认为你很迷人，值得被欣赏。你在TA眼中是美好的，有吸引力的。',
        'love_feelings': '对方对你很有好感，可能已经被你吸引了。这是积极的信号。',
        'relationship_future': '关系会很美好。如果你们在一起，会是别人羡慕的那种感情。',
        'career': '工作上会有好事发生，比如升职、加薪、或者被认可。你的努力会被看到。',
        'decision': '选择那个让你感觉更好的选项。你的直觉在告诉你正确的方向。',
        'general': '好事正在发生，保持自信。'
      },
      '镰刀': {
        'how_they_see_me': '对方可能觉得你需要做出改变，或者你们的关系需要被"修剪"。有些东西需要被切断。',
        'love_feelings': '对方可能正在考虑结束什么，或者改变现状。这可能是关系，也可能是某种相处模式。',
        'relationship_future': '关系面临重要决定。可能需要分手，或者做出重大改变。不能继续这样下去了。',
        'career': '工作中需要做出决定，可能是辞职、结束项目。拖延只会让情况更糟。',
        'decision': '必须做出决定了。不要再犹豫，割舍虽然痛，但必须做。',
        'general': '是时候做出艰难的决定了。'
      },
      '鞭子': {
        'how_they_see_me': '对方和你的关系中有冲突。可能经常争吵，或者有未解决的矛盾。这让TA感到疲惫。',
        'love_feelings': '对方的感情很矛盾。可能有爱，但也有不满和抱怨。关系不够和谐。',
        'relationship_future': '关系会有冲突。如果你们不能好好沟通，关系会很累。需要学会好好说话。',
        'career': '工作中人际关系紧张。可能有冲突的同事或老板。学会处理冲突很重要。',
        'decision': '选择那个能减少冲突的选项。不要选择会让你持续痛苦的路。',
        'general': '有些冲突需要被解决，不要逃避。'
      },
      '鸟': {
        'how_they_see_me': '对方觉得你是个健谈、有趣的人。但可能也觉得你话太多，或者不够深入。',
        'love_feelings': '对方想和你沟通，想多了解你。沟通是你们关系的关键。',
        'relationship_future': '关系的发展需要好的沟通。多说说心里话，不要藏着掖着。',
        'career': '工作中要多沟通，多表达自己。机会来自于你和人的交流。',
        'decision': '找信任的人聊聊，他们的建议会帮你理清思路。',
        'general': '沟通很重要，把话说出来。'
      },
      '小孩': {
        'how_they_see_me': '对方认为你单纯、可爱，像个孩子一样。这可能让TA想要保护你，但也可能觉得你不成熟。',
        'love_feelings': '对方对你有纯真的好感。这份感情很单纯，没有太多杂念。',
        'relationship_future': '关系会重新开始，或者进入一个新的阶段。过去的包袱可以放下了。',
        'career': '工作中会有新的开始，新项目、新机会。用新的眼光去迎接。',
        'decision': '像个新人一样去思考，不要被过去的经验束缚。',
        'general': '新的开始正在到来，保持开放。'
      },
      '狐狸': {
        'how_they_see_me': '对方可能觉得你不够真诚，或者你在耍心机。信任是问题所在。',
        'love_feelings': '对方在怀疑你的真实想法，或者不信任你的感情。信任需要重建。',
        'relationship_future': '关系面临信任危机。如果不诚实面对，关系很难维持。',
        'career': '工作中要小心，不是所有人都值得信任。保护好自己。',
        'decision': '不要被表面的好处迷惑。仔细思考每个选项的真实情况。',
        'general': '保持警惕，事情可能不像看起来那样。'
      },
      '熊': {
        'how_they_see_me': '对方认为你有能力、有力量。但也可能觉得你太强势，或者让人有压力。',
        'love_feelings': '对方很重视你，可能有些依赖你。你在TA生活中有重要的位置。',
        'relationship_future': '关系会稳定发展。你是被依靠的那一方，但也不要让自己太累。',
        'career': '工作中你有能力，也有资源。好好利用它们，你可以取得成就。',
        'decision': '选择能让你发挥力量的选项。你有能力承担选择的后果。',
        'general': '你有力量，相信自己。'
      },
      '星星': {
        'how_they_see_me': '对方认为你有闪光点，你让TA对未来有希望。你是TA生活中的星光。',
        'love_feelings': '对方对你抱有希望，把你当作梦想或理想。这份感情很浪漫。',
        'relationship_future': '关系有希望发展得很好。保持对未来的信念，不要因为现在的问题放弃。',
        'career': '工作上保持希望和信念。你现在做的事情有长远的价值。',
        'decision': '选择那个让你对未来有希望的方向。相信你的梦想。',
        'general': '希望和梦想在指引你，相信它们。'
      },
      '鹳鸟': {
        'how_they_see_me': '对方认为你是个在成长的人。TA看到了你的变化，这些变化是积极的。',
        'love_feelings': '对方的感情在积极发展。你们的关系正在往好的方向变化。',
        'relationship_future': '关系会有积极的变化。可能是关系升级，或者相处模式改善。',
        'career': '工作上会有好的变化。升职、转岗、或者新的机会都在靠近。',
        'decision': '选择能带来积极改变的那个选项。不要害怕变化。',
        'general': '好的变化正在发生，迎接它。'
      },
      '狗': {
        'how_they_see_me': '对方认为你是个忠诚的朋友。你给TA可靠的感觉，信任是你们的基础。',
        'love_feelings': '对方对你有深厚的感情，这种感情建立在信任之上。你是TA可以依靠的人。',
        'relationship_future': '关系会稳定发展。忠诚和信任是你们关系的基石。',
        'career': '工作中找到可靠的伙伴和盟友。合作会让你事半功倍。',
        'decision': '选择那个更值得信任的选项。可靠性很重要。',
        'general': '信任和忠诚很重要，珍惜它们。'
      },
      '塔': {
        'how_they_see_me': '对方可能觉得你太正式、太有距离感。或者你在TA心中是个权威人物，不是平等的伙伴。',
        'love_feelings': '对方的感情很正式，不够亲密。你们之间可能有等级或身份的隔阂。',
        'relationship_future': '关系可能受到外界因素的限制，比如家庭、社会的压力。需要突破这些障碍。',
        'career': '工作中要遵守规则和制度。不要试图打破规则，那样只会让你受挫。',
        'decision': '选择那个更规范的选项。不要试图走捷径，按规矩来。',
        'general': '尊重规则和制度，它们有存在的道理。'
      },
      '花园': {
        'how_they_see_me': '对方认为你是个社交能力强的人，在人面前很得体。你给TA留下好印象。',
        'love_feelings': '对方很想把你介绍给TA的朋友和家人。这是好信号，说明TA重视你。',
        'relationship_future': '关系会公开化、社会化。可能会见父母、朋友，或者在社交场合正式亮相。',
        'career': '工作中多参与社交活动，多和人接触。机会来自于人际网络。',
        'decision': '选择那个能让更多人参与和了解的选项。不要一个人扛。',
        'general': '走出去，和人连接，这会给你带来机会。'
      },
      '山': {
        'how_they_see_me': '对方觉得你很难接近，或者你们之间有明显的障碍。这让TA感到无力。',
        'love_feelings': '对方想要接近你，但感觉有障碍。可能是距离、家庭、或其他实际问题。',
        'relationship_future': '关系面临实际障碍。这些障碍不是不可克服，但需要努力和耐心。',
        'career': '工作中遇到困难。这不是你不够好，而是客观的困难。一步一步来。',
        'decision': '如果两个选择都很难，选择那个你更愿意为之努力的。',
        'general': '障碍是真实的，但你可以克服它。'
      },
      '路': {
        'how_they_see_me': '对方认为你有很多可能性，但也觉得你不够确定，不知道你想要什么。',
        'love_feelings': '对方对你有很多想象和期待，但还不确定真实的你是怎样的。',
        'relationship_future': '关系面临选择。有很多可能性，但需要做出选择才能前进。',
        'career': '工作中有很多选项。这看起来是好事，但也可能让你困惑。',
        'decision': '你确实需要做选择。不要因为选项多就推迟决定。',
        'general': '你在十字路口，选择方向才能前进。'
      },
      '老鼠': {
        'how_they_see_me': '对方觉得你们的关系在慢慢恶化，或者有些小问题在累积。不是大事，但让人不舒服。',
        'love_feelings': '对方的感情在慢慢流失。不是因为一次大的事件，而是很多小事的累积。',
        'relationship_future': '关系面临慢性损耗。如果不及时处理，小问题会变成大问题。',
        'career': '工作中有很多小的损耗和问题。及时处理它们，不要累积。',
        'decision': '选择问题更少的那条路。不要选择那些会持续消耗你的。',
        'general': '小问题要及时处理，不要拖延。'
      },
      '心': {
        'how_they_see_me': '对方认为你是个有爱心、情感丰富的人。你在TA心中是特别的。',
        'love_feelings': '对方真的爱你。这份感情是真实的，不是游戏。',
        'relationship_future': '关系充满爱。如果你们都愿意投入，这会是一段很美好的感情。',
        'career': '做你真心热爱的工作。激情会带给你成就感。',
        'decision': '选择那个你真心想要的，而不是别人觉得你应该选的。',
        'general': '跟着你的心走，它会指引你。'
      },
      '戒指': {
        'how_they_see_me': '对方把你当作承诺的对象。在TA心中，你们之间有某种约定或责任。',
        'love_feelings': '对方对你的感情很认真。这不是玩玩而已，而是有承诺的。',
        'relationship_future': '关系会走向承诺。可能是订婚、结婚，或者其他形式的严肃承诺。',
        'career': '工作中遵守承诺和契约。你的信誉很重要。',
        'decision': '选择那个你愿意长期承诺的。不要选择你知道不会坚持的。',
        'general': '承诺很重要，认真对待它。'
      },
      '书': {
        'how_they_see_me': '对方觉得你很神秘，还有很多不了解的地方。这让你有吸引力，但也让TA不安。',
        'love_feelings': '对方想要了解你更多。你有吸引力，但TA感觉还有很多不知道的。',
        'relationship_future': '关系中还有许多未被发现的层面。多分享，多了解。',
        'career': '工作中继续学习。你的知识和技能是你的资产。',
        'decision': '在决定之前先了解更多。收集信息再做选择。',
        'general': '保持学习，知识会给你力量。'
      },
      '信': {
        'how_they_see_me': '对方认为你们需要更好的沟通，或者有些话需要说出来。',
        'love_feelings': '对方想和你多交流。文字、语言对你们的关系很重要。',
        'relationship_future': '关系的发展需要沟通。不要把话藏在心里，坦诚交流。',
        'career': '工作中要注意书面沟通。邮件、报告、文档都很重要。',
        'decision': '把你的想法写下来。书写会让思路清晰。',
        'general': '沟通很重要，把话说出来。'
      },
      '男人': {
        'how_they_see_me': '如果是男性问感情，这张牌代表对方看到的是一个平等的对象。你们的关系更像伙伴。',
        'love_feelings': '如果是女性问感情，对方把你当作重要的男人看待。你是TA生活中的重要男性。',
        'relationship_future': '关系中男性的能量在主导。如果对方是男性，他的态度会决定关系走向。',
        'career': '工作中男性角色或权威人物很重要。他们的看法会影响你的发展。',
        'decision': '考虑重要男性人物的意见。父亲、伴侣、上司的建议值得参考。',
        'general': '男性力量在影响你的处境。'
      },
      '女人': {
        'how_they_see_me': '如果是女性问感情，这张牌代表对方看到的是一个平等的对象。你们的关系更像伙伴。',
        'love_feelings': '如果是男性问感情，对方把你当作重要的女性看待。你是TA生活中的重要女性。',
        'relationship_future': '关系中女性的能量在主导。如果对方是女性，她的态度会决定关系走向。',
        'career': '工作中女性角色或权威人物很重要。她们的看法会影响你的发展。',
        'decision': '考虑重要女性人物的意见。母亲、伴侣、女上司的建议值得参考。',
        'general': '女性力量在影响你的处境。'
      },
      '百合': {
        'how_they_see_me': '对方认为你是个成熟、稳重的人。你和你的相处是和谐的，没有太多戏剧性。',
        'love_feelings': '对方的感情很成熟稳定。这不是轰轰烈烈的激情，而是细水长流的深情。',
        'relationship_future': '关系会很和谐稳定。你们能够平衡彼此，这是长期关系的基础。',
        'career': '工作中追求稳定和谐。不要频繁变动，在一个地方慢慢成长。',
        'decision': '选择更平衡、更和谐的那个选项。稳定比冒险更重要。',
        'general': '追求和谐与平衡，这是成熟的智慧。'
      },
      '太阳': {
        'how_they_see_me': '对方认为你很棒，你是TA生活中的阳光。你在TA心中是积极的、正面的。',
        'love_feelings': '对方真的很爱你，而且是很阳光、很轻松的那种爱。和TA在一起你会很快乐。',
        'relationship_future': '关系会非常美好。这是最好的牌之一，预示着幸福和成功。',
        'career': '工作上会有大成功。升职、加薪、好评，好事会连连。',
        'decision': '答案是肯定的。你可以放心向前，不会有错。',
        'general': '最好的牌，一切都会很好。'
      },
      '月亮': {
        'how_they_see_me': '对方对你的感觉更多是情感上的，而非理性的。你在TA心中激发了很多情绪。',
        'love_feelings': '对方对你的感情很深，可能是爱，也可能是其他强烈的情绪。情感很丰富。',
        'relationship_future': '关系充满情感波动。可能很浪漫，但也可能情绪化。需要学会管理情绪。',
        'career': '工作上跟着直觉走。你的第六感可能比逻辑更准确。',
        'decision': '用情感做决定，而不是只看利弊。问自己真心想要什么。',
        'general': '相信你的直觉和感受，它们在告诉你重要的东西。'
      },
      '钥匙': {
        'how_they_see_me': '对方认为你就是答案。你在TA心中是重要的，可能比你自己意识到的还要重要。',
        'love_feelings': '对方真的认为你就是TA要找的人。你是关键，这很确定。',
        'relationship_future': '关系会发展得很好。你们找到了彼此，这是正确的相遇。',
        'career': '工作中你会找到解决问题的方法。答案比你想象的更近。',
        'decision': '你已经知道答案了。相信你的判断，不要怀疑。',
        'general': '答案已经存在，找到它。'
      },
      '鱼': {
        'how_they_see_me': '对方认为你很丰富，有很多内涵。但也可能觉得你让人捉摸不透，不够直接。',
        'love_feelings': '对方对你的感情很深，像深海一样丰富。但也可能因此感到不安。',
        'relationship_future': '关系会有丰富的情感体验。不是简单的爱恨，而是复杂的情感深度。',
        'career': '工作上财务状况会改善。可能有收入增加、投资回报等。',
        'decision': '选择那个能带来更多丰富性的选项。不要选择单调的路。',
        'general': '丰富和深度是你的优势，发挥它们。'
      },
      '锚': {
        'how_they_see_me': '对方认为你很稳定，是你给了TA安全感。你是TA可以停靠的港湾。',
        'love_feelings': '对方真的依赖你，你是TA的锚。这份感情很稳定，虽然可能不够浪漫。',
        'relationship_future': '关系会很稳定。你们会成为彼此的依靠，这是长期关系的基础。',
        'career': '工作上寻找稳定的位置。不要频繁变动，稳定发展会更好。',
        'decision': '选择更稳定的那条路。现在不是冒险的时候。',
        'general': '稳定是你的优势，好好利用它。'
      },
      '十字架': {
        'how_they_see_me': '对方可能觉得你是个负担，或者你们的关系让TA感到沉重。',
        'love_feelings': '对方的感情很复杂，有爱但也有负担。这份感情让TA感到沉重。',
        'relationship_future': '关系需要承担责任。这不是轻松的感情，需要你们共同承担。',
        'career': '工作中你有责任在身。这些责任可能让你感到沉重，但必须承担。',
        'decision': '选择那个你愿意承担责任的路。逃避责任不是办法。',
        'general': '有些责任必须承担，这是成长的一部分。'
      }
    }

    return concreteAnswers[cardName]?.[questionType] || `这张牌${cardName}在提示您关注${keyword}这个主题。结合您的问题，牌面建议您关注这个生命面向。`
  }

  /**
   * 【当下】直接回答您的问题
   */
  const readCurrentSituation = () => {
    const questionType = analyzeQuestion()
    const concreteAnswer = getConcreteAnswer(questionType, cards)

    let reading = ""

    if (spreadType === 'single') {
      const card = cards[0]

      reading = `您的问题是：${question || '（未提问）'}

**${card.name}**给出的答案是：

${concreteAnswer}

这是牌面对您问题的直接回应。如果您的问题更具体，解读也会更精确。`

    } else if (spreadType === 'three') {
      const [past, present, future] = cards
      const questionType = analyzeQuestion()

      reading = `您的问题是：${question || '（未提问）'}

**【${past.name}】**（过去）- ${getConcreteAnswer(questionType, [past])}

**【${present.name}】**（现在）- ${getConcreteAnswer(questionType, [present])}

**【${future.name}】**（未来）- ${getConcreteAnswer(questionType, [future])}

综合来看：从${past.keywords[0]}的过去，走到${present.keywords[0]}的现在，未来指向${future.keywords[0]}。这是一个连续的过程。`

    } else if (spreadType === 'nine') {
      const coreCard = cards[4]
      const outcomeCard = cards[8]
      const questionType = analyzeQuestion()

      reading = `您的问题是：${question || '（未提问）'}

**核心答案**：**【${coreCard.name}】**是整个解读的中心。${getConcreteAnswer(questionType, [coreCard])}

**结局预示**：**【${outcomeCard.name}】**指向最终结果。${getConcreteAnswer(questionType, [outcomeCard])}

**需要注意的牌**：
- **【${cards[0].name}】**（现状）：${getConcreteAnswer(questionType, [cards[0]])}
- **【${cards[1].name}】**（挑战）：${getConcreteAnswer(questionType, [cards[1]])}
- **【${cards[3].name}】**（近期帮助）：${getConcreteAnswer(questionType, [cards[3]])}

综合建议：关注${coreCard.keywords[0]}这个核心主题，结局会指向${outcomeCard.keywords[0]}。但记住，您的选择会影响最终结果。`

    }

    return reading
  }

  /**
   *【挑战】需要面对的具体问题
   */
  const readChallenges = () => {
    const challengeCards = cards.filter(c =>
      ['云', '蛇', '老鼠', '棺材', '山', '十字架', '鞭子', '狐狸', '狗', '鸟', '镰刀'].includes(c.name)
    )

    if (challengeCards.length === 0) {
      return `好消息：牌面中没有明显的挑战牌。

这意味着您的处境相对顺利。如果您仍然感到困惑或不安，这种感受可能来自于：
- 您自己的过度思考
- 对未来的不确定性
- 或者是一些还未显现的内在因素

建议：不要太焦虑。如果有问题，它们会显现的。现在保持平常心就好。`
    }

    let challengeReading = ""

    challengeCards.forEach(card => {
      const challenges: { [key: string]: string } = {
        '云': `**【${card.name}】**- 最大的问题是现在看不清方向。建议：等一等，不要在迷雾中做决定。`,
        '蛇': `**【${card.name}】**- 要警惕欺骗或不诚实。可能是别人对你不诚实，也可能是你在自欺欺人。建议：相信直觉，感觉不对就保持距离。`,
        '老鼠': `**【${card.name}】**- 小问题在累积。不是什么大事，但很多小事在消耗你。建议：从最小的问题开始解决，不要拖延。`,
        '棺材': `**【${card.name}】**- 某些事情需要结束。可能是关系、工作、或某种状态。建议：问问自己，什么是已经该放下的？`,
        '山': `**【${card.name}】**- 有真实的障碍需要克服。这不是你的问题，是客观困难。建议：评估一下，这座山值得爬吗？如果值得，一步一步来。`,
        '十字架': `**【${card.name}】**- 你承担的责任太重了。问问自己：这些责任真的是你的吗？建议：学会拒绝，不要什么都扛着。`,
        '鞭子': `**【${card.name}】**- 有冲突需要解决。可能是和别人的，也可能是自己内心的矛盾。建议：不要逃避，面对它，解决它。`,
        '狐狸': `**【${card.name}】**- 保持警惕。不是所有人都值得信任。建议：在重要的事情上，多留个心眼。`,
        '狗': `**【${card.name}】**- 检查一下你的关系。忠诚是相互的吗？建议：如果只有你在付出，这需要重新考虑。`,
        '鸟': `**【${card.name}】**- 沟通有问题。有些话需要说出来。建议：找个时间，好好把话说清楚。`,
        '镰刀': `**【${card.name}】**- 有个决定不能再拖了。你已经想了很久。建议：现在就做决定，不要再犹豫。`,
      }

      if (challenges[card.name]) {
        challengeReading += challenges[card.name] + "\n\n"
      }
    })

    return `牌面中的挑战牌：

${challengeReading}总结：这些挑战不是不可克服的，但需要你主动面对。问题不会自己消失，行动是唯一的解决办法。`
  }

  /**
   *【指引】具体的行动建议
   */
  const readGuidance = () => {
    const positiveCards = cards.filter(c =>
      ['太阳', '星星', '幸运草', '花束', '心', '钥匙', '狗', '鹳鸟', '百合'].includes(c.name)
    )

    const questionType = analyzeQuestion()
    const firstCard = cards[0]
    const lastCard = cards[cards.length - 1]

    let guidance = `**可操作的建议：**

`

    // 根据问题类型给出具体建议
    if (questionType === 'how_they_see_me') {
      guidance += `1. **不要过度猜测对方想法**。牌面已经给了你答案，相信它。过度分析只会让你更困惑。

2. **做你自己**。对方对你的看法是基于真实的你，不是你扮演出来的样子。

3. **如果答案不是你期望的**，接受它。改变别人的看法很难，但你可以改变自己的选择。

`
    } else if (questionType === 'love_feelings') {
      guidance += `1. **直接沟通比猜测更有效**。如果你真的想知道对方的感受，找机会真诚地聊聊。

2. **给关系时间**。感情不是一蹴而就的，好的感情需要时间培养。

3. **关注对方的行为，不只是语言**。行动比话语更真实。

`
    } else if (questionType === 'relationship_future') {
      guidance += `1. **关系的发展需要双方努力**。牌面显示的是可能性，不是保证。你也需要行动。

2. **不要强求**。如果牌面显示有障碍，认真思考这段关系是否值得继续。

3. **信任你的直觉**。如果你在一段关系中感到不安，这种感受很重要。

`
    } else if (questionType === 'career') {
      guidance += `1. **专注于你能控制的事情**。有些外部因素你无法改变，但你可以提升自己的能力。

2. **保持耐心**。职业发展需要时间，不要期待一夜之间有巨大变化。

3. **建立人脉**。很多工作机会来自于你认识的人。

`
    } else if (questionType === 'decision') {
      guidance += `1. **列出每个选项的利弊**，写在纸上。这会让你思路清晰。

2. **问问自己：一年后我会后悔哪个选择？**这通常能帮你找到答案。

3. **不要追求完美**。没有完美的选择，只有你愿意承担后果的选择。

`
    } else {
      guidance += `1. **先搞清楚你真正想要的是什么**。很多时候我们困惑是因为不知道自己的目标。

2. **从小事开始**。不要试图一次解决所有问题。

3. **给自己时间**。重要的思考需要时间，不要急于求成。

`
    }

    // 根据牌面给出的具体指引
    if (positiveCards.length > 0) {
      guidance += `**支持你的力量**：${positiveCards.map(c => c.name).join('、')}。这些牌显示你拥有的资源和优势。好好利用它们。`
    } else {
      guidance += `**你的资源**：即使牌面中没有明显的积极牌，这并不意味着你没有资源。你的勇气、智慧和求问的意愿就是最重要的资源。`
    }

    guidance += `

**最关键的一步**：${getConcreteAnswer(questionType, [lastCard])}`

    return guidance
  }

  /**
   * 组装完整的解读
   */
  const readingText = `
**【直接回答】**

${readCurrentSituation()}


**【需要面对的问题】**

${readChallenges()}


**【具体建议】**

${readGuidance()}
`

  return {
    opening: question ? `关于您的问题"${question}"，牌面给出了直接的答案。` : "牌面对您的情况给出了以下解读。",
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
