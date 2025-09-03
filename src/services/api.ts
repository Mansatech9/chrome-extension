import { Job, User, UserPreferences, SearchFilters } from '../types';

class ApiService {
  private readonly BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${this.BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Job API methods
  async searchJobs(filters: SearchFilters): Promise<Job[]> {
    const queryParams = new URLSearchParams();
    
    if (filters.keywords) queryParams.append('q', filters.keywords);
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.jobType) queryParams.append('type', filters.jobType);
    if (filters.remote) queryParams.append('remote', 'true');
    if (filters.salaryMin) queryParams.append('salary_min', filters.salaryMin.toString());
    if (filters.salaryMax) queryParams.append('salary_max', filters.salaryMax.toString());

    return this.request<Job[]>(`/jobs/search?${queryParams.toString()}`);
  }

  async getJobById(id: string): Promise<Job> {
    return this.request<Job>(`/jobs/${id}`);
  }

  async saveJob(job: Job): Promise<Job> {
    return this.request<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(job),
    });
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    return this.request<Job>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteJob(id: string): Promise<void> {
    await this.request(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  // User API methods
  async getCurrentUser(): Promise<User | null> {
    try {
      return await this.request<User>('/user/me');
    } catch (error) {
      return null;
    }
  }

  async updateUserPreferences(preferences: UserPreferences): Promise<UserPreferences> {
    return this.request<UserPreferences>('/user/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  async getUserJobs(): Promise<Job[]> {
    return this.request<Job[]>('/user/jobs');
  }

  // Analytics methods
  async trackJobView(jobId: string): Promise<void> {
    try {
      await this.request('/analytics/job-view', {
        method: 'POST',
        body: JSON.stringify({ jobId, timestamp: new Date().toISOString() }),
      });
    } catch (error) {
      console.error('Failed to track job view:', error);
    }
  }

  async trackJobSave(jobId: string): Promise<void> {
    try {
      await this.request('/analytics/job-save', {
        method: 'POST',
        body: JSON.stringify({ jobId, timestamp: new Date().toISOString() }),
      });
    } catch (error) {
      console.error('Failed to track job save:', error);
    }
  }
}

export const apiService = new ApiService();