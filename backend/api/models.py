from django.db import models

class JobDescription(models.Model):
    job_title = models.CharField(max_length=255)
    job_level = models.CharField(max_length=50)
    employment_type = models.CharField(max_length=50)
    department = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    company_website = models.URLField(blank=True, null=True)
    job_description = models.TextField()
    key_skills = models.TextField()
    education_requirements = models.CharField(max_length=255)
    certifications = models.CharField(max_length=255, blank=True, null=True)
    remote_onsite_hybrid = models.CharField(max_length=50)
    skills_match_focus = models.BooleanField(default=False)
    experience_fit_focus = models.BooleanField(default=False)
    education_focus = models.BooleanField(default=False)
    projects_focus = models.BooleanField(default=False)
    ats_keywords_focus = models.BooleanField(default=False)
    additional_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.job_title