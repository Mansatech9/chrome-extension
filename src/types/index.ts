export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  remote: boolean;
  url: string;
  datePosted: Date;
  source: string;
  tags: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
  createdAt: Date;
}

export interface UserPreferences {
  keywords: string[];
  locations: string[];
  jobTypes: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  remoteOnly: boolean;
  notifications: boolean;
}

export interface SearchFilters {
  keywords: string;
  location: string;
  jobType: string;
  remote: boolean;
  salaryMin?: number;
  salaryMax?: number;
}

export interface ExtensionState {
  isActive: boolean;
  currentUrl: string;
  extractedJobs: Job[];
  isLoading: boolean;
  error: string | null;
}