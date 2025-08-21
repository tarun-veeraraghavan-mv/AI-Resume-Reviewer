from typing import List, Optional
from pydantic import BaseModel, Field

# Resume section models

class ContactInfo(BaseModel):
    name: Optional[str] = Field(None, description="Full name of the candidate")
    email: Optional[str] = Field(None, description="Email address")
    phone: Optional[str] = Field(None, description="Phone number")
    linkedin: Optional[str] = Field(None, description="LinkedIn profile URL if present")
    github: Optional[str] = Field(None, description="GitHub profile URL if present")
    portfolio: Optional[str] = Field(None, description="Personal website or portfolio URL")

class WorkExperience(BaseModel):
    job_title: Optional[str] = Field(None, description="Title of the role")
    company: Optional[str] = Field(None, description="Company name")
    location: Optional[str] = Field(None, description="Location if available")
    start_date: Optional[str] = Field(None, description="Start date in YYYY-MM or free text if unclear")
    end_date: Optional[str] = Field(None, description="End date or 'Present' if ongoing")
    achievements: List[str] = Field(default_factory=list, description="List of bullet-point achievements")

class Education(BaseModel):
    degree: Optional[str] = Field(None, description="Degree obtained, e.g., B.Sc. Computer Science")
    institution: Optional[str] = Field(None, description="Name of university or school")
    location: Optional[str] = Field(None, description="Location of institution")
    start_date: Optional[str] = Field(None, description="Start date in YYYY-MM or free text")
    end_date: Optional[str] = Field(None, description="End date or expected graduation")
    gpa: Optional[str] = Field(None, description="GPA if mentioned")

class Project(BaseModel):
    name: Optional[str] = Field(None, description="Project name")
    description: Optional[str] = Field(None, description="Short summary of the project")
    technologies: List[str] = Field(default_factory=list, description="Technologies used")
    link: Optional[str] = Field(None, description="Link to GitHub/demo if present")

class Certification(BaseModel):
    name: Optional[str] = Field(None, description="Name of certification")
    issuer: Optional[str] = Field(None, description="Organization issuing the certification")
    date: Optional[str] = Field(None, description="Date of issue or completion")

class ResumeSections(BaseModel):
    contact_info: ContactInfo = Field(default_factory=ContactInfo, description="Basic candidate contact info")
    summary: Optional[str] = Field(None, description="Professional summary or objective if present")
    skills: List[str] = Field(default_factory=list, description="List of explicit or inferred skills")
    work_experience: List[WorkExperience] = Field(default_factory=list, description="Past job roles and achievements")
    education: List[Education] = Field(default_factory=list, description="Educational background")
    projects: List[Project] = Field(default_factory=list, description="Projects section if included")
    certifications: List[Certification] = Field(default_factory=list, description="Professional certifications")
    extra: Optional[str] = Field(None, description="Any additional section that doesn’t fit neatly above (awards, volunteering, languages, etc.)")

# Resume evaluation models

class EvaluationFeedback(BaseModel):
    dimension: str
    score: Optional[int] = None  
    comments: Optional[str] = None
    suggestions: Optional[List[str]] = []

class ResumeEvaluation(BaseModel):
    ats_score: int = Field(..., description="ATS compatibility score 0-100")
    skill_match_score: int = Field(..., description="Skill match with job 0-100")
    experience_score: int = Field(..., description="Quality of experience 0-100")
    education_score: int = Field(..., description="Education fit score 0-100")
    overall_score: int = Field(..., description="Overall evaluation score 0-100")
    feedback: List[EvaluationFeedback] = []