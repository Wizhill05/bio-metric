# CrewAI FastAPI Backend

This is the Python backend that runs the multi-agent AI logic for the Health Researcher.

## Setup Instructions

1. **Install dependencies:**
   Make sure you have Python installed, then run:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run the server:**
   Launch the FastAPI server using Uvicorn:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

The server will start on `http://localhost:8000`. The Vite React frontend is already configured to point to `/api/chat` on this port.
