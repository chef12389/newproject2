export type CategoryId =
  | 'minju'
  | 'huanggong'
  | 'guanfu'
  | 'qiaoliang'
  | 'shangye'
  | 'jiaoyu'
  | 'lingmu'
  | 'gonggong'
  | 'yuanlin'
  | 'zongjiao'

// 导入扩展案例数据
import { extendedCases } from './architectureDataExtended'

const REMOVED_CATEGORY_IDS = new Set<CategoryId>(['lingmu', 'zongjiao'])

export interface SourceReference {
  label: string
  publisher: string
  url: string
}

export interface FactMetric {
  label: string
  value: string
  detail: string
}

export interface CaseStudy {
  id: string
  name: string
  categoryId: CategoryId
  dynasty: string
  year: string
  eraBucket: '先秦' | '秦汉隋唐' | '宋元' | '明' | '清' | '近现代'
  location: string
  province: string
  region: string
  image: string
  summary: string
  sourceScope: string
  innovations: string[]
  facts: FactMetric[]
  concepts: string[]
  sources: SourceReference[]
  heritageTags?: string[]
  featured?: boolean
}

export interface StructureLayer {
  name: string
  summary: string
  role: string
}

export interface EvolutionStage {
  era: string
  focus: string
  description: string
}

export interface CategoryData {
  id: CategoryId
  name: string
  english: string
  tagline: string
  summary: string
  image: string
  accent: string
  gradient: string
  sampleCount: number
  span: string
  regionCount: number
  keywords: string[]
  drivers: string[]
  structure: StructureLayer[]
  evolution: EvolutionStage[]
  cases: CaseStudy[]
}

export interface KnowledgeNode {
  id: string
  label: string
  type: 'entry' | 'concept' | 'category' | 'case'
  x: number
  y: number
  summary: string
  links: string[]
  route?: string
  accent: string
}

export interface QuizQuestion {
  id: number
  type: 'single' | 'judge'
  question: string
  options: string[]
  answer: number
  explanation: string
  route?: string
}

export interface MortiseJoint {
  id: number
  name: string
  icon: string
  summary: string
  difficulty: '基础' | '进阶' | '高阶'
  uses: string[]
  steps: string[]
  forceProfile: {
    tensile: number
    shear: number
    seismic: number
  }
  gradient: string
}

export interface PuzzleChallenge {
  id: number
  name: string
  category: CategoryId
  image: string
  pieces: number
  difficulty: '入门' | '标准' | '挑战'
  tip: string
}

export interface LabQuestion {
  id: number
  jointId: number
  question: string
  options: string[]
  answer: number
  explanation: string
}

type CategorySeed = Omit<CategoryData, 'sampleCount' | 'regionCount' | 'cases'>

const s = (label: string, publisher: string, url: string): SourceReference => ({ label, publisher, url })
const f = (label: string, value: string, detail: string): FactMetric => ({ label, value, detail })
const unique = <T,>(items: T[]) => Array.from(new Set(items))

function poster(
  title: string,
  subtitle: string,
  primary: string,
  secondary: string,
  seal: string,
  motif: string,
) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${primary}"/>
        <stop offset="100%" stop-color="${secondary}"/>
      </linearGradient>
      <linearGradient id="panel" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="rgba(255,255,255,0.18)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="900" fill="url(#bg)"/>
    <circle cx="970" cy="170" r="210" fill="rgba(255,255,255,0.08)"/>
    <circle cx="1030" cy="770" r="260" fill="rgba(255,255,255,0.06)"/>
    <path d="M0 670 C220 590 360 770 560 690 C760 610 880 730 1200 620 L1200 900 L0 900 Z" fill="rgba(8,16,32,0.18)"/>
    <rect x="72" y="72" width="1056" height="756" rx="40" fill="rgba(8,18,32,0.12)" stroke="rgba(255,255,255,0.26)" stroke-width="2"/>
    <rect x="112" y="112" width="976" height="676" rx="30" fill="url(#panel)" stroke="rgba(255,255,255,0.12)"/>
    <text x="138" y="182" fill="rgba(255,255,255,0.75)" font-size="28" font-family="'Noto Sans SC','Microsoft YaHei',sans-serif" letter-spacing="10">${seal}</text>
    <text x="138" y="400" fill="#fff" font-size="124" font-weight="700" font-family="'Noto Serif SC','STSong',serif">${title}</text>
    <text x="146" y="474" fill="rgba(255,255,255,0.84)" font-size="36" font-family="'Noto Sans SC','Microsoft YaHei',sans-serif">${subtitle}</text>
    <text x="146" y="586" fill="rgba(255,255,255,0.88)" font-size="24" font-family="'Noto Sans SC','Microsoft YaHei',sans-serif">${motif}</text>
    <path d="M790 262 L980 262 L1048 332 L1048 540 L790 540 Z" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>
    <path d="M830 470 L1000 470 L970 400 L884 366 L830 410 Z" fill="rgba(255,255,255,0.18)"/>
    <path d="M844 404 L970 404" stroke="rgba(255,255,255,0.34)" stroke-width="8" stroke-linecap="round"/>
    <path d="M860 420 L860 520 M904 404 L904 520 M948 404 L948 520" stroke="rgba(255,255,255,0.24)" stroke-width="6" stroke-linecap="round"/>
  </svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const posters = {
  hongcun: poster('宏村', '水系与聚落彼此嵌合', '#2f5d62', '#ac8258', '徽州聚落', 'SETTLEMENT / WATER / COURTYARD'),
  wangjia: poster('王家大院', '商帮家族的院落群像', '#5b4132', '#b86a43', '晋商宅院', 'CLAN / COURTYARD / STREET'),
  daxilan: poster('大栅栏', '街巷与店铺共同构成商业界面', '#70472d', '#d29f35', '城市商业', 'SHOP / ALLEY / MEMORY'),
  rishengchang: poster('日升昌票号', '金融秩序写进空间门面', '#7a3c31', '#d4a25b', '票号建筑', 'TRADE / TRUST / FACADE'),
  guozijian: poster('国子监', '礼制与教学合并在一条轴线上', '#315570', '#b08a46', '最高学府', 'RITUAL / TEACHING / AXIS'),
  yuelu: poster('岳麓书院', '书院空间承接千年讲学传统', '#3b5d48', '#b18d54', '书院文脉', 'ACADEMY / LECTURE / HILL'),
  bailudong: poster('白鹿洞书院', '从山林讲学到制度化教育', '#486457', '#c0905e', '书院谱系', 'LEARNING / ORDER / LEGACY'),
  mingxiaoling: poster('明孝陵', '陵寝被拉长为完整纪念地景', '#4d3a61', '#b1855c', '山陵纪念', 'MEMORIAL / AXIS / LANDSCAPE'),
  qingdongling: poster('清东陵', '皇家葬制与山水选址的合体', '#344968', '#9e8157', '皇家陵寝', 'MAUSOLEUM / CEREMONY / SITE'),
  tiantan: poster('天坛', '礼仪场所被放大为公共地景', '#32567a', '#d7a752', '祭天礼制', 'RITUAL / PUBLIC / COSMOS'),
  gulou: poster('钟鼓楼', '时间制度成为城市公共标识', '#4b4e6e', '#d39d55', '城市地标', 'TIME / CITY / MEMORY'),
  yiheyuan: poster('颐和园', '山水、建筑与游览路线协同展开', '#355d69', '#cf9b56', '皇家园林', 'GARDEN / ROUTE / VIEW'),
  zhuozhengyuan: poster('拙政园', '借景与分景共同组织游园节奏', '#3c654f', '#c59a60', '私家园林', 'GARDEN / SCENE / WATER'),
  liuyuan: poster('留园', '空间转折制造层层递进的观景体验', '#506047', '#d2a35c', '园林构景', 'SPACE / FRAMING / WALK'),
  xuankongsi: poster('悬空寺', '危崖与木构共同形成信仰视觉', '#45404f', '#d39f57', '山崖寺观', 'CLIFF / TIMBER / BELIEF'),
  dayanta: poster('大雁塔', '塔体成为城市与佛教传播的坐标', '#70493d', '#d4a260', '佛塔地标', 'PAGODA / CITY / AXIS'),
  yingxian: poster('应县木塔', '纯木结构把垂直尺度推到极致', '#5b4a39', '#c88d50', '木塔样本', 'TIMBER / HEIGHT / STABILITY'),
  chengyang: poster('程阳永济桥', '桥、廊、亭合并为一体化公共构筑', '#4e5c63', '#c4954f', '风雨桥', 'BRIDGE / COMMUNITY / TIMBER'),
}

const casesByCategory: Record<CategoryId, CaseStudy[]> = {
  huanggong: [
    {
      id: 'gugong',
      name: '北京故宫',
      categoryId: 'huanggong',
      dynasty: '明清',
      year: '1420 年建成，明清两代持续使用',
      eraBucket: '明',
      location: '北京',
      province: '北京市',
      region: '华北',
      image: 'images/huanggong/beijing_gugong.jpg',
      summary: '故宫把中轴、台基、院落层层推进，形成最完整的皇家礼制空间样本。',
      sourceScope: '以故宫博物院与 UNESCO 公布信息为基础，强调中轴秩序、院落层级和木构体量。',
      innovations: ['以三大殿为轴心组织国家礼仪', '台基、门阙、殿宇共同放大等级感', '院落序列让政治秩序被直接看见'],
      facts: [
        f('建成时间', '1420 年', '故宫在永乐年间建成，之后成为明清皇宫。'),
        f('空间特征', '中轴推进', '从午门到太和殿形成极强的秩序性递进。'),
        f('观察重点', '院落层级', '礼制并非抽象概念，而是通过门、台、殿逐层展开。'),
      ],
      concepts: ['中轴', '礼制', '大木作', '世界遗产'],
      sources: [
        s('故宫博物院', '故宫博物院', 'https://www.dpm.org.cn/'),
        s('世界遗产条目', 'UNESCO World Heritage Centre', 'https://whc.unesco.org/en/list/439/'),
      ],
      heritageTags: ['世界文化遗产'],
      featured: true,
    },
    {
      id: 'shenyang',
      name: '沈阳故宫',
      categoryId: 'huanggong',
      dynasty: '清初',
      year: '1625 年始建，后续扩建',
      eraBucket: '清',
      location: '辽宁沈阳',
      province: '辽宁省',
      region: '东北',
      image: 'images/huanggong/shenyang_gugong.jpeg',
      summary: '沈阳故宫保留了清初政治结构与居住空间并置的格局，是观察宫殿体系转型的重要样本。',
      sourceScope: '依据沈阳故宫博物院和 UNESCO 信息，突出其在清初制度与空间样式上的过渡性。',
      innovations: ['宫殿与八旗政治空间并置', '高台宫殿强化统治形象', '清初礼制尚未完全定型，布局更具过渡感'],
      facts: [
        f('起建时间', '1625 年', '清政权入关前在盛京建设的皇宫。'),
        f('空间气质', '多核布局', '与北京故宫的轴线纯度相比，沈阳故宫更强调复合功能。'),
        f('阅读方式', '过渡样本', '适合拿来对照北京故宫，观察制度如何走向成熟。'),
      ],
      concepts: ['宫殿', '高台', '政治空间', '世界遗产'],
      sources: [
        s('沈阳故宫博物院', '沈阳故宫博物院', 'https://www.sypm.org.cn/'),
        s('世界遗产条目', 'UNESCO World Heritage Centre', 'https://whc.unesco.org/en/list/439/'),
      ],
      heritageTags: ['世界文化遗产'],
      featured: true,
    },
    {
      id: 'nanjingming',
      name: '南京明故宫遗址',
      categoryId: 'huanggong',
      dynasty: '明初',
      year: '1366 年始建，后成为北京宫城规划参照',
      eraBucket: '明',
      location: '江苏南京',
      province: '江苏省',
      region: '华东',
      image: 'images/huanggong/nanjing_minggugong.jpg',
      summary: '南京明故宫虽然以遗址形态存续，但它是理解明代宫城规划逻辑的关键一站。',
      sourceScope: '采用南京文旅公开介绍，强调其历史位置和对后续宫殿规划的影响。',
      innovations: ['都城宫殿与城池系统一体规划', '早期明代礼制在此形成原型', '遗址状态更适合从城市尺度理解宫殿'],
      facts: [
        f('历史角色', '明初皇宫', '朱元璋定都应天后建设的核心宫殿区。'),
        f('观察重点', '城市尺度', '相比完整宫殿，更适合从整体格局理解都城逻辑。'),
        f('延续影响', '规划蓝本', '北京宫城的许多组织方式都能在这里找到源头。'),
      ],
      concepts: ['宫城', '都城', '遗址', '明代规划'],
      sources: [s('南京文旅', '南京市文化和旅游局', 'https://wlj.nanjing.gov.cn/')],
      featured: true,
    },
    {
      id: 'tangmingtang',
      name: '大明宫',
      categoryId: 'huanggong',
      dynasty: '唐',
      year: '634 年始建，唐代政治中心',
      eraBucket: '秦汉隋唐',
      location: '陕西西安',
      province: '陕西省',
      region: '西北',
      image: 'images/huanggong/daminggong.jpg',
      summary: '大明宫是唐代最宏伟的宫殿建筑群，其规模超越北京故宫，展现盛唐气象。',
      sourceScope: '依据大明宫国家遗址公园公开信息，强调唐代宫殿的宏伟尺度与礼制体系。',
      innovations: ['前朝后寝格局成熟', '大规模夯土台基营造气势', '中轴线贯穿南北长达3公里'],
      facts: [
        f('占地规模', '约3.5平方公里', '是北京故宫的4.5倍，体现唐代宫殿的宏伟。'),
        f('建筑特色', '含元殿前朝', '含元殿面阔11间，体现唐代大木作成就。'),
        f('历史意义', '唐代政治中心', '是唐代帝国的权力象征和礼仪中心。'),
      ],
      concepts: ['唐宫', '台基', '中轴', '前朝后寝'],
      sources: [s('大明宫国家遗址公园', '大明宫国家遗址公园', 'http://www.dmgpark.com/')],
      featured: true,
    },
    {
      id: 'weiyanggong',
      name: '汉长安城未央宫',
      categoryId: 'huanggong',
      dynasty: '汉',
      year: '前200 年始建，西汉皇宫',
      eraBucket: '秦汉隋唐',
      location: '陕西西安',
      province: '陕西省',
      region: '西北',
      image: 'images/huanggong/weiyanggong.jpg',
      summary: '未央宫是汉代最具代表性的宫殿，开创了中国宫殿建筑的诸多先例。',
      sourceScope: '采用汉长安城遗址公园资料，强调汉代宫殿的初创性特征。',
      innovations: ['前殿后室布局初现', '大型夯土台基技术成熟', '宫殿与城郭关系确立'],
      facts: [
        f('建筑特点', '多宫殿组合', '由40多座宫殿组成，形成庞大的宫殿群。'),
        f('历史地位', '西汉政治中心', '是西汉皇帝朝会、居住、处理政务的主要场所。'),
        f('结构特点', '高台建筑', '主要宫殿建在高台上，体现等级与威严。'),
      ],
      concepts: ['汉宫', '夯土', '宫殿群', '西汉'],
      sources: [s('汉长安城遗址公园', '汉长安城遗址公园', 'http://www.hancangcheng.com/')],
    },
    {
      id: 'qinshi',
      name: '秦咸阳宫',
      categoryId: 'huanggong',
      dynasty: '秦',
      year: '前350 年始建，秦始皇统一六国后扩建',
      eraBucket: '秦汉隋唐',
      location: '陕西咸阳',
      province: '陕西省',
      region: '西北',
      image: 'images/huanggong/xianyanggong.jpg',
      summary: '咸阳宫是秦代的主要宫殿，体现了秦国统一天下的雄心与建筑技术。',
      sourceScope: '依据秦咸阳城考古资料，强调秦代宫殿的气势与统一特征。',
      innovations: ['多宫相连形成庞大宫殿群', '高台建筑技术成熟', '宫殿与都城规划一体化'],
      facts: [
        f('建筑规模', '多宫组合', '包括渭水南北宫殿群，规模宏大。'),
        f('建筑特色', '高台宫殿', '主要宫殿建在高台之上，体现秦人崇尚高处的观念。'),
        f('历史意义', '秦代权力中心', '是秦王朝的政治、军事、文化中心。'),
      ],
      concepts: ['秦宫', '高台建筑', '都城规划'],
      sources: [s('秦咸阳城遗址', '秦咸阳城遗址博物馆', '')],
    },
    {
      id: 'yuanhuangcheng',
      name: '元大都宫殿',
      categoryId: 'huanggong',
      dynasty: '元',
      year: '1267 年始建，元朝皇宫',
      eraBucket: '宋元',
      location: '北京',
      province: '北京市',
      region: '华北',
      image: 'images/huanggong/yuandadu_gongdian.jpg',
      summary: '元大都宫殿确立了北京作为帝都的格局，为明清故宫奠定了基础。',
      sourceScope: '采用元大都考古资料，强调元代宫殿对后世的影响。',
      innovations: ['确立北京中轴线格局', '宫殿与湖泊（太液池）结合', '草原文化与传统宫殿融合'],
      facts: [
        f('规划特色', '三重城墙', '大内、皇城、外城三重格局。'),
        f('建筑布局', '前朝后市', '确立中国传统都城的基本格局。'),
        f('历史影响', '明清故宫蓝本', '为明清北京皇宫提供了规划基础。'),
      ],
      concepts: ['元宫', '都城规划', '中轴'],
      sources: [s('元大都遗址', '元大都城垣遗址公园', '')],
    },
  ],
  minju: [
    {
      id: 'siheyuan',
      name: '北京四合院',
      categoryId: 'minju',
      dynasty: '明清成熟',
      year: '明清以来长期延续',
      eraBucket: '清',
      location: '北京',
      province: '北京市',
      region: '华北',
      image: 'images/minju/beijing_siheyuan.jpg',
      summary: '四合院不是单纯的住宅类型，而是一套把家族秩序写进院落关系的生活空间系统。',
      sourceScope: '依据北京政府公开介绍，重点展示门序、正房与院落层次的关系。',
      innovations: ['门序承担身份识别', '正房、厢房、倒座构成稳定秩序', '院落把生活与礼法缝合在一起'],
      facts: [
        f('关键入口', '门与影壁', '进入方式先决定了院落的私密性与身份感。'),
        f('核心空间', '正房居中', '居住等级通过朝向与位置直接表达。'),
        f('观看方法', '先看边界', '四合院要先读门、墙、院，再读建筑单体。'),
      ],
      concepts: ['院落', '门序', '家族秩序'],
      sources: [s('北京传统民居介绍', '北京市人民政府', 'https://www.beijing.gov.cn/')],
      featured: true,
    },
    {
      id: 'hongcun',
      name: '宏村',
      categoryId: 'minju',
      dynasty: '明清',
      year: '现存格局主要形成于明清时期',
      eraBucket: '明',
      location: '安徽黄山黟县',
      province: '安徽省',
      region: '华东',
      image: 'images/minju/hongcun.jpg',
      summary: '宏村最强的价值不在单栋民居，而在水系、街巷与院落共同构成的聚落系统。',
      sourceScope: '采用 UNESCO 世界遗产描述，强调"聚落与完整水系统"的整体性。',
      innovations: ['水系直接参与聚落组织', '街巷与建筑密切缝合', '乡村尺度同样能建立精密空间秩序'],
      facts: [
        f('核心价值', '聚落整体性', '宏村要放在整个村落系统里看，而不是单看一栋房屋。'),
        f('空间线索', '水系穿村', '水圳把生产、生活与景观连到一起。'),
        f('研究入口', '聚落与民居一体', '它比四合院更适合研究"群体如何塑造空间"。'),
      ],
      concepts: ['聚落', '水系', '世界遗产'],
      sources: [s('世界遗产条目', 'UNESCO World Heritage Centre', 'https://whc.unesco.org/en/list/1002')],
      heritageTags: ['世界文化遗产'],
      featured: true,
    },
    {
      id: 'tulou',
      name: '福建土楼',
      categoryId: 'minju',
      dynasty: '明清成熟',
      year: '15 至 20 世纪持续建造',
      eraBucket: '清',
      location: '福建龙岩、漳州',
      province: '福建省',
      region: '华南',
      image: 'images/minju/fujian_tulou.jpg',
      summary: '土楼把防御、家族共居与日常生活压缩到单体建筑里，是民居类型里最强烈的"整体机器"。',
      sourceScope: '依据 UNESCO 信息，关注土楼的集体居住逻辑与材料策略。',
      innovations: ['单体建筑承担社区功能', '夯土外壳强化防御和稳定性', '圆形或方形平面提高内部组织效率'],
      facts: [
        f('组织方式', '共居系统', '土楼内部是围合而稳定的家族生活结构。'),
        f('材料策略', '夯土外墙', '材料和结构被直接用来服务安全与耐久。'),
        f('理解重点', '单体即社区', '与普通民居不同，土楼本身就是完整社区。'),
      ],
      concepts: ['夯土', '防御', '共居', '世界遗产'],
      sources: [s('世界遗产条目', 'UNESCO World Heritage Centre', 'https://whc.unesco.org/en/list/1113')],
      heritageTags: ['世界文化遗产'],
      featured: true,
    },
    {
      id: 'wangjia',
      name: '王家大院',
      categoryId: 'minju',
      dynasty: '明清',
      year: '家族宅院持续营建数百年',
      eraBucket: '清',
      location: '山西晋中灵石',
      province: '山西省',
      region: '华北',
      image: 'images/minju/wangjiadayuan.jpg',
      summary: '王家大院把"院落"从住宅单位放大为连续街区，适合观察大体量宅院如何生长。',
      sourceScope: '采用山西公开旅游资料，强调其宅院群而非单院价值。',
      innovations: ['大尺度院落群并置', '家族扩张驱动空间生长', '宅院群呈现出街区化趋势'],
      facts: [
        f('识别重点', '不是一进院', '它更像由多组院落拼接成的住宅街区。'),
        f('空间逻辑', '由家族扩展驱动', '院落增殖反映了家族组织与财富积累。'),
        f('适合比较', '与四合院对照', '能看出单院秩序如何被放大成群体秩序。'),
      ],
      concepts: ['院落群', '家族', '晋商'],
      sources: [s('山西文旅', '山西省文化和旅游厅', 'https://wlt.shanxi.gov.cn/')],
    },
    {
      id: 'qiaojiadayuan',
      name: '乔家大院',
      categoryId: 'minju',
      dynasty: '清',
      year: '清代中期始建，持续扩建',
      eraBucket: '清',
      location: '山西晋中祁县',
      province: '山西省',
      region: '华北',
      image: 'images/minju/qiaojiadayuan.jpg',
      summary: '乔家大院是晋商宅院的代表，以精美的木雕、砖雕、石雕闻名，展现清代晋商的财富与品位。',
      sourceScope: '依据乔家大院景区资料，强调晋商宅院的装饰艺术与空间组织。',
      innovations: ['三路五进严谨布局', '三雕艺术达到高峰', '院落功能分区明确'],
      facts: [
        f('建筑规模', '占地8725平方米', '由6个大院、20个小院、313间房屋组成。'),
        f('艺术特色', '三雕艺术', '木雕、砖雕、石雕精美绝伦，工艺精湛。'),
        f('文化价值', '晋商文化', '体现晋商家族的财富积累与商业理念。'),
      ],
      concepts: ['晋商宅院', '三雕艺术', '清代民居'],
      sources: [s('乔家大院', '乔家大院景区', 'http://www.qiaojiadayuan.com/')],
      featured: true,
    },
    {
      id: 'xidi',
      name: '西递',
      categoryId: 'minju',
      dynasty: '明清',
      year: '明清时期形成村落格局',
      eraBucket: '明',
      location: '安徽黄山黟县',
      province: '安徽省',
      region: '华东',
      image: 'images/minju/xidi.jpg',
      summary: '西递与宏村同为徽州古村落的代表，以精湛的砖雕、木雕和石雕艺术闻名。',
      sourceScope: '采用 UNESCO 世界遗产描述，强调徽州民居的装饰艺术特色。',
      innovations: ['徽派建筑装饰艺术高峰', '宅院与街巷系统高度组织', '砖石木三雕工艺精湛'],
      facts: [
        f('村落特色', '徽派建筑', '白墙黛瓦，马头墙，是徽派建筑的典型特征。'),
        f('艺术成就', '三雕艺术', '砖雕、石雕、木雕遍布宅院各处。'),
        f('空间组织', '街巷系统', '村落以街道为骨架，宅院沿街分布。'),
      ],
      concepts: ['徽派建筑', '三雕艺术', '世界遗产'],
      sources: [s('世界遗产条目', 'UNESCO World Heritage Centre', 'https://whc.unesco.org/en/list/1002')],
      heritageTags: ['世界文化遗产'],
    },
    {
      id: 'kaipingdiaolou',
      name: '开平碉楼',
      categoryId: 'minju',
      dynasty: '近代',
      year: '20世纪上半叶大量建造',
      eraBucket: '近现代',
      location: '广东江门开平',
      province: '广东省',
      region: '华南',
      image: 'images/minju/kaipingdiaolou.jpg',
      summary: '开平碉楼是华侨文化与传统民居融合的产物，集防卫、居住于一体。',
      sourceScope: '依据 UNESCO 资料，强调碉楼的文化融合与防御功能。',
      innovations: ['中西建筑风格融合', '多层防御体系', '华侨文化与传统建筑结合'],
      facts: [
        f('建筑特色', '中西合璧', '融合中国传统建筑与西方建筑风格。'),
        f('功能定位', '防御与居住', '碉楼兼具防御盗匪和日常居住功能。'),
        f('历史背景', '华侨文化', '反映侨乡建筑文化特色。'),
      ],
      concepts: ['侨乡建筑', '防御', '中西合璧', '世界遗产'],
      sources: [s('世界遗产条目', 'UNESCO World Heritage Centre', 'https://whc.unesco.org/en/list/1112')],
      heritageTags: ['世界文化遗产'],
    },
    {
      id: 'zhujiajian',
      name: '诸暨古民居群',
      categoryId: 'minju',
      dynasty: '明清',
      year: '明清时期建造',
      eraBucket: '明',
      location: '浙江绍兴诸暨',
      province: '浙江省',
      region: '华东',
      image: 'images/minju/zhuji_minju.jpg',
      summary: '诸暨古民居群展现了江南地区传统民居的精致与优雅。',
      sourceScope: '采用诸暨文旅资料，强调江南民居的特色。',
      innovations: ['江南民居特色', '水乡建筑', '木雕艺术精湛'],
      facts: [
        f('建筑特色', '江南民居', '白墙黛瓦，临水而建。'),
        f('工艺特色', '木雕艺术', '梁架、门窗木雕精美。'),
        f('环境关系', '水乡环境', '建筑与水系紧密结合。'),
      ],
      concepts: ['江南民居', '水乡建筑', '木雕'],
      sources: [s('诸暨文旅', '诸暨文旅', '')],
    },
  ],
  guanfu: [
    {
      id: 'pingyaoxianya',
      name: '平遥县衙',
      categoryId: 'guanfu',
      dynasty: '明清',
      year: '现存格局主要形成于明清',
      eraBucket: '清',
      location: '山西晋中平遥',
      province: '山西省',
      region: '华北',
      image: 'images/guanfu/pingyao_xianya.jpeg',
      summary: '县衙的价值在于把行政、审判、礼仪和后勤压缩进一条清晰的院落流程里。',
      sourceScope: '依据平遥县衙公开资料，重点展示"前堂后宅、功能分层"的治理空间逻辑。',
      innovations: ['仪门控制进入秩序', '六房与大堂构成功能骨架', '办公流程通过院落关系被可视化'],
      facts: [
        f('核心看点', '流程空间化', '从进入到审案再到后勤，每一步都有明确空间位置。'),
        f('结构方式', '多进院落', '官署用连续院落把权力流程串起来。'),
        f('阅读建议', '先看门再看堂', '入口控制是理解官府建筑的第一步。'),
      ],
      concepts: ['官署', '院落', '仪门'],
      sources: [s('平遥县人民政府', '平遥县人民政府', 'https://www.pingyao.gov.cn/')],
      featured: true,
    },
    {
      id: 'huangqinwangfu',
      name: '恭王府',
      categoryId: 'guanfu',
      dynasty: '清',
      year: '乾隆时期始建，后成为恭亲王府邸',
      eraBucket: '清',
      location: '北京',
      province: '北京市',
      region: '华北',
      image: 'images/huanggong/gongwangfu.jpg',
      summary: '恭王府是清代规模最大、保存最完整的王府，被称为"一座恭王府，半部清代史"。',
      sourceScope: '依据恭王府博物馆资料，强调王府作为"小皇宫"的礼制特征。',
      innovations: ['中轴严格遵循王府等级', '园林与建筑巧妙结合', '兼具居住与办公功能'],
      facts: [
        f('占地规模', '约6万平方米', '是清代王公府邸中规模最大者。'),
        f('建筑布局', '三路五进', '严格遵循清制王府等级标准。'),
        f('园林特色', '萃锦园', '王府后花园融合了北方与南方园林特色。'),
      ],
      concepts: ['王府', '清代宅第', '园林', '等级制度'],
      sources: [s('恭王府博物馆', '恭王府博物馆', 'https://www.pgm.org.cn/')],
      featured: true,
    },
    {
      id: 'zhilizongdushu',
      name: '直隶总督署',
      categoryId: 'guanfu',
      dynasty: '清代',
      year: '清代省级官署样本',
      eraBucket: '清',
      location: '河北保定',
      province: '河北省',
      region: '华北',
      image: 'images/guanfu/baoding.jpeg',
      summary: '直隶总督署让官署尺度从县级跃升到省级，三路并置的格局更能体现层级治理。',
      sourceScope: '采用河北公开文博资料，重点强调其空间规模与多轴并置特征。',
      innovations: ['中路组织权力中心', '东西路承担辅助功能', '省级官署尺度显著扩大'],
      facts: [
        f('级别差异', '省级官署', '与县衙相比，这里更强调多系统协作。'),
        f('看点', '三路并置', '不是单一轴线，而是多组功能线同时展开。'),
        f('观察方法', '从总体再到单院', '先读总体分区，再读局部礼制。'),
      ],
      concepts: ['官署', '多轴', '行政等级'],
      sources: [s('河北省文物局', '河北省文物局', 'https://wenwu.hebei.gov.cn/')],
      featured: true,
    },
    {
      id: 'kaifengfu',
      name: '开封府遗址陈列区',
      categoryId: 'guanfu',
      dynasty: '宋以后演化',
      year: '以北宋官署记忆为核心重建展示',
      eraBucket: '宋元',
      location: '河南开封',
      province: '河南省',
      region: '华中',
      image: 'images/guanfu/kaifengfuya.jpeg',
      summary: '开封府更适合从制度记忆和城市地位去理解，它提醒我们官府建筑往往和都城结构紧密相连。',
      sourceScope: '采用开封公开文旅资料，作为官署与城市关系的补充样本。',
      innovations: ['官署与都城生活高度耦合', '政治记忆被持续转化为城市地标', '适合对照地方官署的差异'],
      facts: [
        f('研究入口', '官署与城市', '不仅要看院落，还要看它在城市中的位置。'),
        f('识别重点', '制度象征', '开封府的价值很大程度来自历史叙事与城市认知。'),
        f('比较对象', '平遥县衙', '可对比地方治理与都城行政的空间差异。'),
      ],
      concepts: ['官署', '都城', '制度记忆'],
      sources: [s('开封市文化广电和旅游局', '开封市文化广电和旅游局', 'https://lyj.kaifeng.gov.cn/')],
    },
    {
      id: 'liangdaifu',
      name: '梁家大院',
      categoryId: 'guanfu',
      dynasty: '清',
      year: '清代建造',
      eraBucket: '清',
      location: '山西运城',
      province: '山西省',
      region: '华北',
      image: 'images/guanfu/liangjiadayuan.jpg',
      summary: '梁家大院是晋商宅院与官署功能的结合，展现晋商的政治参与。',
      sourceScope: '采用山西文旅资料，强调晋商与官场的互动关系。',
      innovations: ['宅院兼具官署功能', '晋商政治参与', '空间功能复合'],
      facts: [
        f('建筑特色', '官宅合一', '兼具居住与官署功能。'),
        f('空间组织', '多进院落', '院落布局严谨。'),
        f('文化背景', '晋商政治', '反映晋商的政治地位。'),
      ],
      concepts: ['官宅', '晋商', '复合功能'],
      sources: [s('山西文旅', '山西省文化和旅游厅', 'https://wlt.shanxi.gov.cn/')],
    },



  ],
  qiaoliang: [
    {
      id: 'zhaozhouqiao',
      name: '赵州桥',
      categoryId: 'qiaoliang',
      dynasty: '隋',
      year: '595 至 605 年间建成',
      eraBucket: '秦汉隋唐',
      location: '河北赵县',
      province: '河北省',
      region: '华北',
      image: 'images/qiaoliang/zhaozhouqiao.jpg',
      summary: '赵州桥是桥梁类别里的"结构公开课"，减重、泄洪与跨越能力在一个形体中同时出现。',
      sourceScope: '依据石家庄政府公开介绍，强调敞肩拱的结构逻辑与工程效率。',
      innovations: ['敞肩券减轻自重并疏导洪水', '大跨单孔提高通行效率', '工程美感直接来自受力逻辑'],
      facts: [
        f('核心结构', '敞肩拱', '桥体两侧的小拱并不是装饰，而是减重与泄洪策略。'),
        f('观察方式', '先看拱线', '桥梁要从受力路径开始读，不是先看表面细节。'),
        f('知识价值', '结构与美统一', '赵州桥最适合拿来理解工程美学。'),
      ],
      concepts: ['拱券', '受力', '水文'],
      sources: [s('石家庄市人民政府', '石家庄市人民政府', 'https://www.sjz.gov.cn/')],
      featured: true,
    },
    {
      id: 'lugouqiao',
      name: '卢沟桥',
      categoryId: 'qiaoliang',
      dynasty: '金元明清沿用',
      year: '始建于金代，后续多次修缮',
      eraBucket: '宋元',
      location: '北京丰台',
      province: '北京市',
      region: '华北',
      image: 'images/qiaoliang/lugouqiao.jpg',
      summary: '卢沟桥让桥梁从单纯跨越设施转向城市门户和历史记忆载体。',
      sourceScope: '综合北京文博公开资料，强调桥梁与城市道路、历史事件之间的联系。',
      innovations: ['桥梁同时承担交通与城市标识', '望柱石狮强化识别度', '桥体成为进入都城的重要界面'],
      facts: [
        f('空间角色', '城市入口', '卢沟桥与城门、道路共同构成北京西南方向的门户。'),
        f('识别要点', '桥面与望柱', '其视觉记忆不仅来自桥体，也来自栏杆系统。'),
        f('观看建议', '从路径看桥', '它是交通系统的一部分，不宜脱离道路单独看。'),
      ],
      concepts: ['城市门户', '石桥', '历史记忆'],
      sources: [s('北京市文物局', '北京市文物局', 'https://wwj.beijing.gov.cn/')],
      featured: true,
    },
    {
      id: 'chengyangqiao',
      name: '程阳永济桥（风雨桥）',
      categoryId: 'qiaoliang',
      dynasty: '近现代延续传统',
      year: '20 世纪前期建成，延续风雨桥工艺',
      eraBucket: '近现代',
      location: '广西柳州三江',
      province: '广西壮族自治区',
      region: '西南',
      image: 'images/qiaoliang/chengyang_yongjiqiao.jpg',
      summary: '风雨桥把桥、廊、亭合并成公共空间，提醒我们桥梁也可以是社区生活的中心。',
      sourceScope: '采用柳州公开文旅资料，突出侗族风雨桥的公共性与木构表达。',
      innovations: ['桥上可停留而非只通行', '木构与廊亭结合增强社区属性', '跨越设施与公共空间合体'],
      facts: [
        f('类型特征', '桥上有廊亭', '风雨桥最重要的不是跨度，而是停留与交流。'),
        f('材料表达', '木构体系', '结构节点决定了桥上空间的节奏与表情。'),
        f('比较价值', '对照赵州桥', '一个强调石拱效率，一个强调社区公共性。'),
      ],
      concepts: ['风雨桥', '木构', '公共空间'],
      sources: [s('柳州市人民政府', '柳州市人民政府', 'https://www.liuzhou.gov.cn/')],
      featured: true,
    },
  ],
  shangye: [

    {
      id: 'rishengchang',
      name: '日升昌票号旧址',
      categoryId: 'shangye',
      dynasty: '清代',
      year: '清代票号体系代表',
      eraBucket: '清',
      location: '山西晋中平遥',
      province: '山西省',
      region: '华北',
      image: 'images/shangye/rishengchangpiaohaojiuzhi.jpg',
      summary: '票号建筑把信誉、交易与后勤管理叠加在一组院落中，是商业建筑走向制度化的样本。',
      sourceScope: '采用平遥公开文旅资料，强调金融业务对建筑组织的反向塑造。',
      innovations: ['前店后院强化交易安全', '门面承担品牌识别', '商业流程被转化为院落管理秩序'],
      facts: [
        f('核心关系', '信誉与空间', '商业建筑的可信度往往通过门面、入口和柜台布局建立。'),
        f('空间特征', '前后分区', '营业、接待、账务、住宿并非混在一起。'),
        f('比较对象', '官府院落', '同样是多进院落，但驱动力从权力变成交易。'),
      ],
      concepts: ['票号', '门面', '交易秩序'],
      sources: [s('平遥县人民政府', '平遥县人民政府', 'https://www.pingyao.gov.cn/')],
    },
  ],
  jiaoyu: [
    {
      id: 'guozijian',
      name: '北京国子监',
      categoryId: 'jiaoyu',
      dynasty: '元明清',
      year: '元代建置，明清延续',
      eraBucket: '宋元',
      location: '北京',
      province: '北京市',
      region: '华北',
      image: 'images/jiaoyu/beijing_guozijian.jpg',
      summary: '国子监把教育、礼制与国家秩序绑定在一起，是理解古代教育建筑最直接的入口。',
      sourceScope: '基于北京文旅公开资料，强调其"最高学府"与礼制轴线双重属性。',
      innovations: ['教学空间与礼仪空间并置', '中轴组织强化制度感', '学府建筑直接代表国家教育体系'],
      facts: [
        f('空间关键词', '中轴与讲堂', '教育空间也通过秩序感传达权威。'),
        f('制度属性', '国家学府', '它不仅是读书场所，也是制度装置。'),
        f('看点', '礼学并置', '教育建筑在这里绝不是单纯教室集合。'),
      ],
      concepts: ['学府', '礼制', '中轴'],
      sources: [s('北京文旅', '北京市文化和旅游局', 'https://whlyj.beijing.gov.cn/')],
      featured: true,
    },
    {
      id: 'yuelushuyuan',
      name: '岳麓书院',
      categoryId: 'jiaoyu',
      dynasty: '宋至近现代延续',
      year: '宋代创建，后世延续修缮与使用',
      eraBucket: '宋元',
      location: '湖南长沙',
      province: '湖南省',
      region: '华中',
      image: 'images/jiaoyu/yuelu_shuyuan.jpg',
      summary: '岳麓书院更强调山水环境与讲学传统的结合，它让教育建筑拥有了更强的文化沉淀感。',
      sourceScope: '采用湖南大学与湖南文旅公开信息，强调书院传统的连续性。',
      innovations: ['讲学空间与山体环境紧密联系', '书院秩序更温和但并不松散', '学术传承通过院落逐层展开'],
      facts: [
        f('观察入口', '院落与山体', '书院建筑不能脱离自然环境单独看。'),
        f('核心气质', '讲学延续', '空间的力量来自长期被反复使用。'),
        f('比较方式', '对照国子监', '国子监偏制度，岳麓更偏学术共同体。'),
      ],
      concepts: ['书院', '讲学', '山水'],
      sources: [s('湖南大学岳麓书院', '湖南大学', 'https://yuelu.hnu.edu.cn/')],
      featured: true,
    },
    {
      id: 'bailudong',
      name: '白鹿洞书院',
      categoryId: 'jiaoyu',
      dynasty: '宋代定型',
      year: '宋代形成重要书院格局',
      eraBucket: '宋元',
      location: '江西九江',
      province: '江西省',
      region: '华东',
      image: 'images/jiaoyu/bailu_shuyuan.jpg',
      summary: '白鹿洞书院是"书院作为制度"的典型，它让教育建筑从地方讲学走向明确的组织形式。',
      sourceScope: '采用江西文旅公开资料，作为书院制度化的重要补充样本。',
      innovations: ['书院形成明确教学与祭祀分区', '环境选择服务于持续讲学', '地方教育空间被纳入更稳定的文化秩序'],
      facts: [
        f('制度价值', '书院规范化', '白鹿洞书院适合拿来理解书院如何成为一种稳定类型。'),
        f('空间特征', '教学与纪念并存', '教育建筑同时承担文化记忆。'),
        f('研究意义', '类型谱系', '它能补全国子监与岳麓之间的层次。'),
      ],
      concepts: ['书院', '教育制度', '文化传承'],
      sources: [s('江西文旅', '江西省文化和旅游厅', 'https://dct.jiangxi.gov.cn/')],
    },
    {
      id: 'jiangnayamen',
      name: '江南贡院',
      categoryId: 'jiaoyu',
      dynasty: '明清',
      year: '明清科举考场',
      eraBucket: '清',
      location: '江苏南京',
      province: '江苏省',
      region: '华东',
      image: 'images/jiaoyu/jiangnangongyuan.png',
      summary: '江南贡院是古代规模最大的科举考场，展现科举制度的空间化呈现。',
      sourceScope: '依据江南贡院陈列馆资料，强调科举考场与选拔制度的关系。',
      innovations: ['号舍密集排列', '考场秩序严密', '体现科举制度的公平性'],
      facts: [
        f('考场规模', '超2万间号舍', '是古代最大的科举考场之一。'),
        f('空间特征', '号舍制度', '每个考生一个号舍，空间统一。'),
        f('历史意义', '科举制度', '体现中国古代人才选拔制度。'),
      ],
      concepts: ['贡院', '科举', '考试空间'],
      sources: [s('江南贡院', '江南贡院陈列馆', '')],
      featured: true,
    },
  ],
  lingmu: [
    {
      id: 'mingxiaoling',
      name: '明孝陵',
      categoryId: 'lingmu',
      dynasty: '明',
      year: '明初皇家陵寝代表',
      eraBucket: '明',
      location: '江苏南京',
      province: '江苏省',
      region: '华东',
      image: 'images/lingmu/mingxiaoling.jpg',
      summary: '明孝陵把纪念、山水选址与礼制序列拉成长距离体验，是陵墓建筑地景化的典型。',
      sourceScope: '依据南京文旅与 UNESCO 公开资料，强调神道与山体环境的协同。',
      innovations: ['神道把纪念体验拉长', '陵寝与山体地形彼此借力', '皇家纪念被组织为完整路线'],
      facts: [
        f('观察重点', '路线感', '陵墓建筑最重要的不是一栋主殿，而是整条进入过程。'),
        f('空间特征', '地景化', '建筑被放大到山体与林地尺度。'),
        f('比较入口', '对照宫殿', '一个强调统治展示，一个强调纪念与归葬。'),
      ],
      concepts: ['神道', '山陵', '纪念地景', '世界遗产'],
      sources: [
        s('南京文旅', '南京市文化和旅游局', 'https://wlj.nanjing.gov.cn/'),
        s('世界遗产扩展项目', 'UNESCO World Heritage Centre', 'https://whc.unesco.org/en/list/1004/'),
      ],
      heritageTags: ['世界文化遗产'],
      featured: true,
    },
    {
      id: 'qingdongling',
      name: '清东陵',
      categoryId: 'lingmu',
      dynasty: '清',
      year: '清代皇家陵寝体系',
      eraBucket: '清',
      location: '河北唐山遵化',
      province: '河北省',
      region: '华北',
      image: 'images/lingmu/qingdongling.jpg',
      summary: '清东陵以更大的山水格局承接皇家葬制，是观察清代陵寝制度成熟度的重要样本。',
      sourceScope: '采用河北公开文旅与文博资料，强调陵区系统而非单座陵墓。',
      innovations: ['陵区尺度扩大', '礼仪路线更加完整', '山水选址与皇家秩序高度耦合'],
      facts: [
        f('阅读单位', '整个陵区', '清东陵更适合按陵区系统而非单体建筑理解。'),
        f('核心看点', '礼制成熟', '清代陵寝制度的严密程度在这里更清晰。'),
        f('空间印象', '长距离纪念', '记忆是通过步行与路径被建立的。'),
      ],
      concepts: ['陵区', '纪念', '山水选址'],
      sources: [s('河北省文化和旅游厅', '河北省文化和旅游厅', 'https://whly.hebei.gov.cn/')],
    },
  ],
  gonggong: [
    {
      id: 'tiantan',
      name: '天坛',
      categoryId: 'gonggong',
      dynasty: '明清',
      year: '明代建成，清代增修',
      eraBucket: '明',
      location: '北京',
      province: '北京市',
      region: '华北',
      image: 'images/gonggong/tiantan.jpg',
      summary: '天坛是公共仪式空间的代表，建筑、围墙、林地与路径共同构成宏大的礼仪地景。',
      sourceScope: '依据北京文旅和 UNESCO 资料，突出"仪式场所放大为公共地景"的特点。',
      innovations: ['祭天空间拥有极强象征系统', '开放场地与单体建筑协同表达', '礼仪路线让抽象观念变成身体体验'],
      facts: [
        f('核心体验', '路径与开敞', '天坛要在行走中看，而不是只看祈年殿。'),
        f('空间特征', '围合中的开放', '它既被墙体界定，又保有极强的开敞感。'),
        f('价值理解', '公共礼仪', '公共建筑在这里首先服务共同体仪式。'),
      ],
      concepts: ['祭祀', '公共空间', '世界遗产'],
      sources: [
        s('北京文旅', '北京市文化和旅游局', 'https://whlyj.beijing.gov.cn/'),
        s('世界遗产条目', 'UNESCO World Heritage Centre', 'https://whc.unesco.org/en/list/881/'),
      ],
      heritageTags: ['世界文化遗产'],
      featured: true,
    },
    {
      id: 'zhonggulou',
      name: '北京钟鼓楼',
      categoryId: 'gonggong',
      dynasty: '元明清',
      year: '元代定址，明清沿用',
      eraBucket: '宋元',
      location: '北京',
      province: '北京市',
      region: '华北',
      image: 'images/gonggong/zhonggulou.jpg',
      summary: '钟鼓楼把时间制度固定在城市中轴上，是古代城市公共管理的可见装置。',
      sourceScope: '采用北京文旅公开资料，作为"公共制度空间"的补充案例。',
      innovations: ['时间管理被建筑化', '城市记忆与公共秩序叠合', '单体地标统领周边空间感知'],
      facts: [
        f('功能重点', '报时', '它不仅是景观地标，更是城市运行系统的一部分。'),
        f('城市关系', '中轴坐标', '钟鼓楼与城市结构密切相关。'),
        f('观察方式', '从远景看作用', '它的意义一半在建筑本身，一半在城市定位。'),
      ],
      concepts: ['城市地标', '时间制度', '公共记忆'],
      sources: [s('北京文旅', '北京市文化和旅游局', 'https://whlyj.beijing.gov.cn/')],
    },
  ],
  yuanlin: [
    {
      id: 'yiheyuan',
      name: '颐和园',
      categoryId: 'yuanlin',
      dynasty: '清',
      year: '清代皇家园林体系代表',
      eraBucket: '清',
      location: '北京',
      province: '北京市',
      region: '华北',
      image: 'images/yuanlin/yiheyuan.jpg',
      summary: '颐和园的重点不是某一栋殿堂，而是长廊、山体、水面与视线组织出的游览节奏。',
      sourceScope: '采用颐和园官方公开信息和 UNESCO 条目，强调园林中的路线与借景。',
      innovations: ['山水与建筑共同组织视线', '游览路线被精确设计', '皇家园林把政治与休憩叠加'],
      facts: [
        f('阅读方法', '顺着路线看', '园林不是站定观看，而是不断转场。'),
        f('核心线索', '视线与借景', '景不是自然出现，而是被组织出来的。'),
        f('类型价值', '园林独立成类', '它与宫殿、民居的空间逻辑完全不同。'),
      ],
      concepts: ['借景', '游线', '皇家园林', '世界遗产'],
      sources: [
        s('颐和园', '颐和园管理处', 'https://www.summerpalace-china.com/'),
        s('世界遗产条目', 'UNESCO World Heritage Centre', 'https://whc.unesco.org/en/list/880/'),
      ],
      heritageTags: ['世界文化遗产'],
      featured: true,
    },
    {
      id: 'zhuozhengyuan',
      name: '拙政园',
      categoryId: 'yuanlin',
      dynasty: '明清',
      year: '明代营造，后世持续修整',
      eraBucket: '明',
      location: '江苏苏州',
      province: '江苏省',
      region: '华东',
      image: 'images/yuanlin/zhuozhengyuan.jpg',
      summary: '拙政园把私家园林的空间转折推到很高水平，分景、框景与水面共同制造游园节奏。',
      sourceScope: '依据苏州园林与 UNESCO 公开资料，强调私家园林的空间剪辑能力。',
      innovations: ['借景与分景高度成熟', '建筑量体主动退后服务景观', '步行转折不断重构观者视野'],
      facts: [
        f('核心看点', '分景', '园林的精彩在于"看不完"，而不是一眼看透。'),
        f('空间方式', '曲折游线', '每一次转身都在重新定义场景。'),
        f('比较建议', '对照颐和园', '一个偏皇家开阔，一个偏私家精巧。'),
      ],
      concepts: ['私家园林', '框景', '水面', '世界遗产'],
      sources: [
        s('苏州园林', '苏州市园林和绿化管理局', 'https://ylj.suzhou.gov.cn/'),
        s('世界遗产条目', 'UNESCO World Heritage Centre', 'https://whc.unesco.org/en/list/813/'),
      ],
      heritageTags: ['世界文化遗产'],
      featured: true,
    },
    {
      id: 'liuyuan',
      name: '留园',
      categoryId: 'yuanlin',
      dynasty: '清',
      year: '清代私家园林代表',
      eraBucket: '清',
      location: '江苏苏州',
      province: '江苏省',
      region: '华东',
      image: 'images/yuanlin/liuyuan.jpg',
      summary: '留园特别适合看空间框架如何制造观景节奏，廊、窗、洞门都在主动剪辑视线。',
      sourceScope: '采用苏州园林公开介绍，作为"空间框景"能力的代表样本。',
      innovations: ['洞门与廊道形成连续转场', '建筑外壳成为取景器', '游览体验高度依赖步行节奏'],
      facts: [
        f('识别重点', '框景能力', '园林建筑不是背景，而是主动控制你怎么看。'),
        f('空间气质', '紧凑而丰富', '尺度不大，但体验层次很多。'),
        f('适合用途', '讲解园林入门', '留园很适合展示"空间被怎样编排"。'),
      ],
      concepts: ['游线', '框景', '廊道'],
      sources: [s('苏州园林', '苏州市园林和绿化管理局', 'https://ylj.suzhou.gov.cn/')],
    },
  ],
  zongjiao: [
  ],
}

const seeds: CategorySeed[] = [
  {
    id: 'huanggong',
    name: '皇宫',
    english: 'Palace',
    tagline: '从中轴、台基到大殿序列，权力秩序被写成可见的空间语言',
    summary: '皇宫建筑的重点不只是"宏大"，而是通过门、庭、殿、台把国家礼制逐级展开。它适合从轴线、层级和视觉压迫感三个切口进入。',
    image: 'images/huanggong/huanggong.jpeg',
    accent: '#b73b2f',
    gradient: 'from-red-700 via-orange-500 to-amber-400',
    span: '明清两代最具代表性',
    keywords: ['中轴', '礼制', '大木作', '门阙', '台基'],
    drivers: ['国家礼制', '权力展示', '仪式需求', '都城规划'],
    structure: [
      { name: '轴线骨架', summary: '用一条清晰主轴组织最重要的殿宇与门阙。', role: '先建立秩序，再分配等级。' },
      { name: '院落递进', summary: '通过连续院落控制视线、行走速度与礼仪节奏。', role: '把抽象制度转成身体体验。' },
      { name: '台基放大', summary: '高台和须弥座把建筑从地面抬起，形成权威感。', role: '让宫殿在视觉上脱离日常尺度。' },
    ],
    evolution: [
      { era: '明代', focus: '宫城秩序成型', description: '中轴与大朝空间高度成熟，形成典型宫殿样式。' },
      { era: '清代', focus: '制度与居住并置', description: '礼制稳定后，宫殿更强调生活与政治功能的复合组织。' },
    ],
  },
  {
    id: 'minju',
    name: '民居',
    english: 'Dwelling',
    tagline: '从单个院落到整片聚落，生活秩序通过边界、朝向与共居方式被组织',
    summary: '民居不是单看房子怎么盖，而是看一个家庭或群体如何通过门、墙、院、巷把生活方式稳定下来。它最适合从"生活如何被空间安排"切入。',
    image: 'images/minju/minju.jpeg',
    accent: '#2c7a62',
    gradient: 'from-emerald-700 via-teal-500 to-lime-400',
    span: '明清以来类型最丰富',
    keywords: ['院落', '聚落', '门序', '共居', '边界'],
    drivers: ['家族结构', '气候适应', '材料条件', '地方习俗'],
    structure: [
      { name: '边界系统', summary: '门、墙、影壁先决定了家庭与街巷的关系。', role: '定义生活的私密性与秩序感。' },
      { name: '院落组织', summary: '通过正房、厢房、天井或围屋形成稳定日常。', role: '让居住关系可持续运转。' },
      { name: '群体延展', summary: '当住宅增殖到街巷或村落，空间逻辑会被进一步放大。', role: '把家庭秩序变成聚落秩序。' },
    ],
    evolution: [
      { era: '宋元至明代', focus: '地方类型逐渐定型', description: '不同地域开始形成稳定的院落或聚落样式。' },
      { era: '清代至近现代', focus: '群体居住尺度扩大', description: '大院、土楼、村落系统让民居从单体走向整体。' },
    ],
  },
  {
    id: 'guanfu',
    name: '官府',
    english: 'Administrative',
    tagline: '院落不是为了居住，而是为了把行政流程、礼仪顺序和等级关系排布清楚',
    summary: '官府建筑最值得看的是"流程如何被空间化"。从仪门、大堂到后宅，每一步都对应治理秩序，因此它比民居更强调进入控制和功能串联。',
    image: 'images/guanfu/guanfu.jpeg',
    accent: '#3d5775',
    gradient: 'from-slate-700 via-sky-700 to-cyan-500',
    span: '明清官署体系最完整',
    keywords: ['官署', '仪门', '大堂', '行政', '流程'],
    drivers: ['治理结构', '行政等级', '仪式规范', '办公效率'],
    structure: [
      { name: '入口控制', summary: '门禁和前场决定了谁能走到哪里。', role: '官府首先管理进入秩序。' },
      { name: '堂署骨架', summary: '大堂、二堂、六房等构成功能主框架。', role: '让行政流程有明确位置。' },
      { name: '前公后私', summary: '办公、接待、生活区通常分层安排。', role: '保持权力运行与日常居住的边界。' },
    ],
    evolution: [
      { era: '宋元', focus: '官署流程逐步制度化', description: '衙署空间开始稳定服务行政分工。' },
      { era: '明清', focus: '等级与规模被明确放大', description: '不同级别官署在体量、分区与仪式性上拉开差距。' },
    ],
  },
  {
    id: 'qiaoliang',
    name: '桥梁',
    english: 'Bridge',
    tagline: '桥梁最重要的不是表面装饰，而是跨越、水文与受力如何共同生成形体',
    summary: '桥梁是所有类型里最适合讲"结构逻辑"的一类。读桥要从拱、墩、桥面和水流关系入手，再去看它如何成为景观和公共空间。',
    image: 'images/qiaoliang/qiaoliang.jpeg',
    accent: '#8a6a3e',
    gradient: 'from-stone-700 via-amber-700 to-yellow-500',
    span: '从隋到近现代持续演进',
    keywords: ['拱券', '跨越', '水文', '桥面', '公共性'],
    drivers: ['交通需求', '结构效率', '水文条件', '社区交流'],
    structure: [
      { name: '受力主线', summary: '拱、梁、墩决定桥梁如何把荷载传到地面。', role: '结构逻辑是桥梁的第一语言。' },
      { name: '通行界面', summary: '桥面、栏杆与坡道处理决定桥梁如何被使用。', role: '连接工程性能与日常体验。' },
      { name: '水系应对', summary: '洪水、流速与河岸地形都会反向塑造桥体。', role: '让桥梁和环境成为一个整体。' },
    ],
    evolution: [
      { era: '隋唐', focus: '石拱技术成熟', description: '赵州桥等案例把工程效率推到新高度。' },
      { era: '明清至近现代', focus: '桥梁兼具公共性', description: '风雨桥等类型让桥上空间成为社区活动场所。' },
    ],
  },
  {
    id: 'shangye',
    name: '商业',
    english: 'Commercial',
    tagline: '商业建筑的重点在连续街面、门面识别和人流节奏，而不只在单栋房子',
    summary: '商业建筑必须放回街区与交易行为里看。门面、招牌、入口尺度和步行节奏共同塑造商业界面，因此它最适合从"行走中的视觉识别"切入。',
    image: posters.daxilan,
    accent: '#c3832f',
    gradient: 'from-orange-700 via-amber-500 to-yellow-300',
    span: '明清街区延续到近现代',
    keywords: ['街区', '门面', '招牌', '交易', '流线'],
    drivers: ['人流聚集', '交易信用', '品牌识别', '街区更新'],
    structure: [
      { name: '连续立面', summary: '沿街门面形成高密度视觉信息。', role: '把商业内容主动推向街道。' },
      { name: '前店后院', summary: '营业与后勤常常在一组空间里分层处理。', role: '兼顾展示、交易和安全。' },
    ],
    evolution: [
      { era: '明清', focus: '街市空间稳定', description: '商业街区与店铺门面逐渐形成典型样式。' },
      { era: '近现代', focus: '品牌与街区记忆强化', description: '商业建筑成为城市生活与历史记忆的重要界面。' },
    ],
  },
  {
    id: 'jiaoyu',
    name: '教育',
    english: 'Education',
    tagline: '讲学、祭祀、藏书和制度感并不是分开的，它们在教育建筑里同时发生',
    summary: '教育建筑既要服务学习，也要表达文脉和制度。它常常通过轴线、讲堂、祠祀空间与环境关系，塑造一种稳定而持续的学习秩序。',
    image: posters.guozijian,
    accent: '#305a72',
    gradient: 'from-sky-800 via-cyan-700 to-amber-400',
    span: '宋元以来延续千年',
    keywords: ['书院', '讲堂', '学府', '文脉', '礼学'],
    drivers: ['教育制度', '讲学传统', '文化传承', '礼乐秩序'],
    structure: [
      { name: '教学中心', summary: '讲堂或讲学空间是最核心的使用节点。', role: '让学习活动有明确聚焦点。' },
      { name: '纪念系统', summary: '祠祀、碑刻与牌匾强化文脉与身份。', role: '把教育空间转化为文化记忆场所。' },
      { name: '环境支撑', summary: '院落、山体、水面常被纳入整体阅读。', role: '让学习空间更具沉浸感和持续性。' },
    ],
    evolution: [
      { era: '宋代', focus: '书院崛起', description: '地方讲学空间开始形成稳定类型。' },
      { era: '元明清', focus: '国家学府与书院并行', description: '教育建筑同时承担制度与学术两套任务。' },
    ],
  },
  {
    id: 'lingmu',
    name: '陵墓',
    english: 'Mausoleum',
    tagline: '建筑、神道与山水一起构成纪念地景，陵墓要从"路径"而不是单体看起',
    summary: '陵墓建筑最强的不是某一座殿，而是整条进入路径如何逐渐建立纪念感。神道、碑亭、封土和山水关系共同把记忆变成身体体验。',
    image: 'images/lingmu/mingxiaoling.jpg',
    accent: '#6b4d83',
    gradient: 'from-violet-700 via-purple-600 to-amber-400',
    span: '明清皇家陵寝制度成熟',
    keywords: ['神道', '纪念', '山陵', '封土', '地景'],
    drivers: ['纪念需求', '山水选址', '礼仪路线', '皇家制度'],
    structure: [
      { name: '神道序列', summary: '碑亭、石像生和门阙拉长纪念前奏。', role: '让进入过程本身成为仪式。' },
      { name: '陵寝核心', summary: '享殿、方城和封土形成纪念中心。', role: '承接礼制与象征意义。' },
      { name: '山水环境', summary: '陵寝通常与地形、植被和视线控制配合。', role: '把建筑扩大为地景系统。' },
    ],
    evolution: [
      { era: '汉唐以前', focus: '大型陵园观念建立', description: '纪念工程逐渐走向国家尺度。' },
      { era: '明清', focus: '礼仪路线与地景高度整合', description: '陵墓建筑成为成熟的纪念地景类型。' },
    ],
  },
  {
    id: 'gonggong',
    name: '公共',
    english: 'Public',
    tagline: '公共建筑服务的不只是功能，更是共同体的时间、仪式和集体记忆',
    summary: '公共建筑常常承担集体仪式与城市识别功能。它的价值不止在单体设计，而在于如何通过空场、路径、围合和标识把共同体经验组织起来。',
    image: 'images/gonggong/tiantan.jpg',
    accent: '#3b7599',
    gradient: 'from-blue-800 via-sky-700 to-amber-400',
    span: '礼仪与城市公共空间并行发展',
    keywords: ['祭祀', '地标', '广场', '共同体', '城市记忆'],
    drivers: ['国家仪式', '时间制度', '城市识别', '公共活动'],
    structure: [
      { name: '仪式场地', summary: '空场、围墙与路线共同组织大尺度活动。', role: '让公共秩序被反复实践。' },
      { name: '城市标识', summary: '钟楼、鼓楼或主殿成为共同体认知坐标。', role: '帮助城市建立公共记忆。' },
    ],
    evolution: [
      { era: '先秦至汉唐', focus: '礼仪场所积累', description: '公共仪式空间逐步形成体系。' },
      { era: '明清', focus: '大型公共礼仪地景成熟', description: '公共建筑与开放场地被高度整合。' },
    ],
  },
  {
    id: 'yuanlin',
    name: '园林',
    english: 'Garden',
    tagline: '园林不是看"摆了什么"，而是看视线、路线和借景如何被精心编排',
    summary: '园林建筑更像一套空间剪辑系统。水面、假山、廊道、窗洞与建筑量体共同构成一条不断转场的游览路线，因此它必须被单独作为重要类型来看。',
    image: posters.yiheyuan,
    accent: '#406b58',
    gradient: 'from-emerald-800 via-green-700 to-amber-400',
    span: '明清园林经验高度成熟',
    keywords: ['借景', '游线', '框景', '水面', '转场'],
    drivers: ['观景需求', '园居生活', '借景技法', '路线设计'],
    structure: [
      { name: '游线组织', summary: '路径决定观者按什么节奏看到景。', role: '园林首先是一种被安排的观看。' },
      { name: '景框系统', summary: '窗、门、廊与亭不断切割和重组视线。', role: '把自然变成被设计的场景。' },
      { name: '山水骨架', summary: '水面和假山负责建立整体空间关系。', role: '让建筑退后为景服务。' },
    ],
    evolution: [
      { era: '明代', focus: '私家园林成熟', description: '空间转折与借景技法达到高峰。' },
      { era: '清代', focus: '皇家园林扩展尺度', description: '园林从精巧构景进一步走向宏观地景组织。' },
    ],
  },
  {
    id: 'zongjiao',
    name: '宗教',
    english: 'Religious',
    tagline: '宗教建筑往往把场地、结构和精神指向叠加成最强烈的空间体验',
    summary: '宗教建筑不只是"供奉场所"，它往往通过高度、场地险峻、路径控制和象征形体强化精神体验。把宗教单列出来，能补足原来类型系统的代表性不足。',
    image: 'images/zongjiao/longmen_shiku.jpg',
    accent: '#6c5846',
    gradient: 'from-stone-800 via-orange-700 to-amber-500',
    span: '以石窟、宫观等宗教空间为主',
    keywords: ['石窟', '宫观', '场地', '象征', '信仰'],
    drivers: ['宗教仪式', '地标需求', '精神象征', '特殊场地'],
    structure: [
      { name: '精神指向', summary: '垂直、深入或高差常被用来强化宗教感。', role: '把抽象信仰转为身体体验。' },
      { name: '场地协同', summary: '山体、崖壁或城市中轴常直接参与塑形。', role: '让建筑与环境形成共同表达。' },
      { name: '象征形体', summary: '窟、殿、宫观等形体往往承担强烈标识功能。', role: '让宗教建筑从远处就能被识别。' },
    ],
    evolution: [
      { era: '隋唐以前', focus: '石窟与宗教空间奠基', description: '宗教建筑开始建立清晰的视觉类型。' },
      { era: '宋元至明清', focus: '结构与场地表达深化', description: '宗教建筑在木构和地形条件上展现更高复杂度。' },
    ],
  },
]

// 暂时定义，稍后会在合并扩展案例后重新计算
let categoryData: CategoryData[] = []
let allCases: CaseStudy[] = []
let sourceLibrary: SourceReference[] = []
let featuredCases: CaseStudy[] = []
let globalMetrics: any[] = []
let dynastySeries: any[] = []
let regionSeries: any[] = []
let categoryMatrix: any[] = []

const linkSeeds = [
  ['制度入口', '中轴秩序', 3],
  ['制度入口', '礼仪路线', 2],
  ['结构入口', '桥梁', 2],
  ['结构入口', '宗教', 1],
  ['生活入口', '民居', 3],
  ['生活入口', '商业', 2],
  ['环境入口', '园林', 3],
  ['环境入口', '公共', 2],
  ['中轴秩序', '皇宫', 2],
  ['中轴秩序', '教育', 2],
  ['礼仪路线', '陵墓', 2],
  ['礼仪路线', '公共', 2],
  ['桥梁', '赵州桥', 2],
  ['民居', '北京四合院', 2],
  ['园林', '颐和园', 2],
  ['宗教', '龙门石窟', 1],
] as const

const maxLinkCount = Math.max(...linkSeeds.map((item) => item[2]))

export const relationshipLinks = linkSeeds.map(([source, target, count]) => ({
  source,
  target,
  count,
  strength: Math.round((count / maxLinkCount) * 100),
}))

export const knowledgeNodes: KnowledgeNode[] = [
  {
    id: 'entry-order',
    label: '制度入口',
    type: 'entry',
    x: 12,
    y: 18,
    summary: '先从制度切入，适合读皇宫、教育和大型礼仪空间。',
    links: ['concept-axis', 'concept-ritual'],
    route: '/data',
    accent: '#b73b2f',
  },
  {
    id: 'entry-life',
    label: '生活入口',
    type: 'entry',
    x: 12,
    y: 40,
    summary: '先从日常生活切入，更容易理解民居和商业建筑。',
    links: ['category-minju', 'category-shangye'],
    route: '/gallery',
    accent: '#2c7a62',
  },
  {
    id: 'entry-structure',
    label: '结构入口',
    type: 'entry',
    x: 12,
    y: 62,
    summary: '先看受力和节点，桥梁与宗教木构会更清楚。',
    links: ['category-qiaoliang', 'category-zongjiao'],
    route: '/mortise-tenon',
    accent: '#8a6a3e',
  },
  {
    id: 'entry-environment',
    label: '环境入口',
    type: 'entry',
    x: 12,
    y: 84,
    summary: '先从环境与路径切入，适合读园林、陵墓与公共地景。',
    links: ['category-yuanlin', 'category-gonggong'],
    route: '/achievement',
    accent: '#406b58',
  },
  {
    id: 'concept-axis',
    label: '中轴秩序',
    type: 'concept',
    x: 38,
    y: 18,
    summary: '轴线不是形式，而是将等级、仪式与观看顺序稳定下来的一种空间方法。',
    links: ['category-huanggong', 'category-jiaoyu', 'case-gugong'],
    route: '/architecture/huanggong',
    accent: '#b73b2f',
  },
  {
    id: 'concept-ritual',
    label: '礼仪路线',
    type: 'concept',
    x: 38,
    y: 84,
    summary: '礼仪路线通过行走、停顿和视线控制，把抽象观念变成身体体验。',
    links: ['category-lingmu', 'category-gonggong', 'case-tiantan'],
    route: '/architecture/gonggong',
    accent: '#6b4d83',
  },
  {
    id: 'category-huanggong',
    label: '皇宫',
    type: 'category',
    x: 64,
    y: 18,
    summary: '适合从中轴、台基和殿前广场的递进关系入手。',
    links: ['case-gugong'],
    route: '/architecture/huanggong',
    accent: '#b73b2f',
  },
  {
    id: 'category-jiaoyu',
    label: '教育',
    type: 'category',
    x: 64,
    y: 30,
    summary: '适合看教学空间如何与礼制、文脉和环境叠合。',
    links: ['case-guozijian'],
    route: '/architecture/jiaoyu',
    accent: '#305a72',
  },
  {
    id: 'category-minju',
    label: '民居',
    type: 'category',
    x: 64,
    y: 42,
    summary: '适合从门序、边界和群体生活方式来读。',
    links: ['case-siheyuan'],
    route: '/architecture/minju',
    accent: '#2c7a62',
  },
  {
    id: 'category-shangye',
    label: '商业',
    type: 'category',
    x: 64,
    y: 54,
    summary: '适合用步行视角理解街区门面和商业识别。',
    links: ['case-dazhalan'],
    route: '/architecture/shangye',
    accent: '#c3832f',
  },
  {
    id: 'category-qiaoliang',
    label: '桥梁',
    type: 'category',
    x: 64,
    y: 66,
    summary: '适合从受力路径和水系关系开始阅读。',
    links: ['case-zhaozhou'],
    route: '/architecture/qiaoliang',
    accent: '#8a6a3e',
  },
  {
    id: 'category-zongjiao',
    label: '宗教',
    type: 'category',
    x: 64,
    y: 78,
    summary: '适合看高度、场地和精神体验如何共同构形。',
    links: ['case-longmen'],
    route: '/architecture/zongjiao',
    accent: '#6c5846',
  },
  {
    id: 'category-yuanlin',
    label: '园林',
    type: 'category',
    x: 64,
    y: 90,
    summary: '适合从视线剪辑、路径和借景法进入。',
    links: ['case-yiheyuan'],
    route: '/architecture/yuanlin',
    accent: '#406b58',
  },
  {
    id: 'category-gonggong',
    label: '公共',
    type: 'category',
    x: 64,
    y: 102,
    summary: '适合看公共秩序如何通过空场和标识被建立。',
    links: ['case-tiantan'],
    route: '/architecture/gonggong',
    accent: '#3b7599',
  },
  {
    id: 'category-lingmu',
    label: '陵墓',
    type: 'category',
    x: 64,
    y: 114,
    summary: '适合从神道、路径与山水关系理解纪念空间。',
    links: ['case-mingxiaoling'],
    route: '/architecture/lingmu',
    accent: '#6b4d83',
  },
  {
    id: 'case-gugong',
    label: '北京故宫',
    type: 'case',
    x: 90,
    y: 18,
    summary: '用最完整的院落序列呈现皇家礼制空间。',
    links: ['category-huanggong', 'concept-axis'],
    route: '/architecture/huanggong',
    accent: '#b73b2f',
  },
  {
    id: 'case-guozijian',
    label: '北京国子监',
    type: 'case',
    x: 90,
    y: 30,
    summary: '让教育空间与礼制空间正面相遇。',
    links: ['category-jiaoyu', 'concept-axis'],
    route: '/architecture/jiaoyu',
    accent: '#305a72',
  },
  {
    id: 'case-siheyuan',
    label: '北京四合院',
    type: 'case',
    x: 90,
    y: 42,
    summary: '用门、墙、院和朝向组织家庭生活。',
    links: ['category-minju', 'entry-life'],
    route: '/architecture/minju',
    accent: '#2c7a62',
  },
  {
    id: 'case-dazhalan',
    label: '大栅栏',
    type: 'case',
    x: 90,
    y: 54,
    summary: '商业识别建立在整条街区的连续界面上。',
    links: ['category-shangye', 'entry-life'],
    route: '/architecture/shangye',
    accent: '#c3832f',
  },
  {
    id: 'case-zhaozhou',
    label: '赵州桥',
    type: 'case',
    x: 90,
    y: 66,
    summary: '最适合入门桥梁结构逻辑的代表样本。',
    links: ['category-qiaoliang', 'entry-structure'],
    route: '/architecture/qiaoliang',
    accent: '#8a6a3e',
  },
  {
    id: 'case-longmen',
    label: '龙门石窟',
    type: 'case',
    x: 90,
    y: 78,
    summary: '石窟群把宗教叙事、场地与雕刻工艺融合在一起。',
    links: ['category-zongjiao', 'entry-structure'],
    route: '/architecture/zongjiao',
    accent: '#6c5846',
  },
  {
    id: 'case-yiheyuan',
    label: '颐和园',
    type: 'case',
    x: 90,
    y: 90,
    summary: '山水、建筑与游览路线彼此协作。',
    links: ['category-yuanlin', 'entry-environment'],
    route: '/architecture/yuanlin',
    accent: '#406b58',
  },
  {
    id: 'case-tiantan',
    label: '天坛',
    type: 'case',
    x: 90,
    y: 102,
    summary: '公共仪式通过开放场地与路径被放大。',
    links: ['category-gonggong', 'concept-ritual'],
    route: '/architecture/gonggong',
    accent: '#3b7599',
  },
  {
    id: 'case-mingxiaoling',
    label: '明孝陵',
    type: 'case',
    x: 90,
    y: 114,
    summary: '纪念建筑被拉长为完整地景体验。',
    links: ['category-lingmu', 'concept-ritual'],
    route: '/architecture/lingmu',
    accent: '#6b4d83',
  },
]

export const moduleCards = [
  { title: '数据总览', description: '从类型、时代、地区和证据密度建立整体判断。', route: '/data' },
  { title: '类型档案', description: '围绕结构、驱动力、代表案例和演化过程展开。', route: '/architecture/huanggong' },
  { title: '图像馆', description: '按分类切换不同案例，结合证据点快速识别。', route: '/gallery' },
  { title: '知识问答', description: '通过互动问答形式深入了解传统建筑知识，从结构原理到历史文化。', route: '/knowledge-quiz' },
  { title: '综合问答', description: '把看过的内容转成可判断、可回忆的知识。', route: '/quiz' },
]

// 暂时定义，稍后会在合并扩展案例后重新计算
let galleryItems: any[] = []

export const mortiseJoints: MortiseJoint[] = [
  {
    id: 1,
    name: '燕尾榫',
    icon: '燕',
    summary: '通过斜向咬合限制拉脱，是最适合讲"锁定关系"的入门榫卯。',
    difficulty: '基础',
    uses: ['桌案边框', '柜体拼接', '抽屉结构'],
    steps: ['确定榫头比例', '切出燕尾斜面', '对应开槽试配', '轻敲锁定整体'],
    forceProfile: { tensile: 84, shear: 63, seismic: 58 },
    gradient: 'from-amber-500 via-orange-500 to-red-500',
  },
  {
    id: 2,
    name: '穿带榫',
    icon: '穿',
    summary: '将板材和框架贯通连接，适合演示平面构件如何互相约束。',
    difficulty: '基础',
    uses: ['门板', '屏风', '案面板芯'],
    steps: ['板材定位', '开通槽', '穿带压入', '校正平整度'],
    forceProfile: { tensile: 66, shear: 82, seismic: 64 },
    gradient: 'from-sky-500 via-blue-500 to-indigo-600',
  },
  {
    id: 3,
    name: '抱肩榫',
    icon: '抱',
    summary: '常用于腿足与牙条连接，重点是让转角位置既稳定又不笨重。',
    difficulty: '进阶',
    uses: ['桌椅腿足', '架格', '条案承托'],
    steps: ['确认转角关系', '咬合肩部', '对接横材', '加固受力点'],
    forceProfile: { tensile: 72, shear: 86, seismic: 76 },
    gradient: 'from-emerald-600 via-teal-500 to-cyan-500',
  },
  {
    id: 4,
    name: '粽角榫',
    icon: '角',
    summary: '三向转角同时咬合，适合做高阶装配挑战和结构理解题。',
    difficulty: '高阶',
    uses: ['复杂框架', '箱柜转角', '多向木构节点'],
    steps: ['三向取角', '分层试配', '收紧接缝', '检查整体稳定'],
    forceProfile: { tensile: 76, shear: 88, seismic: 82 },
    gradient: 'from-rose-500 via-red-500 to-orange-500',
  },
]

export const labQuestions: LabQuestion[] = [
  {
    id: 1,
    jointId: 1,
    question: '燕尾榫最核心的优势是什么？',
    options: ['方便拆卸展示', '依靠斜向咬合防止拉脱', '只适合承受垂直压力', '主要用于装饰纹样'],
    answer: 1,
    explanation: '燕尾榫最关键的是斜向咬合形成锁定关系，因此常被用来抵抗抽拉。',
  },
  {
    id: 2,
    jointId: 2,
    question: '穿带榫更适合解决哪类问题？',
    options: ['高耸塔体的垂直稳定', '板材与框架之间的贯通连接', '石桥拱券的受力传导', '外墙防水'],
    answer: 1,
    explanation: '穿带榫通常服务于板材与框架的结合，强调平面构件的稳定与整合。',
  },
  {
    id: 3,
    jointId: 3,
    question: '抱肩榫为什么常出现在桌椅腿足位置？',
    options: ['因为那里最适合做彩绘', '因为腿足与牙条的转角需要稳定连接', '因为必须承受水流冲刷', '因为只用于屋顶'],
    answer: 1,
    explanation: '抱肩榫最典型的场景就是转角受力部位，它把腿足和横材稳定咬合在一起。',
  },
  {
    id: 4,
    jointId: 4,
    question: '粽角榫被视为高阶节点，主要因为它：',
    options: ['只要上胶就能完成', '需要多方向同时咬合，对精度要求高', '只能用于纸模', '不参与结构受力'],
    answer: 1,
    explanation: '粽角榫通常涉及多方向连接，装配误差一大就会影响整体稳定。',
  },
]

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    type: 'single',
    question: '如果你想最快读懂皇家建筑的"等级感"，最应该优先观察什么？',
    options: ['院落中的植被种类', '中轴、台基与殿前广场的递进关系', '瓦片颜色深浅', '屋内家具陈设'],
    answer: 1,
    explanation: '皇宫的等级感主要通过轴线推进、台基高度和院落层次建立，不是靠零散细节。',
    route: '/architecture/huanggong',
  },
  {
    id: 2,
    type: 'single',
    question: '宏村最有代表性的观察方法是哪一种？',
    options: ['只看某一座祠堂', '把村落、水系、街巷和民居一起看', '只统计房间数量', '只看屋顶样式'],
    answer: 1,
    explanation: '宏村的价值在聚落整体，不适合被拆成单栋民居单独理解。',
    route: '/architecture/minju',
  },
  {
    id: 3,
    type: 'judge',
    question: '官府建筑和民居都常用院落，但它们的空间驱动力完全相同。',
    options: ['正确', '错误'],
    answer: 1,
    explanation: '两者都可能用院落，但官府更强调行政流程和等级控制，民居更强调日常生活与家族秩序。',
    route: '/architecture/guanfu',
  },
  {
    id: 4,
    type: 'single',
    question: '读赵州桥时，最合适的起点是什么？',
    options: ['先看桥边摊位', '先看拱券与受力路径', '先看游客流量', '先看桥面颜色'],
    answer: 1,
    explanation: '桥梁最重要的是结构逻辑和跨越方式，赵州桥尤其如此。',
    route: '/architecture/qiaoliang',
  },
  {
    id: 5,
    type: 'single',
    question: '为什么商业建筑不应只看单栋？',
    options: ['因为商业建筑没有结构', '因为商业价值主要由连续街面和人流节奏构成', '因为商业建筑都很小', '因为商业建筑不需要入口'],
    answer: 1,
    explanation: '商业建筑的识别力很大一部分来自整条街区的连续界面和步行体验。',
    route: '/architecture/shangye',
  },
  {
    id: 6,
    type: 'single',
    question: '教育建筑和园林建筑最明显的阅读差异之一是：',
    options: ['教育建筑完全不看路径', '园林更依赖游线和视线转场', '园林不包含建筑', '教育建筑没有环境关系'],
    answer: 1,
    explanation: '园林建筑要顺着游线和视线变化来理解，而教育建筑更多从秩序和讲学关系进入。',
    route: '/architecture/yuanlin',
  },
  {
    id: 7,
    type: 'judge',
    question: '天坛这类公共建筑，阅读重点应放在"共同体仪式如何被空间组织起来"。',
    options: ['正确', '错误'],
    answer: 0,
    explanation: '公共建筑的重要价值正在于它如何组织共同体经验，而不只是单看某一座主建筑。',
    route: '/architecture/gonggong',
  },
  {
    id: 8,
    type: 'single',
    question: '把宗教类型单独列出来，最大的意义是什么？',
    options: ['为了增加页面数量', '因为它能把场地、结构和精神体验叠加成独特类型', '因为宗教建筑都在山里', '因为它和其他类型没有任何联系'],
    answer: 1,
    explanation: '宗教建筑常常同时牵动场地、象征和结构表现，单独成类更便于比较与理解。',
    route: '/architecture/zongjiao',
  },
]

export const puzzleChallenges: PuzzleChallenge[] = [
  {
    id: 1,
    name: '北京故宫',
    category: 'huanggong',
    image: 'images/huanggong/beijing_gugong.jpg',
    pieces: 9,
    difficulty: '入门',
    tip: '先抓住中轴和大屋顶的位置，再补台基和广场边界。',
  },
  {
    id: 2,
    name: '赵州桥',
    category: 'qiaoliang',
    image: 'images/qiaoliang/zhaozhouqiao.jpg',
    pieces: 16,
    difficulty: '标准',
    tip: '先找到主拱线，再对齐桥面与倒影，结构会更容易拼起来。',
  },
  {
    id: 3,
    name: '福建土楼',
    category: 'minju',
    image: 'images/minju/fujian_tulou.jpg',
    pieces: 25,
    difficulty: '挑战',
    tip: '先识别外圈围合，再处理中庭和夯土墙的纹理变化。',
  },
]

export function getCategoryById(id: string | undefined): CategoryData | undefined {
  return categoryData.find((item) => item.id === id)
}

export function getCategoryName(id: CategoryId): string {
  return getCategoryById(id)?.name ?? id
}

// ===== 扩展数据整合 =====

// 将扩展案例合并到原有分类中
const mergeExtendedCases = () => {
  const appendUniqueCases = (categoryId: CategoryId, items: CaseStudy[]) => {
    const target = casesByCategory[categoryId]
    const existingIds = new Set(target.map((item) => item.id))

    items.forEach((item) => {
      if (existingIds.has(item.id)) {
        return
      }
      target.push(item)
      existingIds.add(item.id)
    })
  }

  // Merge bridge cases.
  appendUniqueCases('qiaoliang', extendedCases.filter((item) => item.categoryId === 'qiaoliang'))
  // Merge commerce cases.
  appendUniqueCases('shangye', extendedCases.filter((item) => item.categoryId === 'shangye'))
  // Merge education cases.
  appendUniqueCases('jiaoyu', extendedCases.filter((item) => item.categoryId === 'jiaoyu'))
  // Merge public architecture cases.
  appendUniqueCases('gonggong', extendedCases.filter((item) => item.categoryId === 'gonggong'))
  // Merge garden cases.
  appendUniqueCases('yuanlin', extendedCases.filter((item) => item.categoryId === 'yuanlin'))
}

// 执行合并
mergeExtendedCases()

// 重新计算所有需要的变量
const recalculateData = () => {
  categoryData = seeds
    .filter((seed) => !REMOVED_CATEGORY_IDS.has(seed.id))
    .map((seed) => ({
    ...seed,
    cases: casesByCategory[seed.id],
    sampleCount: casesByCategory[seed.id].length,
    regionCount: unique(casesByCategory[seed.id].map((item) => item.region)).length,
  }))

  allCases = categoryData.flatMap((item) => item.cases)
  sourceLibrary = unique(allCases.flatMap((item) => item.sources.map((entry) => JSON.stringify(entry)))).map(
    (item) => JSON.parse(item) as SourceReference,
  )
  featuredCases = allCases.filter((item) => item.featured)

  globalMetrics = [
    { label: '收录案例', value: allCases.length, suffix: '个', note: '案例按空间逻辑系统组织，涵盖不同类型与时代的代表性建筑。' },
    { label: '类型板块', value: categoryData.length, suffix: '类', note: '涵盖宫殿、民居、官府、桥梁、园林、宗教等多种类型，构建完整的建筑谱系。' },
    { label: '覆盖地区', value: unique(allCases.map((item) => item.region)).length, suffix: '个', note: '覆盖多个地域的建筑实例，体现不同地区的建筑特色与差异。' },
    { label: '来源条目', value: sourceLibrary.length, suffix: '条', note: '每个案例均提供权威来源参考，便于深入研究与查证。' },
  ]

  const eraLabel: Record<CaseStudy['eraBucket'], string> = {
    先秦: '礼仪、聚落与早期城市空间观念的源头',
    秦汉隋唐: '制度与工程能力持续提升，出现强代表性样本',
    宋元: '教育、宗教与城市功能类型不断细分',
    明: '礼制、园林与都城空间进入高度成熟阶段',
    清: '类型谱系进一步扩展，尺度和层级被放大',
    近现代: '传统工艺与地方公共生活继续共存',
  }

  dynastySeries = (['先秦', '秦汉隋唐', '宋元', '明', '清', '近现代'] as const).map((bucket) => {
    const bucketCases = allCases.filter((item) => item.eraBucket === bucket)

    return {
      dynasty: bucket,
      count: bucketCases.length,
      sourceCount: unique(bucketCases.flatMap((item) => item.sources.map((entry) => entry.url))).length,
      label: eraLabel[bucket],
    }
  })

  regionSeries = unique(allCases.map((item) => item.region)).map((region) => {
    const cases = allCases.filter((item) => item.region === region)
    const focus = unique(cases.map((item) => getCategoryName(item.categoryId))).join('、')

    return { region, count: cases.length, focus }
  })

  categoryMatrix = categoryData.map((item) => ({
    id: item.id,
    name: item.name,
    caseCount: item.cases.length,
    sourceCount: unique(item.cases.flatMap((entry) => entry.sources.map((src) => src.url))).length,
    factCount: item.cases.reduce((count, entry) => count + entry.facts.length, 0),
    heritageCount: item.cases.filter((entry) => entry.heritageTags?.length).length,
    regionCount: unique(item.cases.map((entry) => entry.region)).length,
    accent: item.accent,
  }))

  galleryItems = categoryData.flatMap((category) =>
    category.cases.map((item) => ({
      ...item,
      categoryName: category.name,
      accent: category.accent,
    })),
  )
}

// 执行重新计算
recalculateData()

// 更新统计数据
export const totalExtendedCases = extendedCases.filter((c) => !REMOVED_CATEGORY_IDS.has(c.categoryId)).length
export const extendedCasesSummary = {
  bridge: extendedCases.filter(c => c.categoryId === 'qiaoliang').length,
  commercial: extendedCases.filter(c => c.categoryId === 'shangye').length,
  education: extendedCases.filter(c => c.categoryId === 'jiaoyu').length,
  public: extendedCases.filter(c => c.categoryId === 'gonggong').length,
  garden: extendedCases.filter(c => c.categoryId === 'yuanlin').length,
}

// 导出重新计算后的变量
export { categoryData, allCases, sourceLibrary, featuredCases, globalMetrics, dynastySeries, regionSeries, categoryMatrix, galleryItems }

