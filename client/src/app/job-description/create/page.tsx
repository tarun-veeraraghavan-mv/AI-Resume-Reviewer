"use client";

import { JobDescriptionForm } from "@/components/JobDescriptionForm";

export default function page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Job Description List</h1>
      <JobDescriptionForm />
    </div>
  );
}
