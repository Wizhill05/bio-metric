# BioMetric 🔬

> **AI-powered answers from peer-reviewed science.**

BioMetric is a full-stack, AI-driven search engine that answers medical and health-related questions by synthesizing information exclusively from real, peer-reviewed academic papers. It eliminates LLM hallucinations by enforcing strict adherence to retrieved scientific literature, providing users with highly structured, point-wise answers and inline citations.

## ✨ Key Features

- **No Hallucinations:** Answers are strictly synthesized from academic databases (PubMed, Cochrane Library, Google Scholar, Nature) using SerpApi.
- **Multi-Agent Pipeline (CrewAI):**
  - **Research Agent:** Queries Google Scholar and retrieves high-quality, relevant academic papers.
  - **Synthesis Agent:** Analyzes the retrieved papers and constructs a concise, point-wise markdown response.
- **Interactive Citations:** Every answer includes inline markdown citations. Hovering over a citation reveals a neo-brutalist tooltip containing the paper's title, authors, year, snippet, and a link to the source.
- **Smart Follow-up Questions:** Automatically generates context-aware follow-up queries using `litellm`. Users can ask up to 4 follow-up questions in a stack-based interface, maintaining the context of previous answers.
- **8-Bit Pixel Art Aesthetics:** A unique, responsive neo-brutalist UI featuring custom 8-bit SVG icons and dynamic theme modes (Light/Dark).
- **Persistent Chat History:** Integrated with Supabase to provide secure user authentication and chat history persistence across sessions.
- **Guest Mode:** Non-logged-in users can still interact with the engine and explore its capabilities.

---

## 🏗️ Architecture

### Frontend

- **Framework:** React + Vite
- **Styling:** Vanilla CSS (Neo-brutalist design system)
- **State Management:** React Hooks (`useState`, `useEffect`, `useCallback`)
- **Key Components:**
  - `App.jsx`: Main application controller and layout.
  - `HistorySidebar.jsx`: Collapsible left panel for chat history and settings.
  - `AuthModal.jsx` / `OnboardingModal.jsx`: User flow and onboarding.
  - `FollowUpQuestions.jsx`: AI-suggested related queries.

### Backend

- **Framework:** FastAPI (Python)
- **AI Orchestration:** CrewAI (Agents: Researcher, Synthesizer)
- **LLM Integration:** `langchain-groq`, `litellm`
- **Data Source:** SerpApi (Google Scholar Engine)
- **Endpoints:**
  - `POST /api/chat`: Executes the multi-agent search pipeline.
  - `POST /api/followup`: Generates context-aware follow-up questions.

### Database & Auth

- **Platform:** Supabase
- **Features:** Email/Password Authentication, Row Level Security (RLS) enabled tables for storing user queries and results.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- `uv` (Python package manager)
- API Keys: SerpApi, Groq, Mistral/LiteLLM
- Supabase Project URL & Anon Key

### 1. Environment Setup

**Backend (`backend/.env`):**

```env
SERPAPI_API_KEY=your_serpapi_key
GROQ_API_KEY=your_groq_key
MISTRAL_API_KEY=your_mistral_key
```

**Frontend (`.env` in root):**

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Backend Installation

Navigate to the `backend` directory and run the FastAPI server:

```bash
cd backend
uv run uvicorn main:app --reload --port 8000
```

_The backend runs on `http://localhost:8000`._

### 3. Frontend Installation

Install Node dependencies and start the Vite dev server:

```bash
npm install
npm run dev
```

_The frontend runs on `http://localhost:5173`._

### 4. Database Setup (Supabase)

Execute the provided SQL schema in your Supabase SQL Editor to create the necessary tables and policies:

```sql
-- See `supabase_schema.sql` for the full script.
CREATE TABLE chat_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    query TEXT NOT NULL,
    result JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Enable RLS and create policies...
```

---

## 🎨 Design System

BioMetric utilizes a distinctive **neo-brutalist** design language combined with **8-bit pixel art** accents.

- **Colors:** Vibrant accents (`#10b981`), high-contrast borders (`#333333`), and distinct Light/Dark themes.
- **Typography:** `Space Grotesk` for sharp, legible headers and dense informational text.
- **Icons:** Fully custom, zero-dependency SVG pixel art drawn on 8x8 grids (`src/components/Icons.jsx`).

---

## 📜 License

This project is licensed under the MIT License.
