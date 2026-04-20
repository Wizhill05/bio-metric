import os
from crewai import Agent, Task, Crew, Process, LLM
agent = Agent(role='test', goal='test', backstory='test', llm=LLM(model="ollama/test", base_url="http://localhost:11434"))
task = Task(description='test', expected_output='test', agent=agent)
crew = Crew(agents=[agent], tasks=[task])
try:
    crew.kickoff()
except Exception as e:
    pass
print(type(crew.usage_metrics))
print(dir(crew.usage_metrics))
if hasattr(crew.usage_metrics, "total_tokens"):
    print(crew.usage_metrics.total_tokens)
