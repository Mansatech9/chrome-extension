import React from 'react';
import { Job } from '../types';
import { JobCard } from './JobCard';
import { Briefcase, Search } from 'lucide-react';

interface JobListProps {
  jobs: Job[];
  savedJobIds: string[];
  onSaveJob: (job: Job) => void;
  onRemoveJob: (jobId: string) => void;
  onEditJob: (job: Job) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function JobList({
  jobs,
  savedJobIds,
  onSaveJob,
  onRemoveJob,
  onEditJob,
  isLoading = false,
  emptyMessage = "No jobs found. Try adjusting your search criteria."
}: JobListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Jobs Found</h3>
        <p className="text-gray-600 max-w-md mx-auto">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Briefcase className="w-5 h-5" />
          <span className="font-medium">
            {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
          </span>
        </div>
      </div>
      
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          isSaved={savedJobIds.includes(job.id)}
          onSave={onSaveJob}
          onRemove={onRemoveJob}
          onEdit={onEditJob}
        />
      ))}
    </div>
  );
}