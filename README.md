# DayPilot - AI-Powered Daily Planner

DayPilot is a modern, high-performance daily schedule assistant built to help users optimize their productivity using Generative AI. It allows users to manage tasks, set work preferences, and leverage AI to create the most efficient daily plan possible.

## 🚀 Tech Stack

### Frontend & Framework
- **Next.js 15 (App Router)**: Utilizing Server Components and modern routing.
- **React 19**: Latest functional components and hooks.
- **TypeScript**: Full type safety across the application.
- **Tailwind CSS**: Utility-first styling for a responsive, modern UI.
- **ShadCN UI**: Accessible and beautiful pre-built components (Radix UI based).
- **Lucide React**: Comprehensive icon library.
- **Recharts**: Data visualization for productivity analytics.

### Backend & AI
- **Firebase Authentication**: Secure user management (Email/Password & Google Sign-In).
- **Cloud Firestore**: Real-time NoSQL database for tasks and user profiles.
- **Genkit 1.x**: Framework for implementing AI flows.
- **Google Gemini 2.5 Flash**: The underlying LLM powering the schedule optimization.

## 📁 Project Structure

```text
src/
├── ai/                 # Genkit AI flows and configuration
│   ├── flows/          # AI logic (scheduling, adjustments)
│   └── genkit.ts       # AI initialization
├── app/                # Next.js App Router (pages and layouts)
│   ├── login/          # Authentication pages
│   └── globals.css     # Global styles and ShadCN theme
├── components/         # Reusable React components
│   ├── ui/             # ShadCN UI base components
│   ├── Timeline.tsx    # Visual schedule component
│   └── TaskCard.tsx    # Individual task management
├── firebase/           # Firebase client initialization and hooks
│   ├── auth/           # useUser hook
│   └── firestore/      # useCollection and useDoc hooks
├── hooks/              # Custom application hooks (toast, mobile)
└── lib/                # Utilities, shared types, and constants
```

## ✨ Core Features

### 1. AI Schedule Assistant
The heart of DayPilot. It takes your list of pending tasks and your work preferences (start/end times, preferred breaks) and uses Google Gemini to generate an optimized, non-overlapping daily schedule.

### 2. Intelligent Task Management
Full CRUD support for tasks. Each task includes:
- **Priority**: High, Medium, or Low.
- **Estimates**: Duration in minutes.
- **Categorization**: Group tasks by Work, Personal, etc.
- **Status**: Track Todo, In-Progress, and Completed.

### 3. Productivity Dashboard
Visualize your progress with:
- **Completion Rates**: Percentage of tasks finished today.
- **Priority Distribution**: Charts showing where your effort is focused.
- **Recent Activity**: A live feed of your task updates.

### 4. Dynamic Scheduling
When life happens, use the AI to re-adjust your remaining day based on unexpected events or new high-priority arrivals.

### 5. Multi-View Interface
- **Dashboard**: High-level overview.
- **Planner**: The main timeline and task list.
- **Categories**: Grouped task management.
- **Calendar**: Long-term deadline tracking.

## 🛠 Setup & Development

### Firebase Configuration
The app expects Firebase environment variables in `.env`:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- ... (standard Firebase config)

### Running Locally
1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Access at `http://localhost:9002` (or your forwarded port)

## 🎨 Theme Support
DayPilot fully supports **Dark Mode** and **Light Mode**, toggleable via the header or settings menu.
