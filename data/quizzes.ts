/**
 * Educational Content - Quiz Data
 */

export interface Quiz {
  id: string
  title: string
  lessonId: string
  description: string
  passingScore: number // percentage
  timeLimit?: number // minutes (optional)
  questions: Question[]
  xp: number // XP awarded for passing
}

export type QuestionType = 'multiple-choice' | 'true-false' | 'image-identification' | 'matching'

export interface Question {
  id: string
  type: QuestionType
  question: string
  points: number
  options?: string[] // for multiple-choice
  correctAnswer: number | boolean | string
  explanation: string
  image?: string // for image-based questions
  difficulty: 'easy' | 'medium' | 'hard'
}

export const quizzes: Quiz[] = [
  {
    id: 'quiz-altar',
    title: 'Altar Knowledge Check',
    lessonId: 'lesson-altar',
    description: 'Test your understanding of altars in religious architecture',
    passingScore: 70,
    timeLimit: 10,
    xp: 200,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What is the flat top surface of an altar called?',
        points: 10,
        options: ['Mensa', 'Predella', 'Reredos', 'Tabernacle'],
        correctAnswer: 0,
        explanation: 'The mensa is the flat top surface of an altar where offerings are placed. It comes from the Latin word for "table".',
        difficulty: 'easy',
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'What is a reredos?',
        points: 10,
        options: [
          'A decorative screen behind the altar',
          'The platform under the altar',
          'A portable altar',
          'The altar cloth',
        ],
        correctAnswer: 0,
        explanation: 'A reredos is a decorative screen, wall, or paneling behind an altar, often featuring religious imagery and ornate carvings.',
        difficulty: 'medium',
      },
      {
        id: 'q3',
        type: 'true-false',
        question: 'The High Altar is always located at the entrance of a church.',
        points: 10,
        correctAnswer: false,
        explanation: 'The High Altar is typically located in the choir or sanctuary at the eastern end of the church, not at the entrance.',
        difficulty: 'easy',
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        question: 'Which famous baroque artist designed the baldachin over the High Altar of St. Peter\'s Basilica?',
        points: 15,
        options: ['Bernini', 'Michelangelo', 'Borromini', 'Da Vinci'],
        correctAnswer: 0,
        explanation: 'Gian Lorenzo Bernini designed the magnificent bronze baldachin (canopy) over the High Altar in St. Peter\'s Basilica between 1623-1634.',
        difficulty: 'hard',
      },
      {
        id: 'q5',
        type: 'image-identification',
        question: 'What type of altar is shown in this image?',
        points: 15,
        image: '/images/quizzes/altar/high-altar.jpg',
        options: ['High Altar', 'Side Altar', 'Portable Altar', 'Outdoor Altar'],
        correctAnswer: 0,
        explanation: 'This is a High Altar, identifiable by its central location, elaborate decoration, and monumental scale.',
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'quiz-column',
    title: 'Classical Column Orders',
    lessonId: 'lesson-column',
    description: 'Identify and understand the three classical column orders',
    passingScore: 75,
    timeLimit: 15,
    xp: 200,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Which classical order is the oldest and simplest?',
        points: 10,
        options: ['Doric', 'Ionic', 'Corinthian', 'Composite'],
        correctAnswer: 0,
        explanation: 'The Doric order is the oldest and simplest of the classical orders, characterized by its sturdy proportions and lack of a base.',
        difficulty: 'easy',
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'What distinguishes an Ionic capital?',
        points: 10,
        options: [
          'Acanthus leaves',
          'Scroll-shaped volutes',
          'Plain square design',
          'Palm leaves',
        ],
        correctAnswer: 1,
        explanation: 'Ionic capitals are characterized by their distinctive scroll-shaped volutes on each side.',
        difficulty: 'easy',
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'What is entasis?',
        points: 15,
        options: [
          'A slight convex curve in the column shaft',
          'The spacing between columns',
          'The decoration on the capital',
          'The base of a column',
        ],
        correctAnswer: 0,
        explanation: 'Entasis is a slight convex curve in the column shaft that creates an optical illusion of straight lines and prevents the column from appearing to bulge in the middle.',
        difficulty: 'hard',
      },
      {
        id: 'q4',
        type: 'true-false',
        question: 'Doric columns rest directly on the stylobate without a base.',
        points: 10,
        correctAnswer: true,
        explanation: 'Unlike Ionic and Corinthian columns, Doric columns have no base and rest directly on the stylobate (platform).',
        difficulty: 'medium',
      },
      {
        id: 'q5',
        type: 'multiple-choice',
        question: 'Which order is known for its elaborate capital decorated with acanthus leaves?',
        points: 10,
        options: ['Doric', 'Ionic', 'Corinthian', 'Tuscan'],
        correctAnswer: 2,
        explanation: 'The Corinthian order features an elaborate capital decorated with stylized acanthus leaves, making it the most ornate of the classical orders.',
        difficulty: 'easy',
      },
      {
        id: 'q6',
        type: 'image-identification',
        question: 'Which classical order is shown in this image?',
        points: 15,
        image: '/images/quizzes/column/ionic-capital.jpg',
        options: ['Doric', 'Ionic', 'Corinthian', 'Composite'],
        correctAnswer: 1,
        explanation: 'This is an Ionic capital, identifiable by the characteristic scroll-shaped volutes.',
        difficulty: 'medium',
      },
    ],
  },
  // More quizzes for other architectural elements...
]

// Helper functions
export function getQuizById(id: string): Quiz | undefined {
  return quizzes.find(quiz => quiz.id === id)
}

export function getQuizByLessonId(lessonId: string): Quiz | undefined {
  return quizzes.find(quiz => quiz.lessonId === lessonId)
}

export function calculateScore(quiz: Quiz, answers: Record<string, any>): {
  score: number
  totalPoints: number
  percentage: number
  passed: boolean
  results: QuestionResult[]
} {
  const results: QuestionResult[] = []
  let earnedPoints = 0
  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0)

  quiz.questions.forEach(question => {
    const userAnswer = answers[question.id]
    const isCorrect =
      question.type === 'true-false'
        ? userAnswer === question.correctAnswer
        : userAnswer === question.correctAnswer

    if (isCorrect) {
      earnedPoints += question.points
    }

    results.push({
      questionId: question.id,
      correct: isCorrect,
      userAnswer,
      correctAnswer: question.correctAnswer,
      points: isCorrect ? question.points : 0,
      explanation: question.explanation,
    })
  })

  const percentage = (earnedPoints / totalPoints) * 100
  const passed = percentage >= quiz.passingScore

  return {
    score: earnedPoints,
    totalPoints,
    percentage,
    passed,
    results,
  }
}

export interface QuestionResult {
  questionId: string
  correct: boolean
  userAnswer: any
  correctAnswer: any
  points: number
  explanation: string
}
