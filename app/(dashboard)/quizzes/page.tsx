"use client"

import { quizzes } from '@/data/quizzes'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useProgress } from '@/components/providers'
import toast from 'react-hot-toast'

export default function QuizzesPage() {
  const { state, recordQuizResult } = useProgress()
  const attempts = Object.values(state.quizzes)
  const attemptedCount = attempts.length
  const passedCount = attempts.filter((a) => a.passed).length

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Quizzes</h1>
        <Link href="/">
          <Button>Home</Button>
        </Link>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-2">Test your knowledge and earn XP.</p>
      <div className="mb-6 text-sm text-gray-600 dark:text-gray-300">
        Attempted: {attemptedCount} / {quizzes.length} • Passed: {passedCount}
      </div>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((q) => {
          const attempt = state.quizzes[q.id]
          return (
            <li key={q.id}>
              <Card className="p-4 flex flex-col gap-2">
                <h2 className="font-semibold mb-1">{q.title}</h2>
                <div className="text-sm text-gray-500">Passing: {q.passingScore}% • {q.xp} XP</div>
                {attempt && (
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Attempts: {attempt.attempts} • Best: {attempt.bestScore}% • Last: {attempt.lastScore}% {attempt.passed ? '• Passed' : ''}
                  </div>
                )}
                <div className="mt-2 flex gap-2 flex-wrap">
                  <Link href={`/quizzes/${q.id}`}>
                    <Button size="sm" variant="outline">Take quiz</Button>
                  </Link>
                  <Button
                    size="sm"
                    onClick={() => {
                      // Record a passing attempt at exactly the passingScore
                      const total = 100
                      const score = Math.max(q.passingScore, 70)
                      recordQuizResult(q.id, score, total)
                      toast.success('Recorded passing attempt')
                    }}
                  >
                    Mark as passed
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      // Record a failed attempt at 50%
                      recordQuizResult(q.id, 50, 100)
                      toast('Recorded failed attempt')
                    }}
                  >
                    Record failed
                  </Button>
                </div>
              </Card>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
