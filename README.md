# Matchmaker AI Dashboard

An AI-assisted matchmaking platform designed for professional matchmakers to manage client profiles, generate candidate recommendations, and send personalized introductions.

---

## 🚀 Key Features

* **Client Profile Management:** Interactive database of customers, detailed preferences, and matchmaker notes.
* **Smart Matching:** AI-driven matchmaking combining deterministic rule-based filtering with generative compatibility analysis (OpenAI GPT-5).
* **Automated Introductions:** Direct integration with Resend API to draft and send personalized intro emails.
* **Matchmaker Dashboard:** Real-time metrics on customer status tags and profile verification rates.
* **Secure Auth:** Powered by Supabase Authentication.

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite, React Router, TailwindCSS, Lucide Icons, Supabase Auth client)
* **Backend:** Node.js (Bun, Express, Prisma ORM, PostgreSQL)
* **AI/API integrations:** OpenAI API (GPT models), Resend (Email delivery)

---

## 📂 Project Structure

```text
├── backend/            # Express.js server & Prisma configuration
│   ├── prisma/         # Schema, migrations, and database seed scripts
│   └── src/            # Controllers, routes, services, and utils
└── frontend/           # React dashboard application
    ├── src/components/ # Reusable UI components
    └── src/pages/      # Application views & page layouts
```

---

## ⚙️ Quick Start

### Prerequisites
- [Bun](https://bun.sh/) runtime installed.
- PostgreSQL database (or Supabase instance).

### 1. Database & Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   bun install
   ```
3. Set up environment variables in a `.env` file:
   ```env
   DATABASE_URL="your-postgresql-url"
   DIRECT_URL="your-direct-postgresql-url"
   OPENAI_API_KEY="your-openai-api-key"
   RESEND_API_KEY="your-resend-api-key"
   RESEND_FROM_EMAIL="your-onboarding-email"
   COMPANY_LOGO_URL="logo-url"
   ```
4. Run migrations and seed data:
   ```bash
   bun run generate
   ```
5. Start the server:
   ```bash
   bun run dev
   ```
   *(Running at `http://localhost:3000`)*

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   bun install
   ```
3. Set up environment variables in a `.env` file:
   ```env
   VITE_SUPABASE_URL="your-supabase-url"
   VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
   VITE_API_URL="http://localhost:3000"
   COMPANY_LOGO_URL="logo-url"
   ```
4. Start the development server:
   ```bash
   bun run dev
   ```
   *(Running at `http://localhost:5173`)*
