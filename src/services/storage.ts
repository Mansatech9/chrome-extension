import { Job, User, UserPreferences } from '../types';

class StorageService {
  private readonly STORAGE_KEYS = {
    JOBS: 'saved_jobs',
    USER: 'user_data',
    PREFERENCES: 'user_preferences',
    SEARCH_HISTORY: 'search_history',
  } as const;

  // Job storage methods
  async saveJob(job: Job): Promise<void> {
    try {
      const savedJobs = await this.getSavedJobs();
      const updatedJobs = [...savedJobs.filter(j => j.id !== job.id), job];
      localStorage.setItem(this.STORAGE_KEYS.JOBS, JSON.stringify(updatedJobs));
    } catch (error) {
      console.error('Error saving job:', error);
      throw new Error('Failed to save job');
    }
  }

  async getSavedJobs(): Promise<Job[]> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.JOBS);
      if (!stored) return [];
      
      const jobs = JSON.parse(stored);
      return jobs.map((job: any) => ({
        ...job,
        datePosted: new Date(job.datePosted),
      }));
    } catch (error) {
      console.error('Error retrieving saved jobs:', error);
      return [];
    }
  }

  async removeJob(jobId: string): Promise<void> {
    try {
      const savedJobs = await this.getSavedJobs();
      const filteredJobs = savedJobs.filter(job => job.id !== jobId);
      localStorage.setItem(this.STORAGE_KEYS.JOBS, JSON.stringify(filteredJobs));
    } catch (error) {
      console.error('Error removing job:', error);
      throw new Error('Failed to remove job');
    }
  }

  // User preferences methods
  async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    try {
      localStorage.setItem(this.STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw new Error('Failed to save preferences');
    }
  }

  async getUserPreferences(): Promise<UserPreferences | null> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.PREFERENCES);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error retrieving preferences:', error);
      return null;
    }
  }

  // Search history methods
  async saveSearchHistory(query: string): Promise<void> {
    try {
      const history = await this.getSearchHistory();
      const updatedHistory = [query, ...history.filter(h => h !== query)].slice(0, 10);
      localStorage.setItem(this.STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  async getSearchHistory(): Promise<string[]> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.SEARCH_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error retrieving search history:', error);
      return [];
    }
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing data:', error);
      throw new Error('Failed to clear data');
    }
  }
}

export const storageService = new StorageService();