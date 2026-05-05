import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LazyImage } from '@/components/LazyImage'
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Compass,
  Eye,
  Flame,
  Grid3X3,
  Hammer,
  RefreshCw,
  Sparkles,
  Target,
  TimerReset,
  Trophy,
  XCircle,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import GlobalNav from '@/components/GlobalNav'
import { HeroScrollCue } from '@/components/HeroScrollCue'
import {
  buildTrainingSession,
  getQuestionsForTopic,
  getTrainingModesForTopic,
  getTrainingTopic,
  trainingOverview,
  trainingPuzzleLevels,
  trainingTopics,
  type TrainingMode,
  type TrainingPuzzleLevel,
  type TrainingQuestion,
} from '@/data/trainingData'
import { getJourneyState, recordPuzzleCompletion, recordTrainingSession, trackPageVisit, type WrongAnswerRecord } from '@/lib/progress'
import { getImageUrl } from '@/lib/utils'
import {
  aliveCardHover,
  aliveCardTap,
  buttonMagnetHover,
  cardPopChildVariants,
  cardPopVariants,
  pageSectionVariants,
} from '@/lib/motion'

type PageMode = 'overview' | TrainingMode

type AnswerRecord = {
  question: TrainingQuestion
  selectedAnswer: number
}

interface TrainingCenterPageProps {
  entryPath: string
  initialMode?: PageMode
  initialTopicId?: string
}

const modeMeta: Record<
  TrainingMode,
  {
    label: string
    description: string
    icon: typeof BrainCircuit
    theme: string
    accent?: string
    surface?: string
    eyebrow?: string
    cta?: string
    bg?: string
    border?: string
    iconBg?: string
  }
> = {
  single: {
    label: '创意问答',
    description: '从民居到桥梁，每个建筑类型都有专属问答集，帮你一步步建立完整的文创设计知识脉络。',
    icon: BrainCircuit,
    theme: 'from-amber-600 via-amber-700 to-amber-900',
    accent: '#d97706',
    bg: 'from-amber-50 to-orange-50/50',
    border: 'border-amber-200/60',
    iconBg: 'from-amber-500 to-amber-700',
    cta: '从你感兴趣的专题开始探索',
  },
  judge: {
    label: '判断强化',
    description: '快速判断建筑知识点正误，在一次次选择中巩固你对设计知识的理解。',
    icon: Target,
    theme: 'from-teal-700 via-teal-700 to-teal-900',
    accent: '#0f766e',
    bg: 'from-teal-50 to-emerald-50/50',
    border: 'border-teal-200/60',
    iconBg: 'from-teal-600 to-teal-800',
    cta: '适合在浏览专题后巩固所学',
  },
  visual: {
    label: '图像识别',
    description: '从建筑实景与古画入手，训练你通过视觉细节辨识不同时代的设计特征，提升审美敏感度。',
    icon: Eye,
    theme: 'from-pink-700 via-pink-600 to-pink-900',
    accent: '#be185d',
    bg: 'from-pink-50 to-rose-50/50',
    border: 'border-pink-200/60',
    iconBg: 'from-pink-600 to-pink-800',
    cta: '用眼睛发现设计的细节之美',
  },
  structure: {
    label: '结构问答',
    description: '围绕榫卯、斗拱、梁架等传统工艺，深入理解古代匠人的智慧结晶，为手作文创积累工艺知识。',
    icon: Hammer,
    theme: 'from-emerald-700 via-teal-700 to-green-900',
    accent: '#047857',
    bg: 'from-emerald-50 to-green-50/50',
    border: 'border-emerald-200/60',
    iconBg: 'from-emerald-600 to-green-800',
    cta: '探索榫卯与构件的工艺密码',
  },
  challenge: {
    label: '创意闯关',
    description: '跨越不同建筑类型，综合检验你的文创知识储备，看看你能闯过几关。',
    icon: Compass,
    theme: 'from-blue-600 via-indigo-600 to-purple-700',
    accent: '#2563eb',
    bg: 'from-blue-50 to-indigo-50/50',
    border: 'border-blue-200/60',
    iconBg: 'from-blue-500 to-indigo-700',
    cta: '综合检验你的创意知识成果',
  },
  puzzle: {
    label: '拼图训练',
    description: '将经典建筑拆解为碎片，在空间重组中加深对建筑形制与构造的记忆，锻炼设计中的空间思维。',
    icon: Grid3X3,
    theme: 'from-purple-600 via-violet-600 to-purple-900',
    accent: '#9333ea',
    bg: 'from-purple-50 to-violet-50/50',
    border: 'border-purple-200/60',
    iconBg: 'from-purple-600 to-violet-800',
    cta: '在拼合中感受建筑的韵律',
  },
}

type ModePreview = {
  topicCount: number
  progressLabel: string
  questionLabel: string
  highlights: string[]
  starter: string
}

function buildWrongAnswerRecords(records: AnswerRecord[]): WrongAnswerRecord[] {
  const timestamp = Date.now()

  return records
    .filter((record) => record.selectedAnswer !== record.question.answer)
    .map((record, index) => ({
      questionId: record.question.id,
      topicId: record.question.topicId,
      mode: record.question.mode,
      selectedAnswer: record.selectedAnswer,
      correctAnswer: record.question.answer,
      sourceRoute: record.question.sourceRoute,
      sourceLabel: record.question.sourceLabel,
      timestamp: timestamp + index,
    }))
}

function usePuzzleGame(pieces: number, onComplete: () => void) {
  const [board, setBoard] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const shuffle = useCallback(() => {
    const source = Array.from({ length: pieces }, (_, index) => index)

    for (let index = source.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1))
      ;[source[index], source[target]] = [source[target], source[index]]
    }

    if (source.every((value, index) => value === index) && source.length > 1) {
      ;[source[0], source[1]] = [source[1], source[0]]
    }

    setBoard(source)
    setMoves(0)
    setTime(0)
    setDraggedIndex(null)
  }, [pieces])

  useEffect(() => {
    shuffle()
  }, [shuffle])

  useEffect(() => {
    if (board.length === 0) {
      return
    }

    const solved = board.every((value, index) => value === index)
    if (solved) {
      onComplete()
    }
  }, [board, onComplete])

  useEffect(() => {
    if (board.length === 0) {
      return
    }

    const solved = board.every((value, index) => value === index)
    if (solved) {
      return
    }

    const timer = window.setInterval(() => {
      setTime((value) => value + 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [board])

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index)
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
  }, [])

  const handleDrop = useCallback(
    (targetIndex: number) => {
      if (draggedIndex === null) {
        return
      }

      setBoard((current) => {
        const next = [...current]
        ;[next[draggedIndex], next[targetIndex]] = [next[targetIndex], next[draggedIndex]]
        return next
      })
      setMoves((value) => value + 1)
      setDraggedIndex(null)
    },
    [draggedIndex],
  )

  const formatTime = useCallback((value: number) => {
    const minutes = Math.floor(value / 60)
    const seconds = value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, [])

  return {
    board,
    draggedIndex,
    moves,
    time,
    shuffle,
    handleDragStart,
    handleDragOver,
    handleDrop,
    formatTime,
  }
}

function PuzzleWorkbench({
  levels,
  selectedLevelId,
  onSelectLevel,
  onComplete,
  completedIds,
}: {
  levels: TrainingPuzzleLevel[]
  selectedLevelId: number
  onSelectLevel: (levelId: number) => void
  onComplete: (level: TrainingPuzzleLevel) => void
  completedIds: number[]
}) {
  const level = levels.find((item) => item.id === selectedLevelId) ?? levels[0]
  const size = Math.sqrt(level.pieces)
  const completedRef = useRef(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const { board, draggedIndex, moves, time, shuffle, handleDragStart, handleDragOver, handleDrop, formatTime } =
    usePuzzleGame(level.pieces, () => {
      if (completedRef.current) {
        return
      }
      completedRef.current = true
      setIsCompleted(true)
      onComplete(level)
    })

  useEffect(() => {
    completedRef.current = false
    setIsCompleted(false)
  }, [level.id])

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="rounded-[28px] border border-white/45 bg-white/75 p-4 shadow-[0_24px_80px_rgba(31,47,67,0.12)] backdrop-blur dark:border-white/10 dark:bg-white/5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b5e34]">拼图模式</div>
            <h3 className="mt-1 text-xl font-black text-foreground">训练关卡</h3>
          </div>
          <div className="rounded-full border border-white/50 bg-white/80 px-3 py-1 text-xs font-semibold text-[#536579]">
            完成 {completedIds.length}/{levels.length}
          </div>
        </div>

        <div className="space-y-3">
          {levels.map((item) => {
            const active = item.id === level.id
            const completed = completedIds.includes(item.id)

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectLevel(item.id)}
                className={`w-full rounded-[22px] border p-3 text-left transition-all ${
                  active
                    ? 'border-[#b45309]/40 bg-[linear-gradient(135deg,rgba(250,236,214,0.96),rgba(249,244,236,0.9))] shadow-[0_18px_40px_rgba(180,83,9,0.14)]'
                    : 'border-white/45 bg-white/75 hover:-translate-y-0.5 hover:border-[#cbd5e1] dark:border-white/10 dark:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={getImageUrl(item.image)} alt={item.name} className="h-16 w-20 rounded-[16px] object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate font-bold text-foreground">{item.name}</div>
                      {completed ? <CheckCircle2 className="h-4 w-4 flex-none text-[#047857]" /> : null}
                    </div>
                    <div className="mt-1 text-xs font-semibold text-[#8b5e34]">{item.difficulty}</div>
                    <div className="mt-1 text-xs leading-5 text-muted-foreground">{item.tip}</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </aside>

      <section className="panel-shell p-5">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b5e34]">当前拼图</div>
            <h3 className="mt-2 text-2xl font-black text-foreground">{level.name}</h3>
            <p className="mt-2 max-w-[56ch] text-sm leading-7 text-muted-foreground">{level.tip}</p>
          </div>

          <button type="button" onClick={shuffle} className="premium-button-glass inline-flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            重新打散
          </button>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="info-tile">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b5e34]">块数</div>
            <div className="mt-2 text-2xl font-black text-foreground">{level.pieces}</div>
          </div>
          <div className="info-tile">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b5e34]">步数</div>
            <div className="mt-2 text-2xl font-black text-foreground">{moves}</div>
          </div>
          <div className="info-tile">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b5e34]">用时</div>
            <div className="mt-2 text-2xl font-black text-foreground">{formatTime(time)}</div>
          </div>
        </div>

        <div className="mb-5 rounded-[24px] border border-dashed border-[#d4b48b] bg-white/60 p-4 text-sm leading-7 text-[#5f6b77] dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          小提示：先观察建筑的屋顶、结构和整体轮廓，这些特征能帮助你更好地完成拼图。完成后回到专题页面，继续探索更多建筑知识。
        </div>

        <div className="relative">
          <div
            className="mx-auto grid w-full max-w-[620px] overflow-hidden rounded-[28px] border border-white/60 bg-[#1f2937] p-2 shadow-[0_24px_60px_rgba(15,23,42,0.35)] sm:p-3"
            style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
          >
            {board.map((value, index) => {
              const x = value % size
              const y = Math.floor(value / size)

              return (
                <div
                  key={`${level.id}-${index}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  className={`aspect-square rounded-[16px] border border-white/10 transition-transform ${
                    draggedIndex === index ? 'scale-[0.97] opacity-60' : 'hover:scale-[1.01]'
                  }`}
                  style={{
                    backgroundImage: `url(${getImageUrl(level.image)})`,
                    backgroundSize: `${size * 100}% ${size * 100}%`,
                    backgroundPosition: `${(x / Math.max(size - 1, 1)) * 100}% ${(y / Math.max(size - 1, 1)) * 100}%`,
                    cursor: draggedIndex === null ? 'grab' : 'grabbing',
                  }}
                />
              )
            })}
          </div>

          {isCompleted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-[28px]">
              <div className="text-center text-white p-6">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold mb-2">拼图完成！</h3>
                <p className="mb-4">你用了 {moves} 步，耗时 {formatTime(time)}</p>
                <button 
                  onClick={shuffle} 
                  className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
                >
                  再次挑战
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default function TrainingCenterPage({
  entryPath,
  initialMode = 'overview',
  initialTopicId = 'achievement',
}: TrainingCenterPageProps) {
  const navigate = useNavigate()
  const [journey, setJourney] = useState(() => getJourneyState())
  const [activeMode, setActiveMode] = useState<PageMode>(initialMode)
  const [selectedTopicId, setSelectedTopicId] = useState(initialTopicId)
  const [currentQuestions, setCurrentQuestions] = useState<TrainingQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([])
  const [selectedPuzzleId, setSelectedPuzzleId] = useState(trainingPuzzleLevels[0]?.id ?? 0)

  useEffect(() => {
    trackPageVisit(entryPath)
  }, [entryPath])

  useEffect(() => {
    if (activeMode !== 'overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [activeMode])

  useEffect(() => {
    const sync = () => {
      setJourney(getJourneyState())
    }

    window.addEventListener('journey-updated', sync)
    return () => window.removeEventListener('journey-updated', sync)
  }, [])

  const selectedTopic = useMemo(() => getTrainingTopic(selectedTopicId), [selectedTopicId])
  const topicModes = useMemo(() => getTrainingModesForTopic(selectedTopicId), [selectedTopicId])

  useEffect(() => {
    if (activeMode === 'overview' || activeMode === 'puzzle' || activeMode === 'challenge') {
      return
    }

    if (!topicModes.includes(activeMode)) {
      setActiveMode(topicModes[0] ?? 'single')
    }
  }, [activeMode, topicModes])

  const currentQuestion = currentQuestions[currentIndex] ?? null
  const correctCount = useMemo(
    () => answerRecords.filter((record) => record.selectedAnswer === record.question.answer).length,
    [answerRecords],
  )
  const finished = currentQuestions.length > 0 && answerRecords.length === currentQuestions.length
  const wrongRecords = useMemo(
    () => answerRecords.filter((record) => record.selectedAnswer !== record.question.answer),
    [answerRecords],
  )

  const startQuestionSession = useCallback(
    (mode: Exclude<TrainingMode, 'puzzle'>, topicId = selectedTopicId) => {
      const nextQuestions = buildTrainingSession(topicId, mode)

      setCurrentQuestions(nextQuestions)
      setCurrentIndex(0)
      setSelectedAnswer(null)
      setSubmitted(false)
      setAnswerRecords([])
      setActiveMode(mode)
    },
    [selectedTopicId],
  )

  const resetToOverview = useCallback(() => {
    setCurrentQuestions([])
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setSubmitted(false)
    setAnswerRecords([])
    setActiveMode('overview')
  }, [])

  const persistFinishedSession = useCallback(
    (records: AnswerRecord[]) => {
      if (records.length === 0) {
        return
      }

      const mode = activeMode === 'overview' ? 'single' : activeMode
      const score = records.filter((record) => record.selectedAnswer === record.question.answer).length

      recordTrainingSession({
        topicId: selectedTopicId,
        mode,
        score,
        total: records.length,
        timestamp: Date.now(),
        wrongAnswers: buildWrongAnswerRecords(records),
      })
      setJourney(getJourneyState())
    },
    [activeMode, selectedTopicId],
  )

  const submitCurrentAnswer = useCallback(() => {
    if (!currentQuestion || selectedAnswer === null || submitted) {
      return
    }

    setSubmitted(true)
  }, [currentQuestion, selectedAnswer, submitted])

  const goNext = useCallback(() => {
    if (!currentQuestion || selectedAnswer === null) {
      return
    }

    const record = {
      question: currentQuestion,
      selectedAnswer,
    }
    const nextRecords = [...answerRecords, record]

    setAnswerRecords(nextRecords)
    setSelectedAnswer(null)
    setSubmitted(false)

    if (currentIndex >= currentQuestions.length - 1) {
      persistFinishedSession(nextRecords)
      return
    }

    setCurrentIndex((value) => value + 1)
  }, [answerRecords, currentIndex, currentQuestion, currentQuestions.length, persistFinishedSession, selectedAnswer])

  const retryCurrentMode = useCallback(() => {
    if (activeMode === 'overview' || activeMode === 'puzzle') {
      return
    }

    startQuestionSession(activeMode, selectedTopicId)
  }, [activeMode, selectedTopicId, startQuestionSession])

  const handlePuzzleComplete = useCallback((level: TrainingPuzzleLevel) => {
    recordPuzzleCompletion(level.id)
    recordTrainingSession({
      topicId: level.topicId,
      mode: 'puzzle',
      score: 1,
      total: 1,
      timestamp: Date.now(),
    })
    setJourney(getJourneyState())
  }, [])

  const topicProgress = trainingTopics
    .filter((item) => item.id !== 'all-topics')
    .map((item) => ({
      ...item,
      questionCount: getQuestionsForTopic(item.id).length,
      completed: journey.trainingTopics.includes(item.id),
    }))
  const modePreviewMap = useMemo<Record<TrainingMode, ModePreview>>(() => {
    const buildTopicPreview = (mode: Exclude<TrainingMode, 'challenge' | 'puzzle'>) => {
      const eligibleTopics = topicProgress.filter((topic) => getTrainingModesForTopic(topic.id).includes(mode))
      const totalQuestions = eligibleTopics.reduce((sum, topic) => sum + buildTrainingSession(topic.id, mode).length, 0)
      const completedTopics = eligibleTopics.filter((topic) => topic.completed).length

      return {
        topicCount: eligibleTopics.length,
        progressLabel: `${completedTopics}/${eligibleTopics.length || 1} 专题已打通`,
        questionLabel: `${totalQuestions} 道训练题可直接开始`,
        highlights: eligibleTopics.slice(0, 3).map((topic) => topic.label),
        starter: eligibleTopics[0]?.label ?? '设计素材',
      }
    }

    const challengeQuestions = buildTrainingSession('all-topics', 'challenge').length

    return {
      single: buildTopicPreview('single'),
      judge: buildTopicPreview('judge'),
      visual: buildTopicPreview('visual'),
      structure: buildTopicPreview('structure'),
      challenge: {
        topicCount: trainingTopics.filter((item) => item.id !== 'all-topics').length,
        progressLabel: `${journey.trainingTopics.length}/${trainingOverview.topicCount} 专题可参与综合闯关`,
        questionLabel: `${challengeQuestions} 道混合题会跨页面抽取`,
        highlights: ['建筑成就', '营造文献', '文化语境'],
        starter: '综合闯关',
      },
      puzzle: {
        topicCount: trainingPuzzleLevels.length,
        progressLabel: `${journey.completedPuzzles.length}/${trainingOverview.puzzleCount} 拼图已完成`,
        questionLabel: `${trainingPuzzleLevels.length} 组图像拼图可切换`,
        highlights: trainingPuzzleLevels.slice(0, 3).map((level) => level.name),
        starter: trainingPuzzleLevels[0]?.name ?? '拼图训练',
      },
    }
  }, [journey.completedPuzzles.length, journey.trainingTopics.length, topicProgress])

  const heroMode: TrainingMode = 'challenge'
  const featuredTopics = topicProgress.slice(0, 4)

  useEffect(() => {
    if (activeMode === 'overview' || activeMode === 'puzzle' || currentQuestions.length > 0 || answerRecords.length > 0) {
      return
    }

    const bootMode = activeMode as Exclude<TrainingMode, 'puzzle'>
    const bootTopicId = bootMode === 'challenge' ? 'all-topics' : bootMode === 'structure' ? 'structure' : bootMode === 'visual' ? 'gallery' : selectedTopicId

    setSelectedTopicId(bootTopicId)
    startQuestionSession(bootMode, bootTopicId)
  }, [activeMode, answerRecords.length, currentQuestions.length, selectedTopicId, startQuestionSession])

  return (
    <div className="page-shell">
      <GlobalNav />

      <motion.section
        className="page-header training-hero-v2"
        variants={pageSectionVariants}
        initial="initial"
        animate="animate"
        data-cine-section
      >
        <div className="training-hero-v2-bg">
          <LazyImage src="/images/beijing3.jpg" alt="知识训练中心" className="training-hero-v2-image" priority />
          <div className="training-hero-v2-overlay" />
          <div className="training-hero-v2-grain" />
        </div>
        <div className="training-hero-v2-content">
          <motion.div className="hero-orb hero-orb-cinnabar" data-cine-parallax="0.10" style={{ width: 420, height: 420, top: '-15%', right: '5%' }} />
          <motion.div className="hero-orb hero-orb-yellow" data-cine-parallax="-0.06" style={{ width: 320, height: 320, bottom: '-12%', left: '-4%' }} />

          <div className="training-hero-v2-layout">
            <div className="training-hero-v2-copy">
              <motion.div className="training-hero-v2-badge" variants={cardPopChildVariants} data-cine-copy>
                <Sparkles className="h-3.5 w-3.5" />
                <span>创意训练中心</span>
              </motion.div>

              <h1 className="training-hero-v2-title">
                <span data-cine-title-line className="training-hero-v2-title-line">千年营造</span>
                <span data-cine-title-line className="training-hero-v2-title-line training-hero-v2-title-accent">创意新生</span>
              </h1>

              <motion.p className="training-hero-v2-subtitle" variants={cardPopChildVariants} data-cine-copy>
                从专题学习到图像辨识，从结构解析到综合闯关，多种训练方式助你循序渐进地掌握古建筑知识。
              </motion.p>

              <motion.div className="training-hero-v2-stats" variants={cardPopChildVariants} data-cine-strip>
                <div className="training-hero-v2-stat">
                  <BrainCircuit className="h-4 w-4" />
                  <span className="training-hero-v2-stat-value">{trainingOverview.totalQuestions}</span>
                  <span className="training-hero-v2-stat-label">道精选题目</span>
                </div>
                <div className="training-hero-v2-stat">
                  <Target className="h-4 w-4" />
                  <span className="training-hero-v2-stat-value">{journey.trainingTopics.length}</span>
                  <span className="training-hero-v2-stat-label">专题已打通</span>
                </div>
                <div className="training-hero-v2-stat">
                  <Grid3X3 className="h-4 w-4" />
                  <span className="training-hero-v2-stat-value">{journey.completedPuzzles.length}</span>
                  <span className="training-hero-v2-stat-label">拼图已完成</span>
                </div>
                <div className="training-hero-v2-stat">
                  <Flame className="h-4 w-4" />
                  <span className="training-hero-v2-stat-value">{journey.wrongAnswers.length}</span>
                  <span className="training-hero-v2-stat-label">待复习</span>
                </div>
              </motion.div>

              <motion.div className="training-hero-v2-actions" variants={cardPopChildVariants} data-cine-actions>
                <motion.button
                  type="button"
                  onClick={() => startQuestionSession('challenge', 'all-topics')}
                  className="training-hero-v2-cta-primary"
                  whileHover={buttonMagnetHover}
                  whileTap={aliveCardTap}
                >
                  <span>开始综合闯关</span>
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => navigate('/')}
                  className="training-hero-v2-cta-glass"
                  whileHover={buttonMagnetHover}
                  whileTap={aliveCardTap}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>返回首页</span>
                </motion.button>
              </motion.div>
            </div>

            <motion.div
              className="training-hero-v2-quickstart"
              variants={cardPopVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="training-hero-v2-quickstart-header">
                <div className="training-hero-v2-quickstart-icon">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <div className="training-hero-v2-quickstart-eyebrow">为你推荐</div>
                  <h2 className="training-hero-v2-quickstart-title">{modeMeta[heroMode].label}</h2>
                </div>
              </div>
              <p className="training-hero-v2-quickstart-desc">{modeMeta[heroMode].description}</p>

              <div className="training-hero-v2-quickstart-topics">
                {featuredTopics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => {
                      const mode = 'single'
                      const nextQuestions = buildTrainingSession(topic.id, mode)
                      if (nextQuestions.length > 0) {
                        setSelectedTopicId(topic.id)
                        setCurrentQuestions(nextQuestions)
                        setCurrentIndex(0)
                        setSelectedAnswer(null)
                        setSubmitted(false)
                        setAnswerRecords([])
                        setActiveMode(mode)
                        // 滚动到答题区域
                        setTimeout(() => {
                          const mainContent = document.getElementById('main-content')
                          if (mainContent) {
                            mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }
                        }, 100)
                      }
                    }}
                    className={`training-hero-v2-topic${topic.id === selectedTopicId ? ' training-hero-v2-topic-active' : ''}`}
                  >
                    <span className="training-hero-v2-topic-name">{topic.label}</span>
                    <span className="training-hero-v2-topic-count">{topic.questionCount} 题</span>
                    <ChevronRight className="training-hero-v2-topic-arrow h-3 w-3" />
                  </button>
                ))}
              </div>

              <div className="training-hero-v2-quickstart-hint">
                先从专题问答入门，再挑战图像识别，最后试试综合闯关
              </div>
            </motion.div>
          </div>

          <div className="training-hero-v2-scroll-wrap">
            <HeroScrollCue tone="ember" label="向下展开卷轴" />
          </div>
        </div>
      </motion.section>

      <div className="training-hero-transition" aria-hidden="true">
        <svg className="training-hero-transition-ornament" viewBox="0 0 1200 24" fill="none" preserveAspectRatio="none">
          <path d="M0 12 Q50 0, 100 12 Q150 24, 200 12 Q250 0, 300 12 Q350 24, 400 12 Q450 0, 500 12 Q550 24, 600 12 Q650 0, 700 12 Q750 24, 800 12 Q850 0, 900 12 Q950 24, 1000 12 Q1050 0, 1100 12 Q1150 24, 1200 12" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
        </svg>
      </div>

      <motion.main id="main-content" className="page-main training-main-v2" variants={pageSectionVariants} initial="initial" animate="animate">
        {activeMode === 'overview' ? (
        <section className="training-modes-v2" data-cine-section>
          <div className="training-modes-v2-header">
            <div className="training-modes-v2-kicker">
              <span className="training-modes-v2-kicker-line" />
              <span>训练模式</span>
            </div>
            <h2 className="training-modes-v2-title">选择适合你的训练方式</h2>
            <p className="training-modes-v2-desc">从专题入门到综合闯关，每种模式都有不同的学习侧重点。</p>
          </div>

          <div className="training-modes-v2-grid">
            {(Object.keys(modeMeta) as TrainingMode[]).map((mode, index) => {
              const meta = modeMeta[mode]
              const Icon = meta.icon
              const preview = modePreviewMap[mode]

              return (
                <motion.button
                  key={mode}
                  type="button"
                  onClick={() => {
                    if (mode === 'puzzle') {
                      setActiveMode('puzzle')
                    } else if (mode === 'challenge') {
                      startQuestionSession('challenge', 'all-topics')
                    } else {
                      const topicId = mode === 'structure' ? 'structure' : mode === 'visual' ? 'gallery' : selectedTopicId
                      setSelectedTopicId(topicId)
                      startQuestionSession(mode as Exclude<TrainingMode, 'puzzle' | 'challenge'>, topicId)
                    }
                  }}
                  className="training-mode-v2-card"
                  style={{
                    ['--mode-accent' as string]: meta.accent,
                    ['--mode-bg' as string]: meta.bg,
                    ['--mode-border' as string]: meta.border,
                    ['--mode-gradient' as string]: meta.theme,
                    ['--mode-icon-bg' as string]: meta.iconBg,
                  }}
                  variants={cardPopVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.15 }}
                  whileHover={aliveCardHover}
                  whileTap={aliveCardTap}
                  transition={{ delay: index * 0.06 }}
                >
                  <div className="training-mode-v2-card-body">
                    <div className="training-mode-v2-card-head">
                      <div className="training-mode-v2-card-icon-wrap">
                        <span className="training-mode-v2-card-icon-bg" />
                        <Icon className="training-mode-v2-card-icon" />
                      </div>
                      <span className="training-mode-v2-card-count">{preview.topicCount} 个专题</span>
                    </div>
                    <h3 className="training-mode-v2-card-title">{meta.label}</h3>
                    <p className="training-mode-v2-card-desc">{meta.description}</p>
                    <div className="training-mode-v2-card-highlights">
                      {preview.highlights.slice(0, 2).map((item) => (
                        <span key={item} className="training-mode-v2-card-tag">{item}</span>
                      ))}
                    </div>
                    <div className="training-mode-v2-card-footer">
                      <span className="training-mode-v2-card-cta">
                        {meta.cta}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                      <span className="training-mode-v2-card-index">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </section>
        ) : null}

        {activeMode === 'puzzle' ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b5e34]">拼图训练</div>
                <h2 className="mt-2 text-2xl font-black text-foreground">把图像识别纳入统一训练语言</h2>
              </div>
              <button type="button" onClick={resetToOverview} className="premium-button-glass inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                返回中心总览
              </button>
            </div>

            <PuzzleWorkbench
              levels={trainingPuzzleLevels}
              selectedLevelId={selectedPuzzleId}
              onSelectLevel={setSelectedPuzzleId}
              onComplete={handlePuzzleComplete}
              completedIds={journey.completedPuzzles}
            />
          </div>
        ) : null}

        {activeMode !== 'overview' && activeMode !== 'puzzle' && currentQuestions.length > 0 && !finished ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-md">
                  {(() => {
                    const ModeIcon = modeMeta[activeMode].icon
                    return <ModeIcon className="h-5 w-5" />
                  })()}
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b5e34]">{modeMeta[activeMode].label}</div>
                  <h2 className="text-lg font-black text-foreground">{selectedTopic.label}</h2>
                </div>
              </div>
              <button type="button" onClick={resetToOverview} className="premium-button-glass inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                返回训练中心
              </button>
            </div>
          <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
            <aside className="space-y-6">
              <article className="panel-shell">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b5e34]">当前模式</div>
                <h2 className="mt-2 text-2xl font-black text-foreground">{modeMeta[activeMode].label}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{modeMeta[activeMode].description}</p>

                <div className="mt-5 space-y-3">
                  {topicProgress.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => {
                        const nextMode = activeMode === 'visual' ? 'visual' : activeMode === 'structure' ? 'structure' : 'single'
                        const fallbackMode = getTrainingModesForTopic(topic.id).includes(nextMode) ? nextMode : getTrainingModesForTopic(topic.id)[0]
                        setSelectedTopicId(topic.id)
                        startQuestionSession(fallbackMode as Exclude<TrainingMode, 'puzzle'>, topic.id)
                      }}
                      className={topic.id === selectedTopicId ? 'choice-card choice-card-selected' : 'choice-card hover:-translate-y-0.5'}
                    >
                      <div className="font-bold text-foreground">{topic.label}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{topic.questionCount} 题题库</div>
                    </button>
                  ))}
                </div>
              </article>

              <article className="panel-shell">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b5e34]">训练进度</div>
                    <div className="mt-2 text-2xl font-black text-foreground">
                      {currentIndex + 1}/{currentQuestions.length}
                    </div>
                  </div>
                  <div className="selection-pill px-3 py-1 text-xs text-[#536579]">
                    已答 {answerRecords.length} 道
                  </div>
                </div>

                <div className="mt-5 h-3.5 overflow-hidden rounded-full bg-white/60 shadow-inner dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#d97706,#b45309,#2563eb)] shadow-sm transition-all duration-500 ease-out"
                    style={{ width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }}
                  />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="info-tile">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b5e34]">专题</div>
                    <div className="mt-2 font-bold text-foreground">{selectedTopic.label}</div>
                  </div>
                  <div className="info-tile">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b5e34]">题型</div>
                    <div className="mt-2 font-bold text-foreground">
                      {currentQuestion.mode === 'visual'
                        ? '图像识别'
                        : currentQuestion.mode === 'structure'
                          ? '结构识别'
                          : currentQuestion.mode === 'judge'
                            ? '判断题'
                            : '单选题'}
                    </div>
                  </div>
                </div>
              </article>
            </aside>

            <section className="panel-shell rounded-[32px] p-7">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="selection-pill gap-2 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#8b5e34]">
                    {selectedTopic.sourceLabel}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#f4eadc] px-3 py-1 text-xs font-semibold text-[#8b5e34] dark:bg-white/10 dark:text-[#d8b37f]">
                      第 {currentIndex + 1} / {currentQuestions.length} 题
                    </span>
                    <span className="rounded-full bg-[#eef4fb] px-3 py-1 text-xs font-semibold text-[#47627e] dark:bg-white/10 dark:text-slate-200">
                      {currentQuestion.mode === 'visual'
                        ? '图像识别'
                        : currentQuestion.mode === 'structure'
                          ? '结构问答'
                          : currentQuestion.mode === 'judge'
                            ? '判断强化'
                            : '专题问答'}
                    </span>
                  </div>
                  <h2 className="mt-4 text-3xl font-black leading-[1.25] text-foreground">{currentQuestion.question}</h2>
                </div>
                <button
                  type="button"
                  onClick={resetToOverview}
                  className="premium-button-tonal px-4 py-2 text-sm"
                >
                  退出本轮训练
                </button>
              </div>

              {currentQuestion.image ? (
                <div className="mb-6 overflow-hidden rounded-[30px] border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,244,237,0.88))] shadow-md dark:border-white/10 dark:bg-white/5">
                  <img src={getImageUrl(currentQuestion.image)} alt={currentQuestion.sourceLabel} className="h-[320px] w-full object-cover transition-transform hover:scale-[1.03]" />
                  <div className="border-t border-white/45 px-5 py-3 text-sm text-muted-foreground dark:border-white/10">
                    图像线索来自 {currentQuestion.sourceLabel}，可先观察体量轮廓、屋顶形式和空间边界，再做判断。
                  </div>
                </div>
              ) : null}

              <div className="space-y-3.5">
                {currentQuestion.options.map((option, index) => {
                  const isPicked = selectedAnswer === index
                  const isCorrect = currentQuestion.answer === index
                  const showCorrect = submitted && isCorrect
                  const showWrong = submitted && isPicked && !isCorrect

                  return (
                    <button
                      key={`${currentQuestion.id}-${index}`}
                      type="button"
                      onClick={() => !submitted && setSelectedAnswer(index)}
                      disabled={submitted}
                      className={`choice-card ${showCorrect ? 'choice-card-correct' : showWrong ? 'choice-card-wrong' : isPicked ? 'choice-card-selected' : ''}`}
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-current text-sm font-black shadow-sm">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <div className="flex-1 text-sm leading-7 text-foreground">{option}</div>
                      {showCorrect ? <CheckCircle2 className="h-5 w-5 text-[#047857]" /> : null}
                      {showWrong ? <XCircle className="h-5 w-5 text-[#b91c1c]" /> : null}
                    </button>
                  )
                })}
              </div>

              <div className="mt-7 flex flex-wrap gap-4">
                {!submitted ? (
                  <button
                    type="button"
                    onClick={submitCurrentAnswer}
                    disabled={selectedAnswer === null}
                    className="premium-button-primary inline-flex items-center gap-2 disabled:opacity-40"
                  >
                    <Target className="h-4 w-4" />
                    提交答案
                  </button>
                ) : (
                  <button type="button" onClick={goNext} className="premium-button-primary inline-flex items-center gap-2">
                    {currentIndex >= currentQuestions.length - 1 ? '查看本轮结果' : '下一题'}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}

                <button type="button" onClick={() => setSelectedAnswer(null)} className="premium-button-glass" disabled={submitted}>
                  重置选择
                </button>
              </div>

              {submitted ? (
                <div className="mt-6 rounded-[28px] border border-white/45 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {selectedAnswer === currentQuestion.answer ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-[#047857]" />
                          <span className="font-bold text-[#047857]">回答正确，真棒！</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-[#b91c1c]" />
                          <span className="font-bold text-[#b91c1c]">这道题答错了，别灰心</span>
                        </>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(currentQuestion.sourceRoute)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#8b5e34] hover:underline"
                    >
                      回到原文看看
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{currentQuestion.explanation}</p>
                </div>
              ) : null}
            </section>
          </div>
          </div>
        ) : null}

        {activeMode !== 'overview' && activeMode !== 'puzzle' && finished ? (
          <motion.section
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="rounded-[32px] border border-white/45 bg-[linear-gradient(135deg,rgba(255,251,244,0.98),rgba(246,239,230,0.94))] p-7 shadow-[0_28px_90px_rgba(31,47,67,0.16)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(17,24,39,0.94),rgba(15,23,42,0.96))]"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#d97706,#b45309)] text-white shadow-lg">
                    <Trophy className="h-8 w-8" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b5e34]">训练结果</div>
                    <h2 className="mt-2 text-3xl font-black text-foreground">
                      {selectedTopic.label} · {modeMeta[activeMode].label}
                    </h2>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[22px] border border-white/45 bg-white/80 px-5 py-4 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b5e34]">答对</div>
                    <div className="mt-2 text-3xl font-black text-foreground">
                      {correctCount}/{answerRecords.length}
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-white/45 bg-white/80 px-5 py-4 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b5e34]">正确率</div>
                    <div className="mt-2 text-3xl font-black text-foreground">
                      {Math.round((correctCount / Math.max(answerRecords.length, 1)) * 100)}%
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-white/45 bg-white/80 px-5 py-4 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b5e34]">待复习</div>
                    <div className="mt-2 text-3xl font-black text-foreground">{wrongRecords.length}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <button type="button" onClick={retryCurrentMode} className="premium-button-primary inline-flex items-center gap-2">
                  <TimerReset className="h-4 w-4" />
                  再来一轮
                </button>
                <button type="button" onClick={resetToOverview} className="premium-button-glass inline-flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  返回训练中心
                </button>
                <button type="button" onClick={() => navigate('/user')} className="premium-button-glass inline-flex items-center gap-2">
                  <BookMarked className="h-4 w-4" />
                  查看学习档案
                </button>
              </div>
            </motion.div>

            <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
              <article className="rounded-[30px] border border-white/45 bg-[linear-gradient(180deg,rgba(255,251,244,0.96),rgba(250,246,240,0.92))] p-6 shadow-[0_20px_70px_rgba(31,47,67,0.12)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(17,24,39,0.92),rgba(15,23,42,0.94))]">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h3 className="text-2xl font-black text-foreground">错题列表</h3>
                  <div className="rounded-full border border-white/45 bg-white/80 px-3 py-1 text-xs font-semibold text-[#536579] shadow-sm dark:border-white/10 dark:bg-white/5">
                    推荐先回看再重做
                  </div>
                </div>

                {wrongRecords.length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-[#bbf7d0] bg-[#ecfdf5] p-5 text-sm leading-7 text-[#166534] shadow-sm">
                    本轮没有错题。你已经把这个专题的核心题链完整打通了，可以直接切到综合闯关继续训练。
                  </div>
                ) : (
                  <div className="space-y-4">
                    {wrongRecords.map((record) => (
                      <div key={record.question.id} className="premium-card-compact rounded-[24px] p-5">
                        <div className="text-sm font-semibold text-[#8b5e34]">{record.question.sourceLabel}</div>
                        <div className="mt-2 text-lg font-bold leading-8 text-foreground">{record.question.question}</div>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          <div className="rounded-[18px] bg-[#fef2f2] px-4 py-3 text-sm text-[#991b1b] shadow-sm">
                            你的答案：{record.question.options[record.selectedAnswer]}
                          </div>
                          <div className="rounded-[18px] bg-[#ecfdf5] px-4 py-3 text-sm text-[#166534] shadow-sm">
                            正确答案：{record.question.options[record.question.answer]}
                          </div>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-muted-foreground">{record.question.explanation}</p>
                        <button
                          type="button"
                          onClick={() => navigate(record.question.sourceRoute)}
                          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8b5e34] hover:underline"
                        >
                          去回看来源页面
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </article>

              <div className="space-y-6">
                <article className="panel-shell">
                  <h3 className="text-2xl font-black text-foreground">推荐去向</h3>
                  <div className="mt-5 space-y-3">
                    <button
                      type="button"
                      onClick={() => navigate(selectedTopic.sourceRoute)}
                      className="choice-card justify-between px-4 py-4"
                    >
                      <div>
                        <div className="font-bold text-foreground">回到 {selectedTopic.sourceLabel}</div>
                        <div className="mt-1 text-sm text-muted-foreground">继续看专题正文，补足概念来源和案例上下文。</div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-[#8b5e34]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => startQuestionSession('challenge', 'all-topics')}
                      className="choice-card justify-between px-4 py-4"
                    >
                      <div>
                        <div className="font-bold text-foreground">进入综合闯关</div>
                        <div className="mt-1 text-sm text-muted-foreground">把多个专题混在一起，检验是否真正形成跨页面判断能力。</div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-[#8b5e34]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMode('puzzle')}
                      className="choice-card justify-between px-4 py-4"
                    >
                      <div>
                        <div className="font-bold text-foreground">切到拼图训练</div>
                        <div className="mt-1 text-sm text-muted-foreground">换一种训练节奏，用空间与图像记忆巩固建筑识别。</div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-[#8b5e34]" />
                    </button>
                  </div>
                </article>

                <article className="panel-shell">
                  <h3 className="text-2xl font-black text-foreground">本轮回顾</h3>
                  <div className="mt-5 space-y-3">
                    {answerRecords.map((record, index) => (
                      <div key={record.question.id} className="info-tile px-4 py-3 text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-semibold text-foreground">第 {index + 1} 题</div>
                          {record.selectedAnswer === record.question.answer ? (
                            <span className="text-[#047857]">答对</span>
                          ) : (
                            <span className="text-[#b91c1c]">答错</span>
                          )}
                        </div>
                        <div className="mt-1 line-clamp-2 leading-7 text-muted-foreground">{record.question.question}</div>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </div>
          </motion.section>
        ) : null}
      </motion.main>
    </div>
  )
}
