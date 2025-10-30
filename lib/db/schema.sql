-- Heritage Academy Database Schema
-- For Vercel Postgres

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_login TIMESTAMP,
  oauth_provider VARCHAR(50),
  oauth_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id VARCHAR(100) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER,
  time_spent INTEGER, -- seconds
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id VARCHAR(100) NOT NULL,
  score INTEGER NOT NULL,
  total_points INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  passed BOOLEAN NOT NULL,
  time_taken INTEGER, -- seconds
  answers JSONB NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(255),
  points INTEGER DEFAULT 0,
  category VARCHAR(50),
  requirement JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id VARCHAR(100) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Daily activity table (for streak tracking)
CREATE TABLE IF NOT EXISTS daily_activity (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  quizzes_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, activity_date)
);

-- Leaderboard cache (materialized view alternative)
CREATE TABLE IF NOT EXISTS leaderboard_cache (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  total_xp INTEGER NOT NULL,
  lessons_completed INTEGER NOT NULL,
  quizzes_passed INTEGER NOT NULL,
  streak INTEGER NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Study sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id VARCHAR(100),
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  duration INTEGER, -- seconds
  completed BOOLEAN DEFAULT FALSE
);

-- Flashcard progress table
CREATE TABLE IF NOT EXISTS flashcard_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_id VARCHAR(100) NOT NULL,
  last_reviewed TIMESTAMP,
  next_review TIMESTAMP,
  ease_factor DECIMAL(3,2) DEFAULT 2.5,
  interval INTEGER DEFAULT 1, -- days
  repetitions INTEGER DEFAULT 0,
  UNIQUE(user_id, card_id)
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'light',
  language VARCHAR(10) DEFAULT 'en',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  leaderboard_visible BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson ON user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON daily_activity(user_id, activity_date);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcard_progress_user ON flashcard_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_leaderboard_cache_rank ON leaderboard_cache(rank);

-- Insert default achievements
INSERT INTO achievements (code, name, description, icon, points, category) VALUES
('first_lesson', 'First Steps', 'Complete your first lesson', '🎓', 50, 'milestone'),
('five_lessons', 'Getting Started', 'Complete 5 lessons', '📚', 100, 'milestone'),
('ten_lessons', 'Dedicated Learner', 'Complete 10 lessons', '📖', 200, 'milestone'),
('first_perfect', 'Perfectionist', 'Score 100% on a quiz', '💯', 100, 'achievement'),
('five_perfects', 'Excellence', 'Score 100% on 5 quizzes', '⭐', 250, 'achievement'),
('week_streak', 'Consistent', 'Maintain a 7-day streak', '🔥', 150, 'streak'),
('month_streak', 'Dedicated', 'Maintain a 30-day streak', '🔥🔥', 500, 'streak'),
('all_altars', 'Altar Expert', 'Master all altar lessons', '⛪', 200, 'mastery'),
('all_columns', 'Column Master', 'Master all column lessons', '🏛️', 200, 'mastery'),
('top_ten', 'Rising Star', 'Reach top 10 on leaderboard', '🌟', 300, 'social'),
('number_one', 'Champion', 'Reach #1 on leaderboard', '🏆', 1000, 'social')
ON CONFLICT (code) DO NOTHING;

-- Function to update user level based on XP
CREATE OR REPLACE FUNCTION calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Level formula: level = floor(sqrt(xp / 100)) + 1
  -- Level 1: 0-99 XP
  -- Level 2: 100-399 XP
  -- Level 3: 400-899 XP
  -- etc.
  RETURN FLOOR(SQRT(xp / 100.0)) + 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to automatically update user level when XP changes
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level := calculate_level(NEW.xp);
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_level
BEFORE UPDATE OF xp ON users
FOR EACH ROW
EXECUTE FUNCTION update_user_level();

-- Function to update leaderboard cache
CREATE OR REPLACE FUNCTION refresh_leaderboard_cache()
RETURNS void AS $$
BEGIN
  TRUNCATE leaderboard_cache;

  INSERT INTO leaderboard_cache (user_id, rank, total_xp, lessons_completed, quizzes_passed, streak)
  SELECT
    u.id,
    ROW_NUMBER() OVER (ORDER BY u.xp DESC, u.streak DESC, u.created_at ASC) as rank,
    u.xp,
    (SELECT COUNT(*) FROM user_progress WHERE user_id = u.id AND completed = TRUE),
    (SELECT COUNT(*) FROM quiz_attempts WHERE user_id = u.id AND passed = TRUE),
    u.streak
  FROM users u
  ORDER BY u.xp DESC;
END;
$$ LANGUAGE plpgsql;
