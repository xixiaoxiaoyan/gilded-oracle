import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { question, cards } = await request.json()

    const apiKey = process.env.ZHIPUAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API密钥未配置' },
        { status: 500 }
      )
    }

    const cardDescriptions = cards.map((card: any) =>
      `第${card.id}号牌 - ${card.name}：${card.description.join('、')}`
    ).join('\n')

    const systemPrompt = `你是一位经验丰富的雷诺曼占卜师。请基于抽出的牌，为提问者提供诚实、具体、包含负面信息的解读。

雷诺曼占卜的核心原则：
1. 诚实：不回避负面信息，直接指出问题
2. 具体：给出具体的分析和建议，不是模糊的安慰
3. 平衡：同时指出积极和消极的可能性
4. 赋能：告诉对方选择的权力和可能性，而不是宿命论

请按照以下格式输出解读：

## 关于您的问题：{问题}

**问题类型**：{问题类型分析}

---

### 【单张牌解读】
{每张牌的详细解读，包括：编号、牌名、积极面、消极面、时间预测、关键词}

### 【牌的组合解读】
{分析相邻牌的组合含义}

### 【综合分析】
**牌面统计**：{积极牌和消极牌的数量}

**核心答案**：{基于问题类型给出直接答案}

**警告/建议**：{具体、可执行的建议}

### 【时间预测】
{基于牌面预测事情发生的时间框架}

### 【最终结论】
**诚实的话**：{总结性的、可能不那么悦耳但必要的话}

**你的选择**：{强调提问者的主动权}

**行动建议**：{2-3条具体、可执行的建议}
`

    const userPrompt = `请为以下占卜请求提供解读：

**问题**：${question || '（未提问）'}

**抽出的牌**：
${cardDescriptions}

**牌阵类型**：${cards.length}张牌占卜

请严格按照上述格式输出完整的雷诺曼解读。`

    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'glm-5.1',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        top_p: 0.9
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('GLM-5.1 API error:', error)
      return NextResponse.json(
        { error: 'GLM-5.1 API调用失败' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const reading = data.choices[0].message.content

    return NextResponse.json({
      opening: `关于"${question || '您的现状'}"的雷诺曼解读：`,
      readingText: reading,
      timestamp: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    })

  } catch (error) {
    console.error('Oracle API error:', error)
    return NextResponse.json(
      { error: '解读生成失败' },
      { status: 500 }
    )
  }
}
