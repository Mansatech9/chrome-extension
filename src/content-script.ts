// Content script for Chrome extension
import { jobExtractorService } from './services/jobExtractor';

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractJobs') {
    try {
      const jobs = jobExtractorService.extractJobsFromCurrentPage();
      sendResponse({ success: true, jobs });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }
  
  if (request.action === 'checkJobSite') {
    const isJobSite = jobExtractorService.isJobSite();
    sendResponse({ isJobSite });
  }
  
  return true; // Keep the message channel open for async response
});

// Auto-detect when user navigates to job listings
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    
    // Notify popup that URL changed
    chrome.runtime.sendMessage({
      action: 'urlChanged',
      url: url,
      isJobSite: jobExtractorService.isJobSite()
    });
  }
}).observe(document, { subtree: true, childList: true });

// Initial check
if (jobExtractorService.isJobSite()) {
  chrome.runtime.sendMessage({
    action: 'jobSiteDetected',
    url: location.href
  });
}