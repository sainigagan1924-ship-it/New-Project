# StudyTube – AI-Powered Video Recommendation Platform

**StudyTube** is a modern, responsive web application that helps students and developers discover the best educational YouTube videos based on actual learning value, content quality, viewer feedback, and technical accuracy — not just views and clickbait.

---

## 🚀 Live Services Running

- **Frontend Client (React + Vite + Tailwind CSS):** [http://127.0.0.1:5173](http://127.0.0.1:5173)
- **Backend API Server (Node.js + Express):** [http://localhost:5001](http://localhost:5001)
- **Health Check Endpoint:** [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

## 🎨 1. Design Philosophy & System

- **Clean, Professional Classic SaaS Interface**: Designed with the aesthetics of tools like Linear and Stripe.
- **Color Palette**:
  - Primary Background: `#FFFFFF`
  - Secondary Background: `#F5F5F5` / `#F9FAFB`
  - Primary Text: `#111111`
  - Thin Borders: `#E5E5E5` / `#E2E8F0`
  - Accent Green: `#10B981` / `#059669` (used for quality scores and success indicators)
  - Brand Accent: `#6366F1` / `#4F46E5`
- **Thumbnails**: Kept in **original full color** (never grayscaled or dimmed).
- **Typography**: Inter with strict spacing and readability.

---

## 📊 2. AI Video Quality Scoring Engine (16 Parameters)

StudyTube evaluates videos using a weighted scoring algorithm:

| Parameter | Weight | Description |
|---|---:|---|
| **Topic Relevance** | 10% | Semantic alignment between query and video content |
| **Content Coverage** | 10% | Depth of concepts covered vs skipped |
| **Teaching Clarity** | 10% | Pedagogical delivery and structured pacing |
| **Practical Examples** | 5% | Hands-on code demonstrations and project work |
| **Technical Accuracy** | 5% | Community-validated code correctness |
| **Positive Learning Comments** | 10% | Student feedback explicitly confirming conceptual mastery |
| **Negative Feedback** | 5% | Penalty for pacing issues, poor audio, or flaws |
| **Content-related Feedback** | 5% | Depth of technical discussion vs superficial comments |
| **Comment Sentiment** | 5% | Overall sentiment polarity ratio |
| **Comment Authenticity** | 5% | Bot and spam filtration penalty |
| **Like-to-view Ratio** | 5% | Engagement ratio benchmarked against industry baselines |
| **View Engagement** | 5% | Comment velocity per 1,000 views |
| **Channel Credibility** | 5% | Verification status and historical educational authority |
| **Video Duration** | 5% | Suitability for subject depth (crash course vs deep dive) |
| **Content Freshness** | 5% | Recency check against modern framework releases |
| **Audio & Visual Quality** | 5% | High-definition production and visual clarity |
| **Total** | **100%** | **Normalized 0–100 Scale** |

### Classification Tiers:
- **90–100**: Excellent (Green)
- **80–89**: Very Good (Green)
- **70–79**: Good (Amber)
- **50–69**: Average (Orange)
- **Below 50**: Not Recommended (Red)

*Note: Missing data is not penalized as zero; scores are normalized across available metrics with an Evaluation Confidence indicator.*

---

## 🧠 3. AI Comment Analysis & Intelligence

- Categorizes student comments into:
  1. **Positive Learning Feedback** (*"Finally understood dependency injection!"*)
  2. **Technical Mistakes / Community Fixes** (*"Notice at 45:10, in Java 17 that method changed"*)
  3. **Student Confusion** (*"Why use @Component instead of @Service?"*)
  4. **Missing Topics** (*"Wish you covered Docker deployment"*)
  5. **Outdated Information** (*"In Spring Boot 3 use jakarta.* instead of javax.*"*)
  6. **Spam** (*Filtered out*)
- Weights meaningful educational feedback higher than generic comments (e.g. "Nice video").
- Produces an AI-generated learner satisfaction summary.

---

## 📱 4. Website Pages

1. **Landing Page (`/`)**: Dark hero aesthetic matching the design reference, search bar with topic chips (`Java Spring Boot`, `React.js`, `Data Structures`, etc.), floating AI analysis preview, and 5 core feature cards.
2. **Search Results (`/search`)**: Left filter sidebar (Beginner, Intermediate, Advanced, Duration, Features), Sort dropdown (Recommended, Highest Quality, Most Popular, Recent), and full-color video cards with quality breakdowns.
3. **Video Analysis (`/video/:videoId`)**: YouTube embed player, channel details, overall quality score gauge, 16-parameter progress bars, "Why We Recommend This Video" bullets, and tabbed comment intelligence, transcript, and syllabus chapters.
4. **Learning Roadmaps (`/roadmaps`)**: Milestone stages (Beginner, Intermediate, Advanced, Projects) with completion checkboxes, progress tracking, and curated playlists.
5. **Saved Videos Dashboard (`/saved`)**: Personal dashboard for saved videos, custom playlists, continue learning resume bar, and completion tracking.
6. **Explore (`/explore`)**: Taxonomy of curated educational categories.

---

## 🛠️ 5. Technology Stack & Architecture

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Lucide React icons.
- **Backend**: Node.js, Express, REST APIs.
- **Database**: Dual-mode persistence:
  - Connects to MongoDB via Mongoose when `MONGODB_URI` is provided.
  - Automatically activates high-performance in-memory store if MongoDB is not running locally.
- **External APIs**:
  - YouTube Data API v3 (live search, details & comments with cached fallback).
  - OpenAI API (GPT-4o-mini deep categorization with local NLP heuristic fallback).

---

## 🔑 6. Setting Up API Keys (Optional)

StudyTube works out of the box with realistic educational datasets. You can also provide live keys anytime:
1. Open the web app at [http://127.0.0.1:5173](http://127.0.0.1:5173).
2. Click the **Settings (gear icon)** in the top right.
3. Paste your YouTube Data API v3 key or OpenAI API key.
4. Click **Save Keys** — the platform will instantly use them without needing a server restart!

Or set them in `server/.env`:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/studytube
YOUTUBE_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

---

## 💻 7. Development Commands

```bash
# Run both Backend & Frontend simultaneously
npm run dev

# Run only Backend
npm run server

# Run only Frontend
npm run client

# Build Frontend for Production
npm run build
```

