import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Compass, Sparkles, Waves } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  CultureWindowIcon,
  HallOfAchievementIcon,
  ScientistPortraitIcon,
  TreatiseScrollIcon,
} from '@/components/siteIcons'
import { completeEntryPrologue, getEntryPrologueTarget, isEntryProloguePending } from '@/lib/entryPrologue'
import {
  cardHoverLift,
  cardPress,
  prologueBackgroundVariants,
  prologueCameraVariants,
  prologueCopyVariants,
  prologueFinalLockVariants,
  prologueForegroundVariants,
  prologueHomeRevealVariants,
  prologueLineDrawVariants,
  prologueMidgroundVariants,
  prologueNodeVariants,
  prologueOrnamentRevealVariants,
  prologueParallaxVariants,
  prologueSceneVariants,
  prologueTitleLineVariants,
  prologueTrailRevealVariants,
} from '@/lib/motion'

type SceneId = 'gather' | 'unfold' | 'connect' | 'arrival'
type SceneTheme = 'ember' | 'gilded' | 'azure' | 'dawn'
type OrnamentLevel = 'low' | 'medium' | 'high'

type SceneDefinition = {
  id: SceneId
  caption: string
  title: [string, string]
  note: string
  duration: number
  moodLabel: string
  theme: SceneTheme
  ornamentLevel: OrnamentLevel
}

const scenes: SceneDefinition[] = [
  {
    id: 'gather',
    caption: '先把目光安放在屋宇之前',
    title: ['先驻足', '再入境'],
    note: '檐线未动，气象已先展开。让中轴、尺度与轮廓缓缓显影，替这座建筑说出第一句无声的开场。',
    duration: 3600,
    moodLabel: '起笔',
    theme: 'ember',
    ornamentLevel: 'low',
  },
  {
    id: 'unfold',
    caption: '顺着形制与纹理，再向里看一层',
    title: ['看屋脊', '也看营造'],
    note: '屋脊、台基与纹样次第舒展，线条不止于装饰，也将木石的法度、转折与节奏一并引到眼前。',
    duration: 4000,
    moodLabel: '显影',
    theme: 'gilded',
    ornamentLevel: 'high',
  },
  {
    id: 'connect',
    caption: '眼前将展开的，也不止一页风景',
    title: ['沿着脉络', '看见会通'],
    note: '建筑、人物、文献与风物依次点亮，彼此牵引、相互映照，终会汇成一幅可继续漫游的古建长卷。',
    duration: 4400,
    moodLabel: '会通',
    theme: 'azure',
    ornamentLevel: 'medium',
  },
  {
    id: 'arrival',
    caption: '至此，卷面已徐徐展开',
    title: ['由千年营造', '入创意设计'],
    note: '先前显出的线索都在此处收束。此后可循自己的节奏启卷而行，从一座建筑出发，读进更广阔的文创设计世界。',
    duration: 4200,
    moodLabel: '抵达',
    theme: 'dawn',
    ornamentLevel: 'high',
  },
]

const reducedDurations = [1600, 1800, 2000, 1900]

const networkNodes = [
  {
    key: 'achievement',
    className: 'entry-cinema-network-node-a',
    label: '专题总览',
    icon: HallOfAchievementIcon,
    delay: 0.34,
  },
  {
    key: 'scientist',
    className: 'entry-cinema-network-node-b',
    label: '人物谱系',
    icon: ScientistPortraitIcon,
    delay: 0.46,
  },
  {
    key: 'treatise',
    className: 'entry-cinema-network-node-c',
    label: '文献脉络',
    icon: TreatiseScrollIcon,
    delay: 0.58,
  },
  {
    key: 'culture',
    className: 'entry-cinema-network-node-d',
    label: '文化场域',
    icon: CultureWindowIcon,
    delay: 0.7,
  },
] as const

const networkTrails = [
  { key: 'north', rotate: -90, x: 0, y: -84, width: 170 },
  { key: 'east', rotate: 0, x: 94, y: 0, width: 188 },
  { key: 'south', rotate: 90, x: 0, y: 84, width: 170 },
  { key: 'west', rotate: 180, x: -94, y: 0, width: 188 },
] as const

function GatherScene() {
  return (
    <motion.div className="entry-cinema-visual entry-cinema-visual-gather" aria-hidden="true" variants={prologueCameraVariants} initial="initial" animate="animate" exit="exit">
      <motion.div className="entry-cinema-ornament-grid" custom={0.04} variants={prologueOrnamentRevealVariants} />
      <motion.div className="entry-cinema-depth-grid" custom={0.08} variants={prologueBackgroundVariants} />
      <motion.div className="entry-cinema-mountain-silhouette" custom={0.1} variants={prologueBackgroundVariants} />
      <motion.div className="entry-cinema-atmo entry-cinema-atmo-a" custom={{ delay: 0.1, depth: -20 }} variants={prologueParallaxVariants} />
      <motion.div className="entry-cinema-atmo entry-cinema-atmo-b" custom={{ delay: 0.16, depth: 18 }} variants={prologueParallaxVariants} />
      <motion.div className="entry-cinema-light-ray entry-cinema-light-ray-1" custom={0.14} variants={prologueBackgroundVariants} />
      <motion.div className="entry-cinema-light-ray entry-cinema-light-ray-2" custom={0.2} variants={prologueBackgroundVariants} />
      <motion.div className="entry-cinema-axis" custom={0.22} variants={prologueLineDrawVariants} />
      <motion.div className="entry-cinema-axis-glow" custom={0.28} variants={prologueLineDrawVariants} />
      <motion.div className="entry-cinema-roof entry-cinema-roof-outline" custom={0.26} variants={prologueOrnamentRevealVariants} />
      <motion.div className="entry-cinema-roof entry-cinema-roof-back" custom={{ delay: 0.32, depth: -16 }} variants={prologueParallaxVariants} />
      <motion.div className="entry-cinema-roof entry-cinema-roof-mid" custom={{ delay: 0.4, depth: 10 }} variants={prologueParallaxVariants} />
      <motion.div className="entry-cinema-platform-glow" custom={0.48} variants={prologueBackgroundVariants} />
      <motion.div className="entry-cinema-platform" custom={0.52} variants={prologueForegroundVariants} />
      <motion.div className="entry-cinema-steps" custom={0.58} variants={prologueForegroundVariants} />
      <motion.div className="entry-cinema-ink-drop entry-cinema-ink-drop-1" custom={0.44} variants={prologueBackgroundVariants} />
      <motion.div className="entry-cinema-ink-drop entry-cinema-ink-drop-2" custom={0.56} variants={prologueBackgroundVariants} />
      <motion.div className="entry-cinema-flare entry-cinema-flare-gather" custom={0.62} variants={prologueOrnamentRevealVariants} />
      <motion.div className="entry-cinema-seal-aura" custom={0.7} variants={prologueBackgroundVariants} />
      <motion.div className="entry-cinema-seal" custom={0.76} variants={prologueForegroundVariants}>
        营造
      </motion.div>
      <motion.div className="entry-cinema-ripple entry-cinema-ripple-1" custom={0.72} variants={prologueOrnamentRevealVariants} />
      <motion.div className="entry-cinema-ripple entry-cinema-ripple-2" custom={0.82} variants={prologueOrnamentRevealVariants} />
      <motion.div className="entry-cinema-opening-kicker" custom={0.88} variants={prologueNodeVariants}>
        启卷入境
      </motion.div>
    </motion.div>
  )
}

function UnfoldScene() {
  return (
    <motion.div className="entry-cinema-visual entry-cinema-visual-unfold" aria-hidden="true" variants={prologueCameraVariants} initial="initial" animate="animate" exit="exit">
      <motion.div className="entry-cinema-ornament-ring entry-cinema-ornament-ring-lg" custom={0.02} variants={prologueOrnamentRevealVariants} />
      <motion.div className="entry-cinema-ornament-ring entry-cinema-ornament-ring-sm" custom={0.12} variants={prologueOrnamentRevealVariants} />
      <motion.div className="entry-cinema-unfold-scroll" custom={0.08} variants={prologueHomeRevealVariants} />
      <motion.div className="entry-cinema-unfold-grid" custom={0.18} variants={prologueOrnamentRevealVariants} />
      <motion.div className="entry-cinema-brush-stroke entry-cinema-brush-stroke-1" custom={0.22} variants={prologueOrnamentRevealVariants} />
      <motion.div className="entry-cinema-brush-stroke entry-cinema-brush-stroke-2" custom={0.3} variants={prologueOrnamentRevealVariants} />
      <motion.div className="entry-cinema-unfold-outline entry-cinema-unfold-outline-back" custom={0.26} variants={prologueTrailRevealVariants} />
      <motion.div className="entry-cinema-unfold-outline entry-cinema-unfold-outline-front" custom={0.34} variants={prologueTrailRevealVariants} />
      <motion.div className="entry-cinema-roof entry-cinema-roof-wide" custom={{ delay: 0.34, depth: -12 }} variants={prologueParallaxVariants} />
      <motion.div className="entry-cinema-roof entry-cinema-roof-wide-glow" custom={0.46} variants={prologueBackgroundVariants} />
      <motion.div className="entry-cinema-platform entry-cinema-platform-wide" custom={{ delay: 0.5, depth: 10 }} variants={prologueParallaxVariants} />
      <motion.div className="entry-cinema-steps entry-cinema-steps-wide" custom={0.56} variants={prologueForegroundVariants} />
      <motion.div className="entry-cinema-shimmer-dot entry-cinema-shimmer-dot-1" custom={0.4} variants={prologueNodeVariants} />
      <motion.div className="entry-cinema-shimmer-dot entry-cinema-shimmer-dot-2" custom={0.52} variants={prologueNodeVariants} />
      <motion.div className="entry-cinema-shimmer-dot entry-cinema-shimmer-dot-3" custom={0.64} variants={prologueNodeVariants} />
      <motion.div className="entry-cinema-ornament-seal" custom={0.64} variants={prologueOrnamentRevealVariants}>
        <Waves className="h-4 w-4" />
        <span>金纹初显</span>
      </motion.div>
      <motion.div className="entry-cinema-flare entry-cinema-flare-unfold" custom={0.74} variants={prologueOrnamentRevealVariants} />
    </motion.div>
  )
}

function ConnectScene() {
  return (
    <motion.div className="entry-cinema-visual entry-cinema-visual-connect" aria-hidden="true" variants={prologueCameraVariants} initial="initial" animate="animate" exit="exit">
      <motion.div className="entry-cinema-network-wash" custom={0.02} variants={prologueBackgroundVariants} />
      <motion.div className="entry-cinema-network-orbit" custom={0.1} variants={prologueOrnamentRevealVariants} />
      <motion.div className="entry-cinema-network-ring entry-cinema-network-ring-outer" custom={0.18} variants={prologueOrnamentRevealVariants} />
      <motion.div className="entry-cinema-network-ring entry-cinema-network-ring-inner" custom={0.24} variants={prologueOrnamentRevealVariants} />
      <motion.div className="entry-cinema-network-core" custom={0.26} variants={prologueForegroundVariants}>
        古建
      </motion.div>
      {networkTrails.map((trail, index) => (
        <motion.div
          key={trail.key}
          className={`entry-cinema-trail entry-cinema-network-line-${index + 1}`}
          custom={networkNodes[index].delay - 0.08}
          style={{ rotate: trail.rotate, x: trail.x, y: trail.y, width: trail.width }}
          variants={prologueTrailRevealVariants}
        />
      ))}
      {networkNodes.map((node) => {
        const Icon = node.icon
        return (
          <motion.div key={node.key} className={`entry-cinema-network-node ${node.className}`} custom={node.delay} variants={prologueNodeVariants}>
            <span className="entry-cinema-network-node-glow" />
            <Icon className="h-4 w-4" />
            <span>{node.label}</span>
          </motion.div>
        )
      })}
      <motion.div className="entry-cinema-network-pulse" custom={0.78} variants={prologueBackgroundVariants} />
      <motion.div className="entry-cinema-ink-drop entry-cinema-ink-drop-3" custom={0.68} variants={prologueBackgroundVariants} />
      <motion.div className="entry-cinema-ink-drop entry-cinema-ink-drop-4" custom={0.82} variants={prologueBackgroundVariants} />
      <motion.div className="entry-cinema-flare entry-cinema-flare-connect" custom={0.86} variants={prologueOrnamentRevealVariants} />
    </motion.div>
  )
}

function ArrivalScene() {
  return (
    <motion.div className="entry-cinema-visual entry-cinema-visual-arrival" aria-hidden="true" variants={prologueCameraVariants} initial="initial" animate="animate" exit="exit">
      <motion.div className="entry-cinema-home-glow" custom={0.04} variants={prologueBackgroundVariants} />
      <motion.div className="entry-cinema-home-track" custom={0.14} variants={prologueTrailRevealVariants} />
      <motion.div className="entry-cinema-ornament-ring entry-cinema-arrival-ring" custom={0.16} variants={prologueOrnamentRevealVariants} />
      <motion.div className="entry-cinema-home-shell" custom={0.2} variants={prologueFinalLockVariants}>
        <motion.div className="entry-cinema-home-topbar" custom={0.4} variants={prologueNodeVariants}>
          <div className="entry-cinema-home-pill">首页卷面已在案前铺开</div>
          <div className="entry-cinema-home-orbit">
            <Sparkles className="h-3.5 w-3.5" />
            <span>华章启览</span>
          </div>
        </motion.div>

        <motion.div className="entry-cinema-home-hero" custom={0.5} variants={prologueMidgroundVariants}>
          <div className="entry-cinema-home-display">
            <span>由眼前这一座屋宇</span>
            <strong>续读更辽阔的风景</strong>
          </div>
          <div className="entry-cinema-home-radar">
            <Compass className="h-5 w-5" />
          </div>
        </motion.div>

        <motion.div className="entry-cinema-home-grid" custom={0.6} variants={prologueForegroundVariants}>
          <div className="entry-cinema-home-card entry-cinema-home-card-featured">
            <div className="entry-cinema-home-card-tag">案头第一卷</div>
            <div className="entry-cinema-home-card-title">先观形制总览</div>
            <div className="entry-cinema-home-card-note">先把形制、空间与时代并置成图，再沿你最想追索的那一缕脉络缓缓走入。</div>
          </div>

          <div className="entry-cinema-home-card entry-cinema-home-card-stack">
            <div className="entry-cinema-home-chip">
              <HallOfAchievementIcon className="h-4 w-4" />
              <span>形制</span>
            </div>
            <div className="entry-cinema-home-chip">
              <ScientistPortraitIcon className="h-4 w-4" />
              <span>人物</span>
            </div>
            <div className="entry-cinema-home-chip">
              <TreatiseScrollIcon className="h-4 w-4" />
              <span>典籍</span>
            </div>
          </div>
        </motion.div>

        <motion.div className="entry-cinema-home-cta" custom={0.76} variants={prologueNodeVariants}>
          入首页继续启览
          <ArrowRight className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function SceneVisual({ id }: { id: SceneId }) {
  if (id === 'gather') return <GatherScene />
  if (id === 'unfold') return <UnfoldScene />
  if (id === 'connect') return <ConnectScene />
  return <ArrivalScene />
}

export default function EntryProloguePage() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [sceneIndex, setSceneIndex] = useState(0)
  const [sceneStart, setSceneStart] = useState(Date.now())
  const [sceneNow, setSceneNow] = useState(Date.now())
  const target = useMemo(() => getEntryPrologueTarget(), [])
  const currentScene = scenes[sceneIndex]

  useLayoutEffect(() => {
    const root = document.documentElement
    const hadDarkClass = root.classList.contains('dark')

    if (hadDarkClass) {
      root.classList.remove('dark')
    }

    return () => {
      if (hadDarkClass) {
        root.classList.add('dark')
      }
    }
  }, [])

  useEffect(() => {
    if (!isEntryProloguePending()) {
      navigate(target, { replace: true })
    }
  }, [navigate, target])

  useEffect(() => {
    setSceneStart(Date.now())
    setSceneNow(Date.now())

    const duration = reduceMotion ? reducedDurations[sceneIndex] ?? 820 : currentScene.duration
    const timer = window.setTimeout(() => {
      if (sceneIndex >= scenes.length - 1) {
        completeEntryPrologue()
        navigate(target, { replace: true })
        return
      }

      setSceneIndex((value) => value + 1)
    }, duration)

    return () => window.clearTimeout(timer)
  }, [currentScene.duration, navigate, reduceMotion, sceneIndex, target])

  useEffect(() => {
    let frameId = 0

    const tick = () => {
      setSceneNow(Date.now())
      frameId = window.requestAnimationFrame(tick)
    }

    frameId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frameId)
  }, [sceneIndex])

  const handleSkip = () => {
    completeEntryPrologue()
    navigate(target, { replace: true })
  }

  const elapsed = sceneNow - sceneStart
  const progressDuration = reduceMotion ? reducedDurations[sceneIndex] ?? 820 : currentScene.duration
  const activeProgress = Math.min(elapsed / progressDuration, 1)

  return (
    <div
      className={`entry-cinema-page entry-cinema-page-${currentScene.id} entry-cinema-theme-${currentScene.theme} entry-cinema-ornament-${currentScene.ornamentLevel}${reduceMotion ? ' is-reduced-motion' : ''}`}
    >
      <div className="entry-cinema-grain" />
      <div className="entry-cinema-vignette" />
      <div className={`entry-cinema-halo entry-cinema-halo-${sceneIndex + 1}`} />
      <div className={`entry-cinema-sweep entry-cinema-sweep-${sceneIndex + 1}`} />
      <div className="entry-cinema-dust entry-cinema-dust-a" />
      <div className="entry-cinema-dust entry-cinema-dust-b" />

      <motion.button type="button" className="entry-cinema-skip" onClick={handleSkip} whileHover={cardHoverLift} whileTap={cardPress}>
        略过序章
      </motion.button>

      <div className="entry-cinema-stage">
        <AnimatePresence mode="wait">
          <motion.section
            key={currentScene.id}
            className={`entry-cinema-scene entry-cinema-scene-${currentScene.id}`}
            variants={prologueSceneVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div className="entry-cinema-copy" variants={prologueCopyVariants} initial="initial" animate="animate" exit="exit">
              <motion.div className="entry-cinema-copy-meta" custom={0.08} variants={prologueNodeVariants}>
                <motion.div className="entry-cinema-caption">{currentScene.caption}</motion.div>
                <motion.div className="entry-cinema-mood">{currentScene.moodLabel}</motion.div>
              </motion.div>
              <div className="entry-cinema-title-wrap">
                {currentScene.title.map((line, index) => (
                  <motion.h1 key={line} className="entry-cinema-title" custom={index} variants={prologueTitleLineVariants}>
                    {line}
                  </motion.h1>
                ))}
              </div>
              <motion.p className="entry-cinema-note">{currentScene.note}</motion.p>
            </motion.div>

            <SceneVisual id={currentScene.id} />
          </motion.section>
        </AnimatePresence>
      </div>

      <div className="entry-cinema-bottom">
        <div className="entry-cinema-progress" aria-hidden="true">
          {scenes.map((scene, index) => {
            const progress = index < sceneIndex ? 1 : index === sceneIndex ? activeProgress : 0
            return (
              <div key={scene.id} className={`entry-cinema-progress-item${index === sceneIndex ? ' is-active' : ''}`}>
                <span className="entry-cinema-progress-fill" style={{ transform: `scaleX(${progress})` }} />
              </div>
            )
          })}
        </div>

        <motion.button type="button" className="entry-cinema-enter" onClick={handleSkip} whileHover={cardHoverLift} whileTap={cardPress}>
          直接入卷
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  )
}
