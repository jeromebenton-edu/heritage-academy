"use client"

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { RadioGroup } from '@/components/ui/radio-group'
import { getQuizById, calculateScore } from '@/data/quizzes'
import { useParams, useRouter } from 'next/navigation'
import { useProgress } from '@/components/providers'

type Answers = Record<string, any>

export default function QuizRunnerPage() {
  const params = useParams<{ id: string }>()
  const id = (params?.id as string) ?? ''
  const quiz = getQuizById(id)
  const { recordQuizResult } = useProgress()
  const router = useRouter()

  const [answers, setAnswers] = React.useState<Answers>({})
  const [submitted, setSubmitted] = React.useState(false)
  const [result, setResult] = React.useState<ReturnType<typeof calculateScore> | null>(null)

  if (!quiz) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-2">Quiz not found</h1>
        <Link href="/quizzes"><Button variant="outline">Back to Quizzes</Button></Link>
      </main>
    )
  }

  const onSubmit = () => {
    const r = calculateScore(quiz, answers)
    setResult(r)
    setSubmitted(true)
    recordQuizResult(quiz.id, Math.round(r.percentage), 100)
  }

  const reset = () => {
    setAnswers({})
    setSubmitted(false)
    setResult(null)
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">{quiz.title}</h1>
        <div className="flex gap-2">
          <Link href="/quizzes"><Button variant="outline">Quizzes</Button></Link>
          <Link href="/"><Button>Home</Button></Link>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{quiz.description}</p>

      {submitted && result ? (
        <Card className="mb-6 p-4">
          <h2 className="font-semibold mb-1">Results</h2>
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Score: {result.percentage.toFixed(0)}% • {result.passed ? 'Passed' : 'Not passed'} (passing {quiz.passingScore}%)
          </div>
          <Alert variant={result.passed ? 'success' : 'destructive'}>
            {result.passed ? 'Great job! You passed this quiz.' : 'You did not reach the passing score. Try again!'}
          </Alert>
        </Card>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <ol className="space-y-6 list-decimal pl-5">
          {quiz.questions.map((q, idx) => (
            <li key={q.id}>
              <Card className="p-4">
              <div className="mb-2 font-medium">{idx + 1}. {q.question}</div>
              {q.image ? (
                <div className="relative w-full max-w-md aspect-[16/10] mb-3">
                  <Image src={q.image} alt={q.question} fill sizes="100vw" />
                </div>
              ) : null}

              {(q.type === 'multiple-choice' || q.type === 'image-identification') && q.options && (
                <RadioGroup
                  name={q.id}
                  value={answers[q.id]}
                  onValueChange={(v) => setAnswers({ ...answers, [q.id]: v })}
                  options={q.options.map((opt, i) => ({ label: opt, value: i }))}
                />
              )}

              {q.type === 'true-false' && (
                <RadioGroup
                  name={q.id}
                  value={answers[q.id]}
                  onValueChange={(v) => setAnswers({ ...answers, [q.id]: v })}
                  options={[
                    { label: 'True', value: true },
                    { label: 'False', value: false },
                  ]}
                />
              )}

              {submitted && result && (
                <div className={`mt-3 text-sm ${result.results.find(r=>r.questionId===q.id)?.correct ? 'text-green-700' : 'text-red-700'}`}>
                  {result.results.find(r=>r.questionId===q.id)?.correct ? 'Correct' : 'Incorrect'} — {q.explanation}
                </div>
              )}
              </Card>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex gap-2">
          {!submitted ? (
            <Button type="submit">Submit</Button>
          ) : (
            <>
              <Button onClick={reset} type="button">Retake</Button>
              <Button variant="outline" onClick={() => router.push('/quizzes')} type="button">Back to Quizzes</Button>
            </>
          )}
        </div>
      </form>
    </main>
  )
}
