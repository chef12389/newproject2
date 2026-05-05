import {
  allCases,
  galleryItems,
  getCategoryName,
  labQuestions,
  mortiseJoints,
  puzzleChallenges,
  quizQuestions,
  type CategoryId,
} from '@/data/architectureData'
import { cultureScenes, scientistEntries, treatiseEntries } from '@/data/siteContent'

export type TrainingMode = 'single' | 'judge' | 'visual' | 'structure' | 'challenge' | 'puzzle'

export interface TrainingTopic {
  id: string
  label: string
  description: string
  sourceLabel: string
  sourceRoute: string
  accent: string
  supportedModes: TrainingMode[]
}

export interface TrainingQuestion {
  id: string
  topicId: string
  mode: Exclude<TrainingMode, 'challenge' | 'puzzle'>
  question: string
  options: string[]
  answer: number
  explanation: string
  sourceRoute: string
  sourceLabel: string
  tags: string[]
  image?: string
}

export interface TrainingPuzzleLevel {
  id: number
  topicId: string
  name: string
  image: string
  pieces: number
  difficulty: string
  tip: string
  sourceRoute: string
  sourceLabel: string
  tags: string[]
}

export const trainingTopics: TrainingTopic[] = [
  {
    id: 'all-topics',
    label: '综合闯关',
    description: '把成就、人物、文献、文化、结构与图像识别串成一条完整训练链。',
    sourceLabel: '创意训练中心',
    sourceRoute: '/knowledge-quiz',
    accent: '#9a3412',
    supportedModes: ['challenge'],
  },
  {
    id: 'achievement',
    label: '建筑成就',
    description: '围绕典型建筑案例，训练类型判断、空间特征与专题回看能力。',
    sourceLabel: '营造华章',
    sourceRoute: '/achievement',
    accent: '#b45309',
    supportedModes: ['single', 'judge', 'challenge'],
  },
  {
    id: 'scientists',
    label: '古代科学家',
    description: '聚焦古代建筑营造人物、工匠谱系与工程精神。',
    sourceLabel: '创意大师',
    sourceRoute: '/scientists',
    accent: '#2563eb',
    supportedModes: ['single', 'judge', 'challenge'],
  },
  {
    id: 'treatises',
    label: '营造文献',
    description: '从典籍、术语与做法文献中建立方法论认知。',
    sourceLabel: '营造经纬',
    sourceRoute: '/treatises',
    accent: '#0f766e',
    supportedModes: ['single', 'judge', 'challenge'],
  },
  {
    id: 'culture',
    label: '文化语境',
    description: '把都城礼制、园林游观、传统村落与非遗技艺纳入同一文化视野。',
    sourceLabel: '居游有境',
    sourceRoute: '/culture',
    accent: '#7c3aed',
    supportedModes: ['single', 'judge', 'challenge'],
  },
  {
    id: 'structure',
    label: '结构与榫卯',
    description: '结合榫卯节点与结构题，训练受力、构件与构造判断。',
    sourceLabel: '营造华章',
    sourceRoute: '/achievement',
    accent: '#047857',
    supportedModes: ['structure', 'single', 'challenge'],
  },
  {
    id: 'gallery',
    label: '图像识别',
    description: '通过图像、画面线索和专题入口，建立快速辨识与回看能力。',
    sourceLabel: '图像展廊',
    sourceRoute: '/gallery',
    accent: '#be185d',
    supportedModes: ['visual', 'single', 'challenge', 'puzzle'],
  },
]

const topicById = new Map(trainingTopics.map((item) => [item.id, item]))

const categoryFallbackLabel: Record<CategoryId, string> = {
  minju: '民居建筑',
  huanggong: '宫殿建筑',
  guanfu: '官府建筑',
  qiaoliang: '桥梁建筑',
  shangye: '商业建筑',
  jiaoyu: '教育建筑',
  lingmu: '陵墓建筑',
  gonggong: '公共建筑',
  yuanlin: '园林建筑',
  zongjiao: '宗教建筑',
}

function resolveCategoryLabel(categoryId: CategoryId) {
  const label = getCategoryName(categoryId)
  return label && label !== categoryId ? label : categoryFallbackLabel[categoryId]
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items))
}

function shuffleArray<T>(items: T[]) {
  const next = [...items]

  for (let index = next.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[target]] = [next[target], next[index]]
  }

  return next
}

function buildOptions(correct: string, pool: string[], total = 4) {
  const distinct = unique([correct, ...pool.filter((item) => item !== correct)])
  const options = distinct.slice(0, total)

  while (options.length < total && distinct.length > 0) {
    options.push(distinct[options.length % distinct.length])
  }

  const insertAt = Math.min(options.length - 1, Math.abs(correct.length + pool.length) % total)
  const filtered = options.filter((item) => item !== correct).slice(0, total - 1)
  filtered.splice(insertAt, 0, correct)

  return {
    options: filtered,
    answer: insertAt,
  }
}

function buildRouteLabel(route: string) {
  switch (route) {
    case '/achievement':
      return '营造华章'
    case '/scientists':
      return '创意大师'
    case '/treatises':
      return '营造经纬'
    case '/culture':
      return '居游有境'
    case '/gallery':
      return '图像展廊'
    default:
      return '专题页'
  }
}

const achievementQuestions: TrainingQuestion[] = allCases.flatMap((item, index) => {
  const categoryLabel = resolveCategoryLabel(item.categoryId)
  const categoryPool = unique(
    allCases
      .filter((candidate) => candidate.id !== item.id)
      .map((candidate) => resolveCategoryLabel(candidate.categoryId)),
  )

  const categoryOptions = buildOptions(categoryLabel, categoryPool)
  const reviewRoute = `/architecture/${item.categoryId}`
  const reviewLabel = buildRouteLabel('/achievement')
  const reviewOptions = buildOptions(reviewLabel, [
    buildRouteLabel('/scientists'),
    buildRouteLabel('/treatises'),
    buildRouteLabel('/culture'),
    buildRouteLabel('/gallery'),
  ])

  return [
    {
      id: `achievement-case-${item.id}`,
      topicId: 'achievement',
      mode: 'single',
      question: `如果你要先判断“${item.name}”属于哪一类古代建筑，最合适的答案是？`,
      options: categoryOptions.options,
      answer: categoryOptions.answer,
      explanation: `${item.name} 在站内归入“${categoryLabel}”专题，回看时可优先进入对应案例类型页。`,
      sourceRoute: reviewRoute,
      sourceLabel: item.name,
      tags: [categoryLabel, item.region, item.dynasty],
    },
    {
      id: `achievement-review-${item.id}`,
      topicId: 'achievement',
      mode: index % 2 === 0 ? 'judge' : 'single',
      question:
        index % 2 === 0
          ? `学习“${item.name}”时，只看局部装饰就足够理解它的价值判断。`
          : `答完“${item.name}”相关题后，最适合继续回看的站内入口是？`,
      options: index % 2 === 0 ? ['正确', '错误'] : reviewOptions.options,
      answer: index % 2 === 0 ? 1 : reviewOptions.answer,
      explanation:
        index % 2 === 0
          ? `${item.name} 更适合回到其专题页面，从类型、空间组织和案例背景整体理解。`
          : `${item.name} 属于“${reviewLabel}”训练源内容，继续回看专题页能更快补齐案例判断。`,
      sourceRoute: reviewRoute,
      sourceLabel: item.name,
      tags: ['专题回看', categoryLabel],
    },
  ]
})

const scientistQuestions: TrainingQuestion[] = scientistEntries.flatMap((item, index) => {
  const eraOptions = buildOptions(
    item.era,
    scientistEntries.filter((candidate) => candidate.id !== item.id).map((candidate) => candidate.era),
  )
  const tag = item.themeTags[0] ?? '营造'
  const tagOptions = buildOptions(
    tag,
    scientistEntries.flatMap((candidate) => candidate.themeTags).filter((candidate) => candidate !== tag),
  )

  return [
    {
      id: `scientist-era-${item.id}`,
      topicId: 'scientists',
      mode: 'single',
      question: `人物“${item.name}”最适合放入以下哪个时代语境中理解？`,
      options: eraOptions.options,
      answer: eraOptions.answer,
      explanation: `${item.name} 的站内人物页会把其时代背景、工程角色与代表性贡献放在一起呈现。`,
      sourceRoute: '/scientists',
      sourceLabel: item.name,
      tags: [item.era, item.role],
    },
    {
      id: `scientist-tag-${item.id}`,
      topicId: 'scientists',
      mode: index % 2 === 0 ? 'single' : 'judge',
      question:
        index % 2 === 0
          ? `以下哪个关键词最能帮助你快速回忆“${item.name}”对应的营造主题？`
          : `“${item.name}”的学习重点更偏向建筑制度、工艺谱系与工程人物，而不是孤立背诵年份。`,
      options: index % 2 === 0 ? tagOptions.options : ['正确', '错误'],
      answer: index % 2 === 0 ? tagOptions.answer : 0,
      explanation:
        index % 2 === 0
          ? `“${tag}”是人物条目中的高频主题词，适合作为回看时的记忆锚点。`
          : '训练中心会把人物置于工程系统中理解，避免只停留在机械记忆层面。',
      sourceRoute: '/scientists',
      sourceLabel: item.name,
      tags: item.themeTags.slice(0, 3),
    },
  ]
})

const treatiseQuestions: TrainingQuestion[] = treatiseEntries.flatMap((item, index) => {
  const authorOptions = buildOptions(
    item.author,
    treatiseEntries.filter((candidate) => candidate.id !== item.id).map((candidate) => candidate.author),
  )
  const kindOptions = buildOptions(
    item.kind,
    treatiseEntries.filter((candidate) => candidate.id !== item.id).map((candidate) => candidate.kind),
  )

  return [
    {
      id: `treatise-author-${item.id}`,
      topicId: 'treatises',
      mode: 'single',
      question: `文献“${item.title}”在站内内容中与哪位作者或编修者对应？`,
      options: authorOptions.options,
      answer: authorOptions.answer,
      explanation: `回到“营造经纬”专题，可以把 ${item.title} 的作者、时代与核心术语一起看。`,
      sourceRoute: '/treatises',
      sourceLabel: item.title,
      tags: [item.dynasty, item.kind],
    },
    {
      id: `treatise-kind-${item.id}`,
      topicId: 'treatises',
      mode: index % 2 === 0 ? 'single' : 'judge',
      question:
        index % 2 === 0
          ? `如果你想判断“${item.title}”的用途，以下哪种描述最贴切？`
          : `学习“${item.title}”时，只记住书名，不需要关注它的术语、做法和工艺语境。`,
      options: index % 2 === 0 ? kindOptions.options : ['正确', '错误'],
      answer: index % 2 === 0 ? kindOptions.answer : 1,
      explanation:
        index % 2 === 0
          ? `${item.kind} 是理解该文献定位的最好入口。`
          : '文献训练强调“术语 + 做法 + 专题回看”，不是只有书名记忆。',
      sourceRoute: '/treatises',
      sourceLabel: item.title,
      tags: item.terms.slice(0, 3),
    },
  ]
})

const cultureQuestions: TrainingQuestion[] = cultureScenes.flatMap((item, index) => {
  const labelOptions = buildOptions(
    item.label,
    cultureScenes.filter((candidate) => candidate.id !== item.id).map((candidate) => candidate.label),
  )
  const statOptions = buildOptions(
    item.statLabel,
    cultureScenes.filter((candidate) => candidate.id !== item.id).map((candidate) => candidate.statLabel),
  )

  return [
    {
      id: `culture-label-${item.id}`,
      topicId: 'culture',
      mode: 'single',
      question: `以下哪一项最贴近文化专题“${item.label}”的学习方向？`,
      options: labelOptions.options,
      answer: labelOptions.answer,
      explanation: `${item.label} 对应的是站内“居游有境”中的独立文化语境卡片。`,
      sourceRoute: '/culture',
      sourceLabel: item.label,
      tags: item.themeTags.slice(0, 3),
    },
    {
      id: `culture-stat-${item.id}`,
      topicId: 'culture',
      mode: index % 2 === 0 ? 'single' : 'judge',
      question:
        index % 2 === 0
          ? `回看“${item.label}”时，以下哪个统计提示最可能出现在该专题中？`
          : `“${item.label}”这类文化专题更适合结合统计信息、案例线索与专题说明一起理解。`,
      options: index % 2 === 0 ? statOptions.options : ['正确', '错误'],
      answer: index % 2 === 0 ? statOptions.answer : 0,
      explanation:
        index % 2 === 0
          ? `${item.statLabel} 是该专题卡片中的提示信息之一。`
          : '文化专题并不是空泛介绍，而是由统计、事实点和专题说明共同组成。',
      sourceRoute: '/culture',
      sourceLabel: item.label,
      tags: [item.stat, item.statLabel],
    },
  ]
})

const structureQuestions: TrainingQuestion[] = [
  ...labQuestions.map((item) => {
    const joint = mortiseJoints.find((candidate) => candidate.id === item.jointId)

    return {
      id: `structure-lab-${item.id}`,
      topicId: 'structure',
      mode: 'structure' as const,
      question: item.question,
      options: item.options,
      answer: item.answer,
      explanation: item.explanation,
      sourceRoute: '/achievement',
      sourceLabel: joint?.name ?? '榫卯训练',
      tags: [joint?.name ?? '榫卯', joint?.difficulty ?? '结构'],
    }
  }),
  ...mortiseJoints.map((item, index) => {
    const useOptions = buildOptions(
      item.uses[0],
      mortiseJoints.flatMap((candidate) => candidate.uses).filter((candidate) => candidate !== item.uses[0]),
    )

    return {
      id: `structure-joint-${item.id}`,
      topicId: 'structure',
      mode: index % 2 === 0 ? ('single' as const) : ('judge' as const),
      question:
        index % 2 === 0
          ? `如果你想快速记住“${item.name}”的应用场景，以下哪一项最贴近？`
          : `“${item.name}”的训练重点不仅是名字，还包括它的受力逻辑和适用位置。`,
      options: index % 2 === 0 ? useOptions.options : ['正确', '错误'],
      answer: index % 2 === 0 ? useOptions.answer : 0,
      explanation:
        index % 2 === 0
          ? `${item.name} 在训练页里会结合用途和节点说明一起出现。`
          : '结构训练会把节点名称、用途和构造判断放在同一条学习链路里。',
      sourceRoute: '/achievement',
      sourceLabel: item.name,
      tags: [item.name, item.difficulty],
    }
  }),
]

const galleryQuestions: TrainingQuestion[] = galleryItems.flatMap((item, index) => {
  const caseOptions = buildOptions(
    item.name,
    galleryItems.filter((candidate) => candidate.id !== item.id).map((candidate) => candidate.name),
  )
  const categoryLabel = resolveCategoryLabel(item.categoryId)
  const categoryOptions = buildOptions(
    categoryLabel,
    galleryItems
      .filter((candidate) => candidate.id !== item.id)
      .map((candidate) => resolveCategoryLabel(candidate.categoryId)),
  )

  return [
    {
      id: `gallery-image-${item.id}`,
      topicId: 'gallery',
      mode: 'visual',
      question: '请根据图像线索判断，以下哪一项最可能对应当前图像？',
      options: caseOptions.options,
      answer: caseOptions.answer,
      explanation: `图像识别完成后，可以直接回到“${item.name}”对应的案例页继续回看。`,
      sourceRoute: `/architecture/${item.categoryId}`,
      sourceLabel: item.name,
      tags: [categoryLabel, item.location],
      image: item.image,
    },
    {
      id: `gallery-category-${item.id}`,
      topicId: 'gallery',
      mode: index % 2 === 0 ? 'visual' : 'single',
      question: index % 2 === 0 ? '图中建筑最适合归入哪个专题类型？' : `如果图像对应“${item.name}”，它在站内归入哪类专题？`,
      options: categoryOptions.options,
      answer: categoryOptions.answer,
      explanation: `${item.name} 在站内图像展廊和对应建筑专题中使用同一套分类逻辑。`,
      sourceRoute: '/gallery',
      sourceLabel: item.name,
      tags: [categoryLabel, item.region],
      image: item.image,
    },
  ]
})

const achievementSupplementQuestions: TrainingQuestion[] = allCases.map((item, index) => {
  const dynastyOptions = buildOptions(
    item.dynasty,
    allCases.filter((candidate) => candidate.id !== item.id).map((candidate) => candidate.dynasty),
  )

  return {
    id: `achievement-dynasty-${item.id}`,
    topicId: 'achievement',
    mode: index % 2 === 0 ? ('single' as const) : ('judge' as const),
    question:
      index % 2 === 0
        ? `如果你要把“${item.name}”放回历史脉络中理解，它最适合归入哪个时代背景？`
        : `理解“${item.name}”时，需要同时结合其所处时代与建筑类型，而不只是记住名称。`,
    options: index % 2 === 0 ? dynastyOptions.options : ['正确', '错误'],
    answer: index % 2 === 0 ? dynastyOptions.answer : 0,
    explanation:
      index % 2 === 0
        ? `${item.name} 的专题内容会把朝代背景、空间特征与案例价值放在一起呈现。`
        : '案例训练强调“名称 + 类型 + 时代 + 场景”的整体判断，而不是单点记忆。',
    sourceRoute: `/architecture/${item.categoryId}`,
    sourceLabel: item.name,
    tags: [item.dynasty, resolveCategoryLabel(item.categoryId), item.region],
  }
})

const scientistSupplementQuestions: TrainingQuestion[] = scientistEntries.map((item, index) => {
  const roleOptions = buildOptions(
    item.role,
    scientistEntries.filter((candidate) => candidate.id !== item.id).map((candidate) => candidate.role),
  )

  return {
    id: `scientist-role-${item.id}`,
    topicId: 'scientists',
    mode: index % 2 === 0 ? ('single' as const) : ('judge' as const),
    question:
      index % 2 === 0
        ? `在人物谱系中，“${item.name}”更适合从哪个身份切入理解？`
        : `学习“${item.name}”时，只记年代即可，不需要关注其工程角色与贡献方向。`,
    options: index % 2 === 0 ? roleOptions.options : ['正确', '错误'],
    answer: index % 2 === 0 ? roleOptions.answer : 1,
    explanation:
      index % 2 === 0
        ? `${item.role} 是理解该人物工程位置与知识价值的高效入口。`
        : '人物训练会把时代、角色、工艺贡献与主题关键词一起组织，不是孤立背诵。',
    sourceRoute: '/scientists',
    sourceLabel: item.name,
    tags: [item.role, item.era, ...item.themeTags.slice(0, 2)],
  }
})

const treatiseSupplementQuestions: TrainingQuestion[] = treatiseEntries.map((item, index) => {
  const term = item.terms[0] ?? item.kind
  const termOptions = buildOptions(
    term,
    treatiseEntries.flatMap((candidate) => candidate.terms).filter((candidate) => candidate !== term),
  )

  return {
    id: `treatise-term-${item.id}`,
    topicId: 'treatises',
    mode: index % 2 === 0 ? ('single' as const) : ('judge' as const),
    question:
      index % 2 === 0
        ? `如果要为“${item.title}”建立术语锚点，以下哪个词最适合作为回看提示？`
        : '文献学习应该把书名、术语和做法语境一起理解，而不是只记住标题。',
    options: index % 2 === 0 ? termOptions.options : ['正确', '错误'],
    answer: index % 2 === 0 ? termOptions.answer : 0,
    explanation:
      index % 2 === 0
        ? `“${term}”来自该文献条目的核心术语区，适合作为回顾时的记忆支点。`
        : '训练中心会把文献放回术语、做法和知识谱系中理解，以强化方法论认知。',
    sourceRoute: '/treatises',
    sourceLabel: item.title,
    tags: [item.dynasty, item.kind, ...item.terms.slice(0, 2)],
  }
})

const cultureSupplementQuestions: TrainingQuestion[] = cultureScenes.map((item, index) => {
  const themeTag = item.themeTags[0] ?? item.statLabel
  const themeOptions = buildOptions(
    themeTag,
    cultureScenes.flatMap((candidate) => candidate.themeTags).filter((candidate) => candidate !== themeTag),
  )

  return {
    id: `culture-theme-${item.id}`,
    topicId: 'culture',
    mode: index % 2 === 0 ? ('single' as const) : ('judge' as const),
    question:
      index % 2 === 0
        ? `若要快速回忆“${item.label}”的文化角度，哪个主题词最适合作为入口？`
        : `文化专题训练更适合结合主题词、统计提示和案例脉络一起理解。`,
    options: index % 2 === 0 ? themeOptions.options : ['正确', '错误'],
    answer: index % 2 === 0 ? themeOptions.answer : 0,
    explanation:
      index % 2 === 0
        ? `“${themeTag}”是该文化专题中的高频关键词，适合作为回看入口。`
        : '文化板块不是泛泛介绍，而是通过主题词、事实提示与专题内容共同建立语境。',
    sourceRoute: '/culture',
    sourceLabel: item.label,
    tags: [themeTag, item.statLabel, item.stat],
  }
})

const gallerySupplementQuestions: TrainingQuestion[] = galleryItems.map((item, index) => {
  const locationOptions = buildOptions(
    item.location,
    galleryItems.filter((candidate) => candidate.id !== item.id).map((candidate) => candidate.location),
  )

  return {
    id: `gallery-location-${item.id}`,
    topicId: 'gallery',
    mode: index % 2 === 0 ? ('visual' as const) : ('single' as const),
    question:
      index % 2 === 0
        ? '根据图像与案例线索判断，这处建筑最可能位于以下哪个地点？'
        : `如果图像对应“${item.name}”，它最直接关联的地点信息是？`,
    options: locationOptions.options,
    answer: locationOptions.answer,
    explanation: `${item.name} 在灵感图库与案例页中都会保留地点信息，帮助建立案例与地域记忆。`,
    sourceRoute: `/architecture/${item.categoryId}`,
    sourceLabel: item.name,
    tags: [item.location, resolveCategoryLabel(item.categoryId), item.region],
    image: item.image,
  }
})

export const trainingQuestionBank: TrainingQuestion[] = [
  ...quizQuestions.map((item) => ({
    id: `legacy-quiz-${item.id}`,
    topicId: 'achievement',
    mode: item.type === 'judge' ? ('judge' as const) : ('single' as const),
    question: item.question,
    options: item.options,
    answer: item.answer,
    explanation: item.explanation,
    sourceRoute: item.route ?? '/achievement',
    sourceLabel: '站内综合问答',
    tags: ['旧题库升级', item.type],
  })),
  ...achievementQuestions,
  ...achievementSupplementQuestions,
  ...scientistQuestions,
  ...scientistSupplementQuestions,
  ...treatiseQuestions,
  ...treatiseSupplementQuestions,
  ...cultureQuestions,
  ...cultureSupplementQuestions,
  ...structureQuestions,
  ...galleryQuestions,
  ...gallerySupplementQuestions,
]

export const trainingPuzzleLevels: TrainingPuzzleLevel[] = puzzleChallenges.map((item) => ({
  id: item.id,
  topicId: 'gallery',
  name: item.name,
  image: item.image,
  pieces: item.pieces,
  difficulty: item.difficulty,
  tip: item.tip,
  sourceRoute: `/architecture/${item.category}`,
  sourceLabel: item.name,
  tags: [resolveCategoryLabel(item.category), item.difficulty],
}))

export function getTrainingTopic(topicId: string) {
  return topicById.get(topicId) ?? trainingTopics[0]
}

export function getQuestionsForTopic(topicId: string) {
  if (topicId === 'all-topics') {
    return trainingQuestionBank
  }

  return trainingQuestionBank.filter((item) => item.topicId === topicId)
}

function rankQuestionForMode(question: TrainingQuestion, mode: TrainingMode) {
  if (mode === 'challenge') {
    return question.mode === 'visual' || question.mode === 'structure' ? 2 : 1
  }

  return question.mode === mode ? 3 : question.mode === 'single' ? 1 : 0
}

export function buildTrainingSession(topicId: string, mode: TrainingMode) {
  const pool = getQuestionsForTopic(topicId)
  const desiredSize = mode === 'challenge' ? 8 : mode === 'visual' || mode === 'structure' ? 6 : 7

  return shuffleArray(
    pool
    .map((question) => ({
      question,
      score: rankQuestionForMode(question, mode),
    }))
    .filter((item) => item.score > 0 || mode === 'challenge')
    .sort((left, right) => right.score - left.score || left.question.id.localeCompare(right.question.id))
    .map((item) => item.question)
    .slice(0, desiredSize)
  )
}

export function getTrainingModesForTopic(topicId: string) {
  return getTrainingTopic(topicId).supportedModes
}

export const trainingOverview = {
  totalQuestions: trainingQuestionBank.length,
  topicCount: trainingTopics.filter((item) => item.id !== 'all-topics').length,
  puzzleCount: trainingPuzzleLevels.length,
}
