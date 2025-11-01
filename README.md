# Heritage Academy

> Interactive Educational Platform for Learning Heritage Architecture & Cultural Preservation

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

Heritage Academy is a comprehensive educational platform designed to teach students and enthusiasts about heritage architecture, cultural preservation, and architectural history through interactive lessons, quizzes, and gamification.

## Features

### Educational Content
- **Interactive Lessons** - Learn about 11 architectural elements
- **Video Tutorials** - Visual learning with embedded content
- **Rich Media** - Images, diagrams, and 3D models
- **Progressive Learning** - Structured curriculum from basics to advanced

### Assessment & Practice
- **Interactive Quizzes** - Multiple choice, true/false, image identification
- **Flashcard System** - Spaced repetition for better retention
- **Practice Mode** - Test knowledge without pressure
- **Instant Feedback** - Learn from mistakes immediately

### Gamification
- **Points & Levels** - Earn XP for completing lessons and quizzes
- **Badges & Achievements** - Unlock rewards for milestones
- **Leaderboards** - Compete with other learners
- **Streaks** - Build daily learning habits
- **Progress Tracking** - Visualize your learning journey

### User Features
- **Personal Dashboard** - Track progress and stats
- **Learning Path** - Customized curriculum based on level
- **Study History** - Review past performance
- **Bookmarks** - Save favorite lessons and resources
- **Notes** - Take personal notes on lessons

### Privacy-Friendly (No Account Required)
- Progress is stored locally in your browser (localStorage)
- No personal data is collected or transmitted to a server
- Optional accounts can be added later for sync/leaderboards

### Modern UI/UX
- **Responsive Design** - Works on all devices
- **Dark/Light Mode** - Choose your preference
- **Animations** - Smooth, delightful interactions
- **Accessibility** - WCAG 2.1 compliant
- **Fast Loading** - Optimized for performance

## Architecture

### Tech Stack

**Framework:**
- Next.js 14 (App Router)
- React 18
- TypeScript 5

**Database & Storage:**
- Vercel Postgres (SQL database)
- Cloudflare R2 (S3-compatible object storage)
- Vercel KV (Redis for caching)

**Authentication (planned):**
- NextAuth.js
- Credentials provider
- Email/password + OAuth ready

**Styling:**
- Tailwind CSS
- Framer Motion (animations)
- Lucide Icons

**Deployment:**
- Vercel (optimized for platform)
- Serverless functions
- Edge runtime
- Automatic HTTPS

### Project Structure

```
heritage-academy/
├── app/                      # Next.js 14 App Router
│   ├── (auth)/              # Authentication routes
│   │   ├── login/
│   │   ├── signup/
│   │   └── layout.tsx
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── dashboard/
│   │   ├── lessons/
│   │   ├── quizzes/
│   │   ├── flashcards/
│   │   ├── progress/
│   │   └── layout.tsx
│   ├── (marketing)/         # Public marketing pages
│   │   ├── page.tsx         # Homepage
│   │   ├── about/
│   │   ├── features/
│   │   └── layout.tsx
│   ├── api/                 # API routes (serverless)
│   │   ├── auth/
│   │   ├── lessons/
│   │   ├── quizzes/
│   │   ├── progress/
│   │   └── leaderboard/
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # Base UI components
│   ├── lessons/             # Lesson components
│   ├── quizzes/             # Quiz components
│   ├── dashboard/           # Dashboard widgets
│   └── marketing/           # Marketing components
├── lib/                     # Utility libraries
│   ├── db/                  # Database utilities
│   ├── auth/                # Auth helpers
│   ├── utils/               # Helper functions
│   └── validations/         # Zod schemas
├── types/                   # TypeScript types
├── data/                    # Static educational content
│   ├── lessons/
│   ├── quizzes/
│   └── achievements/
├── public/                  # Static assets
│   ├── images/
│   └── icons/
└── styles/                  # Additional styles
```

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm 8+
- Vercel account for Node hosting (free tier works)
- Cloudflare account for image storage (R2 free tier works)
- Git

### Local Development

1. **Clone the repository:**
```bash
cd ~/projects/heritage_academy
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Database (Vercel Postgres)
POSTGRES_URL="your-connection-string"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Blob Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN="your-blob-token"
```

4. **Set up database:**
```bash
# Initialize schema in Vercel Postgres
# Option A: In Vercel dashboard, open SQL editor and paste lib/db/schema.sql
# Option B: CLI — connect then paste the SQL
pnpm add -g vercel
vercel login
vercel postgres connect
# paste the SQL from lib/db/schema.sql
```

5. **Run development server:**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Deploy to Vercel

#### Option 1: Deploy with Vercel CLI

```bash
# Install Vercel CLI
pnpm add -g vercel

# Login
vercel login

# Deploy
vercel
```

#### Option 2: Deploy via GitHub

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/heritage-academy.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js
6. Add environment variables in Vercel dashboard
7. Deploy!

Your app will be live at: `https://your-app.vercel.app`

## Educational Content

### Architectural Elements (11 Categories)

1. **Altar** - Sacred structures in religious buildings
2. **Apse** - Semi-circular or polygonal termination
3. **Bell Tower** - Tower designed to house bells
4. **Column** - Vertical structural elements
5. **Dome (Inner)** - Interior view of dome structures
6. **Dome (Outer)** - Exterior view of dome structures
7. **Flying Buttress** - External support structures
8. **Gargoyle** - Decorative water spouts
9. **Portal** - Ornamental doorways
10. **Stained Glass** - Colored glass artworks
11. **Vault** - Arched ceiling structures

### Learning Modules

**Module 1: Introduction to Heritage Architecture**
- What is heritage architecture?
- Why preservation matters
- Basic architectural terminology

**Module 2: Architectural Elements**
- Detailed study of each element
- Historical context
- Famous examples worldwide

**Module 3: Architectural Styles**
- Romanesque
- Gothic
- Renaissance
- Baroque
- And more...

**Module 4: Cultural Preservation**
- UNESCO World Heritage sites
- Conservation techniques
- Modern challenges

## Gamification System

### Points System
- Complete lesson: 100 XP
- Pass quiz (80%+): 200 XP
- Perfect quiz (100%): 500 XP
- Daily login: 10 XP
- 7-day streak: 100 XP bonus

### Levels
- Level 1-5: Novice (0-1000 XP)
- Level 6-10: Apprentice (1000-3000 XP)
- Level 11-15: Scholar (3000-6000 XP)
- Level 16-20: Expert (6000-10000 XP)
- Level 21+: Master (10000+ XP)

### Achievements
- **First Steps** - Complete your first lesson
- **Bookworm** - Complete 10 lessons
- **Perfectionist** - Get 100% on 5 quizzes
- **On Fire** - Maintain 30-day streak
- **Top Scholar** - Reach #1 on leaderboard
- And 50+ more...

## Features in Detail

### Dashboard
- Progress overview with charts
- Recent activity feed
- Upcoming lessons
- Achievement showcase
- Quick stats (lessons completed, quiz scores, streak)

### Lessons
- Rich text content
- Embedded images and videos
- Interactive diagrams
- Knowledge checks
- Related resources
- Download study materials

### Quizzes
- Multiple question types
- Randomized questions
- Timer mode (optional)
- Review incorrect answers
- Detailed explanations
- Performance analytics

### Flashcards
- Spaced repetition algorithm
- Flip to reveal answer
- Mark as known/unknown
- Progress tracking
- Custom decks

### Leaderboard
- All-time rankings
- Monthly rankings
- Friends-only view
- Filter by category
- Public profiles

## Security & Privacy

- Planned: authentication with NextAuth
- Password hashing with bcrypt
- HTTPS enforced on Vercel
- No sensitive data in localStorage
- GDPR compliant
- User data export available

## Analytics

Track learning metrics:
- Time spent on lessons
- Quiz performance trends
- Most difficult topics
- Learning velocity
- Engagement patterns

## Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Check TypeScript types
pnpm format       # Format code with Prettier
pnpm test         # Run tests
```

### Adding New Content

#### Add a Lesson

Create a file in `data/lessons/`:
```typescript
// data/lessons/column.ts
export const columnLesson = {
  id: 'column',
  title: 'Understanding Columns',
  description: 'Learn about classical column orders',
  category: 'elements',
  difficulty: 'beginner',
  duration: 15,
  content: `
    # Columns in Architecture

    Columns are vertical structural elements...
  `,
  images: ['/images/lessons/column-1.jpg'],
  quiz: 'column-quiz',
};
```

#### Add a Quiz

Create a file in `data/quizzes/`:
```typescript
// data/quizzes/column-quiz.ts
export const columnQuiz = {
  id: 'column-quiz',
  title: 'Column Knowledge Check',
  questions: [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'What are the three classical orders?',
      options: [
        'Doric, Ionic, Corinthian',
        'Roman, Greek, Egyptian',
        'Simple, Medium, Complex',
      ],
      correctAnswer: 0,
      explanation: 'The three classical orders are Doric, Ionic, and Corinthian.',
    },
  ],
};
```

### Database Schema

```sql
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Progress
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  lesson_id VARCHAR(100),
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER,
  time_spent INTEGER,
  completed_at TIMESTAMP
);

-- Achievements
CREATE TABLE user_achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  achievement_id VARCHAR(100),
  unlocked_at TIMESTAMP DEFAULT NOW()
);

-- Quiz Attempts
CREATE TABLE quiz_attempts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  quiz_id VARCHAR(100),
  score INTEGER,
  total_questions INTEGER,
  time_taken INTEGER,
  answers JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Routes

All API routes are serverless functions:

### Authentication (planned)
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Lessons
- `GET /api/lessons` - List all lessons
- `GET /api/lessons/[id]` - Get lesson details
- `POST /api/lessons/[id]/complete` - Mark complete

### Quizzes
- `GET /api/quizzes/[id]` - Get quiz
- `POST /api/quizzes/[id]/submit` - Submit answers
- `GET /api/quizzes/[id]/results` - Get results

### Progress
- `GET /api/progress` - User progress
- `GET /api/progress/stats` - Statistics
- `POST /api/progress/update` - Update progress

### Leaderboard
- `GET /api/leaderboard` - Get rankings
- `GET /api/leaderboard/user/[id]` - User rank

## Roadmap

### v1.0 (Current)
- Core lesson system
- Quiz functionality
- User authentication
- Progress tracking
- Basic gamification

### v1.1 (Next)
- [ ] Flashcard system
- [ ] Discussion forums
- [ ] Certificate generation
- [ ] Mobile app (React Native)
- [ ] Offline mode

### v2.0 (Future)
- [ ] AI-powered recommendations
- [ ] Live classes
- [ ] Peer-to-peer learning
- [ ] VR heritage tours
- [ ] Multiple languages

## Contributing

This is an educational project. Contributions for learning purposes are welcome!

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

Apache License 2.0 - See [LICENSE](LICENSE) file for details.

## Acknowledgments

- Based on Capstone 2 "Preserving Heritage with AI" project
- Architectural element data from historical databases
- Icons by Lucide
- UI inspiration from modern learning platforms

## Contact

- Website: https://heritage-academy.vercel.app
- Email: hello@heritage-academy.app
- GitHub: [@yourusername](https://github.com/yourusername)

## For Educators

Heritage Academy can be used in:
- Architecture courses
- Art history classes
- Cultural studies programs
- Online learning platforms
- Museum education programs

Bulk licenses and custom content available - contact us!

---

**Built for heritage education and cultural preservation**

Powered by Next.js, Vercel, and passion for learning.
