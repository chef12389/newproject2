import { useRef } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Users } from 'lucide-react'
import GlobalNav from '@/components/GlobalNav'
import { CommentSection } from '@/components/CommentSection'
import { pageSectionVariants } from '@/lib/motion'
import { trackPageVisit } from '@/lib/progress'
import { useEffect } from 'react'

export default function CommentsHub() {
  const heroRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    trackPageVisit('/comments')
  }, [])

  return (
    <div className="page-shell">
      <GlobalNav />

      <motion.section
        ref={heroRef}
        className="page-header comments-hero-v2"
        initial="initial"
        animate="animate"
        variants={pageSectionVariants}
        data-cine-spotlight-image
      >
        <div className="comments-hero-v2-bg" data-cine-spotlight-image>
          <div className="comments-hero-v2-overlay" />
          <div className="comments-hero-v2-grain" />
        </div>

        <div className="comments-hero-v2-content">
          <div className="comments-hero-v2-layout">
            <motion.div className="comments-hero-v2-copy" data-cine-copy initial="initial" animate="animate" variants={pageSectionVariants}>
              <motion.div className="comments-hero-v2-badge">
                <span className="comments-hero-v2-badge-dot" />
                交流广场
              </motion.div>

              <h1 className="comments-hero-v2-title">
                <span className="comments-hero-v2-title-line">众言堂</span>
                <span className="comments-hero-v2-title-line">
                  <span className="comments-hero-v2-title-accent">共话营造</span>
                </span>
              </h1>

              <p className="comments-hero-v2-subtitle">
                与同好交流心得，分享学习心得，
                在互动中深化对文创设计素材的理解。
              </p>

              <motion.div className="comments-hero-v2-stats" data-cine-actions variants={pageSectionVariants}>
                <div className="comments-hero-v2-stat">
                  <MessageSquare className="h-4 w-4" />
                  <span className="comments-hero-v2-stat-value">自由发言</span>
                  <span className="comments-hero-v2-stat-label">畅所欲言</span>
                </div>
                <div className="comments-hero-v2-stat">
                  <Users className="h-4 w-4" />
                  <span className="comments-hero-v2-stat-value">互动交流</span>
                  <span className="comments-hero-v2-stat-label">共同进步</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('main-content')
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' })
              return
            }
            const mainEl = document.querySelector('main')
            if (mainEl) {
              mainEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
              return
            }
            window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'smooth' })
          }}
          className="comments-hero-v2-scroll"
          aria-label="向下滚动"
        >
          <div className="comments-hero-v2-scroll-rail">
            <div className="comments-hero-v2-scroll-rail-dot" />
          </div>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </button>
      </motion.section>

      <div className="comments-hero-transition" aria-hidden="true">
        <svg className="comments-hero-transition-ornament" viewBox="0 0 1200 48" preserveAspectRatio="none">
          <path d="M0 24 Q150 8, 300 24 T600 24 T900 24 T1200 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
          <path d="M0 24 Q150 40, 300 24 T600 24 T900 24 T1200 24" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
        </svg>
      </div>

      <main id="main-content" className="page-main pt-6 md:pt-12">
        <CommentSection />
      </main>
    </div>
  )
}
