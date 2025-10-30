"use client"

import * as React from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { getLessonBySlug } from '@/data/lessons'
import { useProgress } from '@/components/providers'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Shim to avoid TS incompatibility between react-markdown/unified/vfile types in CI
const gfmPlugin = remarkGfm as unknown as any

export default function LessonDetailPage() {
  const params = useParams<{ slug: string }>()
  const slug = (params?.slug as string) ?? ''
  const lesson = getLessonBySlug(slug)
  const { state, markLessonCompleted, unmarkLesson } = useProgress()

  if (!lesson) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-2">Lesson not found</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">We couldn't find that lesson.</p>
        <Link href="/lessons"><Button variant="outline">Back to Lessons</Button></Link>
      </main>
    )
  }

  const isCompleted = !!state.lessons[lesson.id]

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-gray-500">{lesson.element.replace('_',' ')} • {lesson.difficulty} • {lesson.duration} min</div>
          <h1 className="text-3xl font-bold mt-1">{lesson.title}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{lesson.description}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/lessons"><Button variant="outline">Back</Button></Link>
          {isCompleted ? (
            <Button variant="outline" onClick={() => unmarkLesson(lesson.id)}>Mark as incomplete</Button>
          ) : (
            <Button onClick={() => markLessonCompleted(lesson.id)}>Mark completed</Button>
          )}
        </div>
      </div>

      <section className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
        <Alert variant="info" className="not-prose mb-4" title="Lesson info">
          Difficulty: {lesson.difficulty} • Duration: {lesson.duration} min • XP: {lesson.xp}
        </Alert>
        <h2>Introduction</h2>
        <ReactMarkdown remarkPlugins={[gfmPlugin]}>{lesson.content.introduction}</ReactMarkdown>

        {lesson.objectives?.length ? (
          <>
            <h3>Objectives</h3>
            <ul>
              {lesson.objectives.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </>
        ) : null}

        {lesson.content.sections.map((s, idx) => (
          <section key={idx} className="mt-6">
            <h3>{s.title}</h3>
            <ReactMarkdown remarkPlugins={[gfmPlugin]}>{s.content}</ReactMarkdown>
            {s.examples?.length ? (
              <ul>
                {s.examples.map((ex, i) => (
                  <li key={i}><strong>{ex.name}</strong> — {ex.location}. {ex.description}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <h3>Key terms</h3>
        <div className="not-prose">
          <Card className="p-4">
            <ul className="list-disc pl-6">
              {lesson.content.keyTerms.map((kt) => (
                <li key={kt.term}><strong>{kt.term}:</strong> {kt.definition}</li>
              ))}
            </ul>
          </Card>
        </div>

        {lesson.content.furtherReading?.length ? (
          <>
            <h3>Further reading</h3>
            <div className="not-prose">
              <Card className="p-4">
                <ul className="list-disc pl-6">
                  {lesson.content.furtherReading.map((fr) => (
                    <li key={fr.title}><a className="underline" href={fr.url} target="_blank" rel="noreferrer">{fr.title}</a></li>
                  ))}
                </ul>
              </Card>
            </div>
          </>
        ) : null}

        <h3>Summary</h3>
        <div className="not-prose">
          <Card className="p-4">
            <ReactMarkdown remarkPlugins={[gfmPlugin]}>{lesson.content.summary}</ReactMarkdown>
          </Card>
        </div>
      </section>

      <div className="mt-8 flex gap-2">
        <Link href="/lessons"><Button variant="outline">Back to Lessons</Button></Link>
        {isCompleted ? (
          <Button variant="outline" onClick={() => unmarkLesson(lesson.id)}>Mark as incomplete</Button>
        ) : (
          <Button onClick={() => markLessonCompleted(lesson.id)}>Mark completed</Button>
        )}
      </div>
    </main>
  )
}
