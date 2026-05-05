import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Download, Heart, Link2, Share2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LazyImage } from '@/components/LazyImage'
import { toastError, toastInfo, toastSuccess } from '@/components/ToastNotification'
import { allCases, getCategoryName } from '@/data/architectureData'
import { buildCaseRoute, downloadCaseImage, shareCaseLink } from '@/lib/caseActions'
import { modalVariants, overlayVariants } from '@/lib/motion'
import { toggleFavoriteCase } from '@/lib/progress'

interface FavoriteCollectionModalProps {
  isOpen: boolean
  onClose: () => void
  favoriteCaseIds: string[]
}

export function FavoriteCollectionModal({
  isOpen,
  onClose,
  favoriteCaseIds,
}: FavoriteCollectionModalProps) {
  const navigate = useNavigate()

  const favoriteCases = useMemo(
    () => allCases.filter((item) => favoriteCaseIds.includes(item.id)),
    [favoriteCaseIds],
  )

  const handleShare = async (item: (typeof favoriteCases)[number]) => {
    try {
      const result = await shareCaseLink({
        title: item.name,
        text: `${getCategoryName(item.categoryId)} · ${item.location}`,
        categoryId: item.categoryId,
        caseId: item.id,
      })

      if (result === 'shared') {
        toastSuccess('已调起分享', '你可以把这个案例发给更多人。')
      } else if (result === 'copied') {
        toastSuccess('链接已复制', '现在可以直接粘贴分享。')
      } else {
        toastInfo('当前环境不支持系统分享', '你可以手动复制页面链接。')
      }
    } catch {
      toastError('分享失败', '请稍后再试。')
    }
  }

  const handleDownload = async (item: (typeof favoriteCases)[number]) => {
    const ok = await downloadCaseImage({
      image: item.image,
      filename: `${getCategoryName(item.categoryId)}-${item.name}.jpg`,
    })

    if (ok) {
      toastSuccess('图片开始下载')
    } else {
      toastError('下载失败', '请稍后再试。')
    }
  }

  const handleOpen = (item: (typeof favoriteCases)[number]) => {
    navigate(buildCaseRoute(item.categoryId, item.id))
    onClose()
  }

  const handleToggleFavorite = (caseId: string) => {
    toggleFavoriteCase(caseId)
    toastInfo('已从收藏中移除')
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            className="fixed inset-0 z-[110] bg-black/50"
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
          />

          <motion.div
            className="overlay-panel fixed inset-x-4 top-[6vh] z-[111] mx-auto max-h-[88vh] w-full max-w-5xl overflow-hidden rounded-[30px]"
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/20 px-6 py-5">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">收藏弹窗</div>
                <h2 className="mt-1 text-2xl font-black text-foreground">已收藏的建筑案例</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="premium-icon-button"
                aria-label="关闭收藏弹窗"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(88vh-92px)] overflow-y-auto px-6 py-6">
              {favoriteCases.length === 0 ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/30 bg-white/50 px-6 text-center dark:border-white/10 dark:bg-white/5">
                  <Heart className="h-10 w-10 text-muted-foreground" />
                  <div className="mt-4 text-xl font-black text-foreground">还没有收藏内容</div>
                  <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                    在类型页或图像展廊点一下收藏，喜欢的建筑就会集中保存在这里，也可以随时分享或下载。
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {favoriteCases.map((item) => (
                    <article key={item.id} className="premium-card-overlay rounded-[28px]">
                      <LazyImage
                        src={item.image}
                        alt={item.name}
                        className="h-[220px] w-full"
                        imgClassName="object-cover"
                        width={900}
                        height={680}
                      />

                      <div className="space-y-4 p-5">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            {getCategoryName(item.categoryId)}
                          </div>
                          <div className="mt-2 text-xl font-black text-foreground">{item.name}</div>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {item.location} · {item.year}
                          </p>
                        </div>

                        <div className="line-clamp-3 text-sm leading-7 text-muted-foreground">{item.summary}</div>

                        <div className="grid gap-2 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => handleOpen(item)}
                            className="premium-button-glass inline-flex items-center justify-center gap-2 !px-4 !py-2.5 text-sm"
                          >
                            打开页面
                            <ArrowUpRight className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleShare(item)}
                            className="premium-button-glass inline-flex items-center justify-center gap-2 !px-4 !py-2.5 text-sm"
                          >
                            分享
                            <Share2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDownload(item)}
                            className="premium-button-glass inline-flex items-center justify-center gap-2 !px-4 !py-2.5 text-sm"
                          >
                            下载
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleFavorite(item.id)}
                            className="premium-button-glass inline-flex items-center justify-center gap-2 !px-4 !py-2.5 text-sm"
                          >
                            取消收藏
                            <Link2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}

export default FavoriteCollectionModal
