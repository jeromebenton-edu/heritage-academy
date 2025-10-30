import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Trophy, Users, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="absolute inset-0 bg-heritage-pattern opacity-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
              Welcome to{' '}
              <span className="gradient-heritage bg-clip-text text-transparent">
                Heritage Academy
              </span>
            </h1>

            <p className="text-xl sm:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto animate-slide-up">
              Learn heritage architecture through interactive lessons, quizzes, and gamification.
              Master 11 architectural elements and earn achievements!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Learning Free
                </Button>
              </Link>
              <Link href="/lessons">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                  Browse Lessons
                </Button>
              </Link>
              <Link href="/gallery">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                  Explore Gallery
                </Button>
              </Link>
              <Link href="/recommend">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                  Try Recommender
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-sm text-primary-200">Start learning now</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Why Heritage Academy?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<BookOpen className="w-8 h-8" />}
              title="Interactive Lessons"
              description="Learn through rich, multimedia content with images, videos, and interactive diagrams."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Instant Feedback"
              description="Get immediate results on quizzes and learn from detailed explanations."
            />
            <FeatureCard
              icon={<Trophy className="w-8 h-8" />}
              title="Gamification"
              description="Earn points, unlock achievements, and climb the leaderboard as you learn."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Learn Together"
              description="Join a community of heritage enthusiasts and share your progress."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of students learning about heritage architecture
          </p>
          <Link href="/lessons">
            <Button size="lg">Browse Lessons</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Heritage Academy</h3>
              <p className="text-sm">
                Learn heritage architecture through interactive lessons and quizzes.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Learn</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/lessons" className="hover:text-white">Lessons</Link></li>
                <li><Link href="/quizzes" className="hover:text-white">Quizzes</Link></li>
                <li><Link href="/flashcards" className="hover:text-white">Flashcards</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <p className="text-sm">
                Follow us for updates and heritage facts
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 Heritage Academy. Built for educational purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft hover:shadow-xl transition-shadow">
      <div className="text-primary-600 dark:text-primary-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}
