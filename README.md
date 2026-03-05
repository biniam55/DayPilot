# DayPilot - AI-Powered Daily Planner

DayPilot is a modern, high-performance daily schedule assistant built to help users optimize their productivity using Generative AI.

## 🚀 Tech Stack

- **Next.js 15 (App Router)**: High-performance framework.
- **React 19**: Latest UI patterns.
- **Tailwind CSS & ShadCN UI**: Beautiful, responsive design.
- **Genkit 1.x**: AI integration with Gemini.

## 📂 Project Structure

- `src/app/`: App router pages and layouts.
- `src/components/`: Reusable UI components (Task cards, Timeline, etc.).
- `src/ai/`: AI logic and Genkit flows.
- `src/lib/`: Types and utility functions.
- `.next/`: **(Generated)** Compiled build artifacts. Do not edit or commit to Git.

## 🛠 Local Setup (Cursor)

1.  **Initialize Git**:
    ```bash
    git init
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    - Create a `.env` file in the root.
    - Add your `GOOGLE_GENAI_API_KEY`.
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
5.  **Access the App**:
    - Open `http://localhost:9002` in your browser.

## ✨ Core Features
- **AI Assistant**: Automated daily schedule optimization.
- **Visual Dashboard**: Real-time progress and productivity metrics.
- **Responsive Navigation**: Mobile-first design with a slide-out menu.
- **Dark Mode**: Toggleable themes for comfortable viewing.
- **Task Management**: CRUD operations with local state stability.
