/**
 * Educational Content - Lessons Data
 * 11 Architectural Elements from Capstone 2
 */

export interface Lesson {
  id: string
  title: string
  slug: string
  category: 'element' | 'style' | 'history' | 'preservation'
  element: ArchitecturalElement
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number // minutes
  xp: number
  description: string
  objectives: string[]
  content: LessonContent
  images: string[]
  quiz: string // quiz ID
  order: number
}

export type ArchitecturalElement =
  | 'altar'
  | 'apse'
  | 'bell_tower'
  | 'column'
  | 'dome_inner'
  | 'dome_outer'
  | 'flying_buttress'
  | 'gargoyle'
  | 'portal'
  | 'stained_glass'
  | 'vault'

export interface LessonContent {
  introduction: string
  sections: LessonSection[]
  summary: string
  keyTerms: { term: string; definition: string }[]
  furtherReading: { title: string; url: string }[]
}

export interface LessonSection {
  title: string
  content: string
  images?: string[]
  examples?: { name: string; location: string; description: string }[]
}

export const lessons: Lesson[] = [
  {
    id: 'lesson-altar',
    title: 'Understanding Altars',
    slug: 'altar',
    category: 'element',
    element: 'altar',
    difficulty: 'beginner',
    duration: 15,
    xp: 100,
    description: 'Learn about altars - sacred structures in religious buildings used for worship and ritual ceremonies.',
    objectives: [
      'Identify different types of altars',
      'Understand the historical significance of altars',
      'Recognize altar elements in famous structures',
    ],
    content: {
      introduction: `Altars are among the most sacred elements in religious architecture. They serve as focal points for worship, sacrifice, and communion across many cultures and religions.`,
      sections: [
        {
          title: 'What is an Altar?',
          content: `An altar is an elevated structure or place used for religious rituals, particularly for making offerings and sacrifices to a deity. In Christian churches, the altar is the table where the Eucharist is celebrated. In other religions, altars serve various ceremonial purposes.`,
          images: ['/images/lessons/altar/altar-overview.jpg'],
        },
        {
          title: 'Historical Development',
          content: `Altars have evolved from simple stone structures in ancient times to elaborate architectural masterpieces. Early altars were often outdoor structures, while medieval churches developed sophisticated altar designs with intricate decorations.`,
          examples: [
            {
              name: 'High Altar of St. Peter\'s Basilica',
              location: 'Vatican City',
              description: 'Designed by Bernini, this baroque masterpiece features a bronze baldachin',
            },
            {
              name: 'Altar of Zeus',
              location: 'Pergamon, Turkey',
              description: 'Ancient Greek altar known for its monumental scale and relief sculptures',
            },
          ],
        },
        {
          title: 'Types of Altars',
          content: `
### Main Types:
- **High Altar**: The principal altar in a church, usually located in the choir or sanctuary
- **Side Altars**: Secondary altars in side chapels
- **Portable Altars**: Small, movable altars used in private chapels
- **Outdoor Altars**: Used for open-air ceremonies

Each type serves specific liturgical or ceremonial functions.
          `,
        },
        {
          title: 'Architectural Elements',
          content: `Altars typically include:
- **Mensa**: The flat top surface where offerings are placed
- **Predella**: The platform or step on which the altar stands
- **Reredos**: The decorative screen behind the altar
- **Frontal**: The decorative cloth or panel covering the altar front
- **Tabernacle**: A receptacle for sacred objects, often placed on the altar`,
        },
      ],
      summary: 'Altars are central to religious architecture, serving as sacred spaces for worship and ritual. Their design reflects theological beliefs, artistic traditions, and cultural values across different periods and religions.',
      keyTerms: [
        { term: 'Mensa', definition: 'The flat top surface of an altar' },
        { term: 'Reredos', definition: 'Decorative screen or wall behind an altar' },
        { term: 'Predella', definition: 'The platform or step on which an altar stands' },
        { term: 'Tabernacle', definition: 'A receptacle for sacred objects on or near an altar' },
      ],
      furtherReading: [
        {
          title: 'The History of Christian Altars',
          url: 'https://example.com/altar-history',
        },
      ],
    },
    images: [
      '/images/lessons/altar/main.jpg',
      '/images/lessons/altar/types.jpg',
    ],
    quiz: 'quiz-altar',
    order: 1,
  },
  {
    id: 'lesson-column',
    title: 'Classical Columns',
    slug: 'column',
    category: 'element',
    element: 'column',
    difficulty: 'beginner',
    duration: 20,
    xp: 100,
    description: 'Explore the classical orders of columns - Doric, Ionic, and Corinthian - and their significance in architecture.',
    objectives: [
      'Identify the three classical column orders',
      'Understand column anatomy and proportions',
      'Recognize columns in historical buildings',
    ],
    content: {
      introduction: 'Columns are vertical structural elements that support buildings while adding beauty and grandeur. The classical orders represent some of architecture\'s most enduring design principles.',
      sections: [
        {
          title: 'Anatomy of a Column',
          content: `A classical column consists of three main parts:

**1. Base**: The foundation that distributes the column's weight (absent in Doric order)
**2. Shaft**: The tall, cylindrical main body of the column
**3. Capital**: The decorated top that transitions to the architrave

Additionally, columns feature **entasis** - a slight convex curve in the shaft that creates an optical illusion of straight lines.`,
        },
        {
          title: 'The Three Classical Orders',
          content: `### Doric Order
- Oldest and simplest
- No base, rests directly on stylobate
- Plain capital with square abacus
- Sturdy, masculine appearance

### Ionic Order
- More slender and elegant
- Has a base
- Scroll-shaped (volute) capital
- Feminine, graceful appearance

### Corinthian Order
- Most ornate and decorative
- Elaborate capital with acanthus leaves
- Tallest and most slender proportions
- Represents luxury and grandeur`,
          examples: [
            {
              name: 'Parthenon',
              location: 'Athens, Greece',
              description: 'Classic example of Doric columns',
            },
            {
              name: 'Temple of Athena Nike',
              location: 'Athens, Greece',
              description: 'Beautiful Ionic columns',
            },
          ],
        },
      ],
      summary: 'Classical columns represent fundamental principles of architecture, combining structural necessity with aesthetic beauty. Understanding these orders is essential for appreciating Western architectural heritage.',
      keyTerms: [
        { term: 'Entasis', definition: 'Slight convex curve in a column shaft' },
        { term: 'Capital', definition: 'The decorated top of a column' },
        { term: 'Volute', definition: 'Scroll-shaped ornament in Ionic capitals' },
        { term: 'Abacus', definition: 'Square slab on top of a capital' },
      ],
      furtherReading: [],
    },
    images: ['/images/lessons/column/main.jpg'],
    quiz: 'quiz-column',
    order: 2,
  },
  // Additional lessons would follow the same structure...
]

// Helper function to get lesson by slug
export function getLessonBySlug(slug: string): Lesson | undefined {
  return lessons.find(lesson => lesson.slug === slug)
}

// Helper function to get lessons by difficulty
export function getLessonsByDifficulty(difficulty: Lesson['difficulty']): Lesson[] {
  return lessons.filter(lesson => lesson.difficulty === difficulty)
}

// Helper function to get lessons by element
export function getLessonsByElement(element: ArchitecturalElement): Lesson[] {
  return lessons.filter(lesson => lesson.element === element)
}
