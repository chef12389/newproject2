import { useMemo, useState } from 'react'
import { Compass, ExternalLink, Hammer, Orbit, ShieldCheck, Stars } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GlobalNav from '@/components/GlobalNav'
import { HeroScrollCue } from '@/components/HeroScrollCue'
import { LazyImage } from '@/components/LazyImage'
import { ReferenceImage } from '@/components/ReferenceImage'
import { categoryData } from '@/data/architectureData'
import { scientistEntries, scientistSections } from '@/data/siteContent'
import { cn } from '@/lib/utils'

const heroImage = '/images/shouye6.jpg'

export default function ScientistsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(scientistEntries[0]?.id ?? '')

  const profileMap = useMemo(
    () => Object.fromEntries(scientistEntries.map((entry) => [entry.id, entry])),
    [],
  )
  const categoryMap = useMemo(
    () => Object.fromEntries(categoryData.map((item) => [item.id, item.name])),
    [],
  )

  const activeProfile = profileMap[activeTab] ?? scientistEntries[0]
  const activeSection = scientistSections.find((section) => section.itemIds.includes(activeTab)) ?? scientistSections[0]

  return (
    <div className="page-shell">
      <GlobalNav />

      <section className="page-header px-0 pt-0 md:px-0 md:pt-0">
        <div className="page-header-inner max-w-none">
          <div
            data-hero-tone="dark"
            className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden rounded-none border border-slate-200/70 bg-[#08121d] text-white shadow-[0_32px_80px_-36px_rgba(15,23,42,0.68)] md:rounded-[38px]"
          >
            <div className="pointer-events-none absolute inset-0">
              <LazyImage src={heroImage} alt="scientists hero bg" className="h-full w-full object-cover" priority />
            </div>
            <div className="pointer-events-none absolute inset-0 page-hero-fullbleed-scrim page-hero-fullbleed-scrim--scientists" />
            <div className="pointer-events-none absolute -right-16 top-10 h-48 w-48 rounded-full bg-sky-300/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-44 w-44 rounded-full bg-amber-200/12 blur-3xl" />

            <div className="relative z-10 mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-6 px-6 pb-6 pt-[clamp(5.5rem,14vw,7rem)] md:px-8 md:pb-8 md:pt-[clamp(5.75rem,12vw,7.25rem)] xl:grid-cols-[minmax(0,1.05fr)_440px] xl:items-end">
              <div className="page-hero-fullbleed-copy flex flex-col gap-6 self-end">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/78">
                    创意大师
                  </div>
                  <h1 className="font-serif text-4xl font-black leading-tight text-white md:text-6xl">
                    千年匠心，创意人物
                    <span className="block text-[rgba(248,218,158,0.96)]">与设计传承脉络</span>
                  </h1>
                  <p className="mt-5 max-w-3xl text-base leading-8 text-white/78 md:text-lg">
                    按地域、时期、专业领域与组织的多维视角，呈现建筑历史人物及其营造智慧，为文创设计的人物IP开发提供丰富的故事原型与精神内涵。
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-[24px] border border-white/12 bg-white/10 p-4 backdrop-blur-xl">
                    <div className="text-xs uppercase tracking-[0.22em] text-white/60">专题分区</div>
                    <div className="mt-2 text-3xl font-black text-white">{scientistSections.length}</div>
                    <p className="mt-2 text-sm text-white/68">按地域、时期、专业领域与组织的多维视角</p>
                  </div>
                  <div className="rounded-[24px] border border-white/12 bg-white/10 p-4 backdrop-blur-xl">
                    <div className="text-xs uppercase tracking-[0.22em] text-white/60">人物条目</div>
                    <div className="mt-2 text-3xl font-black text-white">{scientistEntries.length}</div>
                    <p className="mt-2 text-sm text-white/68">呈现建筑历史人物及其营造实践与学术贡献</p>
                  </div>
                  <div className="rounded-[24px] border border-white/12 bg-white/10 p-4 backdrop-blur-xl">
                    <div className="text-xs uppercase tracking-[0.22em] text-white/60">引用资料</div>
                    <div className="mt-2 text-3xl font-black text-white">2+</div>
                    <p className="mt-2 text-sm text-white/68">每条人物条目使用权威图像资料，为文创设计提供可靠参考</p>
                  </div>
                </div>
              </div>

              <ReferenceImage
                src={activeProfile.image}
                alt={activeProfile.imageAlt}
                title={activeProfile.name}
                note={`人物肖像图片，来自 public/${activeProfile.image}`}
                className="h-full min-h-[320px] rounded-[30px] border border-white/14 bg-white/10 p-3 backdrop-blur-xl shadow-[0_24px_70px_-28px_rgba(0,0,0,0.6)]"
                imgClassName="h-full min-h-[320px] w-full rounded-[24px] border border-white/10 bg-[rgba(7,14,22,0.72)] object-cover"
                width={1200}
                height={900}
                priority
              />
              <div className="col-span-full flex justify-center pb-1 pt-2 xl:col-span-2">
                <HeroScrollCue tone="jade" label="向下进入详细内容" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main id="main-content" className="page-main flex flex-col gap-6 pt-5 sm:gap-8 sm:pt-10">
        <section className="surface-card-strong rounded-[34px] p-6 md:p-8">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Compass className="h-5 w-5 text-[#355b84]" />
              <h2 className="text-2xl font-black text-foreground">专题导航</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {scientistEntries.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setActiveTab(entry.id)}
                  className={cn(
                    'rounded-full px-5 py-2.5 text-sm font-semibold transition-all',
                    activeTab === entry.id
                      ? 'bg-[linear-gradient(135deg,#19334f,#385f87)] text-white shadow-[0_16px_36px_-20px_rgba(25,51,79,0.9)]'
                      : 'premium-button-glass',
                  )}
                >
                  {entry.name}
                </button>
              ))}
            </div>

            <p className="text-sm leading-7 text-muted-foreground">{activeProfile.summary}</p>
          </div>
        </section>

        <section className="grid items-start gap-8 xl:grid-cols-[minmax(0,1.2fr)_320px]">
          <article className="surface-card-strong rounded-[34px] p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Orbit className="h-5 w-5 text-[#355b84]" />
              <h2 className="text-2xl font-black text-foreground">{activeProfile.name}</h2>
              <span className="rounded-full bg-[#355b84]/10 px-3 py-1 text-xs font-semibold text-[#355b84]">{activeProfile.era}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {activeProfile.image ? (
                <>
                  <div className="md:col-span-5">
                    <ReferenceImage
                      src={activeProfile.image}
                      alt={activeProfile.imageAlt}
                      title={activeProfile.name}
                      note={`人物肖像图片，来自 public/${activeProfile.image}`}
                      className="rounded-[28px] border border-white/35 bg-white/[0.6] shadow-sm"
                      imgClassName="h-[340px] w-full object-cover"
                      width={1000}
                      height={1200}
                    />
                  </div>
                  <div className="md:col-span-7">
                    <div>
                      <div className="text-sm font-semibold text-[#355b84]">{activeProfile.role}</div>
                      <div className="mt-2 text-lg font-black text-foreground">{activeProfile.identity}</div>
                      <p className="mt-4 text-sm leading-7 text-muted-foreground">{activeProfile.summary}</p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {activeProfile.themeTags.map((tag) => (
                        <span key={tag} className="chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="md:col-span-12">
                  <div className="rounded-[28px] border border-white/35 bg-white/[0.6] p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.05]">
                    <div className="text-sm font-semibold text-[#355b84]">{activeProfile.role}</div>
                    <div className="mt-2 text-lg font-black text-foreground">{activeProfile.identity}</div>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">{activeProfile.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {activeProfile.themeTags.map((tag) => (
                        <span key={tag} className="chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div className="md:col-span-12">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {activeProfile.highlights.map((item) => (
                    <div key={item} className="rounded-[22px] border border-white/35 bg-white/[0.64] p-4 text-sm leading-7 text-foreground shadow-sm dark:border-white/10 dark:bg-white/[0.05]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-12">
                <div className="flex flex-wrap gap-3">
                  {activeProfile.externalLinks.map((link) => (
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

          <aside className="surface-card self-start rounded-[34px] p-6">
            <div className="mb-5 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#355b84]" />
              <h2 className="text-xl font-black text-foreground">设计精神</h2>
            </div>
            <div className="space-y-3">
              {activeProfile.spirit.map((item) => (
                <div key={item} className="rounded-[22px] border border-white/35 bg-white/[0.64] px-4 py-3.5 text-sm font-semibold text-foreground shadow-sm dark:border-white/10 dark:bg-white/[0.05]">
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[24px] border border-white/35 bg-white/[0.6] p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.05]">
              <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">所属专题</div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{activeSection.label}</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{activeSection.insightBody}</p>
            </div>
          </aside>
        </section>

        <article className="surface-card self-start rounded-[34px] p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Hammer className="h-5 w-5 text-[#355b84]" />
            <h2 className="text-2xl font-black text-foreground">创意人物成长时间线</h2>
          </div>
          <div className="space-y-4">
            {activeProfile.timeline.map((item) => (
              <div key={item.label} className="story-rail-item">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#355b84]">{item.label}</div>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <section className="surface-card rounded-[34px] p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Stars className="h-5 w-5 text-[#355b84]" />
            <h2 className="text-2xl font-black text-foreground">相关设计素材</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {activeProfile.relatedCategories.map((category) => (
              <button
                  key={category}
                  type="button"
                  onClick={() => navigate(`/architecture/${category}`)}
                  className="premium-button-glass inline-flex items-center gap-2 !px-5 !py-2.5 text-sm"
                >
                  查看 {categoryMap[category] ?? category}
                </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

