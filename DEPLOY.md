# Job Tracker - Deployment Guide

## Overview
This is a React + TypeScript application built with Vite that can function both as a web application and as a Chrome extension for extracting job listings from popular job sites.

## Prerequisites
- Node.js 18+ and npm
- Git
- Chrome browser (for extension testing)

## Local Development

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd job-tracker
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Job Tracker
```

### 3. Start Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

## Chrome Extension Development

### 1. Build Extension
```bash
npm run build
```

### 2. Load Extension in Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `dist` folder
4. The extension will appear in your extensions list

### 3. Test Extension
1. Navigate to LinkedIn, Indeed, or other supported job sites
2. Click the extension icon in the toolbar
3. Use the "Extract Jobs" feature to test job extraction

## Production Deployment

### Web Application Deployment

#### Option 1: Netlify
1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Netlify:
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

#### Option 2: Vercel
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

#### Option 3: AWS S3 + CloudFront
1. Build the project:
   ```bash
   npm run build
   ```

2. Upload `dist` folder contents to S3 bucket
3. Configure CloudFront distribution
4. Update DNS records

### Chrome Extension Deployment

#### 1. Prepare Extension Package
```bash
# Build the extension
npm run build

# Create a zip file of the dist folder
cd dist
zip -r ../job-tracker-extension.zip .
cd ..
```

#### 2. Chrome Web Store Submission
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Pay the one-time $5 developer registration fee
3. Click "Add new item"
4. Upload `job-tracker-extension.zip`
5. Fill out the store listing:
   - Description
   - Screenshots
   - Category: Productivity
   - Privacy policy (required)
6. Submit for review

#### 3. Extension Review Process
- Initial review: 1-3 days for new extensions
- Updates: Usually within 24 hours
- Follow Chrome Web Store policies

## Environment Configuration

### Development
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Job Tracker Dev
```

### Production
```env
VITE_API_URL=https://your-api-domain.com/api
VITE_APP_NAME=Job Tracker
```

## API Backend Setup (Optional)

If you want to implement the full API functionality:

### 1. Backend Technologies
- Node.js + Express or Fastify
- PostgreSQL or MongoDB
- JWT for authentication
- Redis for caching (optional)

### 2. Required API Endpoints
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/user/me
PUT  /api/user/preferences

GET  /api/jobs/search
GET  /api/jobs/:id
POST /api/jobs
PUT  /api/jobs/:id
DELETE /api/jobs/:id
GET  /api/user/jobs

POST /api/analytics/job-view
POST /api/analytics/job-save
```

### 3. Database Schema
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  description TEXT,
  requirements JSONB,
  salary VARCHAR(100),
  job_type VARCHAR(50),
  remote BOOLEAN DEFAULT false,
  url VARCHAR(500),
  source VARCHAR(100),
  tags JSONB,
  date_posted TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Monitoring and Analytics

### 1. Error Tracking
- Integrate Sentry for error monitoring
- Set up alerts for critical errors

### 2. Analytics
- Google Analytics for web app usage
- Chrome extension analytics via Chrome Web Store

### 3. Performance Monitoring
- Lighthouse CI for performance testing
- Core Web Vitals monitoring

## Security Considerations

### 1. Content Security Policy
Update `index.html` with appropriate CSP headers:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

### 2. Extension Permissions
- Request minimal permissions needed
- Use `activeTab` instead of broad host permissions when possible
- Implement proper data sanitization

### 3. API Security
- Implement rate limiting
- Use HTTPS only
- Validate all inputs
- Implement proper CORS policies

## Troubleshooting

### Common Issues

#### 1. Extension Not Loading
- Check manifest.json syntax
- Verify all file paths are correct
- Check browser console for errors

#### 2. Job Extraction Not Working
- Verify content script is injected
- Check if job site has updated their HTML structure
- Test on different job sites

#### 3. Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check TypeScript errors: `npm run type-check`
- Verify all imports are correct

### Performance Optimization
- Implement lazy loading for job lists
- Use React.memo for expensive components
- Optimize bundle size with code splitting
- Implement virtual scrolling for large job lists

## Contributing

### 1. Development Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and test
npm run dev
npm run build
npm run type-check

# Commit and push
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

### 2. Code Quality
- Run ESLint: `npm run lint`
- Format code: `npm run format`
- Run tests: `npm run test`

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review Chrome extension documentation
3. Check React and Vite documentation
4. Create an issue in the project repository

## License

This project is licensed under the MIT License. See LICENSE file for details.