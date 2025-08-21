from langgraph.graph import StateGraph, START, END
from .agent_state import AgentState
from .nodes import parse_resume_sections, analyze_resume_sections

graph = StateGraph(AgentState)

graph.add_node("parse_resume_sections", parse_resume_sections)
graph.add_node("analyze_resume_sections", analyze_resume_sections)

graph.add_edge(START, "parse_resume_sections")
graph.add_edge("parse_resume_sections", "analyze_resume_sections")
graph.add_edge("analyze_resume_sections", END)

app = graph.compile()