﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿import { useState } from 'react'
import { Compass, ExternalLink, Landmark, Map, ScrollText, Trees } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GlobalNav from '@/components/GlobalNav'
import { HeroScrollCue } from '@/components/HeroScrollCue'
import { LazyImage } from '@/components/LazyImage'
import { ReferenceImage } from '@/components/ReferenceImage'
import { categoryData } from '@/data/architectureData'
import { cultureScenes } from '@/data/siteContent'
import { cn } from '@/lib/utils'

const heroImage = '/images/shouye8.jpg'

export default function CulturePage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(cultureScenes[0]?.id ?? '')
  const categoryMap = Object.fromEntries(categoryData.map((item) => [item.id, item.name]))

  const activeScene = cultureScenes.find((scene) => scene.id === activeTab) ?? cultureScenes[0]

  return (
    <div className="page-shell">
      <GlobalNav />

      <section className="page-header px-0 pt-0 md:px-0 md:pt-0">
        <div className="page-header-inner max-w-none">
          <div
            data-hero-tone="light"
            className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden rounded-none border border-teal-200/70 bg-[#0d1d1b] shadow-[0_28px_72px_-34px_rgba(39,93,82,0.42)] md:rounded-[38px]"
          >
            <div className="pointer-events-none absolute inset-0">
              <LazyImage src={heroImage} alt="culture hero bg" className="h-full w-full object-cover" priority />
            </div>
            <div className="pointer-events-none absolute inset-0 page-hero-fullbleed-scrim page-hero-fullbleed-scrim--culture" />
            <div className="pointer-events-none absolute -left-10 top-10 h-44 w-44 rounded-full bg-teal-300/22 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-emerald-300/16 blur-3xl" />

            <div
              className={cn(
                'relative z-10 mx-auto grid w-full max-w-[1200px] grid-cols-1 items-end gap-6 px-6 pb-6 pt-[clamp(5.5rem,14vw,7rem)] md:px-8 md:pb-8 md:pt-[clamp(5.75rem,12vw,7.25rem)]',
                'xl:grid-cols-[minmax(0,1.02fr)_440px]',
              )}
            >
              <div className="page-hero-fullbleed-copy flex flex-col gap-6 self-end">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white/65 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-800">
                    文化创意
                  </div>
                  <h1 className="font-serif text-4xl font-black leading-tight text-white md:text-6xl">
                    千年营造，文化创意
                    <span className="block text-[#c8ddd9]">与文创产品专题</span>
                  </h1>
                  <p className="mt-5 max-w-3xl text-base leading-8 text-[#e1f0ed] md:text-lg">
                    这里关注的不是单体建筑本身，而是礼制、都城、园林、村落、非遗和当代传播如何共同构成“赋能文创设计的文化遗产”。
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-[24px] border border-white/35 bg-[rgba(248,251,241,0.2)] p-4 text-[#f7f6ed] backdrop-blur-xl shadow-[0_18px_44px_-26px_rgba(0,0,0,0.42)]">
                    <div className="text-xs uppercase tracking-[0.22em] text-[rgba(226,235,202,0.78)]">主题分区</div>
                    <div className="mt-2 text-3xl font-black text-white">{cultureScenes.length}</div>
                    <p className="mt-2 text-sm text-[rgba(244,247,235,0.82)]">从都城礼制到当代传播，形成连续的文创设计线索。</p>
                  </div>
                  <div className="rounded-[24px] border border-white/35 bg-[rgba(248,251,241,0.2)] p-4 text-[#f7f6ed] backdrop-blur-xl shadow-[0_18px_44px_-26px_rgba(0,0,0,0.42)]">
                    <div className="text-xs uppercase tracking-[0.22em] text-[rgba(226,235,202,0.78)]">权威数据</div>
                    <div className="mt-2 text-3xl font-black text-white">UNESCO</div>
                    <p className="mt-2 text-sm text-[rgba(244,247,235,0.82)]">以 UNESCO、住建部、国家文物局等公开资料为基础。</p>
                  </div>
                  <div className="rounded-[24px] border border-white/35 bg-[rgba(248,251,241,0.2)] p-4 text-[#f7f6ed] backdrop-blur-xl shadow-[0_18px_44px_-26px_rgba(0,0,0,0.42)]">
                    <div className="text-xs uppercase tracking-[0.22em] text-[rgba(226,235,202,0.78)]">阅读方式</div>
                    <div className="mt-2 text-3xl font-black text-white">主题切换</div>
                    <p className="mt-2 text-sm text-[rgba(244,247,235,0.82)]">按主题分区浏览，每次聚焦一个文化专题。</p>
                  </div>
                </div>
              </div>

              <ReferenceImage
                src={activeScene.image}
                alt={activeScene.imageAlt}
                title={activeScene.label}
                note={`文化主题图片，来自 public/${activeScene.image}`}
                className="self-start rounded-[30px] border border-white/14 bg-white/10 p-3 backdrop-blur-xl shadow-[0_24px_70px_-28px_rgba(0,0,0,0.54)]"
                imgClassName="h-[320px] w-full rounded-[24px] border border-teal-100/12 bg-[rgba(10,24,22,0.74)] object-cover md:h-[360px]"
                width={1200}
                height={900}
                priority
              />
              <div className="col-span-full flex justify-center pb-1 pt-2 xl:col-span-2">
                <HeroScrollCue tone="paper" label="向下进入文化主题" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main id="main-content" className="page-main flex flex-col gap-6 pt-5 sm:pt-10">
        <section className="surface-card-strong rounded-[34px] border-teal-200/70 p-5 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Compass className="h-5 w-5 text-[#2a6f61]" />
              <h2 className="text-2xl font-black text-foreground">文创主题导航</h2>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {cultureScenes.map((scene) => (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => setActiveTab(scene.id)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                    activeScene.id === scene.id
                      ? 'bg-[linear-gradient(135deg,#2a6f61,#1f4f48)] text-white shadow-[0_16px_36px_-20px_rgba(31,79,72,0.8)]'
                      : 'premium-button-glass',
                  )}
                >
                  {scene.label}
                </button>
              ))}
            </div>

            <p className="text-sm leading-7 text-muted-foreground">{activeScene.intro}</p>
          </div>
        </section>

        <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.2fr)_300px]">
          <article className="surface-card-strong rounded-[34px] border-teal-200/70 p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Landmark className="h-5 w-5 text-[#2a6f61]" />
              <h2 className="text-2xl font-black text-foreground">{activeScene.label}</h2>
            </div>

            <div className="grid items-start gap-5 lg:grid-cols-[0.88fr_1.12fr]">
              <ReferenceImage
                src={activeScene.image}
                alt={activeScene.imageAlt}
                title={activeScene.label}
                note={`待补充权威图片：public/${activeScene.image}`}
                className="self-start rounded-[28px] border border-teal-200/70 bg-white/70"
                imgClassName="h-[320px] w-full object-cover"
                width={1200}
                height={900}
              />

              <div className="flex flex-col gap-4">
                <div className="rounded-[26px] border border-teal-200/70 bg-white/72 p-5">
                  <div className="text-xs uppercase tracking-[0.22em] text-[#2a6f61]">{activeScene.statLabel}</div>
                  <div className="mt-3 text-4xl font-black text-[#173d36]">{activeScene.stat}</div>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{activeScene.statNote}</p>
                </div>

                <div>
                  <p className="text-sm leading-7 text-muted-foreground">{activeScene.summary}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeScene.themeTags.map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  {activeScene.externalLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="premium-button-glass inline-flex items-center gap-2 !px-4 !py-2 text-sm"
                    >
                      {link.label}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <aside className="surface-card self-start rounded-[34px] border-teal-200/70 p-6">
            <div className="mb-4 flex items-center gap-3">
              <Map className="h-5 w-5 text-[#2a6f61]" />
              <h2 className="text-xl font-black text-foreground">事实速览</h2>
            </div>
            <div className="space-y-3">
              {activeScene.facts.map((item) => (
                <div key={item} className="rounded-[22px] border border-teal-200/70 bg-white/[0.68] p-4 text-sm leading-7 text-foreground">
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="grid items-start gap-6 xl:grid-cols-[1fr_1fr]">
          <article className="surface-card-strong self-start rounded-[34px] border-teal-200/70 p-6 md:p-8">
            <div className="mb-5 flex items-center gap-3">
              <Trees className="h-5 w-5 text-[#2a6f61]" />
              <h2 className="text-2xl font-black text-foreground">文创展开</h2>
            </div>
            <div className="grid gap-4">
              {activeScene.detailCards.map((card) => (
                <div key={card.title} className="rounded-[28px] border border-teal-200/70 bg-white/78 p-5">
                  <div className="text-lg font-black text-foreground">{card.title}</div>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.body}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="surface-card self-start rounded-[34px] border-teal-200/70 p-6 md:p-8">
            <div className="mb-5 flex items-center gap-3">
              <ScrollText className="h-5 w-5 text-[#2a6f61]" />
              <h2 className="text-2xl font-black text-foreground">站内延伸</h2>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              文创设计不仅在专题资料里寻找灵感，也能回到本站的建筑案例中继续挖掘素材。你可以从园林、民居、宫殿与桥梁等类型切回具体实例。
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {activeScene.relatedCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => navigate(`/architecture/${category}`)}
                  className="premium-button-glass inline-flex items-center gap-2 !px-4 !py-2 text-sm"
                >
                  关联 {categoryMap[category] ?? category}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-[24px] border border-teal-200/70 bg-white/[0.66] p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">阅读建议</div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                可按礼制与文创空间、园林美学与体验设计、民居文创与生活美学、宗教建筑、文创地标与公共艺术、非遗文创与手作传承等主题继续浏览相关内容。
              </p>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}
