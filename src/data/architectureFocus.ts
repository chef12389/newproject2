import { allCases, categoryData, type CategoryData, type CategoryId } from '@/data/architectureData'

export const PRIMARY_CATEGORY_IDS: CategoryId[] = ['minju', 'guanfu', 'huanggong', 'qiaoliang']

const PRIMARY_SET = new Set<CategoryId>(PRIMARY_CATEGORY_IDS)

export function isPrimaryCategory(id: CategoryId) {
  return PRIMARY_SET.has(id)
}

export function compareCategoryOrder(a: CategoryData, b: CategoryData) {
  const aPrimary = isPrimaryCategory(a.id)
  const bPrimary = isPrimaryCategory(b.id)

  if (aPrimary !== bPrimary) {
    return aPrimary ? -1 : 1
  }

  if (aPrimary && bPrimary) {
    return PRIMARY_CATEGORY_IDS.indexOf(a.id) - PRIMARY_CATEGORY_IDS.indexOf(b.id)
  }

  return a.name.localeCompare(b.name, 'zh-Hans')
}

export const orderedCategories = [...categoryData].sort(compareCategoryOrder)
export const primaryCategories = orderedCategories.filter((item) => isPrimaryCategory(item.id))
export const secondaryCategories = orderedCategories.filter((item) => !isPrimaryCategory(item.id))
export const primaryCases = allCases.filter((item) => isPrimaryCategory(item.categoryId))
export const secondaryCases = allCases.filter((item) => !isPrimaryCategory(item.categoryId))

