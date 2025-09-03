import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Search, Bookmark, User, LogOut } from 'lucide-react';
import { Job, SearchFilters } from './types';
import { useAuth } from './hooks/useAuth';
import { storageService } from './services/storage';
import { jobExtractorService } from './services/jobExtractor';
import { LoginForm } from './components/LoginForm';
import { JobForm } from './components/JobForm';
import { JobList } from './components/JobList';
import { SearchBar } from './components/SearchBar';
import { ExtensionPopup } from './components/ExtensionPopup';

type ViewMode = 'dashboard' | 'extension';

function App() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | undefined>();
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');

  useEffect(() => {
    if (isAuthenticated) {
      loadSavedJobs();
    }
  }, [isAuthenticated]);

  const loadSavedJobs = async () => {
    try {
      const saved = await storageService.getSavedJobs();
      setSavedJobs(saved);
    } catch (error) {
      console.error('Failed to load saved jobs:', error);
    }
  };

  const handleSearch = async (filters: SearchFilters) => {
    setIsLoading(true);
    try {
      // Simulate API search - in real implementation, this would call apiService.searchJobs
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, show some mock jobs
      const mockJobs: Job[] = [
        {
          id: 'demo-1',
          title: 'Senior React Developer',
          company: 'TechCorp',
          location: 'San Francisco, CA',
          description: 'We are looking for an experienced React developer to join our team...',
          requirements: ['React', 'TypeScript', 'Node.js'],
          type: 'full-time',
          remote: true,
          url: 'https://example.com/job/1',
          datePosted: new Date(),
          source: 'Company Website',
          tags: ['frontend', 'senior'],
          salary: '$120,000 - $150,000',
        },
        {
          id: 'demo-2',
          title: 'Full Stack Engineer',
          company: 'StartupXYZ',
          location: 'New York, NY',
          description: 'Join our fast-growing startup as a full stack engineer...',
          requirements: ['JavaScript', 'Python', 'PostgreSQL'],
          type: 'full-time',
          remote: false,
          url: 'https://example.com/job/2',
          datePosted: new Date(Date.now() - 86400000),
          source: 'LinkedIn',
          tags: ['fullstack', 'startup'],
          salary: '$100,000 - $130,000',
        },
      ];
      
      setJobs(mockJobs);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveJob = async (job: Job) => {
    try {
      await storageService.saveJob(job);
      await loadSavedJobs();
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  };

  const handleRemoveJob = async (jobId: string) => {
    try {
      await storageService.removeJob(jobId);
      await loadSavedJobs();
    } catch (error) {
      console.error('Failed to remove job:', error);
    }
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleJobFormSave = async (job: Job) => {
    await handleSaveJob(job);
    setShowJobForm(false);
    setEditingJob(undefined);
  };

  const handleJobFormCancel = () => {
    setShowJobForm(false);
    setEditingJob(undefined);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => window.location.reload()} />;
  }

  if (viewMode === 'extension') {
    return <ExtensionPopup />;
  }

  const currentJobs = activeTab === 'all' ? jobs : savedJobs;
  const savedJobIds = savedJobs.map(job => job.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Job Tracker</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('dashboard')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'dashboard'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setViewMode('extension')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'extension'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Extension
                </button>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {activeTab === 'all' ? 'Job Search' : 'Saved Jobs'}
            </h2>
            <p className="text-gray-600">
              {activeTab === 'all' 
                ? 'Search and discover new opportunities' 
                : 'Manage your saved job opportunities'
              }
            </p>
          </div>
          
          <div className="flex gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'all'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'saved'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Saved ({savedJobs.length})
              </button>
            </div>
            
            <button
              onClick={() => setShowJobForm(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Job
            </button>
          </div>
        </div>

        {activeTab === 'all' && (
          <SearchBar onSearch={handleSearch} />
        )}

        <JobList
          jobs={currentJobs}
          savedJobIds={savedJobIds}
          onSaveJob={handleSaveJob}
          onRemoveJob={handleRemoveJob}
          onEditJob={handleEditJob}
          isLoading={isLoading}
          emptyMessage={
            activeTab === 'all'
              ? "Search for jobs using the search bar above."
              : "No saved jobs yet. Start by searching and saving jobs you're interested in."
          }
        />
      </main>

      {showJobForm && (
        <JobForm
          job={editingJob}
          onSave={handleJobFormSave}
          onCancel={handleJobFormCancel}
        />
      )}
    </div>
  );
}

export default App;