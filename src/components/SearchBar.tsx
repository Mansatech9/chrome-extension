import React, { useState } from 'react';
import { Search, MapPin, Filter, X } from 'lucide-react';
import { SearchFilters } from '../types';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

export function SearchBar({ onSearch, initialFilters }: SearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || {
    keywords: '',
    location: '',
    jobType: '',
    remote: false,
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      keywords: '',
      location: '',
      jobType: '',
      remote: false,
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  return (
    <div className="card mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="keywords"
              value={filters.keywords}
              onChange={handleInputChange}
              className="input-field pl-10"
              placeholder="Job title, skills, or company..."
            />
          </div>
          
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleInputChange}
              className="input-field pl-10"
              placeholder="City, state, or country..."
            />
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              Search Jobs
            </button>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="btn-secondary"
              title="Advanced filters"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showAdvanced && (
          <div className="border-t border-gray-200 pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type
                </label>
                <select
                  id="jobType"
                  name="jobType"
                  value={filters.jobType}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-1">
                  Min Salary
                </label>
                <input
                  type="number"
                  id="salaryMin"
                  name="salaryMin"
                  value={filters.salaryMin || ''}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., 50000"
                />
              </div>
              
              <div>
                <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Salary
                </label>
                <input
                  type="number"
                  id="salaryMax"
                  name="salaryMax"
                  value={filters.salaryMax || ''}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., 150000"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="remote"
                  checked={filters.remote}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Remote jobs only</span>
              </label>
              
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear filters
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}