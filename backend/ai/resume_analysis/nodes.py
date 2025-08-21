from .agent_state import AgentState
from ..utils import llm
from .output_models import ResumeSections, ResumeEvaluation

def parse_resume_sections(state: AgentState) -> AgentState:
    structured_llm = llm.with_structured_output(ResumeSections)
    res = structured_llm.invoke(f"""

    You are a resume parser. Given a resume text, extract all relevant details and map them into this structured JSON schema:

    {state["resume_text"]}

    If some fields are missing in the resume, leave them null. 
    Always use lists for multiple items. 
    Always keep date fields as strings in the same format they appear.

    """)

    state["resume_sections"] = res.dict()

    return state

def analyze_resume_sections(state: AgentState) -> AgentState:
    structured_llm = llm.with_structured_output(ResumeEvaluation)

    res = structured_llm.invoke(f"""
    You are an expert technical recruiter and resume evaluator. Evaluate the candidate’s resume based on the following job description:

    Job Description:
    {state["job_description_text"]}

    Candidate Resume JSON:
    {state["resume_sections"]}

    Please provide:

    1. Scores from 0-100 for:
      - ATS Compatibility
      - Skill Match
      - Experience Quality
      - Education Fit
      - Overall Score

    2. Feedback for each dimension, including:
      - Comments about strengths/weaknesses
      - 2-3 actionable suggestions for improvement

    Output must be in strict JSON matching this schema:
    {ResumeEvaluation.schema_json()}

    """)

    state["resume_analysis"] = res.dict()

    return state