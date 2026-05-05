import type { CategoryId } from '@/data/architectureData'
import { getImageUrl } from '@/lib/utils'

export function buildCaseRoute(categoryId: CategoryId, caseId: string) {
  return `/architecture/${categoryId}?case=${caseId}`
}

export function buildCaseShareUrl(categoryId: CategoryId, caseId: string) {
  const route = buildCaseRoute(categoryId, caseId)

  if (typeof window === 'undefined') {
    return route
  }

  return `${window.location.origin}${window.location.pathname}#${route}`
}

export async function shareCaseLink({
  title,
  text,
  categoryId,
  caseId,
}: {
  title: string
  text?: string
  categoryId: CategoryId
  caseId: string
}) {
  const url = buildCaseShareUrl(categoryId, caseId)

  if (typeof navigator !== 'undefined' && navigator.share) {
    await navigator.share({
      title,
      text,
      url,
    })
    return 'shared' as const
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url)
    return 'copied' as const
  }

  return 'unsupported' as const
}

export async function downloadCaseImage({
  image,
  filename,
}: {
  image: string
  filename: string
}) {
  if (typeof window === 'undefined') {
    return false
  }

  const imageUrl = getImageUrl(image)

  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const objectUrl = window.URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = objectUrl
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.URL.revokeObjectURL(objectUrl)
    return true
  } catch {
    const anchor = document.createElement('a')
    anchor.href = imageUrl
    anchor.download = filename
    anchor.target = '_blank'
    anchor.rel = 'noreferrer'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    return true
  }
}
