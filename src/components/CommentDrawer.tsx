import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageSquare, X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CommentSection } from '@/components/CommentSection'
import { drawerVariants, hoverLift, overlayVariants, tapPress } from '@/lib/motion'

export function CommentDrawer() {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  if (location.pathname === '/comments') {
    return null
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        className="comment-fab fixed bottom-5 right-5 left-auto z-[70] inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-white md:bottom-6 md:right-6 xl:bottom-8 xl:right-8"
        whileHover={{
          scale: 1.05,
          y: -5,
        }}
        whileTap={{
          scale: 0.95,
          y: 0,
        }}
      >
        <MessageSquare className="h-4 w-4" />
        评论交流
      </motion.button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="关闭评论抽屉"
              className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={overlayVariants}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial="initial"
              animate="animate"
              exit="exit"
              variants={drawerVariants}
              className="fixed inset-x-0 bottom-0 top-auto z-[81] flex h-[min(88dvh,760px)] w-full flex-col rounded-t-[28px] border border-white/40 bg-[rgba(250,246,239,0.94)] shadow-deep backdrop-blur-2xl dark:border-white/10 dark:bg-[rgba(17,20,27,0.94)] md:inset-y-0 md:right-0 md:left-auto md:h-auto md:max-w-[520px] md:rounded-none md:rounded-l-[28px] md:border-l"
            >
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-4 md:px-5">
                <div>
                  <div className="text-lg font-black text-foreground">评论交流</div>
                  <div className="text-sm leading-6 text-muted-foreground">全站统一评论区，手机端也能直接展开浏览、回复和发布内容。</div>
                </div>
                <motion.button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-white/70 text-foreground dark:border-white/10 dark:bg-white/10"
                  whileHover={hoverLift}
                  whileTap={tapPress}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-3 md:px-4 md:py-4">
                <CommentSection compact />
              </div>

              <div className="border-t border-border/60 px-4 py-4 md:px-5">
                <motion.button
                  type="button"
                  className="premium-button-glass w-full justify-center"
                  onClick={() => navigate('/comments')}
                  whileHover={hoverLift}
                  whileTap={tapPress}
                >
                  前往完整评论页
                </motion.button>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  )
}
