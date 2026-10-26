# FBISE Study Hub 🎓
> **"Prepare Smart. Practice Better. Achieve More."**

An all-in-one educational platform engineered specifically for students of the **Federal Board of Intermediate and Secondary Education (FBISE), Islamabad, Pakistan**.

**Developed by Team Khan Hanan**

---

## 🌐 Live Access & Deployment

- **🚀 Live Web App:** [https://benz-four-visits-warning.trycloudflare.com](https://benz-four-visits-warning.trycloudflare.com)
- **📄 GitHub Pages Portal:** [https://007-khan829.github.io/fbise-study-hub/](https://007-khan829.github.io/fbise-study-hub/)
- **💻 GitHub Repository:** [https://github.com/007-khan829/fbise-study-hub](https://github.com/007-khan829/fbise-study-hub)
- **⚡ Deploy to Vercel:** [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F007-khan829%2Ffbise-study-hub)

---

## 🌟 Key Highlights & Features

- **🏛️ 4 Dedicated Class Portals:**
  - **Class 9 (SSC Part 1 - Matric)**
  - **Class 10 (SSC Part 2 - Matric)**
  - **1st Year — Class 11 (HSSC Part 1 - Intermediate)**
  - **2nd Year — Class 12 (HSSC Part 2 - Intermediate)**
  - Curated subject libraries: *Physics, Chemistry, Biology, Mathematics, Computer Science, English, Urdu, Pakistan Studies, Islamiat*.

- **📚 Verified Past Papers Library:**
  - Filterable by Class, Subject, Year (2021–2024), and Session (Annual / Supplementary).
  - Built-in online PDF viewer modal (with zoom and print controls).
  - Direct PDF downloads with real FBISE board headers.
  - Personal bookmarking system.

- **📑 SLO Model Papers (Student Learning Outcomes):**
  - Calibrated against the latest National Curriculum reforms and FBISE cognitive domains (Knowledge, Understanding, Application).

- **⏱️ Daily Chapter Quizzes & Streaks:**
  - One-question-at-a-time interactive exam engine.
  - Countdown timer, progress bar, question palette navigation.
  - Instant scoring with confetti celebration and full FBISE textbook explanations.
  - Daily streak tracking counter.

- **🤖 Automated AI Paper Checking System:**
  - Submit handwritten paper photos/PDF or type your answers directly.
  - Evaluates according to strict FBISE marking schemes and SLO rubrics.
  - Question-wise marks awarded, deductions highlighted, and mistakes diagnosed.
  - Actionable examiner feedback and study tips.
  - Printable / PDF exportable diagnostic report saved automatically to the student dashboard.

- **🏆 Federal Board Student Leaderboard:**
  - Daily & weekly top scholar rankings with podium presentation (🥇 Gold, 🥈 Silver, 🥉 Bronze).
  - Class-based filtering and honor points calculation.

- **📊 Student Dashboard:**
  - Profile overview, active study streak counter, accuracy analytics chart.
  - Full quiz attempt history with retake links.
  - AI checked paper reports archive.
  - Saved/bookmarked papers for quick access.

- **🛡️ Full-Featured Admin Control Panel:**
  - Platform KPI statistics (total students, papers, quizzes, submissions).
  - Upload & delete past/model papers.
  - Quiz creation & question editor.
  - Student user management (view, block/unblock, delete).
  - Publish board announcements and pinned notices.

- **🌙 Modern UI & Education Theme:**
  - Deep Federal green (`#064e3b`), clean white, and academic gold (`#d97706`).
  - Dark mode and light mode toggle.
  - Responsive mobile-first navigation drawer.
  - Mandatory credit on every page: **Developed by Team Khan Hanan**

---

## 🌐 Live Access & Deployment

- **🚀 Live Web App:** [https://benz-four-visits-warning.trycloudflare.com](https://benz-four-visits-warning.trycloudflare.com)
- **📄 GitHub Pages Portal:** [https://007-khan829.github.io/fbise-study-hub/](https://007-khan829.github.io/fbise-study-hub/)
- **💻 GitHub Repository:** [https://github.com/007-khan829/fbise-study-hub](https://github.com/007-khan829/fbise-study-hub)
- **⚡ Deploy to Vercel:** [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F007-khan829%2Ffbise-study-hub).

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, Lucide React Icons, Canvas Confetti
- **Backend:** Node.js Next.js Server Route Handlers (RESTful architecture)
- **Database:** Prisma ORM with SQLite (`dev.db`, zero-friction local execution)
- **Authentication:** Bcrypt password hashing + JWT tokens stored in HttpOnly cookies
- **File & PDF Generation:** `pdf-lib` for generating authentic FBISE board past papers
- **AI Integration:** Google Gemini API integration (`GEMINI_API_KEY`) with an intelligent built-in FBISE Rubric Evaluation Fallback engine

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js version 18+ or 20+ installed
- npm version 9+ or 10+ installed

### 2. Environment Configuration
The repository includes a ready-to-run `.env` file:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="fbise-study-hub-super-secret-jwt-key-2025-khan-hanan"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
GEMINI_API_KEY="" # Optional: paste Google Gemini API Key for live LLM inference
ADMIN_EMAIL="admin@fbise.edu.pk"
ADMIN_PASSWORD="AdminPassword123!"
```

### 3. Setup Database and Seed Authentic Data
Run the following commands in the project directory:

```bash
# Push Prisma schema to local database
npx prisma db push

# Seed realistic FBISE papers, quizzes, announcements and demo users
node prisma/seed.js
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🔑 Default Credentials

For effortless testing, the login page (`/login`) includes **1-click quick-fill demo buttons**:

### 🛡️ Administrator Account
- **Email:** `admin@fbise.edu.pk`
- **Password:** `AdminPassword123!`
- **Role:** `ADMIN` (Access to `/admin` panel)

### 🎓 Student Account (Top Scholar)
- **Email:** `khan.hanan@student.fbise.edu.pk`
- **Password:** `StudentPassword123!`
- **Class:** `12` (2nd Year)
- **Active Streak:** 21 Days

### Additional Pre-seeded Students:
- **Class 9:** `student9@fbise.edu.pk` / `StudentPassword123!`
- **Class 10:** `student10@fbise.edu.pk` / `StudentPassword123!`
- **1st Year (11):** `student11@fbise.edu.pk` / `StudentPassword123!`
- **2nd Year (12):** `student12@fbise.edu.pk` / `StudentPassword123!`

---

## 📁 Project Structure

```
fbise-study-hub/
├── prisma/
│   ├── schema.prisma       # Prisma schema (User, Paper, Quiz, Question, Attempt, CheckedPaper, Bookmark, Announcement)
│   ├── seed.js             # Database seeder with authentic PDF generation
│   └── dev.db              # SQLite Database
├── public/
│   └── uploads/
│       ├── papers/         # FBISE Past & Model Paper PDF documents
│       └── submissions/    # Student answer sheet uploads
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with Header, Footer & AuthProvider
│   │   ├── page.tsx        # Homepage (Hero, class cards, features, ticker)
│   │   ├── login/          # Sign-in page with quick demo fillers
│   │   ├── signup/         # Student registration page
│   │   ├── forgot-password/# Password recovery flow
│   │   ├── dashboard/      # Student Dashboard (analytics, quiz history, checked papers, bookmarks)
│   │   ├── classes/
│   │   │   └── [classSlug]/# Dedicated portals for Class 9, 10, 11, and 12
│   │   ├── past-papers/    # Past Papers library with filters & PDF viewer
│   │   ├── model-papers/   # SLO-based Model Papers
│   │   ├── quizzes/
│   │   │   ├── page.tsx    # Daily Quizzes index
│   │   │   └── [id]/       # Interactive 1-by-1 quiz taking engine
│   │   ├── ai-paper-check/ # AI Paper Checking System with printable reports
│   │   ├── leaderboard/    # Top student rankings & podium
│   │   ├── announcements/  # Official FBISE circulars & date sheets
│   │   ├── about/          # About FBISE Study Hub & Team Khan Hanan
│   │   ├── contact/        # Contact form, FAQs, and Islamabad location
│   │   ├── search/         # Global search
│   │   └── api/            # Backend REST API routes
│   ├── components/
│   │   ├── Header.tsx      # Navbar with classes dropdown, dark mode, search
│   │   ├── Footer.tsx      # Mandatory "Developed by Team Khan Hanan" footer
│   │   └── PdfViewerModal.tsx # Embedded PDF reader & downloader
│   ├── context/
│   │   └── AuthContext.tsx # React Auth Context
│   └── lib/
│       ├── prisma.ts       # Prisma client instance
│       ├── auth.ts         # JWT sign/verify & bcrypt helpers
│       └── ai-checker.ts   # FBISE Rubric Evaluator & Gemini integration
├── tailwind.config.js      # Deep green and gold color scheme
├── package.json
└── README.md
```

---

## 📜 Footer Credit
As required on every single page of the application:
**"Developed by Team Khan Hanan"**

*Prepare Smart. Practice Better. Achieve More.*
