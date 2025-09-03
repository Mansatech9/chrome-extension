# Job Tracker

A modern job tracking application built with React, TypeScript, and Vite. Functions both as a web application and Chrome extension for extracting job listings from popular job sites.

## Features

- 🔍 **Job Search & Discovery** - Search jobs across multiple platforms
- 💾 **Save & Organize** - Save interesting jobs and organize them
- 🔧 **Chrome Extension** - Extract jobs directly from LinkedIn, Indeed, and other job sites
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🎨 **Modern UI** - Clean, professional interface with smooth animations
- 🔐 **User Authentication** - Secure login and user management
- 🏷️ **Tagging System** - Organize jobs with custom tags
- 📊 **Analytics** - Track your job search progress

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd job-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

## Chrome Extension Setup

1. Build the project:
   ```bash
   npm run build
   ```

2. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

3. Test on job sites like LinkedIn or Indeed

## Project Structure

```
src/
├── components/          # React components
│   ├── JobCard.tsx     # Individual job display
│   ├── JobForm.tsx     # Add/edit job form
│   ├── JobList.tsx     # Job listing container
│   ├── LoginForm.tsx   # Authentication form
│   ├── SearchBar.tsx   # Job search interface
│   └── ExtensionPopup.tsx # Chrome extension popup
├── hooks/              # Custom React hooks
│   └── useAuth.ts      # Authentication logic
├── services/           # Business logic services
│   ├── api.ts          # API communication
│   ├── storage.ts      # Local storage management
│   └── jobExtractor.ts # Job extraction logic
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types
├── content-script.ts   # Chrome extension content script
└── App.tsx            # Main application component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Deployment

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions for both web application and Chrome extension.

## Technologies Used

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Storage**: LocalStorage (with plans for backend integration)
- **Extension**: Chrome Extension Manifest V3

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please create an issue in the GitHub repository.