import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SignupPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Create your account</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Account creation is coming soon. In the meantime, explore lessons and quizzes.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/">
          <Button>Home</Button>
        </Link>
        <Link href="/lessons">
          <Button variant="outline">Browse Lessons</Button>
        </Link>
        <Link href="/quizzes">
          <Button variant="outline">View Quizzes</Button>
        </Link>
      </div>
    </main>
  )
}
