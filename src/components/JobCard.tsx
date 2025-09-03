import React from 'react';
import { MapPin, Building, Clock, Globe, ExternalLink, Bookmark, BookmarkCheck, Edit, Trash2 } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  onSave?: (job: Job) => void;
  onRemove?: (jobId: string) => void;
  onEdit?: (job: Job) => void;
  showActions?: boolean;
}

export function JobCard({ 
  job, 
  isSaved = false, 
  onSave, 
  onRemove, 
  onEdit, 
  showActions = true 
}: JobCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  const getJobTypeColor = (type: Job['type']) => {
    const colors = {
      'full-time': 'bg-green-100 text-green-800',
      'part-time': 'bg-blue-100 text-blue-800',
      'contract': 'bg-purple-100 text-purple-800',
      'internship': 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="card hover:shadow-xl transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Building className="w-4 h-4" />
            <span className="font-medium">{job.company}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(job.datePosted)}</span>
            </div>
            {job.remote && (
              <div className="flex items-center gap-1 text-green-600">
                <Globe className="w-4 h-4" />
                <span>Remote</span>
              </div>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(job)}
                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                title="Edit job"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {isSaved ? (
              <button
                onClick={() => onRemove?.(job.id)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Remove from saved"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => onSave?.(job)}
                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                title="Save job"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getJobTypeColor(job.type)}`}>
          {job.type.replace('-', ' ')}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {job.source}
        </span>
        {job.salary && (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {job.salary}
          </span>
        )}
      </div>

      {job.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {job.description}
        </p>
      )}

      {job.requirements.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
          <div className="flex flex-wrap gap-1">
            {job.requirements.slice(0, 5).map((req, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs"
              >
                {req}
              </span>
            ))}
            {job.requirements.length > 5 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{job.requirements.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {job.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {job.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {isSaved && (
            <BookmarkCheck className="w-4 h-4 text-green-600" />
          )}
          <span className="text-xs text-gray-500">
            Added {formatDate(job.datePosted)}
          </span>
        </div>
        
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
          >
            View Job
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}