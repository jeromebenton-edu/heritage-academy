"use client"

import * as React from "react"
import { Toaster } from "react-hot-toast"

type LessonProgress = Record<string, { completedAt: number }>
type QuizAttempt = {
  attempts: number
  bestScore: number
  lastScore: number
  passed: boolean
  updatedAt: number
}
type QuizProgress = Record<string, QuizAttempt>

export type ProgressState = {
  lessons: LessonProgress
  quizzes: QuizProgress
}

type ProgressContextValue = {
  state: ProgressState
  markLessonCompleted: (lessonId: string) => void
  unmarkLesson: (lessonId: string) => void
  recordQuizResult: (quizId: string, score: number, totalPoints: number) => void
  resetAll: () => void
}

const defaultState: ProgressState = { lessons: {}, quizzes: {} }
const ProgressContext = React.createContext<ProgressContextValue | null>(null)
const LS_KEY = "ha_progress_v1"

function loadFromStorage(): ProgressState {
  if (typeof window === "undefined") return defaultState
  try {
    const raw = window.localStorage.getItem(LS_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw)
    if (typeof parsed === "object" && parsed) return { lessons: parsed.lessons ?? {}, quizzes: parsed.quizzes ?? {} }
  } catch {}
  return defaultState
}

function saveToStorage(state: ProgressState) {
  try {
    if (typeof window !== "undefined") window.localStorage.setItem(LS_KEY, JSON.stringify(state))
  } catch {}
}

export function useProgress() {
  const ctx = React.useContext(ProgressContext)
  if (!ctx) throw new Error("useProgress must be used within Providers")
  return ctx
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ProgressState>(defaultState)

  React.useEffect(() => {
    setState(loadFromStorage())
  }, [])

  const update = React.useCallback((updater: (prev: ProgressState) => ProgressState) => {
    setState((prev) => {
      const next = updater(prev)
      saveToStorage(next)
      return next
    })
  }, [])

  const markLessonCompleted = React.useCallback((lessonId: string) => {
    update((prev) => ({
      ...prev,
      lessons: { ...prev.lessons, [lessonId]: { completedAt: Date.now() } },
    }))
  }, [update])

  const unmarkLesson = React.useCallback((lessonId: string) => {
    update((prev) => {
      const next = { ...prev.lessons }
      delete next[lessonId]
      return { ...prev, lessons: next }
    })
  }, [update])

  const recordQuizResult = React.useCallback((quizId: string, score: number, totalPoints: number) => {
    update((prev) => {
      const prevAttempt = prev.quizzes[quizId]
      const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0
      const passed = percentage >= 70
      const attempt: QuizAttempt = {
        attempts: (prevAttempt?.attempts ?? 0) + 1,
        bestScore: Math.max(prevAttempt?.bestScore ?? 0, percentage),
        lastScore: percentage,
        passed,
        updatedAt: Date.now(),
      }
      return { ...prev, quizzes: { ...prev.quizzes, [quizId]: attempt } }
    })
  }, [update])

  const resetAll = React.useCallback(() => {
    update(() => defaultState)
  }, [update])

  const value = React.useMemo<ProgressContextValue>(
    () => ({ state, markLessonCompleted, unmarkLesson, recordQuizResult, resetAll }),
    [state, markLessonCompleted, unmarkLesson, recordQuizResult, resetAll]
  )

  return (
    <ProgressContext.Provider value={value}>
      {children}
      <Toaster position="top-right" />
    </ProgressContext.Provider>
  )
}
