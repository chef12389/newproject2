import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Loader2, RotateCcw, Send, Sparkles, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import {
  answerAssistantQuestion,
  type AssistantMessage,
} from '@/lib/assistant'
import { motionEase } from '@/lib/motion'

type Message = {
  id: string
  text: string
  sender: 'user' | 'ai'
}

const sparkles = [
  { className: '-left-1 top-3', delay: 0.2, size: 'h-5 w-5', opacity: 0.9 },
  { className: 'right-1 top-0', delay: 1.1, size: 'h-4 w-4', opacity: 0.75 },
  { className: 'right-2 bottom-3', delay: 1.8, size: 'h-3.5 w-3.5', opacity: 0.68 },
]

function getPanelContextLabel(pathname: string) {
  if (pathname.startsWith('/architecture/')) return '建筑知识'
  if (pathname.startsWith('/achievement')) return '类型知识'
  if (pathname.startsWith('/scientists')) return '人物知识'
  if (pathname.startsWith('/treatises')) return '文献知识'
  if (pathname.startsWith('/culture')) return '文化知识'
  if (pathname.startsWith('/gallery')) return '图像知识'
  return '古建知识'
}

function getPanelQuickPrompts(pathname: string) {
  if (pathname.startsWith('/scientists')) return ['李诫', '喻皓', '样式雷']
  if (pathname.startsWith('/treatises')) return ['营造法式', '园冶', '工程做法则例']
  if (pathname.startsWith('/culture')) return ['礼制与都城', '传统村落', '非遗技艺']
  return ['故宫', '赵州桥', '四合院']
}

function getPanelWelcome(pathname: string) {
  return `这里可以直接查询站内古建知识。输入一个对象或主题即可，例如“故宫”或“李诫”。当前更适合查询${getPanelContextLabel(pathname)}。`
}

function createWelcomeMessage(pathname: string): Message {
  return {
    id: `welcome-${pathname}-${Date.now()}`,
    text: getPanelWelcome(pathname),
    sender: 'ai',
  }
}

export default function AISprite() {
  const location = useLocation()
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const disableAnimations = prefersReducedMotion || isMobile

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const contextLabel = useMemo(() => getPanelContextLabel(location.pathname), [location.pathname])
  const quickPrompts = useMemo(() => getPanelQuickPrompts(location.pathname), [location.pathname])
  const canSend = inputText.trim().length > 0 && !isLoading
  const showStarterCard = messages.length === 1 && messages[0]?.sender === 'ai'

  const spriteFloat = useMemo(
    () => ({
      animate: disableAnimations
        ? { y: 0, rotate: 0 }
        : {
            y: [0, -7, 0],
            rotate: [0, -2, 2, 0],
            transition: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' },
          },
    }),
    [disableAnimations],
  )

  const haloAnimation = disableAnimations
    ? { rotate: 0, scale: 1 }
    : {
        rotate: [0, 8, 0, -8, 0],
        scale: [1, 1.04, 1],
      }

  const haloTransition = disableAnimations
    ? { duration: 0.01 }
    : {
        duration: 5.6,
        repeat: Infinity,
        ease: 'easeInOut',
      }

  const blinkAnimation = disableAnimations ? { scaleY: 1 } : { scaleY: [1, 1, 0.16, 1, 1] }
  const blinkTransition = disableAnimations
    ? { duration: 0.01 }
    : {
        duration: 4.8,
        repeat: Infinity,
        times: [0, 0.44, 0.48, 0.54, 1],
        ease: 'easeInOut',
      }

  useEffect(() => {
    setMessages([createWelcomeMessage(location.pathname)])
    setIsOpen(false)
    setInputText('')
    setIsLoading(false)
  }, [location.pathname])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, isLoading])

  useEffect(() => {
    if (!isOpen) return

    const timer = window.setTimeout(() => {
      inputRef.current?.focus()
    }, 120)

    return () => window.clearTimeout(timer)
  }, [isOpen])

  const submitMessage = (question: string) => {
    const trimmed = question.trim()
    if (!trimmed || isLoading) return

    const nextMessages = [
      ...messages,
      {
        id: `user-${Date.now()}`,
        text: trimmed,
        sender: 'user' as const,
      },
    ]

    setMessages(nextMessages)
    setInputText('')
    setIsLoading(true)

    window.setTimeout(() => {
      const memory: AssistantMessage[] = nextMessages.slice(-8).map((item) => ({
        role: item.sender === 'user' ? 'user' : 'assistant',
        content: item.text,
      }))

      const answer = answerAssistantQuestion({
        pathname: location.pathname,
        question: trimmed,
        messages: memory,
      })

      setMessages((prev) => [
        ...prev.slice(-9),
        {
          id: `ai-${Date.now()}`,
          text: answer,
          sender: 'ai',
        },
      ])
      setIsLoading(false)
    }, 260)
  }

  const handleReset = () => {
    setMessages([createWelcomeMessage(location.pathname)])
    setInputText('')
    setIsLoading(false)
  }

  return (
    <div className="fixed right-3 top-3 z-[95] bottom-auto md:right-5 md:top-4 xl:right-6 xl:top-4 2xl:right-8">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: motionEase }}
            className="absolute right-0 top-[calc(100%+0.75rem)] w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-[28px] border border-[#e6d7ba] bg-[linear-gradient(180deg,rgba(255,251,243,0.985),rgba(248,239,226,0.965))] shadow-[0_26px_80px_-34px_rgba(72,42,18,0.42)] backdrop-blur-xl dark:border-[#5c4a35] dark:bg-[linear-gradient(180deg,rgba(18,21,29,0.97),rgba(16,19,25,0.97))] md:w-[380px]"
          >
            <div className="border-b border-[#eadcc1] px-4 py-3 dark:border-[#4d3d2a]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center">
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full border border-[#f5d79d]/90 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,240,201,0.95),rgba(255,208,119,0.86),rgba(255,238,199,0.95))] shadow-[0_8px_18px_-14px_rgba(212,134,42,0.86)]"
                      animate={haloAnimation}
                      transition={haloTransition}
                    />
                    <span className="absolute left-1/2 top-0 h-[7px] w-[18px] -translate-x-1/2 rounded-full bg-[#fff6dc]/90 blur-[0.5px]" />
                    <span className="absolute left-1/2 top-[5px] h-[3px] w-[10px] -translate-x-1/2 rounded-full bg-[#f7c561]/80" />
                    <div className="relative flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_38%_30%,#fff7ef_0%,#ffe9ca_40%,#ffd48f_74%,#f3a84b_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_22px_-14px_rgba(212,134,42,0.85)]">
                      <span className="absolute -left-[2px] top-[10px] h-[8px] w-[7px] rounded-l-full rounded-r-[999px] bg-[linear-gradient(180deg,#ffe9be,#ffca74)] opacity-95" />
                      <span className="absolute -right-[2px] top-[10px] h-[8px] w-[7px] rounded-r-full rounded-l-[999px] bg-[linear-gradient(180deg,#ffe9be,#ffca74)] opacity-95" />
                      <span className="absolute left-[4px] top-[8px] flex h-[12px] w-[12px] items-center justify-center rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.72)]">
                        <motion.span
                          className="relative h-[8px] w-[7px] rounded-full bg-[radial-gradient(circle_at_40%_30%,#7f4124_0%,#5f2d16_100%)]"
                          animate={blinkAnimation}
                          transition={blinkTransition}
                          style={{ originY: 0.5 }}
                        >
                          <span className="absolute left-[1px] top-[1px] h-[3px] w-[3px] rounded-full bg-white" />
                        </motion.span>
                      </span>
                      <span className="absolute right-[4px] top-[8px] flex h-[12px] w-[12px] items-center justify-center rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.72)]">
                        <motion.span
                          className="relative h-[8px] w-[7px] rounded-full bg-[radial-gradient(circle_at_40%_30%,#7f4124_0%,#5f2d16_100%)]"
                          animate={blinkAnimation}
                          transition={blinkTransition}
                          style={{ originY: 0.5 }}
                        >
                          <span className="absolute left-[1px] top-[1px] h-[3px] w-[3px] rounded-full bg-white" />
                        </motion.span>
                      </span>
                      <span className="absolute left-[4px] top-[17px] h-[6px] w-[7px] rounded-full bg-[#ffd7a6]/55" />
                      <span className="absolute right-[4px] top-[17px] h-[6px] w-[7px] rounded-full bg-[#ffd7a6]/55" />
                      <span className="absolute left-1/2 top-[16px] h-[4px] w-[6px] -translate-x-1/2 rounded-[3px] bg-[#fff1d9]/96" />
                      <span className="absolute left-1/2 top-[21px] h-[5px] w-[7px] -translate-x-1/2 rounded-full bg-[#fff7ea]/96" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-black text-foreground">檐知</div>
                    <div className="text-[11px] text-muted-foreground">{contextLabel}</div>
                    <div className="mt-1 text-[11px] leading-5 text-[#86603b] dark:text-[#d0b184]">可直接查询当前页面相关的建筑、人物、典籍和专题线索。</div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                    aria-label="重置对话"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                    aria-label="关闭问答面板"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="border-b border-[#eadcc1] px-4 py-3 dark:border-[#4d3d2a]">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#9b7440] dark:text-[#d4b07a]">快速提问</div>
                <div className="text-[11px] text-muted-foreground">当前会话 {Math.max(messages.length - 1, 0)} 条</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => submitMessage(prompt)}
                    className="rounded-full border border-[#e1cfaa] bg-white/80 px-3 py-1 text-xs font-semibold text-[#8a5a24] transition hover:-translate-y-0.5 hover:bg-white dark:border-[#604d35] dark:bg-white/5 dark:text-[#efc880]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div ref={chatRef} className="h-[min(320px,42dvh)] space-y-3 overflow-y-auto px-4 py-4 md:h-[320px]">
              {showStarterCard ? (
                <div className="rounded-[22px] border border-[#ead6b4] bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,248,237,0.76))] px-4 py-3 text-sm leading-6 text-[#6f5334] dark:border-[#5b4831] dark:bg-white/5 dark:text-[#dfc394]">
                  可以先点击上面的快捷问题，也可以直接输入具体对象，例如“故宫”“李诫”“营造法式”。
                </div>
              ) : null}

              {messages.map((message) => (
                <div key={message.id} className={message.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div
                    className={
                      message.sender === 'user'
                        ? 'max-w-[78%] rounded-[20px] rounded-tr-md bg-[linear-gradient(145deg,#25476b,#3e6f9f)] px-3.5 py-2.5 text-sm leading-6 text-white shadow-[0_14px_28px_-22px_rgba(37,71,107,0.85)]'
                        : 'max-w-[88%] whitespace-pre-line rounded-[20px] rounded-tl-md border border-[#ead6b4] bg-white/84 px-3.5 py-2.5 text-sm leading-6 text-foreground shadow-[0_14px_26px_-24px_rgba(84,55,23,0.35)] dark:border-[#5b4831] dark:bg-white/5'
                    }
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {isLoading ? (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-[20px] rounded-tl-md border border-[#ead6b4] bg-white/84 px-3.5 py-2.5 text-sm text-foreground dark:border-[#5b4831] dark:bg-white/5">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    檐知想一想…
                  </div>
                </div>
              ) : null}
            </div>

            <div className="border-t border-[#eadcc1] px-4 py-3 dark:border-[#4d3d2a]">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(event) => setInputText(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') submitMessage(inputText)
                  }}
                  placeholder="输入故宫、赵州桥、李诫…"
                  className="flex-1 rounded-full border border-[#e1cfaa] bg-white/78 px-4 py-2 text-sm text-foreground outline-none transition focus:border-[#d7924a] focus:ring-4 focus:ring-[#f1d8b2]/40 dark:border-[#604d35] dark:bg-white/5 dark:text-white dark:focus:ring-[#604d35]/30"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => submitMessage(inputText)}
                  disabled={!canSend}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(145deg,#6bcffd,#5f92ff)] text-white shadow-[0_10px_20px_-12px_rgba(74,137,255,0.8)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 text-[11px] leading-5 text-muted-foreground">回答基于站内已整理内容，适合快速查找建筑信息、人物关系和专题入口。</div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="group relative flex h-[3.35rem] w-[3.35rem] items-center justify-center md:h-[3.6rem] md:w-[3.6rem]"
        initial={{ opacity: 0, scale: 0.92, y: -6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.24, ease: motionEase }}
        whileHover={disableAnimations ? undefined : { scale: 1.04 }}
        whileTap={disableAnimations ? undefined : { scale: 0.98 }}
        aria-label="打开檐知助手"
      >
        <motion.span
          aria-hidden="true"
          className="absolute inset-[10px] rounded-full bg-[radial-gradient(circle,rgba(255,206,126,0.34)_0%,rgba(255,206,126,0.08)_48%,rgba(255,206,126,0)_75%)] blur-md"
          animate={disableAnimations ? { opacity: 0.7, scale: 1 } : { opacity: [0.58, 0.9, 0.58], scale: [0.94, 1.08, 0.94] }}
          transition={disableAnimations ? { duration: 0.01 } : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span {...spriteFloat} className="relative flex h-full w-full items-center justify-center">
          <motion.span
            aria-hidden="true"
            className="absolute left-1/2 top-[6px] h-[14px] w-[42px] -translate-x-1/2 rounded-full border border-[#f6d99f]/80 bg-[linear-gradient(180deg,rgba(255,244,214,0.98),rgba(255,215,133,0.9))] shadow-[0_0_22px_rgba(255,205,110,0.65)]"
            animate={haloAnimation}
            transition={haloTransition}
          />
          <span className="absolute bottom-[12px] h-[14px] w-[54px] rounded-full bg-[radial-gradient(circle,rgba(116,72,23,0.3)_0%,rgba(116,72,23,0)_74%)] blur-[2px]" />
          <div className="relative flex h-full w-full items-center justify-center rounded-full border border-[#f8d7aa] bg-[radial-gradient(circle_at_35%_28%,#fff9eb_0%,#ffe8c2_24%,#ffd08a_46%,#f5aa4e_72%,#d4862a_100%)] shadow-[0_26px_48px_-22px_rgba(212,134,42,0.95)]">
            <span className="absolute inset-[7px] rounded-full border border-white/45" />
            <span className="absolute inset-[12px] rounded-full bg-[radial-gradient(circle_at_42%_30%,rgba(255,255,255,0.92),rgba(255,255,255,0.05)_72%)]" />
            <motion.span
              aria-hidden="true"
              className="absolute left-[9px] top-[11px] h-[14px] w-[14px] rounded-[55%_45%_55%_45%] bg-[linear-gradient(180deg,#fff5e2,#ffd99e)] shadow-[0_0_12px_rgba(255,217,158,0.65)]"
              animate={disableAnimations ? { rotate: -16, y: 0 } : { rotate: [-16, -10, -16], y: [0, -1, 0] }}
              transition={disableAnimations ? { duration: 0.01 } : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '50% 100%' }}
            />
            <motion.span
              aria-hidden="true"
              className="absolute right-[9px] top-[11px] h-[14px] w-[14px] rounded-[45%_55%_45%_55%] bg-[linear-gradient(180deg,#fff5e2,#ffd99e)] shadow-[0_0_12px_rgba(255,217,158,0.65)]"
              animate={disableAnimations ? { rotate: 16, y: 0 } : { rotate: [16, 10, 16], y: [0, -1, 0] }}
              transition={disableAnimations ? { duration: 0.01 } : { duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              style={{ transformOrigin: '50% 100%' }}
            />
            <span className="absolute left-[8px] top-[14px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]">
              <motion.span
                className="relative h-[12px] w-[10px] rounded-full bg-[radial-gradient(circle_at_40%_30%,#8f4628_0%,#6d3318_72%,#56260f_100%)]"
                animate={blinkAnimation}
                transition={blinkTransition}
                style={{ originY: 0.5 }}
              >
                <span className="absolute left-[2px] top-[2px] h-[4px] w-[4px] rounded-full bg-white" />
                <span className="absolute right-[1px] top-[6px] h-[2px] w-[2px] rounded-full bg-white/85" />
              </motion.span>
            </span>
            <span className="absolute right-[8px] top-[14px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]">
              <motion.span
                className="relative h-[12px] w-[10px] rounded-full bg-[radial-gradient(circle_at_40%_30%,#8f4628_0%,#6d3318_72%,#56260f_100%)]"
                animate={blinkAnimation}
                transition={blinkTransition}
                style={{ originY: 0.5 }}
              >
                <span className="absolute left-[2px] top-[2px] h-[4px] w-[4px] rounded-full bg-white" />
                <span className="absolute right-[1px] top-[6px] h-[2px] w-[2px] rounded-full bg-white/85" />
              </motion.span>
            </span>
            <span className="absolute left-[11px] top-[37px] h-[12px] w-[14px] rounded-full bg-[#ffd39e]/36 blur-[1px]" />
            <span className="absolute right-[11px] top-[37px] h-[12px] w-[14px] rounded-full bg-[#ffd39e]/36 blur-[1px]" />
            <span className="absolute left-1/2 top-[38px] h-[5px] w-[8px] -translate-x-1/2 rounded-[4px] bg-[#fff1d9]/96 shadow-[0_1px_2px_rgba(153,94,34,0.12)]" />
            <span className="absolute left-1/2 top-[46px] h-[7px] w-[9px] -translate-x-1/2 rounded-full bg-[#fff7ea]/96 shadow-[0_1px_2px_rgba(153,94,34,0.12)]" />
            <motion.span
              aria-hidden="true"
              className="absolute bottom-[10px] right-[9px] h-[12px] w-[20px] rounded-full border border-white/35 bg-[linear-gradient(90deg,rgba(255,248,228,0.18),rgba(255,255,255,0.52),rgba(255,240,201,0.15))] blur-[0.2px]"
              animate={disableAnimations ? { x: 0, opacity: 0.55 } : { x: [0, 4, 0], opacity: [0.38, 0.8, 0.38] }}
              transition={disableAnimations ? { duration: 0.01 } : { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            />
            {sparkles.map((sparkle) => (
              <motion.span
                key={sparkle.className}
                aria-hidden="true"
                className={`absolute ${sparkle.className} ${sparkle.size} text-white`}
                animate={disableAnimations ? { opacity: sparkle.opacity, scale: 1 } : { opacity: [0.25, sparkle.opacity, 0.25], scale: [0.6, 1, 0.6], rotate: [0, 18, 0] }}
                transition={disableAnimations ? { duration: 0.01 } : { duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: sparkle.delay }}
              >
                <Sparkles className="h-full w-full" />
              </motion.span>
            ))}
          </div>
          <motion.span
            aria-hidden="true"
            className="absolute -right-0.5 top-1 flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-white/90 text-[#d4862a] shadow-md dark:bg-[#1f2530] dark:text-[#f4a64a]"
            animate={disableAnimations ? { y: 0, rotate: 0 } : { y: [0, -2, 0], rotate: [0, 12, 0, -8, 0] }}
            transition={disableAnimations ? { duration: 0.01 } : { duration: 3.1, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          >
            <Sparkles className="h-3.5 w-3.5" />
          </motion.span>
        </motion.span>
      </motion.button>
    </div>
  )
}
