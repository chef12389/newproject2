import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ChevronRight,
  Compass,
  Play,
  Sparkles,
  BookOpen,
  Users,
  Landmark,
  Trees,
  Quote,
  Eye,
  Layers3,
  ScrollText,
  Map,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GlobalNav from '@/components/GlobalNav'
import { HeroScrollCue } from '@/components/HeroScrollCue'
import { LazyImage } from '@/components/LazyImage'
import {
  CultureWindowIcon,
  HallOfAchievementIcon,
  ScientistPortraitIcon,
  TreatiseScrollIcon,
  type SiteIcon,
} from '@/components/siteIcons'
import { primaryCategories, secondaryCategories } from '@/data/architectureFocus'
import { useCinematicHero, useSectionReveal } from '@/lib/cinematic'
import {
  aliveCardHover,
  aliveCardTap,
  buttonMagnetHover,
  cardPopChildVariants,
  cardPopVariants,
  pageSectionVariants,
} from '@/lib/motion'
import { trackPageVisit } from '@/lib/progress'

interface TopicCard {
  title: string
  description: string
  route: string
  icon: SiteIcon
  lucideIcon: typeof Landmark
  accent: string
  tint: string
  gradient: string
  poem: string
  stats: string
  image: string
  eyebrow: string
  highlights: string[]
  footnote: string
}

const topicCards: TopicCard[] = [
  {
    title: '营造华章',
    description: '从典型建筑案例进入，优先理解空间格局、形制差异与营造秩序。',
    route: '/achievement',
    icon: HallOfAchievementIcon,
    lucideIcon: Landmark,
    accent: '#8f3024',
    tint: 'rgba(242, 221, 210, 0.99)',
    gradient: 'linear-gradient(135deg, #8f3024 0%, #c45a3c 50%, #e8956a 100%)',
    poem: '栋宇千秋',
    stats: `${primaryCategories.length} 个门类`,
    image: primaryCategories[0]?.cases[0]?.image ?? '/images/shouye4.jpg',
    eyebrow: '空间与形制',
    highlights: ['代表案例', '形制脉络', '空间阅读'],
    footnote: '适合先建立对宫殿、坛庙、园林、桥梁等门类的整体认识。',
  },
  {
    title: '匠门群星',
    description: '沿着工匠、设计者与制度人物的线索，理解建筑背后的人与协作体系。',
    route: '/scientists',
    icon: ScientistPortraitIcon,
    lucideIcon: Users,
    accent: '#345f8f',
    tint: 'rgba(219, 230, 244, 0.99)',
    gradient: 'linear-gradient(135deg, #345f8f 0%, #5a8cc4 50%, #8bb8e8 100%)',
    poem: '匠心独运',
    stats: '人物谱系',
    image: '/images/shouye6.jpg',
    eyebrow: '人物与制度',
    highlights: ['工匠故事', '组织协作', '制度角色'],
    footnote: '把建筑放回“谁来营造、如何协作、为何成形”的人物关系网络中。',
  },
  {
    title: '营造经纬',
    description: '从文献、图档与核心术语切入，把纸上的营造知识重新读活。',
    route: '/treatises',
    icon: TreatiseScrollIcon,
    lucideIcon: BookOpen,
    accent: '#9e6b17',
    tint: 'rgba(245, 234, 198, 0.99)',
    gradient: 'linear-gradient(135deg, #9e6b17 0%, #c99a3a 50%, #e8c46a 100%)',
    poem: '经纬纵横',
    stats: '文献经纬',
    image: '/images/reference/treatises/yingzao_fashi_nlc.jpg',
    eyebrow: '典籍与图档',
    highlights: ['术语解读', '文献导读', '图像互证'],
    footnote: '把《营造法式》等典籍与图样、构件、制度语汇串联阅读。',
  },
  {
    title: '居游有境',
    description: '将礼制、园林、聚落与生活场景放回同一幅文化图景中理解。',
    route: '/culture',
    icon: CultureWindowIcon,
    lucideIcon: Trees,
    accent: '#2f7a62',
    tint: 'rgba(218, 239, 231, 0.99)',
    gradient: 'linear-gradient(135deg, #2f7a62 0%, #4aaa8c 50%, #7ad4b8 100%)',
    poem: '境随心转',
    stats: '文化语境',
    image: '/images/shouye8.jpg',
    eyebrow: '生活与文化',
    highlights: ['礼制秩序', '园林意境', '日常场景'],
    footnote: '从建筑之外理解建筑，看见其与社会生活、审美趣味的共振。',
  },
]

const flowSteps = [
  { label: '览其形', sub: '建筑素材', icon: Eye, index: 0 },
  { label: '识其人', sub: '创意人物', icon: Users, index: 1 },
  { label: '读其典', sub: '营造典籍', icon: ScrollText, index: 2 },
  { label: '悟其境', sub: '文创生活', icon: Map, index: 3 },
]

const impactStats = [
  { value: '10', label: '建筑门类', suffix: '+' },
  { value: '60', label: '世界遗产', suffix: '项' },
  { value: '8155', label: '传统村落', suffix: '' },
  { value: '14936', label: '样式雷图档', suffix: '件' },
]

const galleryGroups = [
  {
    title: '宗教与纪念',
    items: secondaryCategories.slice(0, 3),
  },
  {
    title: '园林与公共',
    items: secondaryCategories.slice(3, 6),
  },
]

const classicalQuotes = [
  { text: '虽由人作，宛自天开。', source: '计成《园冶》' },
  { text: '以材为祖，材有八等。', source: '李诫《营造法式》' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const pageRef = useRef<HTMLDivElement | null>(null)
  const heroRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    trackPageVisit('/')
  }, [])

  useCinematicHero(heroRef)
  useSectionReveal(pageRef)

  const heroCase = primaryCategories[2] ?? primaryCategories[0]

  return (
    <div ref={pageRef} className="page-shell">
      <GlobalNav />

      <motion.section
        ref={heroRef}
        className="page-header home-hero-v3"
        variants={pageSectionVariants}
        initial="initial"
        animate="animate"
        data-cine-section
      >
        <div className="home-hero-v3-bg" data-cine-spotlight-image>
          <LazyImage src="/images/shouye1.jpg" alt="中国古代建筑" className="home-hero-v3-image" priority />
          <div className="home-hero-v3-overlay" />
          <div className="home-hero-v3-grain" />
          <div className="home-hero-v3-ink-wash" />
        </div>

        <div className="home-hero-v3-content page-header-inner">
          <motion.div
            className="hero-orb hero-orb-cinnabar"
            data-cine-atmosphere
            data-cine-glow
            data-cine-parallax="0.12"
            style={{ width: 520, height: 520, top: '-18%', right: '4%' }}
          />
          <motion.div
            className="hero-orb hero-orb-yellow"
            data-cine-atmosphere
            data-cine-parallax="-0.08"
            style={{ width: 380, height: 380, bottom: '-16%', left: '-4%' }}
          />

          <div className="home-hero-v3-layout">
            <div className="home-hero-v3-copy">
              <motion.div className="home-hero-v3-badge" variants={cardPopChildVariants} data-cine-copy>
                <span className="home-hero-v3-badge-dot" />
                <Sparkles className="h-3.5 w-3.5" />
                <span>千年营造，创意新生</span>
              </motion.div>

              <h1 className="home-hero-v3-title">
                <span data-cine-title-line className="home-hero-v3-title-line">千年营造</span>
                 <span data-cine-title-line className="home-hero-v3-title-line home-hero-v3-title-accent">创意新生</span>
              </h1>

              <motion.p className="home-hero-v3-subtitle" variants={cardPopChildVariants} data-cine-copy>
                 从建筑、人物、典籍与文化四个维度，逐步展开中国古代营造智慧，为当代文创设计注入源源不断的创意灵感。
                </motion.p>

              <motion.div className="home-hero-v3-actions" variants={cardPopChildVariants} data-cine-actions>
                <motion.button
                  type="button"
                  onClick={() => navigate('/achievement')}
                  className="home-hero-v3-cta-primary"
                  whileHover={buttonMagnetHover}
                  whileTap={aliveCardTap}
                >
                  <span className="home-hero-v3-cta-primary-text">进入营造新途</span>
                  <Compass className="h-4 w-4" />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => navigate(`/architecture/${heroCase.id}`)}
                  className="home-hero-v3-cta-glass"
                  whileHover={buttonMagnetHover}
                  whileTap={aliveCardTap}
                >
                  <Play className="h-4 w-4" />
                  <span>先读代表案例</span>
                </motion.button>
              </motion.div>

              <motion.div className="home-hero-v3-flow" variants={cardPopChildVariants} data-cine-strip>
                {flowSteps.map((step, i) => {
                  const StepIcon = step.icon
                  return (
                    <div key={step.label} className="home-hero-v3-flow-step">
                      <div className="home-hero-v3-flow-icon">
                        <StepIcon className="h-3.5 w-3.5" />
                      </div>
                      <div className="home-hero-v3-flow-text">
                        <span className="home-hero-v3-flow-num">{String(i + 1).padStart(2, '0')}</span>
                        <span className="home-hero-v3-flow-label">{step.label}</span>
                      </div>
                      {i < flowSteps.length - 1 && (
                        <span className="home-hero-v3-flow-connector">
                          <ChevronRight className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  )
                })}
              </motion.div>
            </div>

            <motion.button
              type="button"
              onClick={() => navigate(`/architecture/${heroCase.id}`)}
              className="home-hero-v3-spotlight"
              variants={cardPopVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.35 }}
              whileHover={aliveCardHover}
              whileTap={aliveCardTap}
              data-cine-spotlight
              data-cine-step
            >
              <div className="home-hero-v3-spotlight-inner">
                <LazyImage
                  src={heroCase.cases[0]?.image ?? ''}
                  alt={heroCase.name}
                  className="home-hero-v3-spotlight-image"
                  priority
                />
                <div className="home-hero-v3-spotlight-overlay" />
                <div className="home-hero-v3-spotlight-border" />
                <div className="home-hero-v3-spotlight-content">
                  <div className="home-hero-v3-spotlight-tags">
                    <span className="home-hero-v3-spotlight-tag">代表案例</span>
                    <span className="home-hero-v3-spotlight-count">{heroCase.sampleCount} 例</span>
                  </div>
                  <h2 className="home-hero-v3-spotlight-title">{heroCase.name}</h2>
                  <p className="home-hero-v3-spotlight-note">{heroCase.summary}</p>
                  <div className="home-hero-v3-spotlight-action">
                    由此展开
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </motion.button>
          </div>

          <motion.div className="home-hero-v3-scroll" variants={cardPopChildVariants} data-cine-copy>
            <HeroScrollCue tone="ember" label="向下展开卷轴" />
          </motion.div>
        </div>
      </motion.section>

      <div className="home-hero-transition" aria-hidden="true">
        <svg className="home-hero-transition-ornament" viewBox="0 0 1200 24" fill="none" preserveAspectRatio="none">
          <path d="M0 12 Q50 0, 100 12 Q150 24, 200 12 Q250 0, 300 12 Q350 24, 400 12 Q450 0, 500 12 Q550 24, 600 12 Q650 0, 700 12 Q750 24, 800 12 Q850 0, 900 12 Q950 24, 1000 12 Q1050 0, 1100 12 Q1150 24, 1200 12" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
        </svg>
      </div>

      <motion.main
        id="main-content"
        className="page-main home-main-v3"
        variants={pageSectionVariants}
        initial="initial"
        animate="animate"
      >
        <section className="home-stats-v3" data-cine-section>
          <div className="home-stats-v3-inner">
            {impactStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="home-stats-v3-item"
                variants={cardPopVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.06 }}
              >
                <div className="home-stats-v3-value">
                  {stat.value}
                  <span className="home-stats-v3-suffix">{stat.suffix}</span>
                </div>
                <div className="home-stats-v3-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="home-modules-v3" data-cine-section>
          <div className="home-section-header">
            <div className="home-section-header-left">
              <div className="home-section-kicker">
                <span className="home-section-kicker-line" />
                <span>营造新途</span>
              </div>
              <h2 className="home-section-title">千年营造，创意新生</h2>
            </div>
            <p className="home-section-desc">设计素材、创意人物、设计典籍与文化创意，四维交织成完整的文创灵感图景。</p>
          </div>

          <div className="home-dimension-grid">
            {topicCards.map((item, index) => {
              const Icon = item.icon
              const AccentIcon = item.lucideIcon

              return (
                <motion.button
                  key={item.route}
                  type="button"
                  onClick={() => navigate(item.route)}
                  className="home-dimension-card"
                  style={{
                    ['--topic-accent' as string]: item.accent,
                    ['--topic-tint' as string]: item.tint,
                    ['--topic-glow' as string]: item.tint,
                    ['--topic-ink' as string]: '#17202c',
                    ['--topic-edge' as string]: 'rgba(196, 174, 140, 0.22)',
                    ['--topic-gradient' as string]: item.gradient,
                  }}
                  variants={cardPopVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.18 }}
                  whileHover={aliveCardHover}
                  whileTap={aliveCardTap}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="home-dimension-card-topline" />
                  <div className="home-dimension-card-header">
                    <div className="home-dimension-card-icon-wrap">
                      <Icon className="home-dimension-card-icon" />
                    </div>
                    <span className="home-dimension-card-index">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="home-dimension-card-body">
                    <div className="home-dimension-card-title-row">
                      <h3 className="home-dimension-card-title">{item.title}</h3>
                      <div className="home-dimension-card-mini-icon">
                        <AccentIcon className="h-3.5 w-3.5" />
                      </div>
                    </div>
                    <span className="home-dimension-card-poem">{item.poem}</span>
                    <p className="home-dimension-card-note">{item.description}</p>
                  </div>
                  <div className="home-dimension-card-footer">
                    <span className="home-dimension-card-action">
                      进入模块
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                    <span className="home-dimension-card-stats">{item.stats}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </section>

        <section className="home-journey-v3" data-cine-section>
          <div className="home-section-header">
            <div className="home-section-header-left">
              <div className="home-section-kicker">
                <span className="home-section-kicker-line" />
                <span>探索路径</span>
              </div>
              <h2 className="home-section-title">四步开启营造新途</h2>
            </div>
            <p className="home-section-desc">从览形到悟境，层层递进，建立完整的文创设计认知。</p>
          </div>

          <div className="home-journey-v3-track">
            {flowSteps.map((step, i) => {
              const StepIcon = step.icon
              const card = topicCards[i]

              return (
                <motion.button
                  key={step.label}
                  type="button"
                  onClick={() => navigate(card.route)}
                  className="home-journey-v3-node"
                  variants={cardPopVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.25 }}
                  whileHover={aliveCardHover}
                  whileTap={aliveCardTap}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    ['--topic-accent' as string]: card.accent,
                    ['--topic-gradient' as string]: card.gradient,
                  }}
                >
                  <div className="home-journey-v3-node-dot">
                    <StepIcon className="h-4 w-4" />
                  </div>
                  <div className="home-journey-v3-node-text">
                    <span className="home-journey-v3-node-label">{step.label}</span>
                    <span className="home-journey-v3-node-sub">{step.sub}</span>
                  </div>
                  <ArrowRight className="home-journey-v3-node-arrow h-3.5 w-3.5" />
                  {i < flowSteps.length - 1 && <div className="home-journey-v3-node-connector" />}
                </motion.button>
              )
            })}
          </div>
        </section>

        <section className="home-quote-v3" data-cine-section>
          <div className="home-quote-v3-inner">
            {classicalQuotes.map((quote, i) => (
              <motion.div
                key={quote.source}
                className="home-quote-v3-item"
                variants={cardPopVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1 }}
              >
                <Quote className="home-quote-v3-icon" />
                <blockquote className="home-quote-v3-text">{quote.text}</blockquote>
                <cite className="home-quote-v3-source">{quote.source}</cite>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="home-gallery-v3" data-cine-section>
          <div className="home-section-header">
            <div className="home-section-header-left">
              <div className="home-section-kicker">
                <span className="home-section-kicker-line" />
                <span>更多门类</span>
              </div>
              <h2 className="home-section-title">继续浏览更多建筑门类</h2>
            </div>
            <motion.button
              type="button"
              onClick={() => navigate('/achievement')}
              className="home-gallery-v3-view-all"
              whileHover={buttonMagnetHover}
              whileTap={aliveCardTap}
            >
              查看全部
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>
          </div>

          <div className="home-gallery-v3-groups">
            {galleryGroups.map((group) => (
              <div key={group.title} className="home-gallery-v3-group">
                <div className="home-gallery-v3-group-header">
                  <span className="home-gallery-v3-group-title">{group.title}</span>
                  <span className="home-gallery-v3-group-line" />
                </div>
                <div className="home-gallery-v3-list">
                  {group.items.map((category, index) => (
                    <motion.button
                      key={category.id}
                      type="button"
                      onClick={() => navigate(`/architecture/${category.id}`)}
                      className="home-gallery-v3-item"
                      variants={cardPopVariants}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true, amount: 0.18 }}
                      whileHover={aliveCardHover}
                      whileTap={aliveCardTap}
                      transition={{ delay: index * 0.04 }}
                      data-cine-card
                    >
                      <div className="home-gallery-v3-item-accent" style={{ background: category.accent }} />
                      <span className="home-gallery-v3-item-index">
                        {String(secondaryCategories.indexOf(category) + primaryCategories.length + 1).padStart(2, '0')}
                      </span>
                      <div className="home-gallery-v3-item-content">
                        <div className="home-gallery-v3-item-name">{category.name}</div>
                        <p className="home-gallery-v3-item-tagline">{category.tagline}</p>
                      </div>
                      <span className="home-gallery-v3-item-count" style={{ color: category.accent }}>
                        {category.sampleCount}
                      </span>
                      <span className="home-gallery-v3-item-arrow">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </motion.main>

      <footer className="home-footer-v3">
        <div className="home-footer-v3-inner">
          <div className="home-footer-v3-top">
            <div className="home-footer-v3-brand">
              <Layers3 className="h-5 w-5" />
              <span>营造新途</span>
            </div>
            <nav className="home-footer-v3-nav">
              {topicCards.map((item) => (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => navigate(item.route)}
                  className="home-footer-v3-link"
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </div>
          <div className="home-footer-v3-divider" />
          <div className="home-footer-v3-bottom">
            <div className="home-footer-v3-copy">千年营造，创意新生</div>
            <div className="home-footer-v3-extra">
              <span>营造新途 · 互联网+文化创意产品平台</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
