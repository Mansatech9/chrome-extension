class JobTrackerPopup {
  constructor() {
    this.API_BASE = 'http://localhost:3001';
    this.initElements();
    this.initEventListeners();
    this.checkAuth();
  }

  initElements() {
    // Main elements
    this.settingsBtn = document.getElementById('settingsBtn');
    
    // Forms
    this.loginForm = document.getElementById('loginForm');
    this.jobForm = document.getElementById('jobForm');
    
    // Login form
    this.emailInput = document.getElementById('email');
    this.passwordInput = document.getElementById('password');
    this.loginBtn = document.getElementById('loginBtn');
    this.loginStatus = document.getElementById('loginStatus');
    
    // Job form
    this.companyInput = document.getElementById('company');
    this.positionInput = document.getElementById('position');
    this.locationInput = document.getElementById('location');
    this.salaryInput = document.getElementById('salary');
    this.notesInput = document.getElementById('notes');
    this.extractBtn = document.getElementById('extractBtn');
    this.saveBtn = document.getElementById('saveBtn');
    this.logoutBtn = document.getElementById('logoutBtn');
    this.jobStatus = document.getElementById('jobStatus');
  }

  initEventListeners() {
    // Settings button
    this.settingsBtn.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
    
    // Login form
    this.loginBtn.addEventListener('click', () => this.handleLogin());
    this.passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleLogin();
    });
    
    // Job form
    this.extractBtn.addEventListener('click', () => this.extractJobData());
    this.saveBtn.addEventListener('click', () => this.saveJob());
    this.logoutBtn.addEventListener('click', () => this.handleLogout());
  }

  async checkAuth() {
    try {
      const { authToken, userId } = await chrome.storage.local.get(['authToken', 'userId']);
      if (authToken && userId) {
        this.showJobForm();
        // Auto-extract when opened via context menu
        chrome.runtime.sendMessage({ action: 'checkContextMenuTrigger' }, (response) => {
          if (response?.fromContextMenu) {
            this.extractJobData();
          }
        });
      } else {
        this.showLoginForm();
      }
    } catch (error) {
      console.error('Auth check error:', error);
      this.showLoginForm();
    }
  }

  showLoginForm() {
    this.loginForm.style.display = 'block';
    this.jobForm.style.display = 'none';
  }

  showJobForm() {
    this.loginForm.style.display = 'none';
    this.jobForm.style.display = 'block';
  }

  showStatus(element, message, type = 'success') {
    element.textContent = message;
    element.className = `status ${type}`;
    
    setTimeout(() => {
      element.className = 'status';
    }, 3000);
  }

  setLoading(button, isLoading) {
    const btnText = button.querySelector('.btn-text') || button.querySelector('span');
    if (isLoading) {
      button.disabled = true;
      const loadingEl = document.createElement('span');
      loadingEl.className = 'loading';
      button.insertBefore(loadingEl, btnText);
    } else {
      button.disabled = false;
      const loadingEl = button.querySelector('.loading');
      if (loadingEl) loadingEl.remove();
    }
  }

  async handleLogin() {
    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value;

    if (!email || !password) {
      this.showStatus(this.loginStatus, 'Please enter email and password', 'error');
      return;
    }

    this.setLoading(this.loginBtn, true);

    try {
      const response = await fetch(`${this.API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const { token, user } = await response.json();
      
      await chrome.storage.local.set({
        authToken: token,
        userEmail: user.email,
        userId: user.uid
      });

      this.showStatus(this.loginStatus, 'Login successful!');
      this.showJobForm();
      await this.extractJobData();
      
    } catch (error) {
      console.error('Login error:', error);
      this.showStatus(this.loginStatus, error.message || 'Login failed', 'error');
    } finally {
      this.setLoading(this.loginBtn, false);
    }
  }

  async handleLogout() {
    try {
      await chrome.storage.local.remove(['authToken', 'userEmail', 'userId']);
      this.showLoginForm();
      this.clearForm();
      this.showStatus(this.jobStatus, 'Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      this.showStatus(this.jobStatus, 'Logout failed', 'error');
    }
  }

  clearForm() {
    this.companyInput.value = '';
    this.positionInput.value = '';
    this.locationInput.value = '';
    this.salaryInput.value = '';
    this.notesInput.value = '';
  }

  async extractJobData() {
    this.setLoading(this.extractBtn, true);
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          const getText = (selectors) => {
            for (const selector of selectors) {
              const el = document.querySelector(selector);
              if (el) return el.textContent.trim();
            }
            return '';
          };

          // Enhanced selectors with better position detection
          const company = getText([
            '[data-testid="inlineHeader-companyName"]', // LinkedIn
            '.jobsearch-InlineCompanyRating a', // Indeed
            '.employer-name', // Glassdoor
            '.company-name', // Generic
            '[itemprop="hiringOrganization"]', // Schema.org
            '[data-company-name]', // Custom attributes
            '[class*="company" i]', // Case-insensitive class
            '[class*="employer" i]'
          ]);

          const position = getText([
            'h1[data-testid="job-title"]', // LinkedIn
            'h1.jobsearch-JobInfoHeader-title', // Indeed
            'h1[itemprop="title"]', // Schema.org
            'h1[class*="title" i]',
            'h1[class*="position" i]',
            'h1.job-title',
            'h1', // Fallback to first h1
            '[data-testid="job-title"]', // LinkedIn alternative
            '.jobsearch-JobInfoHeader-title' // Indeed alternative
          ]);

          const location = getText([
            '[data-testid="job-location"]', // LinkedIn
            '.jobsearch-JobInfoHeader-subtitle div', // Indeed
            '[itemprop="jobLocation"]', // Schema.org
            '[class*="location" i]',
            '.location'
          ]);

          const salary = getText([
            '[data-testid="salary-range"]', // LinkedIn
            '.jobsearch-JobMetadataHeader-item', // Indeed
            '[itemprop="baseSalary"]', // Schema.org
            '[class*="salary" i]',
            '[class*="compensation" i]'
          ]);

          const description = getText([
            '[data-testid="job-description"]', // LinkedIn
            '#jobDescriptionText', // Indeed
            '[itemprop="description"]', // Schema.org
            '[class*="description" i]'
          ]);

          return {
            company: company,
            position: position,
            location: location,
            salary: salary,
            description: description,
            url: window.location.href
          };
        }
      });

      if (results?.[0]?.result) {
        const jobData = results[0].result;
        this.companyInput.value = jobData.company;
        this.positionInput.value = jobData.position;
        this.locationInput.value = jobData.location;
        this.salaryInput.value = jobData.salary;
        this.notesInput.value = jobData.description || '';
        
        this.showStatus(this.jobStatus, 'Job data extracted successfully!');
      } else {
        throw new Error('No job data found on this page');
      }
    } catch (error) {
      console.error('Extraction error:', error);
      this.showStatus(this.jobStatus, error.message || 'Failed to extract job data', 'error');
    } finally {
      this.setLoading(this.extractBtn, false);
    }
  }

  async saveJob() {
    const company = this.companyInput.value.trim();
    const position = this.positionInput.value.trim();

    if (!company || !position) {
      this.showStatus(this.jobStatus, 'Company and position are required', 'error');
      return;
    }

    this.setLoading(this.saveBtn, true);

    try {
      const { authToken, userId } = await chrome.storage.local.get(['authToken', 'userId']);
      
      if (!authToken || !userId) {
        this.showStatus(this.jobStatus, 'Please sign in first', 'error');
        this.showLoginForm();
        return;
      }

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const jobData = {
        company,
        position,
        location: this.locationInput.value.trim(),
        salary: this.salaryInput.value.trim(),
        notes: this.notesInput.value.trim(),
        fromUrl: tab?.url,
        source: 'extension',
        appliedDate: new Date().toISOString(),
        status: 'applied',
        userId
      };

      const response = await fetch(`${this.API_BASE}/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save job');
      }

      this.showStatus(this.jobStatus, 'Job saved successfully!');
      this.clearForm();
      
    } catch (error) {
      console.error('Save error:', error);
      this.showStatus(this.jobStatus, error.message || 'Failed to save job', 'error');
    } finally {
      this.setLoading(this.saveBtn, false);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new JobTrackerPopup());