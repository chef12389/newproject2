﻿﻿﻿﻿﻿﻿import type { CategoryId } from '@/data/architectureData'

export type SourceLink = {
  label: string
  url: string
  org: string
  note?: string
}

export type ScientistEntry = {
  id: string
  name: string
  era: string
  role: string
  identity: string
  summary: string
  image: string
  imageAlt: string
  highlights: string[]
  timeline: { label: string; detail: string }[]
  spirit: string[]
  sources: SourceLink[]
  externalLinks: SourceLink[]
  relatedCategories: CategoryId[]
  themeTags: string[]
}

export type ScientistSection = {
  id: string
  label: string
  intro: string
  leadId: string
  itemIds: string[]
  insightTitle: string
  insightBody: string
  spiritCards?: { title: string; body: string }[]
}

export type TreatiseEntry = {
  id: string
  title: string
  author: string
  dynasty: string
  kind: string
  summary: string
  excerpt: string
  excerptSource: string
  image: string
  imageAlt: string
  highlights: string[]
  terms: string[]
  crafts: string[]
  sources: SourceLink[]
  externalLinks: SourceLink[]
  relatedCategories: CategoryId[]
  themeTags: string[]
}

export type TreatiseSection = {
  id: string
  label: string
  intro: string
  leadId: string
  relatedIds: string[]
  insightTitle: string
  insightBody: string
  glossaryGroups?: { title: string; items: string[] }[]
}

export type CultureTheme = {
  id: string
  label: string
  intro: string
  stat: string
  statLabel: string
  statNote: string
  image: string
  imageAlt: string
  summary: string
  facts: string[]
  detailCards: { title: string; body: string }[]
  sources: SourceLink[]
  externalLinks: SourceLink[]
  themeTags: string[]
  relatedCategories: CategoryId[]
}

export const siteTheme = {
  title: '营造新途',
  slogan: '千年营造，创意新生',
  subtitle: '互联网+文化创意产品专题',
  scope:
    '本项目以中国古代建筑成就为核心资源，打造面向互联网+文化创意产品的设计灵感平台。从民居、官府、宫殿、桥梁等代表性建筑类型，到鲁班、宇文恺、李诫等匠心人物，从《营造法式》《园冶》等经典典籍到礼制、园林、非遗等文化场景，通过设计素材、创意人物、设计典籍与文化创意四个维度，为当代文创产品设计提供系统化的灵感来源与知识支撑。',
}

export const homeGuides = [
  {
    title: '设计素材',
    description:
      '聚焦民居、官府、宫殿、桥梁等代表性建筑类型，从空间组织、结构工艺与营建制度三个层面，为文创设计提供丰富的视觉与结构素材。',
  },
  {
    title: '创意人物',
    description:
      '围绕鲁班、宇文恺、李诫、喻皓、蒯祥、阎立德、蔡信、梁九等人物，呈现古代建筑技术人物的制度意识、工程经验与传承脉络，为文创人物IP开发提供素材。',
  },
  {
    title: '设计典籍与文创生活',
    description:
      '从《考工记》《营造法式》《木经》《园冶》《鲁班经》《长物志》等原典与图档文献，到礼制都城、园林游观、民居聚落、宗教建筑、桥梁津渡与非遗技艺，理解建筑文明如何被记录、阐释并持续影响今天的文创设计。',
  },
]

export const scientistEntries: ScientistEntry[] = [
  {
    id: 'li-jie',
    name: '李诫',
    era: '北宋',
    role: '营造制度整理者',
    identity: '将作监官员，《营造法式》主持编修者',
    summary:
      '李诫的重要性不只在于留下《营造法式》，更在于他将工匠经验、构件尺度、工种分工与图样制度整理为可执行、可传承的官式营造规范。',
    image: 'images/reference/scientists/li_jie_dpm.jpg',
    imageAlt: '李诫与《营造法式》相关图像',
    highlights: [
      '主持整理北宋官式建筑的制度与做法。',
      '将功限、料例、图样与工种组织纳入统一文本框架。',
      '推动古代营造知识由经验传承走向制度表达。',
    ],
    timeline: [
      { label: '约1060年', detail: '出生于北宋时期，后进入将作监体系任职。' },
      { label: '1092年', detail: '调入将作监，逐步参与官式营造制度整理。' },
      { label: '1103年', detail: '《营造法式》刊行，成为后世研究中国古代建筑的重要依据。' },
    ],
    spirit: ['制度整理', '标准意识', '图样思维', '总结实践'],
    sources: [
      { label: '故宫博物院人物词条', url: 'https://www.dpm.org.cn/lemmas/244533.html', org: '故宫博物院' },
      { label: '故宫博物院《营造法式》词条', url: 'https://www.dpm.org.cn/lemmas/243760.html', org: '故宫博物院' },
    ],
    externalLinks: [
      { label: '查看故宫博物院人物资料', url: 'https://www.dpm.org.cn/lemmas/244533.html', org: '故宫博物院' },
      { label: '查看《营造法式》馆藏说明', url: 'https://www.dpm.org.cn/ancient/mingqing/149329.html', org: '故宫博物院' },
    ],
    relatedCategories: ['guanfu', 'huanggong'],
    themeTags: ['法式', '制度', '模数', '图样'],
  },
  {
    id: 'yu-hao',
    name: '喻皓',
    era: '五代至北宋初',
    role: '木构营造名匠',
    identity: '都料匠，擅长楼阁与宝塔营造',
    summary:
      '喻皓长期从事木构建筑实践，尤其擅长高层木塔与楼阁营造。他代表的是古代工匠群体中将经验不断积累、提炼并尝试转化为系统知识的一类人物。',
    image: 'images/reference/scientists/yuhao.jpeg',
    imageAlt: '喻皓相关图像',
    highlights: [
      '长期活跃于建筑实践一线，尤擅塔与阁的木构营造。',
      '常被后世视作古代木构名匠代表。',
      '其事迹体现出工匠经验总结与口传心授并行的特点。',
    ],
    timeline: [
      { label: '五代末至北宋初', detail: '活跃于江南地区，出身建筑工匠群体。' },
      { label: '长期实践', detail: '在木结构营造方面积累了丰富经验，尤长于高层木塔。' },
      { label: '后世影响', detail: '成为中国古代木构营造智慧与匠作精神的重要象征。' },
    ],
    spirit: ['勤于摸索', '重在实践', '精于木构', '师徒传承'],
    sources: [
      { label: '杭州市档案馆人物资料', url: 'https://www.hzarchives.org.cn/info/4739', org: '杭州市档案馆' },
    ],
    externalLinks: [
      { label: '查看杭州市档案馆资料', url: 'https://www.hzarchives.org.cn/info/4739', org: '杭州市档案馆' },
    ],
    relatedCategories: ['qiaoliang', 'zongjiao'],
    themeTags: ['木构', '宝塔', '楼阁', '工匠经验'],
  },
  {
    id: 'kuai-xiang',
    name: '蒯祥',
    era: '明代',
    role: '皇家工程组织者',
    identity: '明代著名建筑匠师，香山帮代表人物',
    summary:
      '蒯祥不仅是著名匠师，也是大型皇家工程的重要组织者。他所体现的，不只是精巧技艺，更是古代建筑项目中图样、现场、工序与制度协同运作的能力。',
    image: 'images/reference/scientists/kuai_xiang_suzhou.jpg',
    imageAlt: '蒯祥相关图像',
    highlights: [
      '常被视作香山帮匠师体系中的代表人物。',
      '参与并主持多项皇家工程建设。',
      '体现了古代大工程中的组织协调与现场掌控能力。',
    ],
    timeline: [
      { label: '1398年', detail: '出生于苏州吴县香山一带，出身工匠世家。' },
      { label: '明代中期', detail: '参与并主持多项北京皇家建筑工程。' },
      { label: '后世评价', detail: '逐渐成为香山帮营造技艺的重要象征人物。' },
    ],
    spirit: ['工程统筹', '技艺精专', '法式熟练', '匠师声望'],
    sources: [
      { label: '苏州地方志“香山帮”条目', url: 'https://dfzb.suzhou.gov.cn/dfzb/szdq/201903/6174d35383c349d786cd1c38580cddc8.shtml', org: '苏州市地方志编纂委员会办公室' },
      { label: '苏州地方志“蒯祥与香山帮”条目', url: 'https://dfzb.suzhou.gov.cn/dfzb/szdq/202311/3fbb8fc69e6a4cfb9b07288f6ba1b745.shtml', org: '苏州市地方志编纂委员会办公室' },
    ],
    externalLinks: [
      { label: '查看香山帮官方资料', url: 'https://dfzb.suzhou.gov.cn/dfzb/szdq/201903/6174d35383c349d786cd1c38580cddc8.shtml', org: '苏州市地方志编纂委员会办公室' },
      { label: '查看蒯祥与香山帮专题', url: 'https://dfzb.suzhou.gov.cn/dfzb/szdq/202311/3fbb8fc69e6a4cfb9b07288f6ba1b745.shtml', org: '苏州市地方志编纂委员会办公室' },
    ],
    relatedCategories: ['huanggong', 'yuanlin'],
    themeTags: ['香山帮', '故宫', '皇家工程', '匠师'],
  },
  {
    id: 'lei-fada',
    name: '雷发达',
    era: '清初',
    role: '样式房开创人物',
    identity: '清代样式房重要匠师',
    summary:
      '雷发达及其后人长期在清代样式房体系中承担设计与监造工作，开启了“样式雷”这一跨代延续的皇家建筑设计谱系。',
    image: 'images/reference/scientists/lei_fada_beijing.jpg',
    imageAlt: '雷发达相关图像',
    highlights: [
      '被视作清代样式房的重要匠师。',
      '参与清初皇家园林与宫殿工程。',
      '为后续多代家族持续服务皇家工程奠定基础。',
    ],
    timeline: [
      { label: '1683年', detail: '自江宁赴北京，开始参与皇家营建事务。' },
      { label: '康熙年间', detail: '参与畅春园等皇家工程建设。' },
      { label: '后续影响', detail: '为清代皇家工程培养了后继人才。' },
    ],
    spirit: ['工程协同', '家族传承', '皇家营造', '设计监造'],
    sources: [
      { label: '北京市人民政府专题资料', url: 'https://www.beijing.gov.cn/renwen/zt/changchunyuan/mgqj/201712/t20171214_1868439.html', org: '北京市人民政府' },
      { label: '国家图书馆样式雷专题', url: 'https://www.nlc.cn/nmcb/gcjpdz/ysl/', org: '国家图书馆' },
    ],
    externalLinks: [
      { label: '查看北京市人民政府资料', url: 'https://www.beijing.gov.cn/renwen/zt/changchunyuan/mgqj/201712/t20171214_1868439.html', org: '北京市人民政府' },
      { label: '查看国家图书馆样式雷专题', url: 'https://www.nlc.cn/nmcb/gcjpdz/ysl/', org: '国家图书馆' },
    ],
    relatedCategories: ['huanggong', 'guanfu'],
    themeTags: ['样式房', '畅春园', '皇家园林', '家族技艺'],
  },
  {
    id: 'lu-ban',
    name: '鲁班',
    era: '春秋',
    role: '百工之祖',
    identity: '传说时代的工匠始祖，后世建筑与木作行业共同尊奉的行业神',
    summary:
      '鲁班是中国工匠传统中最具象征意义的人物。无论其历史原型如何，"鲁班"这一名字已经超越了个体，成为古代工匠智慧、创造力和技艺精神的集合符号，深刻影响了中国建筑行业的行业认同与文化传承。',
    image: 'images/reference/scientists/luban.jpeg',
    imageAlt: '鲁班相关图像',
    highlights: [
      '被后世建筑、木作、石作等多个行业共同尊为祖师。',
      '锯、刨、墨斗、曲尺等工具的发明传说均归于鲁班名下。',
      '"鲁班"已从历史人物演变为工匠精神的文化符号。',
    ],
    timeline: [
      { label: '春秋时期', detail: '传说为鲁国人，名公输般，以巧思善构闻名。' },
      { label: '后世传承', detail: '历代工匠将发明创造归附其名，逐渐形成鲁班传说体系。' },
      { label: '行业崇拜', detail: '鲁班崇拜成为建筑行业凝聚认同、传承技艺的重要文化传统。' },
    ],
    spirit: ['巧思善构', '工具革新', '行业认同', '文化符号'],
    sources: [
      { label: '中国非物质文化遗产网鲁班传说', url: 'https://www.ihchina.cn/', org: '中国非物质文化遗产网' },
    ],
    externalLinks: [
      { label: '查看中国非物质文化遗产网', url: 'https://www.ihchina.cn/', org: '中国非物质文化遗产网' },
    ],
    relatedCategories: ['minju', 'qiaoliang'],
    themeTags: ['鲁班', '工匠精神', '行业神', '工具发明'],
  },
  {
    id: 'yuwen-kai',
    name: '宇文恺',
    era: '隋代',
    role: '都城规划与工程主持者',
    identity: '隋代著名建筑与城市规划家，大兴城与洛阳城的主要规划者',
    summary:
      '宇文恺是中国古代少有的以规划见长的建筑人物。他主持规划的大兴城（即唐长安城前身）是中国古代规模最大的都城之一，其方格路网、里坊制度与中轴线布局深刻影响了此后数百年的都城建设。',
    image: 'images/reference/scientists/yuwenkai.jpeg',
    imageAlt: '宇文恺与大兴城相关图像',
    highlights: [
      '主持规划隋大兴城，奠定唐长安城的基本格局。',
      '参与规划东都洛阳，实践了大规模城市营建的综合能力。',
      '其规划思想体现了《考工记》营国制度与实际地形的结合。',
    ],
    timeline: [
      { label: '555年', detail: '出生于鲜卑贵族家庭，自幼受到工程技术与制度文化的熏陶。' },
      { label: '582年', detail: '受命主持规划大兴城，在短时间内完成了一座超大规模都城的营建。' },
      { label: '604年后', detail: '参与东都洛阳的规划与营建，进一步展现其城市设计能力。' },
      { label: '612年', detail: '去世，其都城规划思想对后世产生深远影响。' },
    ],
    spirit: ['规划先行', '制度意识', '因地制宜', '规模统筹'],
    sources: [
      { label: '中国社会科学院考古研究所隋唐长安城考古', url: 'http://www.kaogu.cn/', org: '中国社会科学院考古研究所' },
    ],
    externalLinks: [
      { label: '查看考古研究所资料', url: 'http://www.kaogu.cn/', org: '中国社会科学院考古研究所' },
    ],
    relatedCategories: ['guanfu', 'huanggong'],
    themeTags: ['都城规划', '大兴城', '里坊制度', '中轴线'],
  },
  {
    id: 'yan-lide',
    name: '阎立德',
    era: '唐代',
    role: '皇家工程与器物设计者',
    identity: '唐代著名建筑家与工艺设计家，出身工程世家',
    summary:
      '阎立德出身于工程与工艺世家，长期主持唐代皇家建筑与重要器物设计。他的实践范围涵盖宫殿、陵寝、仪仗器物等多个领域，体现了唐代大工程中建筑设计与工艺制作的紧密关联。',
    image: '',
    imageAlt: '阎立德相关图像',
    highlights: [
      '出身工程世家，其父阎毗即为隋代著名工艺家。',
      '主持唐太宗昭陵等重大皇家工程的设计与营建。',
      '其弟阎立本为著名画家，兄弟二人共同体现了唐代工程与艺术的结合。',
    ],
    timeline: [
      { label: '约596年', detail: '出生于工程与艺术世家，自幼接触建筑与工艺设计。' },
      { label: '贞观年间', detail: '担任将作大匠，主持多项皇家建筑工程与器物设计。' },
      { label: '636年', detail: '主持唐太宗长孙皇后昭陵营建。' },
      { label: '658年', detail: '去世，其工程实践对唐代建筑制度产生重要影响。' },
    ],
    spirit: ['工程世家', '建筑与工艺结合', '皇家工程', '制度实践'],
    sources: [
      { label: '陕西省考古研究院昭陵考古', url: 'http://www.sxkgy.com/', org: '陕西省考古研究院' },
    ],
    externalLinks: [
      { label: '查看陕西省考古研究院资料', url: 'http://www.sxkgy.com/', org: '陕西省考古研究院' },
    ],
    relatedCategories: ['huanggong', 'guanfu'],
    themeTags: ['昭陵', '将作大匠', '唐代建筑', '工艺设计'],
  },
  {
    id: 'cai-xin',
    name: '蔡信',
    era: '明代',
    role: '故宫早期营建参与者',
    identity: '明代著名匠师，参与明初北京宫殿营建工程',
    summary:
      '蔡信是明初北京宫殿营建中的关键匠师之一。他与蒯祥等人共同承担了紫禁城早期建设的重任，代表了明代初年大规模国家工程中南方匠师北上参与营造的历史现象。',
    image: '',
    imageAlt: '蔡信相关图像',
    highlights: [
      '参与明初北京宫殿（紫禁城）的营建工程。',
      '与蒯祥同为南方匠师北上参与皇家建设的代表人物。',
      '体现了明代国家工程中匠师选拔与调配的制度化运作。',
    ],
    timeline: [
      { label: '明初', detail: '出身江南工匠群体，以精湛技艺被征调参与北京宫殿建设。' },
      { label: '永乐年间', detail: '参与紫禁城主要殿宇的设计与施工。' },
      { label: '后世影响', detail: '与蒯祥等人共同奠定了明代官式建筑的基本格局。' },
    ],
    spirit: ['技艺精湛', '工程协作', '南北匠师交流', '国家工程'],
    sources: [
      { label: '故宫博物院明代建筑专题', url: 'https://www.dpm.org.cn/', org: '故宫博物院' },
    ],
    externalLinks: [
      { label: '查看故宫博物院专题', url: 'https://www.dpm.org.cn/', org: '故宫博物院' },
    ],
    relatedCategories: ['huanggong', 'guanfu'],
    themeTags: ['紫禁城', '明代营建', '南方匠师', '宫殿建筑'],
  },
  {
    id: 'liang-jiu',
    name: '梁九',
    era: '清初',
    role: '清初皇家工程匠师',
    identity: '清初著名匠师，与雷发达同时期参与皇家营建',
    summary:
      '梁九是清初与雷发达齐名的重要匠师，在康熙年间的皇家建筑工程中发挥了关键作用。他擅长大木作技术，参与了太和殿等重要建筑的重建工作，是研究清初建筑技术传承不可忽视的人物。',
    image: '',
    imageAlt: '梁九相关图像',
    highlights: [
      '与雷发达同为清初皇家工程的核心匠师。',
      '擅长大木作技术，参与太和殿重建等重要工程。',
      '其事迹反映了清初匠师群体在技术传承与工程实践中的核心地位。',
    ],
    timeline: [
      { label: '明末清初', detail: '出身工匠群体，以大木作技艺闻名。' },
      { label: '康熙年间', detail: '参与太和殿等皇家建筑的重建与修缮工程。' },
      { label: '后世评价', detail: '与雷发达并称，被视为清初皇家营造体系中的关键人物。' },
    ],
    spirit: ['大木专精', '工程实践', '技术传承', '匠师声望'],
    sources: [
      { label: '故宫博物院清代建筑专题', url: 'https://www.dpm.org.cn/', org: '故宫博物院' },
    ],
    externalLinks: [
      { label: '查看故宫博物院专题', url: 'https://www.dpm.org.cn/', org: '故宫博物院' },
    ],
    relatedCategories: ['huanggong', 'guanfu'],
    themeTags: ['太和殿', '大木作', '清初匠师', '皇家营造'],
  },
]

export const scientistSections: ScientistSection[] = [
  {
    id: 'system-foundation',
    label: '制度奠基',
    intro: '这一组人物的价值，在于把分散的营造经验转化为制度、法式与可传承的工程语言，为文创设计提供系统化知识支撑。',
    leadId: 'li-jie',
    itemIds: ['li-jie', 'yu-hao', 'yuwen-kai'],
    insightTitle: '从经验到制度',
    insightBody:
      '古代建筑技术并不是天然成体系的。李诫代表的是整理法式的制度能力，喻皓代表的是从实践中积累与总结的工匠经验，宇文恺代表的是将规划思想落实为城市格局的实践能力，三者共同构成中国古代建筑知识上升为体系的重要路径。',
  },
  {
    id: 'master-craft',
    label: '创意名匠',
    intro: '这里聚焦大工程中的关键匠师。他们并非抽象的“工匠”形象，而是能将图样、结构、现场与工序整合起来的核心人物。',
    leadId: 'kuai-xiang',
    itemIds: ['kuai-xiang', 'yu-hao', 'lei-fada', 'cai-xin', 'liang-jiu'],
    insightTitle: '匠作不止于手艺',
    insightBody:
      '从高层木塔到皇家宫苑，名匠真正重要的地方，不只是"会做"，而是能在复杂工程中持续判断结构、尺度、工序与协作关系。蒯祥、蔡信代表了南方匠师北上参与国家工程的传统，梁九则体现了清初匠师群体在大木作领域的精湛技艺。这些人物的故事为文创设计提供了丰富的人物原型与精神内涵。',
  },
  {
    id: 'legendary-craftsmen',
    label: '百工传统',
    intro: '从传说中的鲁班到唐代的阎立德，古代工匠传统既有神话化的行业记忆，也有真实的工程实践。',
    leadId: 'lu-ban',
    itemIds: ['lu-ban', 'yan-lide'],
    insightTitle: '传说与历史之间',
    insightBody:
      '鲁班代表了工匠精神的文化符号化过程——工具发明、行业崇拜与技艺传承都汇聚在同一个名字之下。阎立德则代表了唐代工程世家将建筑设计与工艺制作紧密结合的实践传统。两者共同构成了理解古代工匠文化的两个维度。',
  },
  {
    id: 'engineering-spirit',
    label: '工程精神',
    intro: '从古代建筑技术人物的实践中，提炼出今天仍可阅读和理解的专题维度。',
    leadId: 'li-jie',
    itemIds: ['li-jie', 'kuai-xiang', 'yangshi-lei', 'yuwen-kai', 'lu-ban'],
    insightTitle: '应当看见怎样的精神',
    insightBody:
      '如果把这些人物放回工程史脉络中，他们共同体现的是标准意识、现场判断、工种协同、图档管理与代际传承。从鲁班的行业认同到宇文恺的规划先行，从李诫的制度整理到样式雷的图档管理，古代建筑智慧始终在经验与制度之间寻求平衡。',
    spiritCards: [
      { title: '制度意识', body: '把经验整理成法式、做法和可复用的工程语言。' },
      { title: '现场判断', body: '在真实工程中不断修正尺度、材料与施工逻辑。' },
      { title: '图样管理', body: '重视图档、烫样、做法说明与文书协同。' },
      { title: '代际传承', body: '通过家族、师徒和工程体系维持知识连续性。' },
      { title: '规划先行', body: '在大规模营建之前，先完成格局、路网与制度的整体设计。' },
      { title: '行业认同', body: '通过祖师崇拜、行业规范与技艺传承凝聚工匠群体的文化认同。' },
    ],
  },
]

export const treatiseEntries: TreatiseEntry[] = [
  {
    id: 'yingzao-fashi',
    title: '《营造法式》',
    author: '李诫奉敕编修',
    dynasty: '北宋',
    kind: '官式营造总则',
    summary:
      '《营造法式》是现存最完整、最系统的中国古代建筑文献之一。它将制度、工种、功限、料例与图样组织成一部可执行的官式营造规范书。',
    excerpt: '“以材为祖，材有八等。”',
    excerptSource: '见《营造法式》大木作制度，故宫博物院馆藏说明有相关介绍。',
    image: 'images/reference/treatises/yingzao_fashi_nlc.jpg',
    imageAlt: '《营造法式》相关图像',
    highlights: [
      '是研究中国古代建筑制度与模数体系的核心文献。',
      '内容涵盖总释、制度、功限、料例与图样等部分。',
      '体现了古代建筑标准化、模数化的重要思路。',
    ],
    terms: ['材分', '总释', '总例', '功限', '料例', '图样'],
    crafts: ['大木作', '小木作', '瓦作', '砖作', '彩画作', '锯作'],
    sources: [
      { label: '故宫博物院《营造法式》词条', url: 'https://www.dpm.org.cn/lemmas/243760.html', org: '故宫博物院' },
      { label: '故宫博物院馆藏说明', url: 'https://www.dpm.org.cn/ancient/mingqing/149329.html', org: '故宫博物院' },
    ],
    externalLinks: [
      { label: '查看故宫博物院词条', url: 'https://www.dpm.org.cn/lemmas/243760.html', org: '故宫博物院' },
      { label: '查看馆藏版本说明', url: 'https://www.dpm.org.cn/ancient/mingqing/149329.html', org: '故宫博物院' },
    ],
    relatedCategories: ['guanfu', 'huanggong'],
    themeTags: ['法度', '模数', '工种', '图样'],
  },
  {
    id: 'yuanye',
    title: '《园冶》',
    author: '计成',
    dynasty: '明代',
    kind: '造园原典',
    summary:
      '《园冶》是中国古代最具代表性的造园专著之一。它将相地、立基、屋宇、掇山、借景等问题系统写入文本，是理解传统园林审美与营造理法的关键入口。',
    excerpt: '“虽由人作，宛自天开。”',
    excerptSource: '见《园冶·园说》，相关园林专题文章多有引用。',
    image: 'images/reference/treatises/yuanye_official.jpg',
    imageAlt: '《园冶》相关图像',
    highlights: [
      '是理解中国传统园林设计方法的重要原典。',
      '系统讨论相地、屋宇、掇山、选石与借景等内容。',
      '“巧于因借，精在体宜”的理念至今仍影响园林设计。',
    ],
    terms: ['相地', '立基', '掇山', '选石', '借景', '体宜'],
    crafts: ['园地规划', '屋宇配置', '山石经营', '借景组织'],
    sources: [
      { label: '苏州市园林局园林历史专题', url: 'https://ylj.suzhou.gov.cn/szsylj/ylls/wztt.shtml', org: '苏州市园林局' },
      { label: '光明网《园冶》专题文章', url: 'https://news.gmw.cn/2024-04/14/content_37261696.htm', org: '光明网' },
    ],
    externalLinks: [
      { label: '查看苏州市园林局资料', url: 'https://ylj.suzhou.gov.cn/szsylj/ylls/wztt.shtml', org: '苏州市园林局' },
      { label: '查看光明网专题解读', url: 'https://news.gmw.cn/2024-04/14/content_37261696.htm', org: '光明网' },
    ],
    relatedCategories: ['yuanlin'],
    themeTags: ['园林', '借景', '计成', '审美'],
  },
  {
    id: 'gongcheng-zuofa',
    title: '《工程做法则例》',
    author: '清工部颁行',
    dynasty: '清代',
    kind: '官式工程规范',
    summary:
      '《工程做法则例》是清代官式建筑的重要规范文献。它延续了官式工程的制度传统，也为样式雷图样、做法说明与工程估算提供了直接参照。',
    excerpt: '是清代官式建筑通行的标准设计与做法规范。',
    excerptSource: '据故宫博物院《工程做法则例》词条概述整理。',
    image: 'images/reference/treatises/gongchengzuofazeli.png',
    imageAlt: '《工程做法则例》相关图像',
    highlights: [
      '是理解清代官式建筑尺度与做法的关键文献。',
      '关联做法说明、工料估算与工程组织制度。',
      '可与样式雷图档相互参照阅读。',
    ],
    terms: ['做法', '工料估算', '内工', '外工', '样房', '算房'],
    crafts: ['官式建筑设计', '工程估算', '做法说明', '施工差错控制'],
    sources: [
      { label: '故宫博物院《工程做法则例》词条', url: 'https://www.dpm.org.cn/lemmas/239498.html', org: '故宫博物院' },
      { label: '国家图书馆样式雷世家及图档', url: 'https://www.nlc.cn/nmcb/gcjpdz/ysl/sjtd/', org: '国家图书馆' },
    ],
    externalLinks: [
      { label: '查看故宫博物院词条', url: 'https://www.dpm.org.cn/lemmas/239498.html', org: '故宫博物院' },
      { label: '查看国家图书馆图档说明', url: 'https://www.nlc.cn/nmcb/gcjpdz/ysl/sjtd/', org: '国家图书馆' },
    ],
    relatedCategories: ['huanggong', 'guanfu'],
    themeTags: ['做法', '清代', '估算', '官式'],
  },
  {
    id: 'kaogongji',
    title: '《考工记》',
    author: '先秦工匠制度汇编',
    dynasty: '先秦',
    kind: '百工制度经典',
    summary:
      '《考工记》是中国现存最早的手工业技术文献，系统记录了先秦时期官营手工业的分工制度与技术规范。其中"匠人营国"一节对都城规划制度的描述，成为后世理解中国古代城市设计思想的关键文本。',
    excerpt: '"匠人营国，方九里，旁三门，国中九经九纬，经涂九轨。"',
    excerptSource: '见《考工记·匠人》，此为论述都城规划制度的核心段落。',
    image: 'images/reference/treatises/kaogongji.jpeg',
    imageAlt: '《考工记》相关图像',
    highlights: [
      '是中国现存最早系统记录百工制度与技术规范的文献。',
      '"匠人营国"段落奠定了中国古代都城规划的理论基础。',
      '对车舆、兵器、礼器等制作工艺的详细记录，是研究先秦技术史的核心资料。',
    ],
    terms: ['匠人营国', '六齐', '轮人', '舆人', '攻木之工', '攻金之工'],
    crafts: ['都城规划', '车舆制作', '兵器制造', '礼器铸造'],
    sources: [
      { label: '中国国家博物馆先秦工艺专题', url: 'https://www.chnmuseum.cn/', org: '中国国家博物馆' },
    ],
    externalLinks: [
      { label: '查看中国国家博物馆专题', url: 'https://www.chnmuseum.cn/', org: '中国国家博物馆' },
    ],
    relatedCategories: ['guanfu', 'huanggong'],
    themeTags: ['考工记', '百工', '营国制度', '先秦技术'],
  },
  {
    id: 'mujing',
    title: '《木经》',
    author: '喻皓（传）',
    dynasty: '五代至北宋初',
    kind: '木构营造专书',
    summary:
      '《木经》相传为喻皓所著，是中国古代专门论述木结构建筑技术的早期著作。虽然原书已佚，但通过沈括《梦溪笔谈》等文献的转引与记载，仍可窥见其关于木构尺度、比例与施工方法的重要论述。',
    excerpt: '"营舍之法，谓之《木经》。"',
    excerptSource: '见沈括《梦溪笔谈》卷十八，转引喻皓《木经》相关内容。',
    image: 'images/reference/treatises/mujing.jpeg',
    imageAlt: '《木经》相关图像',
    highlights: [
      '是中国古代木构建筑技术的早期专书，相传为喻皓所著。',
      '原书已佚，但通过《梦溪笔谈》等文献的转引保留了部分内容。',
      '其关于建筑尺度与比例的论述，对理解早期木构技术发展具有重要参考价值。',
    ],
    terms: ['木构', '尺度', '比例', '举折', '侧脚', '生起'],
    crafts: ['木构架设计', '尺度控制', '举折制度', '施工方法'],
    sources: [
      { label: '杭州市档案馆喻皓与《木经》', url: 'https://www.hzarchives.org.cn/', org: '杭州市档案馆' },
    ],
    externalLinks: [
      { label: '查看杭州市档案馆资料', url: 'https://www.hzarchives.org.cn/', org: '杭州市档案馆' },
    ],
    relatedCategories: ['qiaoliang', 'zongjiao'],
    themeTags: ['木经', '喻皓', '木构技术', '举折'],
  },
  {
    id: 'lubanjing',
    title: '《鲁班经》',
    author: '民间匠作汇编',
    dynasty: '明代',
    kind: '民间匠作手册',
    summary:
      '《鲁班经》是明代以来流传最广的民间建筑与木作技术手册。它以鲁班之名汇集了家具制作、房屋营造、选材用尺等方面的实用知识，是研究古代民间匠作传统与行业文化的重要文献。',
    excerpt: '"匠人不可不知规矩，规矩者，方圆之至也。"',
    excerptSource: '见《鲁班经》开篇，强调规矩与法度在匠作中的核心地位。',
    image: 'images/reference/treatises/lubanjing.jpeg',
    imageAlt: '《鲁班经》相关图像',
    highlights: [
      '是明代以来流传最广的民间建筑与木作技术手册。',
      '内容涵盖房屋营造、家具制作、选材用尺与吉凶宜忌。',
      '以鲁班之名汇集知识，体现了工匠行业的文化认同与知识传承方式。',
    ],
    terms: ['鲁班尺', '压白', '门光尺', '大木', '小木', '吉凶宜忌'],
    crafts: ['民间房屋营造', '家具制作', '选材用尺', '行业仪轨'],
    sources: [
      { label: '中国非物质文化遗产网传统匠作', url: 'https://www.ihchina.cn/', org: '中国非物质文化遗产网' },
    ],
    externalLinks: [
      { label: '查看中国非物质文化遗产网', url: 'https://www.ihchina.cn/', org: '中国非物质文化遗产网' },
    ],
    relatedCategories: ['minju'],
    themeTags: ['鲁班经', '民间匠作', '鲁班尺', '行业手册'],
  },
  {
    id: 'changwuzhi',
    title: '《长物志》',
    author: '文震亨',
    dynasty: '明代',
    kind: '居游审美典籍',
    summary:
      '《长物志》是明代文人文震亨所著的居游审美典籍，系统论述了室庐、花木、水石、禽鱼、书画、几榻、器具等与居住和游赏相关的审美标准。它从文人视角为理解明代居住文化与园林审美提供了独特入口。',
    excerpt: '"居山水间者为上，村居次之，郊居又次之。"',
    excerptSource: '见《长物志·室庐》，论述居所选址的审美层次。',
    image: 'images/reference/treatises/changwuzhi.jpeg',
    imageAlt: '《长物志》相关图像',
    highlights: [
      '从文人视角系统论述居住与游赏的审美标准。',
      '涵盖室庐、花木、水石、器具等十二个门类，构建了完整的居游审美体系。',
      '与《园冶》互为补充，从不同角度呈现明代园林与居住文化的丰富面貌。',
    ],
    terms: ['室庐', '花木', '水石', '禽鱼', '书画', '几榻'],
    crafts: ['居所审美', '园林陈设', '器具鉴赏', '花木配置'],
    sources: [
      { label: '苏州市园林局园林历史专题', url: 'https://ylj.suzhou.gov.cn/szsylj/ylls/wztt.shtml', org: '苏州市园林局' },
    ],
    externalLinks: [
      { label: '查看苏州园林局资料', url: 'https://ylj.suzhou.gov.cn/szsylj/ylls/wztt.shtml', org: '苏州市园林局' },
    ],
    relatedCategories: ['yuanlin', 'minju'],
    themeTags: ['长物志', '文人审美', '居游', '明代园林'],
  },
]

export const treatiseSections: TreatiseSection[] = [
  {
    id: 'codes',
    label: '营造法度',
    intro: '聚焦古代建筑文献中的“法度”与“模数”，呈现工匠经验如何被整理成规范文本。',
    leadId: 'yingzao-fashi',
    relatedIds: ['gongcheng-zuofa', 'kaogongji'],
    insightTitle: '为什么《营造法式》重要',
    insightBody: '它不仅是一部古籍，更是一套将尺度、工种、图样与管理语言系统化的工程知识体系。从《考工记》的百工制度到《营造法式》的材分模数，法度传统贯穿了中国古代建筑知识的核心脉络。',
  },
  {
    id: 'garden-classics',
    label: '园林原典',
    intro: '园林原典不只是审美读物，它把相地、屋宇、借景、掇山等造园问题转化成可操作的方法。',
    leadId: 'yuanye',
    relatedIds: ['yingzao-fashi', 'changwuzhi'],
    insightTitle: '从工法到意境',
    insightBody: '《园冶》最动人的地方，在于它把操作方法与园林意境写在了一起。而《长物志》则从文人视角补充了居游审美的另一维度，两者共同构成了理解明代园林文化的完整图景。',
  },
  {
    id: 'timber-craft',
    label: '木构技艺',
    intro: '从《木经》到《鲁班经》，木构技术文献记录了古代工匠如何将结构判断与施工经验转化为可传授的知识。',
    leadId: 'mujing',
    relatedIds: ['lubanjing', 'yingzao-fashi'],
    insightTitle: '从经验到手册',
    insightBody: '《木经》代表了早期木构技术的经验总结，虽已散佚但影响深远；《鲁班经》则体现了民间匠作知识以行业手册形式传播的传统。两者共同展现了木构知识从师徒口传走向文本记录的演变过程。',
  },
  {
    id: 'qing-rules',
    label: '清代做法',
    intro: '清代建筑工程的文本世界，不止有图样，还有清晰的做法说明、用料与估算体系。',
    leadId: 'gongcheng-zuofa',
    relatedIds: [],
    insightTitle: '图样为何离不开做法',
    insightBody: '在清代工程里，图样、烫样和文字做法说明彼此配合，单看其中任何一项都不够完整。',
  },
  {
    id: 'glossary',
    label: '术语索引',
    intro: '术语索引把前面几部原典里最常出现的关键词提取出来，帮助读者建立阅读坐标。',
    leadId: 'yingzao-fashi',
    relatedIds: ['yuanye', 'gongcheng-zuofa', 'kaogongji', 'mujing', 'lubanjing', 'changwuzhi'],
    insightTitle: '先认词，再读书',
    insightBody: '很多古代建筑文献并不难读，真正的门槛往往在于没有先建立术语语境。',
    glossaryGroups: [
      { title: '法式类', items: ['材分', '总例', '制度', '功限', '料例', '图样'] },
      { title: '园林类', items: ['相地', '立基', '借景', '掇山', '选石', '体宜'] },
      { title: '做法类', items: ['做法', '样房', '算房', '工料估算', '地盘图', '烫样'] },
      { title: '百工类', items: ['匠人营国', '六齐', '攻木之工', '攻金之工', '轮人', '舆人'] },
      { title: '木构类', items: ['举折', '侧脚', '生起', '鲁班尺', '压白', '门光尺'] },
      { title: '居游类', items: ['室庐', '花木', '水石', '禽鱼', '书画', '几榻'] },
    ],
  },
]

export const cultureScenes: CultureTheme[] = [
  {
    id: 'ritual-capital',
    label: '礼制与都城',
    intro: '礼制并不是抽象概念，它会落实为都城轴线、祭祀建筑、公共空间和道路组织。',
    stat: '15',
    statLabel: '北京中轴线遗产构成要素',
    statNote: 'UNESCO 中文页面明确写明，北京中轴线由 5 大类 15 项遗产构成要素组成。',
    image: 'images/reference/culture/beijing_axis_unesco.jpg',
    imageAlt: '北京中轴线相关图像',
    summary:
      '北京中轴线展示了中国理想都城秩序如何通过宫殿、祭祀建筑、城市管理设施和公共建筑被连续表达出来。',
    facts: [
      'UNESCO 指出该区域具有约 3000 年聚落历史，中轴线本身源于元大都。',
      '中轴线由古代皇家宫殿建筑、祭祀建筑、城市管理设施、国家礼仪与公共建筑、居中道路遗存等 5 大类构成。',
      '这条轴线见证了北京从帝国王都到现代首都的历史演变。',
    ],
    detailCards: [
      { title: '都城秩序', body: '轴线不是单纯道路，而是将礼制、权力、公共性和城市规划压缩到一条结构线中。' },
      { title: '考工记回响', body: 'UNESCO 页面特别提到《考工记》所描述的理想都城秩序，说明古代营城观念在北京留下了可见痕迹。' },
    ],
    sources: [
      { label: 'UNESCO 北京中轴线中文页', url: 'https://whc.unesco.org/zh/list/1714', org: 'UNESCO World Heritage Centre' },
    ],
    externalLinks: [
      { label: '查看 UNESCO 官方页面', url: 'https://whc.unesco.org/zh/list/1714', org: 'UNESCO World Heritage Centre' },
    ],
    themeTags: ['中轴线', '礼制', '都城', '考工记'],
    relatedCategories: ['huanggong', 'guanfu'],
  },
  {
    id: 'garden-life',
    label: '园林与游观',
    intro: '中国古代园林把审美、政治、居住和游赏组织成一个完整文化系统。',
    stat: '1998',
    statLabel: '颐和园列入世界遗产时间',
    statNote: 'UNESCO 将颐和园界定为中国景观园林设计的杰出代表。',
    image: 'images/reference/culture/summer_palace_unesco.jpg',
    imageAlt: '颐和园或中国古典园林相关图像',
    summary:
      '从《园冶》的理法，到颐和园和苏州古典园林的空间实践，古代园林体现的是“人工与自然相协调”的游观文明。',
    facts: [
      'UNESCO 认为颐和园是中国景观园林设计创造艺术的杰出表达。',
      '颐和园将自然山水与亭台殿宇、桥岛长廊整合为一体，兼具政治、居住、游赏与精神功能。',
      '苏州市园林局指出，《园冶》系统整理了相地、屋宇、掇山、借景等造园经验。',
    ],
    detailCards: [
      { title: '游观传统', body: '古典园林并不只是“看景”，而是通过路径、视线和借景组织出层层递进的游赏节奏。' },
      { title: '园林文脉', body: '《园冶》把园林从经验性的工匠技艺，推进到可讨论、可书写、可传授的理论层面。' },
    ],
    sources: [
      { label: 'UNESCO 颐和园页面', url: 'https://whc.unesco.org/en/list/880/', org: 'UNESCO World Heritage Centre' },
      { label: '苏州市园林局园林历史专题', url: 'https://ylj.suzhou.gov.cn/szsylj/ylls/wztt.shtml', org: '苏州市园林局' },
    ],
    externalLinks: [
      { label: '查看颐和园 UNESCO 页面', url: 'https://whc.unesco.org/en/list/880/', org: 'UNESCO World Heritage Centre' },
      { label: '查看苏州园林局资料', url: 'https://ylj.suzhou.gov.cn/szsylj/ylls/wztt.shtml', org: '苏州市园林局' },
    ],
    themeTags: ['园林', '游观', '颐和园', '借景'],
    relatedCategories: ['yuanlin'],
  },
  {
    id: 'traditional-villages',
    label: '传统村落',
    intro: '古代建筑文明的延续，不只在孤立古迹里，更在成片村落、历史建筑和活态乡土生活中。',
    stat: '8155',
    statLabel: '国家级保护名录中的传统村落数量',
    statNote: '住房和城乡建设部公开信息显示，全国已有 8155 个传统村落列入国家级保护名录。',
    image: 'images/reference/culture/dangdaichuancheng.jpeg',
    imageAlt: '传统村落保护相关图像',
    summary:
      '住建部关于传统村落保护利用的公开信息表明，中国传统村落保护已经形成世界范围内规模最大、内容最丰富、保护较完整的农耕文明遗产保护群。',
    facts: [
      '住建部公开数据同时提到，已保护 53.9 万栋历史建筑和传统民居。',
      '相关工作还挖掘出 4789 项省级以上非物质文化遗产。',
      '传统村落保护强调“保护为先、利用为基、传承为本”。',
    ],
    detailCards: [
      { title: '村落不是背景', body: '古建筑文化真正的力量，往往体现在聚落肌理、巷道、水系、院落和乡风民俗的整体关系中。' },
      { title: '活态传承', body: '传统村落的价值在于“还在生活中”，它们不是静态标本，而是仍然与当代社区共存的文化空间。' },
    ],
    sources: [
      { label: '住建部传统村落保护利用信息', url: 'https://www.mohurd.gov.cn/xinwen/gzdt/art/2023/art_304_771352.html', org: '住房和城乡建设部' },
    ],
    externalLinks: [
      { label: '查看住建部官方信息', url: 'https://www.mohurd.gov.cn/xinwen/gzdt/art/2023/art_304_771352.html', org: '住房和城乡建设部' },
    ],
    themeTags: ['传统村落', '历史建筑', '乡土中国', '活态保护'],
    relatedCategories: ['minju'],
  },
  {
    id: 'intangible-craft',
    label: '非遗技艺',
    intro: '古代建筑文明之所以能延续下来，不只是因为留下了建筑实体，也因为构架、榫卯、木拱桥等营造技艺仍在传承。',
    stat: '2009 / 2024',
    statLabel: '两项建筑相关技艺入选 UNESCO 非遗年份',
    statNote:
      '中国传统木结构营造技艺于 2009 年列入 UNESCO 非遗代表作名录，木拱桥传统设计与建造技艺于 2024 年列入代表作名录。',
    image: 'images/reference/culture/wooden_arch_bridges_unesco.jpg',
    imageAlt: '木构技艺或木拱桥相关图像',
    summary:
      '从木构架到木拱桥，UNESCO 非遗页面展示的不是孤立工艺，而是一整套与环境、材料、结构判断和社区生活紧密相关的知识系统。',
    facts: [
      'UNESCO 指出，中国传统木结构营造技艺通过师徒口传心授与实践操作延续。',
      '木拱桥传统技艺强调编梁、榫卯和对环境、结构力学的经验判断。',
      '木拱桥不仅是交通设施，也是村落文化空间和社区记忆的一部分。',
    ],
    detailCards: [
      { title: '木构智慧', body: '木构架体系依靠榫卯连接形成柔性、抗震的结构方式，是中国传统建筑最具辨识度的技术特征之一。' },
      { title: '桥即公共空间', body: 'UNESCO 特别强调木拱桥与社区和谐、教育传播和地方文化生态之间的关系。' },
    ],
    sources: [
      { label: 'UNESCO 木结构营造技艺页面', url: 'https://ich.unesco.org/en/RL/chinese-traditional-architectural-craftsmanship-for-timber-framed-structures-00223', org: 'UNESCO Intangible Heritage' },
      { label: 'UNESCO 木拱桥技艺页面', url: 'https://ich.unesco.org/en/RL/traditional-design-and-practices-for-building-chinese-wooden-arched-bridges-00303', org: 'UNESCO Intangible Heritage' },
    ],
    externalLinks: [
      { label: '查看木结构营造技艺', url: 'https://ich.unesco.org/en/RL/chinese-traditional-architectural-craftsmanship-for-timber-framed-structures-00223', org: 'UNESCO Intangible Heritage' },
      { label: '查看木拱桥技艺', url: 'https://ich.unesco.org/en/RL/traditional-design-and-practices-for-building-chinese-wooden-arched-bridges-00303', org: 'UNESCO Intangible Heritage' },
    ],
    themeTags: ['非遗', '木构', '榫卯', '木拱桥'],
    relatedCategories: ['qiaoliang', 'zongjiao'],
  },
  {
    id: 'living-heritage',
    label: '当代传承',
    intro: '今天谈古代建筑文化，不是停留在怀旧，而是要看到保护、申遗、教育与公众传播仍在持续推进。',
    stat: '60',
    statLabel: '中国列入《世界遗产名录》项目总数',
    statNote: 'UNESCO 中国国家页面显示，截至当前，中国共有 60 项世界遗产。',
    image: 'images/reference/culture/china_heritage_unesco.jpg',
    imageAlt: '中国世界遗产与建筑文明传承相关图像',
    summary:
      '从世界遗产到传统村落保护，再到非遗技艺进入教育和社区实践，古代建筑文明正以“保护、传播、生活化”的方式继续生长。',
    facts: [
      'UNESCO 中国国家页面显示，中国目前共有 60 项世界遗产。',
      '北京中轴线于 2024 年列入《世界遗产名录》，说明都城遗产保护仍在不断推进。',
      '木拱桥技艺页面提到，相关知识和历史文化已被整合进正式教育资源，用于地方文化发展。',
    ],
    detailCards: [
      { title: '保护不止修旧如旧', body: '真正的传承还包括教育传播、社区参与、工艺延续和公众认知更新。' },
      { title: '从遗产到日常', body: '当建筑文明被重新纳入城市生活、乡村保护和文化教育时，传统才不会只停留在纪念意义上。' },
    ],
    sources: [
      { label: 'UNESCO 中国国家页面', url: 'https://whc.unesco.org/en/statesparties/cn', org: 'UNESCO World Heritage Centre' },
      { label: 'UNESCO 北京中轴线页面', url: 'https://whc.unesco.org/zh/list/1714', org: 'UNESCO World Heritage Centre' },
      { label: '住建部传统村落保护信息', url: 'https://www.mohurd.gov.cn/xinwen/gzdt/art/2023/art_304_771352.html', org: '住房和城乡建设部' },
    ],
    externalLinks: [
      { label: '查看 UNESCO 中国页面', url: 'https://whc.unesco.org/en/statesparties/cn', org: 'UNESCO World Heritage Centre' },
      { label: '查看北京中轴线页面', url: 'https://whc.unesco.org/zh/list/1714', org: 'UNESCO World Heritage Centre' },
    ],
    themeTags: ['世界遗产', '保护', '教育', '活态传承'],
    relatedCategories: ['huanggong', 'minju', 'yuanlin'],
  },
  {
    id: 'vernacular-dwellings',
    label: '民居与聚落',
    intro: '民居是最广泛存在的建筑类型，它承载着地域气候、家族组织、生计方式与审美习惯的深层信息。',
    stat: '53.9万',
    statLabel: '已保护的历史建筑与传统民居数量',
    statNote: '住建部公开信息显示，全国已保护 53.9 万栋历史建筑和传统民居。',
    image: 'images/reference/culture/minjuyujuluo.jpeg',
    imageAlt: '传统民居与聚落相关图像',
    summary:
      '从四合院到土楼，从徽派民居到窑洞，中国传统民居呈现出极其丰富的地域差异。这些差异背后，是气候适应、家族制度、材料选择与文化审美的综合作用。',
    facts: [
      '四合院是北方民居的典型形制，其空间组织体现了家族伦理与等级秩序。',
      '福建土楼以夯土与木构结合，兼具居住与防御功能，2008年列入世界遗产。',
      '徽派民居以马头墙、天井和木雕装饰为特色，反映了商贾文化与宗族制度的结合。',
    ],
    detailCards: [
      { title: '地域与气候', body: '民居形制的差异，首先是对气候与地形的回应。从南方的干栏式建筑到北方的厚墙小窗，每一处细节都蕴含着环境适应的智慧。' },
      { title: '家族与空间', body: '民居的空间组织往往映射着家族结构——正房、厢房、倒座的等级关系，天井与厅堂的公共性分配，都是社会秩序的空间表达。' },
    ],
    sources: [
      { label: '住建部传统村落保护利用信息', url: 'https://www.mohurd.gov.cn/xinwen/gzdt/art/2023/art_304_771352.html', org: '住房和城乡建设部' },
      { label: 'UNESCO 福建土楼页面', url: 'https://whc.unesco.org/en/list/1113', org: 'UNESCO World Heritage Centre' },
    ],
    externalLinks: [
      { label: '查看住建部保护信息', url: 'https://www.mohurd.gov.cn/xinwen/gzdt/art/2023/art_304_771352.html', org: '住房和城乡建设部' },
      { label: '查看福建土楼 UNESCO 页面', url: 'https://whc.unesco.org/en/list/1113', org: 'UNESCO World Heritage Centre' },
    ],
    themeTags: ['民居', '四合院', '土楼', '地域建筑'],
    relatedCategories: ['minju'],
  },
  {
    id: 'bridges-crossings',
    label: '桥梁与津渡',
    intro: '桥梁不只是交通设施，它连接两岸、组织聚落、承载商贸，是古代工程智慧与公共空间意识的集中体现。',
    stat: '2024',
    statLabel: '木拱桥传统技艺列入 UNESCO 非遗年份',
    statNote: 'UNESCO 于 2024 年将木拱桥传统设计与建造技艺列入非遗代表作名录，肯定了其独特的结构智慧与文化价值。',
    image: 'images/reference/culture/qiaoliangyujiindu.jpg',
    imageAlt: '桥梁与津渡相关图像',
    summary:
      '从赵州桥的敞肩拱到闽浙木拱桥的编梁结构，中国古代桥梁展现了不同材料与结构体系的创新。桥梁不仅是交通节点，更是聚落公共空间与文化记忆的载体。',
    facts: [
      '赵州桥建于隋代，是世界上现存最古老的敞肩石拱桥，其结构原理比欧洲早了数百年。',
      '闽浙木拱桥采用编梁结构，以较短木材通过交织搭接跨越较大跨度，体现了极高的结构智慧。',
      '卢沟桥、洛阳桥等著名古桥兼具交通、商贸与纪念功能，是城市文化景观的重要组成部分。',
    ],
    detailCards: [
      { title: '结构创新', body: '赵州桥的敞肩拱设计既减轻了桥身自重，又增加了泄洪能力；木拱桥的编梁结构则以小材跨越大桥，两者都是结构力学与材料特性的精妙结合。' },
      { title: '桥与社区', body: '在闽浙地区，木拱桥往往兼有廊屋，既是交通设施，也是村民聚会、祭祀和商贸的公共空间，桥与社区生活紧密交织。' },
    ],
    sources: [
      { label: 'UNESCO 木拱桥技艺页面', url: 'https://ich.unesco.org/en/RL/traditional-design-and-practices-for-building-chinese-wooden-arched-bridges-00303', org: 'UNESCO Intangible Heritage' },
    ],
    externalLinks: [
      { label: '查看木拱桥技艺页面', url: 'https://ich.unesco.org/en/RL/traditional-design-and-practices-for-building-chinese-wooden-arched-bridges-00303', org: 'UNESCO Intangible Heritage' },
    ],
    themeTags: ['桥梁', '木拱桥', '赵州桥', '津渡'],
    relatedCategories: ['qiaoliang'],
  },
]

