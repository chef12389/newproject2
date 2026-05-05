import { useRef } from 'react'
import { ArrowRight, BookOpen, Landmark, Layers3, ScrollText, Sparkles, Users, Trees } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import GlobalNav from '@/components/GlobalNav'
import { HeroScrollCue } from '@/components/HeroScrollCue'
import { LazyImage } from '@/components/LazyImage'
import { primaryCategories, secondaryCategories } from '@/data/architectureFocus'
import { useSectionReveal } from '@/lib/cinematic'
import { aliveCardHover, aliveCardTap, buttonMagnetHover, cardPopChildVariants, cardPopVariants, pageSectionVariants, staggerItemVariants } from '@/lib/motion'

const relatedTopics = [
  { label: '创意大师', desc: '从人物精神汲取灵感', route: '/scientists', icon: Users, accent: '#345f8f' },
  { label: '设计典籍', desc: '从经典文献学习方法', route: '/treatises', icon: BookOpen, accent: '#9e6b17' },
  { label: '文化创意', desc: '从文化传承激发创意', route: '/culture', icon: Trees, accent: '#2f7a62' },
]

const highlights = [
  { title: '民居', text: '院落、门墙、街巷与聚落肌理，日常生活怎样被空间妥善安顿。' },
  { title: '官府', text: '仪门、大堂、廊庑与前后分区，治理秩序如何写入空间。' },
  { title: '皇宫', text: '中轴、台基、殿宇递进与礼制格局，国家礼仪与等级气象。' },
  { title: '桥梁', text: '拱券、桥墩、桥面与水文条件，工程技术与结构判断。' },
]

export default function AchievementPage() {
  const navigate = useNavigate()
  const pageRef = useRef<HTMLDivElement | null>(null)

  useSectionReveal(pageRef)

  return (
    <div ref={pageRef} className="page-shell">
      <GlobalNav />

      <motion.section
        className="page-header achievement-hero-v3"
        variants={pageSectionVariants}
        initial="initial"
        animate="animate"
        data-cine-section
      >
        <div className="achievement-hero-v3-bg" data-cine-spotlight-image>
          <LazyImage src="/images/shouye4.jpg" alt="文创设计素材" className="achievement-hero-v3-image" priority />
          <div className="achievement-hero-v3-overlay" />
          <div className="achievement-hero-v3-grain" />
          <div className="achievement-hero-v3-ink-wash" />
        </div>

        <div className="achievement-hero-v3-content page-header-inner">
          <motion.div
            className="hero-orb hero-orb-cinnabar"
            data-cine-atmosphere
            data-cine-glow
            data-cine-parallax="0.10"
            style={{ width: 420, height: 420, top: '-14%', right: '6%' }}
          />
          <motion.div
            className="hero-orb hero-orb-yellow"
            data-cine-atmosphere
            data-cine-parallax="-0.06"
            style={{ width: 320, height: 320, bottom: '-12%', left: '-3%' }}
          />

          <div className="achievement-hero-v3-layout">
            <div className="achievement-hero-v3-copy">
              <motion.div className="achievement-hero-v3-badge" variants={cardPopChildVariants} data-cine-copy>
                <span className="achievement-hero-v3-badge-dot" />
                <Sparkles className="h-3.5 w-3.5" />
                <span>营造华章</span>
              </motion.div>

              <h1 className="achievement-hero-v3-title">
                <span data-cine-title-line className="achievement-hero-v3-title-line">营造华章</span>
                 <span data-cine-title-line className="achievement-hero-v3-title-line achievement-hero-v3-title-accent">从民居到皇宫，读懂千年营造</span>
              </h1>

              <motion.p className="achievement-hero-v3-subtitle" variants={cardPopChildVariants} data-cine-copy>
                页面收录 1911 年以前的重要建筑成就，以民居、官府、皇宫、桥梁为重点，同时保留园林、教育、商业、公共等门类，为文创产品开发提供丰富的设计素材与灵感。
              </motion.p>

              <motion.div className="achievement-hero-v3-stats" variants={cardPopChildVariants} data-cine-strip>
                <div className="achievement-hero-v3-stat">
                  <Landmark className="h-4 w-4" />
                  <span className="achievement-hero-v3-stat-value">{primaryCategories.length}</span>
                  <span className="achievement-hero-v3-stat-label">个重点素材门类</span>
                </div>
                <div className="achievement-hero-v3-stat">
                  <BookOpen className="h-4 w-4" />
                  <span className="achievement-hero-v3-stat-value">{secondaryCategories.length}</span>
                  <span className="achievement-hero-v3-stat-label">个补充素材门类</span>
                </div>
              </motion.div>

              <motion.div className="achievement-hero-v3-actions" variants={cardPopChildVariants} data-cine-actions>
                <motion.button
                  type="button"
                  onClick={() => navigate(`/architecture/${primaryCategories[0].id}`)}
                  className="achievement-hero-v3-cta-primary"
                  whileHover={buttonMagnetHover}
                  whileTap={aliveCardTap}
                >
                  <span>浏览民居专题</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => navigate('/')}
                  className="achievement-hero-v3-cta-glass"
                  whileHover={buttonMagnetHover}
                  whileTap={aliveCardTap}
                >
                  <span>返回首页</span>
                </motion.button>
              </motion.div>
            </div>

            <motion.div
              className="achievement-hero-v3-quickstart"
              variants={cardPopVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="achievement-hero-v3-quickstart-header">
                <div className="achievement-hero-v3-quickstart-icon">
                  <Layers3 className="h-5 w-5" />
                </div>
                <div>
                  <div className="achievement-hero-v3-quickstart-eyebrow">重点门类</div>
                  <h2 className="achievement-hero-v3-quickstart-title">民居、官府、皇宫、桥梁</h2>
                </div>
              </div>

              <div className="achievement-hero-v3-quickstart-topics">
                {primaryCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => navigate(`/architecture/${category.id}`)}
                    className="achievement-hero-v3-topic"
                    style={{
                      ['--topic-accent' as string]: category.accent,
                    }}
                  >
                    <span className="achievement-hero-v3-topic-name">{category.name}</span>
                    <span className="achievement-hero-v3-topic-count">{category.sampleCount} 例</span>
                    <ArrowRight className="achievement-hero-v3-topic-arrow h-3 w-3" />
                  </button>
                ))}
              </div>

              <div className="achievement-hero-v3-quickstart-hint">
                从你最感兴趣的建筑类型开始探索
              </div>
            </motion.div>
          </div>

          <div className="achievement-hero-v3-scroll-wrap">
            <HeroScrollCue tone="ember" label="向下展开卷轴" />
          </div>
        </div>
      </motion.section>

      <div className="achievement-hero-transition" aria-hidden="true">
        <svg className="achievement-hero-transition-ornament" viewBox="0 0 1200 24" fill="none" preserveAspectRatio="none">
          <path d="M0 12 Q50 0, 100 12 Q150 24, 200 12 Q250 0, 300 12 Q350 24, 400 12 Q450 0, 500 12 Q550 24, 600 12 Q650 0, 700 12 Q750 24, 800 12 Q850 0, 900 12 Q950 24, 1000 12 Q1050 0, 1100 12 Q1150 24, 1200 12" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
        </svg>
      </div>

      <motion.main id="main-content" className="page-main achievement-main-v3" variants={pageSectionVariants} initial="initial" animate="animate">
        <section className="achievement-primary-v3" data-cine-section>
          <div className="achievement-section-header">
            <div className="achievement-section-header-left">
              <div className="achievement-section-kicker">
                <span className="achievement-section-kicker-line" />
                <span>重点门类</span>
              </div>
              <h2 className="achievement-section-title">民居、官府、皇宫、桥梁</h2>
            </div>
            <p className="achievement-section-desc">四大重点门类，从日常生活到国家礼制，层层递进。</p>
          </div>

          <div className="achievement-primary-grid">
            {primaryCategories.map((category, index) => (
              <motion.button
                key={category.id}
                type="button"
                onClick={() => navigate(`/architecture/${category.id}`)}
                className="achievement-primary-card"
                style={{
                  ['--topic-accent' as string]: category.accent,
                  ['--topic-gradient' as string]: `linear-gradient(135deg, ${category.accent} 0%, color-mix(in srgb, ${category.accent} 60%, #111827) 100%)`,
                }}
                variants={cardPopVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
                whileHover={aliveCardHover}
                whileTap={aliveCardTap}
                transition={{ delay: index * 0.05 }}
              >
                <div className="achievement-primary-card-image-wrap">
                  <LazyImage
                    src={category.cases[0]?.image ?? '/images/shouye4.jpg'}
                    alt={category.name}
                    className="achievement-primary-card-image"
                  />
                  <div className="achievement-primary-card-image-overlay" />
                  <div className="achievement-primary-card-image-glow" />
                </div>
                <div className="achievement-primary-card-content">
                  <div className="achievement-primary-card-meta">
                    <span className="achievement-primary-card-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="achievement-primary-card-count">{category.sampleCount} 个案例</span>
                  </div>
                  <h3 className="achievement-primary-card-title">{category.name}</h3>
                  <p className="achievement-primary-card-summary">{category.summary}</p>
                  <div className="achievement-primary-card-action">
                    查看这一类
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="achievement-highlights-v3" data-cine-section>
          <div className="achievement-section-header">
            <div className="achievement-section-header-left">
              <div className="achievement-section-kicker">
                <span className="achievement-section-kicker-line" />
                <span>门类看点</span>
              </div>
              <h2 className="achievement-section-title">四类要点</h2>
            </div>
          </div>

          <div className="achievement-highlights-grid">
            {highlights.map((item, i) => (
              <motion.div
                key={item.title}
                className="achievement-highlight-card"
                variants={cardPopVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  ['--topic-accent' as string]: primaryCategories[i]?.accent ?? '#8f3024',
                }}
              >
                <div className="achievement-highlight-card-dot" />
                <div className="achievement-highlight-card-body">
                  <h3 className="achievement-highlight-card-title">{item.title}</h3>
                  <p className="achievement-highlight-card-text">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="achievement-secondary-v3" data-cine-section>
          <div className="achievement-section-header">
            <div className="achievement-section-header-left">
              <div className="achievement-section-kicker">
                <span className="achievement-section-kicker-line" />
                <span>补充门类</span>
              </div>
              <h2 className="achievement-section-title">其他营造类型</h2>
            </div>
          </div>

          <div className="achievement-secondary-grid">
            {secondaryCategories.map((category, index) => (
              <motion.button
                key={category.id}
                type="button"
                onClick={() => navigate(`/architecture/${category.id}`)}
                className="achievement-secondary-card"
                style={{
                  ['--topic-accent' as string]: category.accent,
                }}
                variants={cardPopVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.15 }}
                whileHover={aliveCardHover}
                whileTap={aliveCardTap}
                transition={{ delay: index * 0.04 }}
              >
                <div className="achievement-secondary-card-accent" style={{ background: category.accent }} />
                <div className="achievement-secondary-card-body">
                  <div className="achievement-secondary-card-name">{category.name}</div>
                  <div className="achievement-secondary-card-count" style={{ color: category.accent }}>
                    {category.sampleCount} 个案例
                  </div>
                  <p className="achievement-secondary-card-tagline">{category.tagline}</p>
                </div>
                <span className="achievement-secondary-card-arrow">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="achievement-related-v3" data-cine-section>
          <div className="achievement-section-header">
            <div className="achievement-section-header-left">
              <div className="achievement-section-kicker">
                <span className="achievement-section-kicker-line" />
                <span>延伸阅读</span>
              </div>
              <h2 className="achievement-section-title">相关专题</h2>
            </div>
            <p className="achievement-section-desc">从人物、典籍与文创三个维度继续探索营造新途。</p>
          </div>

          <div className="achievement-related-grid">
            {relatedTopics.map((topic, i) => {
              const TopicIcon = topic.icon
              return (
                <motion.button
                  key={topic.route}
                  type="button"
                  onClick={() => navigate(topic.route)}
                  className="achievement-related-card"
                  style={{
                    ['--topic-accent' as string]: topic.accent,
                  }}
                  variants={cardPopVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={aliveCardHover}
                  whileTap={aliveCardTap}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="achievement-related-card-icon">
                    <TopicIcon className="h-5 w-5" />
                  </div>
                  <div className="achievement-related-card-body">
                    <h3 className="achievement-related-card-title">{topic.label}</h3>
                    <p className="achievement-related-card-desc">{topic.desc}</p>
                  </div>
                  <ArrowRight className="achievement-related-card-arrow h-4 w-4" />
                </motion.button>
              )
            })}
          </div>
        </section>

        <motion.article className="achievement-timeline-v3" variants={staggerItemVariants} data-cine-step>
          <div className="achievement-timeline-v3-inner">
            <ScrollText className="achievement-timeline-v3-icon" />
            <div className="achievement-timeline-v3-body">
              <h2 className="achievement-timeline-v3-title">时代脉络</h2>
              <p className="achievement-timeline-v3-text">
                这些案例与专题共同勾勒出 1911 年以前中国古代建筑文明的发展脉络，既有制度营建的大工程，也有地方营造与日常生活的长期积累，为今天的文创设计提供了丰厚的文化土壤。
              </p>
            </div>
          </div>
        </motion.article>
      </motion.main>
    </div>
  )
}
