"use client"

import { lessons } from '@/data/lessons'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useProgress } from '@/components/providers'
import { CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LessonsPage() {
  const { state, markLessonCompleted, unmarkLesson } = useProgress()
  const completedCount = Object.keys(state.lessons).length

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Lessons</h1>
        <Link href="/">
          <Button>Home</Button>
        </Link>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Explore our curated lessons on heritage architecture.</p>
      <div className="mb-6 text-sm text-gray-600 dark:text-gray-300">
        Progress: {completedCount} / {lessons.length} completed
      </div>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((l) => (
          <li key={l.id}>
            <Card className="p-4 flex flex-col gap-2">
            <div className="text-sm text-gray-500 mb-1">{l.element.replace('_', ' ')}</div>
            <h2 className="font-semibold">{l.title}</h2>
            <div className="text-sm text-gray-500">{l.duration} min • {l.difficulty}</div>
            <div className="mt-2 flex items-center gap-2">
              {state.lessons[l.id] ? (
                <>
                  <CheckCircle2 className="text-green-600" size={18} />
                  <span className="text-sm text-green-700">Completed</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-auto"
                    onClick={() => {
                      unmarkLesson(l.id)
                      toast.success('Lesson marked as not completed')
                    }}
                  >
                    Undo
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={() => {
                    markLessonCompleted(l.id)
                    toast.success(`Marked "${l.title}" as completed`)
                  }}
                >
                  Mark as completed
                </Button>
              )}
              <Link href={`/lessons/${l.slug}`} className="ml-auto">
                <Button size="sm" variant="outline">View lesson</Button>
              </Link>
            </div>
            </Card>
          </li>
        ))}
      </ul>
    </main>
  )
}
