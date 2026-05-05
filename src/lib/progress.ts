import type { CategoryId } from '@/data/architectureData'
import { getActiveProfileId } from '@/lib/auth'

export interface JourneyState {
  visitedPages: string[]
  exploredCategories: CategoryId[]
  viewedCases: string[]
  favoriteCases: string[]
  completedPuzzles: number[]
  bestQuizScore: number
  trainingTopics: string[]
  wrongAnswers: WrongAnswerRecord[]
  recentTraining: TrainingSessionRecord[]
}

export interface WrongAnswerRecord {
  questionId: string
  topicId: string
  mode: string
  selectedAnswer: number
  correctAnswer: number
  sourceRoute?: string
  sourceLabel: string
  timestamp: number
}

export interface TrainingSessionRecord {
  topicId: string
  mode: string
  score: number
  total: number
  timestamp: number
}

const STORAGE_PREFIX = 'ancient-architecture-journey'

const defaultState: JourneyState = {
  visitedPages: [],
  exploredCategories: [],
  viewedCases: [],
  favoriteCases: [],
  completedPuzzles: [],
  bestQuizScore: 0,
  trainingTopics: [],
  wrongAnswers: [],
  recentTraining: [],
}

function readState(): JourneyState {
  if (typeof window === 'undefined') {
    return defaultState
  }

  const raw = window.localStorage.getItem(`${STORAGE_PREFIX}:${getActiveProfileId()}`)

  if (!raw) {
    return defaultState
  }

  try {
    const parsed = JSON.parse(raw) as Partial<JourneyState>

    return {
      visitedPages: parsed.visitedPages ?? [],
      exploredCategories: parsed.exploredCategories ?? [],
      viewedCases: parsed.viewedCases ?? [],
      favoriteCases: parsed.favoriteCases ?? [],
      completedPuzzles: parsed.completedPuzzles ?? [],
      bestQuizScore: parsed.bestQuizScore ?? 0,
      trainingTopics: parsed.trainingTopics ?? [],
      wrongAnswers: parsed.wrongAnswers ?? [],
      recentTraining: parsed.recentTraining ?? [],
    }
  } catch {
    return defaultState
  }
}

function readStateByProfileId(profileId: string): JourneyState {
  if (typeof window === 'undefined') {
    return defaultState
  }

  const raw = window.localStorage.getItem(`${STORAGE_PREFIX}:${profileId}`)

  if (!raw) {
    return defaultState
  }

  try {
    const parsed = JSON.parse(raw) as Partial<JourneyState>

    return {
      visitedPages: parsed.visitedPages ?? [],
      exploredCategories: parsed.exploredCategories ?? [],
      viewedCases: parsed.viewedCases ?? [],
      favoriteCases: parsed.favoriteCases ?? [],
      completedPuzzles: parsed.completedPuzzles ?? [],
      bestQuizScore: parsed.bestQuizScore ?? 0,
      trainingTopics: parsed.trainingTopics ?? [],
      wrongAnswers: parsed.wrongAnswers ?? [],
      recentTraining: parsed.recentTraining ?? [],
    }
  } catch {
    return defaultState
  }
}

function writeState(next: JourneyState) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(`${STORAGE_PREFIX}:${getActiveProfileId()}`, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent('journey-updated'))
}

function writeStateByProfileId(profileId: string, next: JourneyState) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(`${STORAGE_PREFIX}:${profileId}`, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent('journey-updated'))
}

function mergeUnique<T>(items: T[], value: T): T[] {
  return items.includes(value) ? items : [...items, value]
}

export function getJourneyState(): JourneyState {
  return readState()
}

export function trackPageVisit(page: string) {
  const current = readState()
  writeState({
    ...current,
    visitedPages: mergeUnique(current.visitedPages, page),
  })
}

export function trackCategory(category: CategoryId) {
  const current = readState()
  writeState({
    ...current,
    exploredCategories: mergeUnique(current.exploredCategories, category),
  })
}

export function trackCase(caseId: string) {
  const current = readState()
  writeState({
    ...current,
    viewedCases: mergeUnique(current.viewedCases, caseId),
  })
}

export function toggleFavoriteCase(caseId: string) {
  const current = readState()
  const favoriteCases = current.favoriteCases.includes(caseId)
    ? current.favoriteCases.filter((item) => item !== caseId)
    : [...current.favoriteCases, caseId]

  writeState({
    ...current,
    favoriteCases,
  })
}

export function recordPuzzleCompletion(id: number) {
  const current = readState()
  writeState({
    ...current,
    completedPuzzles: mergeUnique(current.completedPuzzles, id),
  })
}

export function recordQuizScore(score: number) {
  const current = readState()
  writeState({
    ...current,
    bestQuizScore: Math.max(current.bestQuizScore, score),
  })
}

export function recordTrainingSession(
  session: TrainingSessionRecord & {
    wrongAnswers?: WrongAnswerRecord[]
  },
) {
  const current = readState()
  const nextWrongAnswers = [...(session.wrongAnswers ?? []), ...current.wrongAnswers]
    .sort((a, b) => b.timestamp - a.timestamp)
    .filter((item, index, items) => items.findIndex((candidate) => candidate.questionId === item.questionId) === index)
    .slice(0, 30)

  const recentTraining = [session, ...current.recentTraining]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 8)

  writeState({
    ...current,
    trainingTopics: mergeUnique(current.trainingTopics, session.topicId),
    recentTraining,
    wrongAnswers: nextWrongAnswers,
    bestQuizScore: Math.max(current.bestQuizScore, session.score),
  })
}

export function resetJourney() {
  writeState(defaultState)
}

export function migrateJourneyState(fromProfileId: string, toProfileId: string) {
  if (typeof window === 'undefined' || !fromProfileId || !toProfileId || fromProfileId === toProfileId) {
    return
  }

  const source = readStateByProfileId(fromProfileId)
  const target = readStateByProfileId(toProfileId)

  const merged: JourneyState = {
    visitedPages: Array.from(new Set([...target.visitedPages, ...source.visitedPages])),
    exploredCategories: Array.from(new Set([...target.exploredCategories, ...source.exploredCategories])),
    viewedCases: Array.from(new Set([...target.viewedCases, ...source.viewedCases])),
    favoriteCases: Array.from(new Set([...target.favoriteCases, ...source.favoriteCases])),
    completedPuzzles: Array.from(new Set([...target.completedPuzzles, ...source.completedPuzzles])),
    bestQuizScore: Math.max(target.bestQuizScore, source.bestQuizScore),
    trainingTopics: Array.from(new Set([...target.trainingTopics, ...source.trainingTopics])),
    wrongAnswers: [...target.wrongAnswers, ...source.wrongAnswers]
      .sort((a, b) => b.timestamp - a.timestamp)
      .filter((item, index, items) => items.findIndex((candidate) => candidate.questionId === item.questionId) === index)
      .slice(0, 30),
    recentTraining: [...target.recentTraining, ...source.recentTraining].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8),
  }

  writeStateByProfileId(toProfileId, merged)
  window.localStorage.removeItem(`${STORAGE_PREFIX}:${fromProfileId}`)
}
