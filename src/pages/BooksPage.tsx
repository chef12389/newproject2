﻿import { useMemo, useState } from 'react'
import { ExternalLink, FileText, LibraryBig, Quote, ScrollText, Wrench } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GlobalNav from '@/components/GlobalNav'
import { HeroScrollCue } from '@/components/HeroScrollCue'
import { LazyImage } from '@/components/LazyImage'
import { ReferenceImage } from '@/components/ReferenceImage'
import { categoryData } from '@/data/architectureData'
import { treatiseEntries, treatiseSections } from '@/data/siteContent'
import { cn } from '@/lib/utils'

const heroImage = '/images/shouye7.jpg'

export default function BooksPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(treatiseEntries[0]?.id ?? '')

  const entryMap = useMemo(
    () => Object.fromEntries(treatiseEntries.map((entry) => [entry.id, entry])),
    [],
  )
  const categoryMap = useMemo(
    () => Object.fromEntries(categoryData.map((item) => [item.id, item.name])),
    [],
  )

  const activeEntry = entryMap[activeTab] ?? treatiseEntries[0]
  const activeSection = treatiseSections.find((section) => section.leadId === activeTab || section.relatedIds.includes(activeTab)) ?? treatiseSections[0]

  return (
    <div className="page-shell">
      <GlobalNav />

      <section className="page-header px-0 pt-0 md:px-0 md:pt-0">
        <div className="page-header-inner max-w-none">
          <div
            data-hero-tone="light"
            className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden rounded-none border border-[#c7d3b5] bg-[#1e2715] shadow-[0_26px_72px_-34px_rgba(89,110,54,0.42)] md:rounded-[38px]"
          >
            <div className="pointer-events-none absolute inset-0">
              <LazyImage src={heroImage} alt="books hero bg" className="h-full w-full object-cover" priority />
            </div>
            <div className="pointer-events-none absolute inset-0 page-hero-fullbleed-scrim" />
            <div className="pointer-events-none absolute -left-16 top-8 h-48 w-48 rounded-full bg-[#9ec27b]/28 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-44 w-44 rounded-full bg-[#6e8f45]/18 blur-3xl" />

            <div className="relative z-10 mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-6 px-6 pb-6 pt-[clamp(5.5rem,14vw,7rem)] md:px-8 md:pb-8 md:pt-[clamp(5.75rem,12vw,7.25rem)] xl:grid-cols-[minmax(0,1.02fr)_440px] xl:items-end">
              <div className="page-hero-fullbleed-copy flex flex-col gap-6 self-end">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#aab98d] bg-white/65 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#55663a]">
                    设计典籍
                  </div>
                  <h1 className="font-serif text-4xl font-black leading-tight text-[#2c3820] md:text-6xl">
                    千年营造，典籍新生
                    <span className="block text-[#61783a]">与设计方法专题</span>
                  </h1>
                  <p className="mt-5 max-w-3xl text-base leading-8 text-[#516140] md:text-lg">
                    按设计法度、园林美学、木构技艺、清代做法、图档文献与术语索引六条路径，组织古代建筑文献资料，为现代设计提供方法论支撑。
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-[24px] border border-[#c1d09f] bg-white/70 p-4 backdrop-blur-xl">
                    <div className="text-xs uppercase tracking-[0.22em] text-[#63754b]">专题分区</div>
                    <div className="mt-2 text-3xl font-black text-[#324124]">{treatiseSections.length}</div>
                    <p className="mt-2 text-sm text-[#61714f]">从法度、做法到图档，形成清晰的设计知识路径。</p>
                  </div>
                  <div className="rounded-[24px] border border-[#c1d09f] bg-white/70 p-4 backdrop-blur-xl">
                    <div className="text-xs uppercase tracking-[0.22em] text-[#63754b]">核心原典</div>
                    <div className="mt-2 text-3xl font-black text-[#324124]">{treatiseEntries.length}</div>
                    <p className="mt-2 text-sm text-[#61714f]">以《营造法式》《园冶》等原典为主，并配套图档与术语索引，服务文创设计学习。</p>
                  </div>
                  <div className="rounded-[24px] border border-[#c1d09f] bg-white/70 p-4 backdrop-blur-xl">
                    <div className="text-xs uppercase tracking-[0.22em] text-[#63754b]">阅读方式</div>
                    <div className="mt-2 text-3xl font-black text-[#324124]">短引</div>
                    <p className="mt-2 text-sm text-[#61714f]">提供简短摘引，并连接到对应资料页继续学习。</p>
                  </div>
                </div>
              </div>

              <ReferenceImage
                src={activeEntry.image}
                alt={activeEntry.imageAlt}
                title={activeEntry.title}
                note={`请将权威图片放入 public/${activeEntry.image}`}
                className="h-full min-h-[320px] rounded-[30px] border border-white/15 bg-white/10 p-3 backdrop-blur-xl shadow-[0_24px_70px_-28px_rgba(0,0,0,0.52)]"
                imgClassName="h-full min-h-[320px] w-full rounded-[24px] border border-[#dbe6c4]/18 bg-[rgba(24,30,15,0.72)] object-cover"
                width={1200}
                height={900}
                priority
              />
              <div className="col-span-full flex justify-center pb-1 pt-2 xl:col-span-2">
                <HeroScrollCue tone="ink" label="向下进入阅读路径" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main id="main-content" className="page-main flex flex-col gap-6 pt-5 sm:gap-8 sm:pt-10">
        <section className="surface-card-strong rounded-[34px] border-[#c1d09f] p-6 md:p-8">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <ScrollText className="h-5 w-5 text-[#61783a]" />
              <h2 className="text-2xl font-black text-foreground">阅读路径</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {treatiseEntries.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setActiveTab(entry.id)}
                  className={cn(
                    'rounded-full px-5 py-2.5 text-sm font-semibold transition-all',
                    activeTab === entry.id
                      ? 'bg-[linear-gradient(135deg,#61783a,#3d5b29)] text-white shadow-[0_16px_36px_-20px_rgba(61,91,41,0.8)]'
                      : 'premium-button-glass',
                  )}
                >
                  {entry.title}
                </button>
              ))}
            </div>

            <p className="text-sm leading-7 text-muted-foreground">{activeEntry.summary}</p>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_380px]">
          <article className="surface-card-strong rounded-[34px] border-[#c1d09f] p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <LibraryBig className="h-5 w-5 text-[#61783a]" />
              <h2 className="text-2xl font-black text-foreground">{activeEntry.title}</h2>
              <span className="rounded-full bg-[#61783a]/10 px-3 py-1 text-xs font-semibold text-[#61783a]">{activeEntry.dynasty}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-5">
                <ReferenceImage
                  src={activeEntry.image}
                  alt={activeEntry.imageAlt}
                  title={activeEntry.title}
                  note={`待补充权威图片：public/${activeEntry.image}`}
                  className="rounded-[28px] border border-[#c1d09f] bg-white/70 shadow-sm"
                  imgClassName="h-[340px] w-full object-cover"
                  width={1000}
                  height={1200}
                />
              </div>
              <div className="md:col-span-7">
                <div>
                  <div className="text-sm font-semibold text-[#61783a]">{activeEntry.kind}</div>
                  <div className="mt-2 text-lg font-black text-foreground">{activeEntry.author}</div>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{activeEntry.summary}</p>
                </div>

                <div className="mt-5 rounded-[26px] border border-[#c1d09f] bg-[rgba(251,249,240,0.9)] p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2 text-sm font-black text-[#61783a]">
                    <Quote className="h-4 w-4" />
                    经典短引
                  </div>
                  <div className="font-serif text-2xl font-black text-[#2c3820]">“{activeEntry.excerpt.replace(/[“”]/g, '')}”</div>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{activeEntry.excerptSource}</p>
                </div>
              </div>
              <div className="md:col-span-12">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {activeEntry.highlights.map((item) => (
                    <div key={item} className="rounded-[22px] border border-[#c1d09f] bg-white/72 p-4 text-sm leading-7 text-foreground shadow-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-12">
                <div className="flex flex-wrap gap-3">
                  {activeEntry.externalLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="premium-button-glass inline-flex items-center gap-2 !px-5 !py-2.5 text-sm"
                    >
                      {link.label}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <aside className="surface-card rounded-[34px] border-[#c1d09f] p-6">
            <div className="mb-5 flex items-center gap-3">
              <FileText className="h-5 w-5 text-[#61783a]" />
              <h2 className="text-xl font-black text-foreground">术语与索引</h2>
            </div>

            <div className="space-y-5">
              <div className="rounded-[24px] border border-[#c1d09f] bg-white/70 p-5 shadow-sm">
                <div className="text-sm font-black text-foreground">高频术语</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeEntry.terms.map((term) => (
                    <span key={term} className="chip">
                      {term}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-[24px] border border-[#c1d09f] bg-white/70 p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2 text-sm font-black text-foreground">
                  <Wrench className="h-4 w-4 text-[#61783a]" />
                  工法线索
                </div>
                <div className="space-y-2">
                  {activeEntry.crafts.map((craft) => (
                    <div key={craft} className="rounded-2xl bg-white/80 px-4 py-3.5 text-sm leading-6 text-foreground">
                      {craft}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[24px] border border-[#c1d09f] bg-white/70 p-5 shadow-sm">
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">所属路径</div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{activeSection.label}</p>
              </div>
            </div>
          </aside>

        </section>

        <article className="surface-card-strong rounded-[34px] border-[#c1d09f] p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <ScrollText className="h-5 w-5 text-[#61783a]" />
            <h2 className="text-2xl font-black text-foreground">相关建筑类型</h2>
          </div>
          <div className="space-y-5">
            <p className="text-sm leading-7 text-muted-foreground">{activeSection.insightBody}</p>
            <div className="flex flex-wrap gap-3">
              {activeEntry.relatedCategories.map((category) => (
                <button
                    key={category}
                    type="button"
                    onClick={() => navigate(`/architecture/${category}`)}
                    className="premium-button-glass inline-flex items-center gap-2 !px-5 !py-2.5 text-sm"
                  >
                    关联 {categoryMap[category] ?? category}
                  </button>
                ))}
              </div>
            </div>
        </article>
      </main>
    </div>
  )
}
