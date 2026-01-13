# CloudStore Frontend

This is the frontend for the CloudStore application, a secure cloud storage solution built with React and AWS Serverless.

## Features

- 🔐 **Authentication**: Secure Login and Signup flow (currently using mock auth).
- 📂 **File Management**: Upload, list, preview, and delete files.
- 🚀 **Integration Ready**: Prepared for backend integration with API service layer.
- ✨ **Modern API**: Clean UI with drag-and-drop upload and responsive design.

## Architecture

- **Context API**: `AuthContext` for managing user state.
- **Services**: `src/services/api.js` centralizes API calls (currently mocked).
- **Environment**: Uses `.env` for configuration.

## Getting Started

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:5173`

## Development Notes

### Mock Mode
The application currently runs in Mock Mode. API calls in `services/api.js` return simulated data.
To connect to real backend later:
1. Update `VITE_API_BASE_URL` in `.env`.
2. Set `USE_MOCK = false` in `services/api.js`.

### Authentication
- You can sign up with any email/password.
- Data is persisted in `localStorage` for now.

### Validation
- **File Size**: Max 50MB.
- **File Types**: Supports Images, Videos, Audio, PDFs, Docs.