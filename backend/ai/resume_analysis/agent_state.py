from typing import TypedDict

class AgentState(TypedDict):
    resume_text: str
    resume_sections: dict
    job_description_text: dict
    resume_analysis: dict