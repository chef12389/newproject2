import { allCases, categoryData, type CaseStudy, type CategoryData } from '@/data/architectureData'
import {
  cultureScenes,
  scientistEntries,
  treatiseEntries,
  type CultureTheme,
  type ScientistEntry,
  type TreatiseEntry,
} from '@/data/siteContent'

export const HOME_ENTRY_DELAY_MS = 900
export const HOME_ENTRY_SESSION_KEY = 'site-home-entered'

export type AssistantMessage = {
  role: 'user' | 'assistant'
  content: string
}

type KnowledgeKind = '建筑' | '类型' | '人物' | '文献' | '文化主题'

type KnowledgeEntry = {
  title: string
  kind: KnowledgeKind
  summary: string
  detail: string[]
  keywords: string[]
}

const stopWords = ['什么', '介绍', '一下', '可以', '给我', '我想', '请问', '关于', '怎么', '呢', '吗']

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/g, '').trim()
}

function unique(items: string[]) {
  return Array.from(new Set(items.filter(Boolean)))
}

function cleanQuestion(question: string) {
  let result = normalize(question)

  stopWords.forEach((word) => {
    result = result.split(word).join('')
  })

  return result
}

function compactText(items: string[], limit = 3) {
  return items.filter(Boolean).slice(0, limit).join(' ')
}

function createCaseEntry(item: CaseStudy, category: CategoryData): KnowledgeEntry {
  const aliases = unique([
    item.name,
    item.name.replace(/^北京/, ''),
    item.name.replace(/^中国/, ''),
    item.location,
    item.province,
    item.dynasty,
    category.name,
    ...item.concepts,
    ...(item.heritageTags ?? []),
  ])

  return {
    title: item.name,
    kind: '建筑',
    summary: item.summary,
    detail: [
      `${item.name}属于${category.name}，地点在${item.location}，主要时代是${item.dynasty}。`,
      compactText(item.facts.map((fact) => `${fact.label}：${fact.detail}`), 2),
      item.innovations.length ? `可以重点看：${compactText(item.innovations, 2)}。` : '',
    ],
    keywords: aliases,
  }
}

function createCategoryEntry(category: CategoryData): KnowledgeEntry {
  const sampleNames = category.cases.slice(0, 4).map((item) => item.name)

  return {
    title: category.name,
    kind: '类型',
    summary: category.summary,
    detail: [
      `${category.name}这一类常见关键词包括：${category.keywords.slice(0, 5).join('、')}。`,
      category.drivers.length ? `理解这类建筑时，可以抓住：${category.drivers.slice(0, 3).join('、')}。` : '',
      sampleNames.length ? `代表案例有：${sampleNames.join('、')}。` : '',
    ],
    keywords: unique([category.name, category.english, ...category.keywords, ...sampleNames]),
  }
}

function createScientistEntry(item: ScientistEntry): KnowledgeEntry {
  return {
    title: item.name,
    kind: '人物',
    summary: item.summary,
    detail: [
      `${item.name}活跃于${item.era}，角色是${item.role}。`,
      compactText(item.highlights, 2),
      item.spirit.length ? `他最能代表的关键词是：${item.spirit.slice(0, 4).join('、')}。` : '',
    ],
    keywords: unique([item.name, item.era, item.role, item.identity, ...item.themeTags, ...item.spirit]),
  }
}

function createTreatiseEntry(item: TreatiseEntry): KnowledgeEntry {
  return {
    title: item.title,
    kind: '文献',
    summary: item.summary,
    detail: [
      `${item.title}成书背景是${item.dynasty}，作者或编修者是${item.author}。`,
      compactText(item.highlights, 2),
      item.terms.length ? `核心术语有：${item.terms.slice(0, 5).join('、')}。` : '',
    ],
    keywords: unique([item.title, item.title.replace(/[《》]/g, ''), item.author, item.dynasty, item.kind, ...item.terms, ...item.themeTags]),
  }
}

function createCultureEntry(item: CultureTheme): KnowledgeEntry {
  return {
    title: item.label,
    kind: '文化主题',
    summary: item.summary,
    detail: [
      item.intro,
      compactText(item.facts, 2),
      item.detailCards.length ? `你可以从“${item.detailCards[0].title}”这个角度继续理解。` : '',
    ],
    keywords: unique([item.label, ...item.themeTags, ...item.relatedCategories]),
  }
}

const knowledgeBase: KnowledgeEntry[] = [
  ...categoryData.map(createCategoryEntry),
  ...categoryData.flatMap((category) => category.cases.map((item) => createCaseEntry(item, category))),
  ...allCases.map((item) => {
    const category = categoryData.find((entry) => entry.id === item.categoryId)
    return category ? null : createCaseEntry(item, {
      id: item.categoryId,
      name: item.categoryId,
      english: item.categoryId,
      tagline: '',
      summary: '',
      image: '',
      accent: '',
      gradient: '',
      sampleCount: 0,
      span: '',
      regionCount: 0,
      keywords: [],
      drivers: [],
      structure: [],
      evolution: [],
      cases: [],
    })
  }).filter((item): item is KnowledgeEntry => Boolean(item)),
  ...scientistEntries.map(createScientistEntry),
  ...treatiseEntries.map(createTreatiseEntry),
  ...cultureScenes.map(createCultureEntry),
]

function scoreEntry(question: string, entry: KnowledgeEntry) {
  const q = cleanQuestion(question)
  if (!q) return 0

  let score = 0
  const title = normalize(entry.title)

  if (q === title) {
    score += 24
  } else if (q.includes(title) || title.includes(q)) {
    score += 12
  }

  entry.keywords.forEach((keyword) => {
    const current = normalize(keyword)
    if (!current) return

    if (q === current) {
      score += 10
      return
    }

    if (q.includes(current) || current.includes(q)) {
      score += current.length >= 3 ? 5 : 2
    }
  })

  if (q.includes(normalize(entry.kind))) {
    score += 1
  }

  return score
}

function findBestEntry(question: string) {
  return knowledgeBase
    .map((entry) => ({ entry, score: scoreEntry(question, entry) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.entry
}

function findRelatedEntries(question: string, currentTitle?: string) {
  const q = cleanQuestion(question)

  return knowledgeBase
    .filter((entry) => entry.title !== currentTitle)
    .map((entry) => ({ entry, score: scoreEntry(q, entry) }))
    .filter((item) => item.score >= 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((item) => item.entry.title)
}

function inferContextFromMessages(messages: AssistantMessage[]) {
  const lastUserMessage = [...messages].reverse().find((item) => item.role === 'user')
  return lastUserMessage?.content ?? ''
}

function buildFallback(pathname: string) {
  if (pathname.startsWith('/scientists')) {
    return '我现在更适合回答古建筑人物问题。你可以直接问我：李诫、喻皓、蒯祥、样式雷。'
  }

  if (pathname.startsWith('/treatises')) {
    return '我现在更适合回答古建筑文献问题。你可以直接问我：营造法式、园冶、工程做法则例。'
  }

  if (pathname.startsWith('/culture')) {
    return '我现在更适合回答建筑文化主题。你可以直接问我：礼制与都城、园林与游观、传统村落、非遗技艺。'
  }

  if (pathname.startsWith('/achievement') || pathname.startsWith('/architecture/')) {
    return '你可以直接输入一个具体对象，我会回答相关知识，比如：故宫、赵州桥、四合院、福建土楼、拙政园。'
  }

  return '你可以直接问我站内古建知识，比如：故宫、赵州桥、四合院、李诫、营造法式、园冶。'
}

export function getAssistantContextLabel(pathname: string) {
  if (pathname.startsWith('/architecture/')) return '建筑知识'
  if (pathname.startsWith('/achievement')) return '类型知识'
  if (pathname.startsWith('/scientists')) return '人物知识'
  if (pathname.startsWith('/treatises')) return '文献知识'
  if (pathname.startsWith('/culture')) return '文化知识'
  if (pathname.startsWith('/gallery')) return '图像知识'
  return '古建知识'
}

export function getAssistantQuickPrompts(pathname: string) {
  if (pathname.startsWith('/scientists')) {
    return ['李诫', '喻皓', '样式雷']
  }

  if (pathname.startsWith('/treatises')) {
    return ['营造法式', '园冶', '工程做法则例']
  }

  if (pathname.startsWith('/culture')) {
    return ['礼制与都城', '传统村落', '非遗技艺']
  }

  return ['故宫', '赵州桥', '四合院']
}

export function getAssistantWelcome(pathname: string) {
  return `我是檐知，可以直接回答站内古建筑知识。你输入一个词就行，比如“故宫”或“李诫”。当前更适合问${getAssistantContextLabel(pathname)}。`
}

export function answerAssistantQuestion(input: {
  pathname: string
  question: string
  messages: AssistantMessage[]
}) {
  const matched = findBestEntry(input.question)

  if (!matched) {
    const inheritedQuestion = inferContextFromMessages(input.messages)
    const followUpMatch = inheritedQuestion ? findBestEntry(inheritedQuestion) : undefined

    if (!followUpMatch) {
      return buildFallback(input.pathname)
    }

    return `${followUpMatch.title}是我刚刚判断到你在继续追问的对象。\n\n${followUpMatch.summary}\n\n${followUpMatch.detail.filter(Boolean).join('\n')}`
  }

  const related = findRelatedEntries(input.question, matched.title)
  const lines = [
    `${matched.title}属于${matched.kind}知识。`,
    matched.summary,
    ...matched.detail.filter(Boolean),
  ]

  if (related.length) {
    lines.push(`如果你想继续看相近内容，可以再问：${related.join('、')}。`)
  }

  return lines.join('\n\n')
}
