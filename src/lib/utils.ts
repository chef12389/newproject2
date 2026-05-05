import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const IMAGE_ALIASES: Record<string, string> = {
  'images/reference/scientists/yu_hao_hzarchives.jpg': 'images/reference/scientists/li_jie_dpm.jpg',
  'images/reference/scientists/lei_fada_beijing.jpg': 'images/reference/scientists/yangshilei_nlc.jpg',
  'images/reference/culture/traditional_villages_mohurd.jpg': 'images/minju/hongcun.jpg',
  'images/reference/culture/china_heritage_unesco.jpg': 'images/reference/culture/beijing_axis_unesco.jpg',
}

export function normalizeImagePath(path: string): string {
  if (!path) return path
  const normalizedPath = path.replace(/\\/g, '/').replace(/^\.?\//, '')
  return IMAGE_ALIASES[normalizedPath] ?? normalizedPath
}

export function getBasePath(): string {
  const base = import.meta.env.BASE_URL || '/'
  if (base === '/') return '/'
  return base.endsWith('/') ? base.slice(0, -1) : base
}

export function getImageUrl(path: string): string {
  if (typeof window === 'undefined') return path

  const normalizedPath = normalizeImagePath(path)
  const base = getBasePath()

  if (normalizedPath.startsWith('http') || normalizedPath.startsWith('//') || normalizedPath.startsWith('data:')) {
    return normalizedPath
  }

  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  const relativePath = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath

  return `${normalizedBase}${relativePath}`
}
