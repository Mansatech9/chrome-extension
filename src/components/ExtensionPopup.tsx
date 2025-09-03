import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, Settings, Bookmark } from 'lucide-react';
import { Job, ExtensionState } from '../types';
import { jobExtractorService } from '../services/jobExtractor';
import { storageService } from '../services/storage';
import { JobList } from './JobList';

export function ExtensionPopup() {
  const [state, setState] = useState<ExtensionState>({
    isActive: false,
    currentUrl: '',
    extractedJobs: [],
    isLoading: false,
    error: null,
  });
  
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'extract' | 'saved'>('extract');

  useEffect(() => {
    initializeExtension();
    loadSavedJobs();
  }, []);

  const initializeExtension = () => {
    setState(prev => ({
      ...prev,
      currentUrl: window.location.href,
      isActive: jobExtractorService.isJobSite(),
    }));
  };

  const loadSavedJobs = async () => {
    try {
      const savedJobs = await storageService.getSavedJobs();
      setSavedJobIds(savedJobs.map(job => job.id));
    } catch (error) {
      console.error('Failed to load saved jobs:', error);
    }
  };

  const extractJobs = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const jobs = jobExtractorService.extractJobsFromCurrentPage();
      setState(prev => ({
        ...prev,
        extractedJobs: jobs,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to extract jobs from this page',
        isLoading: false,
      }));
    }
  };

  const handleSaveJob = async (job: Job) => {
    try {
      await storageService.saveJob(job);
      setSavedJobIds(prev => [...prev, job.id]);
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  };

  const handleRemoveJob = async (jobId: string) => {
    try {
      await storageService.removeJob(jobId);
      setSavedJobIds(prev => prev.filter(id => id !== jobId));
    } catch (error) {
      console.error('Failed to remove job:', error);
    }
  };

  const handleEditJob = (job: Job) => {
    // This would open the job form in edit mode
    console.log('Edit job:', job);
  };

  if (!state.isActive) {
    return (
      <div className="w-80 p-6 bg-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Job Tracker Extension
          </h3>
          <p className="text-gray-600 text-sm">
            Navigate to a job site like LinkedIn or Indeed to start extracting jobs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 max-h-[600px] bg-white">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Job Tracker</h2>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all">
            <Settings className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('extract')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              activeTab === 'extract'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Extract Jobs
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              activeTab === 'saved'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Saved Jobs
          </button>
        </div>
      </div>

      <div className="p-4 overflow-y-auto max-h-[500px]">
        {activeTab === 'extract' ? (
          <div>
            <div className="flex gap-2 mb-4">
              <button
                onClick={extractJobs}
                disabled={state.isLoading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {state.isLoading ? 'Extracting...' : 'Extract Jobs'}
              </button>
            </div>

            {state.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                {state.error}
              </div>
            )}

            <JobList
              jobs={state.extractedJobs}
              savedJobIds={savedJobIds}
              onSaveJob={handleSaveJob}
              onRemoveJob={handleRemoveJob}
              onEditJob={handleEditJob}
              isLoading={state.isLoading}
              emptyMessage="Click 'Extract Jobs' to find jobs on this page."
            />
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Your saved jobs will appear here.
            </p>
            {/* This would show saved jobs from storage */}
            <div className="text-center py-8">
              <Bookmark className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No saved jobs yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}