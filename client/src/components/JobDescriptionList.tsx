"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Spinner,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Chip,
  Link,
} from "@heroui/react";

interface JobDescription {
  id: number;
  job_title: string;
  job_level: string;
  employment_type: string;
  department: string | null;
  location: string;
  company_name: string;
  company_website: string | null;
  job_description: string;
  key_skills: string;
  education_requirements: string;
  certifications: string | null;
  remote_onsite_hybrid: string;
  created_at: string;
}

export function JobDescriptionList() {
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchJobDescriptions = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/job-descriptions/all/"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch job descriptions");
      }
      const data = await response.json();
      setJobDescriptions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDescriptions();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/job-descriptions/${id}/delete/`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete job description");
      }
      setJobDescriptions(jobDescriptions.filter((job) => job.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleApplyClick = (job: JobDescription) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleResumeSubmit = async () => {
    if (!selectedJob) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/api/resume-review/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description_id: selectedJob.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit resume");
      }

      const result = await response.json();
      console.log("Resume submitted successfully:", result);
      setIsModalOpen(false);
      setResumeText("");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {jobDescriptions.map((job) => (
          <Card key={job.id}>
            <CardHeader className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{job.job_title}</h3>
                <p className="text-md font-medium text-gray-500">
                  {job.company_name}
                </p>
              </div>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="light" className="-mr-2">
                    ...
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Actions">
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    onPress={() => handleDelete(job.id)}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </CardHeader>
            <CardBody>
              <div className="flex items-center text-sm text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {job.location}
              </div>
              {job.department && (
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  {job.department}
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <Chip color="primary">{job.job_level}</Chip>
                <Chip color="secondary">{job.employment_type}</Chip>
                <Chip color="warning">{job.remote_onsite_hybrid}</Chip>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold">Key Skills:</h4>
                <p className="text-sm text-gray-600">{job.key_skills}</p>
              </div>
              <div className="mt-2">
                <h4 className="font-semibold">Education:</h4>
                <p className="text-sm text-gray-600">
                  {job.education_requirements}
                </p>
              </div>
              {job.certifications && (
                <div className="mt-2">
                  <h4 className="font-semibold">Certifications:</h4>
                  <p className="text-sm text-gray-600">{job.certifications}</p>
                </div>
              )}
            </CardBody>
            <CardFooter className="flex justify-between items-center">
              <p className="text-xs text-gray-400">
                Posted on {new Date(job.created_at).toLocaleDateString()}
              </p>
              <div>
                {job.company_website && (
                  <Link as="a" href={job.company_website} target="_blank">
                    Visit Website
                  </Link>
                )}
                <Button onPress={() => handleApplyClick(job)} className="ml-4">
                  Apply Now
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Apply for {selectedJob?.job_title}</ModalHeader>
              <ModalBody>
                <Textarea
                  label="Paste your resume"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={15}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleResumeSubmit}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
