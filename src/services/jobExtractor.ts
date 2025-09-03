import { Job } from '../types';

class JobExtractorService {
  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private extractTextContent(element: Element | null): string {
    if (!element) return '';
    return element.textContent?.trim() || '';
  }

  private extractJobFromLinkedIn(element: Element): Job | null {
    try {
      const titleElement = element.querySelector('[data-job-title]') || 
                          element.querySelector('.job-title') ||
                          element.querySelector('h3 a');
      
      const companyElement = element.querySelector('[data-company-name]') ||
                           element.querySelector('.company-name') ||
                           element.querySelector('h4 a');
      
      const locationElement = element.querySelector('[data-job-location]') ||
                            element.querySelector('.job-location');
      
      const descriptionElement = element.querySelector('.job-description') ||
                               element.querySelector('[data-job-description]');

      const title = this.extractTextContent(titleElement);
      const company = this.extractTextContent(companyElement);
      const location = this.extractTextContent(locationElement);
      const description = this.extractTextContent(descriptionElement);

      if (!title || !company) return null;

      return {
        id: this.generateJobId(),
        title,
        company,
        location: location || 'Not specified',
        description: description || 'No description available',
        requirements: this.extractRequirements(description),
        type: this.inferJobType(title, description),
        remote: this.isRemoteJob(title, description, location),
        url: window.location.href,
        datePosted: new Date(),
        source: 'LinkedIn',
        tags: this.extractTags(title, description),
      };
    } catch (error) {
      console.error('Error extracting LinkedIn job:', error);
      return null;
    }
  }

  private extractJobFromIndeed(element: Element): Job | null {
    try {
      const titleElement = element.querySelector('[data-jk] h2 a') ||
                          element.querySelector('.jobTitle a');
      
      const companyElement = element.querySelector('[data-testid="company-name"]') ||
                           element.querySelector('.companyName');
      
      const locationElement = element.querySelector('[data-testid="job-location"]') ||
                            element.querySelector('.companyLocation');
      
      const summaryElement = element.querySelector('[data-testid="job-snippet"]') ||
                           element.querySelector('.summary');

      const title = this.extractTextContent(titleElement);
      const company = this.extractTextContent(companyElement);
      const location = this.extractTextContent(locationElement);
      const description = this.extractTextContent(summaryElement);

      if (!title || !company) return null;

      return {
        id: this.generateJobId(),
        title,
        company,
        location: location || 'Not specified',
        description: description || 'No description available',
        requirements: this.extractRequirements(description),
        type: this.inferJobType(title, description),
        remote: this.isRemoteJob(title, description, location),
        url: window.location.href,
        datePosted: new Date(),
        source: 'Indeed',
        tags: this.extractTags(title, description),
      };
    } catch (error) {
      console.error('Error extracting Indeed job:', error);
      return null;
    }
  }

  private extractRequirements(description: string): string[] {
    const requirements: string[] = [];
    const text = description.toLowerCase();
    
    // Common tech skills
    const techSkills = [
      'javascript', 'typescript', 'react', 'vue', 'angular', 'node.js', 'python',
      'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
      'html', 'css', 'sass', 'less', 'sql', 'mongodb', 'postgresql', 'mysql',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'jenkins', 'ci/cd'
    ];
    
    techSkills.forEach(skill => {
      if (text.includes(skill)) {
        requirements.push(skill);
      }
    });
    
    return requirements;
  }

  private inferJobType(title: string, description: string): Job['type'] {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.includes('intern')) return 'internship';
    if (text.includes('contract') || text.includes('freelance')) return 'contract';
    if (text.includes('part-time') || text.includes('part time')) return 'part-time';
    
    return 'full-time';
  }

  private isRemoteJob(title: string, description: string, location: string): boolean {
    const text = `${title} ${description} ${location}`.toLowerCase();
    return text.includes('remote') || text.includes('work from home') || text.includes('wfh');
  }

  private extractTags(title: string, description: string): string[] {
    const tags: string[] = [];
    const text = `${title} ${description}`.toLowerCase();
    
    const commonTags = [
      'senior', 'junior', 'lead', 'manager', 'director', 'architect',
      'frontend', 'backend', 'fullstack', 'devops', 'qa', 'testing',
      'mobile', 'web', 'desktop', 'cloud', 'ai', 'ml', 'data'
    ];
    
    commonTags.forEach(tag => {
      if (text.includes(tag)) {
        tags.push(tag);
      }
    });
    
    return tags;
  }

  extractJobsFromCurrentPage(): Job[] {
    const jobs: Job[] = [];
    const hostname = window.location.hostname;

    try {
      if (hostname.includes('linkedin.com')) {
        const jobElements = document.querySelectorAll('[data-job-id], .job-card, .jobs-search-results__list-item');
        jobElements.forEach(element => {
          const job = this.extractJobFromLinkedIn(element);
          if (job) jobs.push(job);
        });
      } else if (hostname.includes('indeed.com')) {
        const jobElements = document.querySelectorAll('[data-jk], .job_seen_beacon, .slider_container .slider_item');
        jobElements.forEach(element => {
          const job = this.extractJobFromIndeed(element);
          if (job) jobs.push(job);
        });
      } else {
        // Generic extraction for other job sites
        const jobElements = document.querySelectorAll('.job, .job-item, .position, .listing, [class*="job"]');
        jobElements.forEach(element => {
          const job = this.extractGenericJob(element);
          if (job) jobs.push(job);
        });
      }
    } catch (error) {
      console.error('Error extracting jobs:', error);
    }

    return jobs;
  }

  private extractGenericJob(element: Element): Job | null {
    try {
      const titleElement = element.querySelector('h1, h2, h3, h4, [class*="title"], [class*="position"]');
      const companyElement = element.querySelector('[class*="company"], [class*="employer"]');
      const locationElement = element.querySelector('[class*="location"], [class*="city"]');
      const descriptionElement = element.querySelector('[class*="description"], [class*="summary"], p');

      const title = this.extractTextContent(titleElement);
      const company = this.extractTextContent(companyElement);
      const location = this.extractTextContent(locationElement);
      const description = this.extractTextContent(descriptionElement);

      if (!title) return null;

      return {
        id: this.generateJobId(),
        title,
        company: company || 'Unknown Company',
        location: location || 'Not specified',
        description: description || 'No description available',
        requirements: this.extractRequirements(description),
        type: this.inferJobType(title, description),
        remote: this.isRemoteJob(title, description, location),
        url: window.location.href,
        datePosted: new Date(),
        source: 'Generic',
        tags: this.extractTags(title, description),
      };
    } catch (error) {
      console.error('Error extracting generic job:', error);
      return null;
    }
  }

  isJobSite(): boolean {
    const hostname = window.location.hostname;
    const jobSites = [
      'linkedin.com',
      'indeed.com',
      'glassdoor.com',
      'monster.com',
      'ziprecruiter.com',
      'careerbuilder.com',
      'dice.com',
      'stackoverflow.com',
      'github.com',
      'angel.co',
      'wellfound.com',
      'remote.co',
      'weworkremotely.com',
      'flexjobs.com',
      'upwork.com',
      'freelancer.com'
    ];
    
    return jobSites.some(site => hostname.includes(site));
  }
}

export const jobExtractorService = new JobExtractorService();