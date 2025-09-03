class OptionsManager {
  constructor() {
    this.initElements();
    this.loadSettings();
    this.loadAccountInfo();
    this.initEventListeners();
  }

  initElements() {
    this.apiUrlInput = document.getElementById('apiUrl');
    this.saveSettingsBtn = document.getElementById('saveSettings');
    this.clearAuthBtn = document.getElementById('clearAuth');
    this.settingsStatus = document.getElementById('settingsStatus');
    this.accountInfo = document.getElementById('accountInfo');
  }

  initEventListeners() {
    this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
    this.clearAuthBtn.addEventListener('click', () => this.clearAuth());
  }

  async loadSettings() {
    try {
      const { apiUrl } = await chrome.storage.sync.get(['apiUrl']);
      if (apiUrl) {
        this.apiUrlInput.value = apiUrl;
      }
    } catch (error) {
      console.error('Settings load error:', error);
    }
  }

  async loadAccountInfo() {
    try {
      const { userEmail, authToken } = await chrome.storage.local.get(['userEmail', 'authToken']);
      
      if (userEmail && authToken) {
        this.accountInfo.innerHTML = `
          <p><strong>Signed in as:</strong> ${userEmail}</p>
          <p><strong>Status:</strong> Authenticated</p>
        `;
      } else {
        this.accountInfo.innerHTML = '<p>Not signed in</p>';
      }
    } catch (error) {
      console.error('Account info error:', error);
      this.accountInfo.innerHTML = '<p>Error loading account info</p>';
    }
  }

  async saveSettings() {
    const apiUrl = this.apiUrlInput.value.trim();
    
    if (!apiUrl) {
      this.showStatus('API URL is required', 'error');
      return;
    }

    try {
      await chrome.storage.sync.set({ apiUrl });
      this.showStatus('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Settings save error:', error);
      this.showStatus('Failed to save settings', 'error');
    }
  }

  async clearAuth() {
    if (confirm('Are you sure you want to clear your authentication? You will need to sign in again.')) {
      try {
        await chrome.storage.local.remove(['authToken', 'userEmail', 'userId']);
        this.loadAccountInfo();
        this.showStatus('Authentication cleared', 'success');
      } catch (error) {
        console.error('Clear auth error:', error);
        this.showStatus('Failed to clear authentication', 'error');
      }
    }
  }

  showStatus(message, type = 'success') {
    this.settingsStatus.textContent = message;
    this.settingsStatus.className = `status ${type}`;
    
    setTimeout(() => {
      this.settingsStatus.className = 'status';
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => new OptionsManager());