"use client";
import { useState } from "react";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import type { Selection } from "@react-types/shared";
import { useRouter } from "next/navigation";

const jobLevels = [
  { key: "intern", label: "Intern" },
  { key: "entry-level", label: "Entry-Level (0–2 yrs)" },
  { key: "mid-level", label: "Mid-Level (2–5 yrs)" },
  { key: "senior", label: "Senior (5+ yrs)" },
];

const employmentTypes = [
  { key: "full-time", label: "Full-Time" },
  { key: "part-time", label: "Part-Time" },
  { key: "contract", label: "Contract" },
  { key: "internship", label: "Internship" },
];

const remoteOptions = [
  { key: "remote", label: "Remote" },
  { key: "onsite", label: "Onsite" },
  { key: "hybrid", label: "Hybrid" },
];

const initialState = {
  jobTitle: "",
  jobLevel: new Set<string>([]),
  employmentType: new Set<string>([]),
  department: "",
  location: "",
  companyName: "",
  companyWebsite: "",
  jobDescription: "",
  keySkills: "",
  educationRequirements: "",
  certifications: "",
  remoteOnsiteHybrid: new Set<string>([]),
  scoringFocus: {
    skillsMatch: false,
    experienceFit: false,
    education: false,
    projects: false,
    atsKeywords: false,
  },
  additionalNotes: "",
};

export function JobDescriptionForm() {
  const router = useRouter();
  const [formState, setFormState] = useState(initialState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string) => (keys: Selection) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: keys as Set<string>,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      scoringFocus: {
        ...prevState.scoringFocus,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submittedState = {
      ...formState,
      jobLevel: Array.from(formState.jobLevel)[0] || "",
      employmentType: Array.from(formState.employmentType)[0] || "",
      remoteOnsiteHybrid: Array.from(formState.remoteOnsiteHybrid)[0] || "",
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/job-descriptions/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submittedState),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Job description created successfully:", result);
        // Optionally, reset form or show a success message
        setFormState(initialState);
        router.push("/job-description");
      } else {
        console.error("Failed to create job description:", response.statusText);
        // Handle error, show an error message
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle network error
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Input
        label="Job Title"
        name="jobTitle"
        value={formState.jobTitle}
        onChange={handleChange}
        placeholder="e.g., Frontend Engineer"
      />
      <Select
        label="Job Level / Experience"
        items={jobLevels}
        selectedKeys={formState.jobLevel}
        onSelectionChange={handleSelectChange("jobLevel")}
        placeholder="Select job level"
      >
        {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
      </Select>
      <Select
        label="Employment Type"
        items={employmentTypes}
        selectedKeys={formState.employmentType}
        onSelectionChange={handleSelectChange("employmentType")}
        placeholder="Select employment type"
      >
        {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
      </Select>
      <Input
        label="Department / Team (Optional)"
        name="department"
        value={formState.department}
        onChange={handleChange}
        placeholder="e.g., Engineering"
      />
      <Input
        label="Location"
        name="location"
        value={formState.location}
        onChange={handleChange}
        placeholder="e.g., Remote, New York, USA"
      />
      <Input
        label="Company Name"
        name="companyName"
        value={formState.companyName}
        onChange={handleChange}
        placeholder="e.g., Tech Solutions Inc."
      />
      <Input
        label="Company Website / Careers Link"
        name="companyWebsite"
        type="url"
        value={formState.companyWebsite}
        onChange={handleChange}
        placeholder="https://www.techsolutions.com/careers"
      />
      <Textarea
        label="Job Description Details"
        name="jobDescription"
        value={formState.jobDescription}
        onChange={handleChange}
        placeholder="Responsibilities, Required Skills, Preferred Skills"
      />
      <Input
        label="Key Skills / Keywords"
        name="keySkills"
        value={formState.keySkills}
        onChange={handleChange}
        placeholder="e.g., React, Redux, TypeScript"
      />
      <Input
        label="Education Requirements"
        name="educationRequirements"
        value={formState.educationRequirements}
        onChange={handleChange}
        placeholder="e.g., B.Sc. in CS or related field"
      />
      <Input
        label="Certifications (Optional)"
        name="certifications"
        value={formState.certifications}
        onChange={handleChange}
        placeholder="e.g., AWS Certified Developer"
      />
      <Select
        label="Remote / Onsite / Hybrid"
        items={remoteOptions}
        selectedKeys={formState.remoteOnsiteHybrid}
        onSelectionChange={handleSelectChange("remoteOnsiteHybrid")}
        placeholder="Select work location"
      >
        {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
      </Select>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Seniority Weight / Scoring Focus (Optional)
        </label>
        <div className="mt-2 space-y-4">
          <div className="flex items-center">
            <input
              id="skills-match"
              name="skillsMatch"
              type="checkbox"
              checked={formState.scoringFocus.skillsMatch}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="skills-match"
              className="ml-3 text-sm text-gray-700 dark:text-gray-300"
            >
              Skills Match
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="experience-fit"
              name="experienceFit"
              type="checkbox"
              checked={formState.scoringFocus.experienceFit}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="experience-fit"
              className="ml-3 text-sm text-gray-700 dark:text-gray-300"
            >
              Experience Fit
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="education"
              name="education"
              type="checkbox"
              checked={formState.scoringFocus.education}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="education"
              className="ml-3 text-sm text-gray-700 dark:text-gray-300"
            >
              Education
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="projects"
              name="projects"
              type="checkbox"
              checked={formState.scoringFocus.projects}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="projects"
              className="ml-3 text-sm text-gray-700 dark:text-gray-300"
            >
              Projects
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="ats-keywords"
              name="atsKeywords"
              type="checkbox"
              checked={formState.scoringFocus.atsKeywords}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="ats-keywords"
              className="ml-3 text-sm text-gray-700 dark:text-gray-300"
            >
              ATS Keywords
            </label>
          </div>
        </div>
      </div>
      <Textarea
        label="Additional Notes / Special Requirements"
        name="additionalNotes"
        value={formState.additionalNotes}
        onChange={handleChange}
        placeholder="Any extra instructions or notes"
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
