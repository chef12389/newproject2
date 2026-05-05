const ENTRY_PENDING_KEY = 'ancient-architecture-entry-pending'
const ENTRY_TARGET_KEY = 'ancient-architecture-entry-target'

function canUseSessionStorage() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
}

export function beginEntryPrologue(target = '/') {
  if (!canUseSessionStorage()) {
    return
  }

  window.sessionStorage.setItem(ENTRY_PENDING_KEY, '1')
  window.sessionStorage.setItem(ENTRY_TARGET_KEY, target)
}

export function isEntryProloguePending() {
  if (!canUseSessionStorage()) {
    return false
  }

  return window.sessionStorage.getItem(ENTRY_PENDING_KEY) === '1'
}

export function getEntryPrologueTarget() {
  if (!canUseSessionStorage()) {
    return '/'
  }

  return window.sessionStorage.getItem(ENTRY_TARGET_KEY) || '/'
}

export function completeEntryPrologue() {
  if (!canUseSessionStorage()) {
    return
  }

  window.sessionStorage.removeItem(ENTRY_PENDING_KEY)
}
