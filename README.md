# Arogya Sahaya Connect

A healthcare management application for managing family health records, vaccinations, and medical information.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository using the project's Git URL
2. Navigate to the project directory
3. Install dependencies:
```bash
npm install
```

4. Create a `.env.local` file in the root directory with your configuration:
```
VITE_APP_ID=your_app_id
VITE_APP_BASE_URL=http://localhost:3000
```

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

### Preview

Preview the production build:
```bash
npm run preview
```

## Project Structure

- `src/pages` - Application pages (Auth, Dashboard, Family, MedicalRecords, etc.)
- `src/components` - Reusable React components and UI components
- `src/lib` - Utility libraries and context providers
- `src/api` - API client configuration
- `src/hooks` - Custom React hooks
- `entities` - JSON schema definitions for data models

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run typecheck` - Check TypeScript types

## Features

- User authentication
- Family member management
- Medical records tracking
- Vaccination records
- QR code scanning
- Responsive design with Tailwind CSS

## Technology Stack

- React 18+
- Vite
- React Router
- React Query (@tanstack/react-query)
- Tailwind CSS
- Radix UI components
- Axios for HTTP client
- React Hook Form for form handling
