export async function fetchHealthResearch(query, historyPayload = []) {
const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`;
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        history: historyPayload
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Backend error: ${response.status}`);
    }

    // The FastAPI backend + CrewAI workflow handles all prompt logic natively 
    // and returns the exact strict JSON dictionary we expect.
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch from backend:", error);
    throw new Error(error.message || "Failed to communicate with the CrewAI Python backend. Please ensure the FastAPI server is running on port 8000.");
  }
}
