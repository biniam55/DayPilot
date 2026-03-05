# DayPilot - AI-Powered Daily Planner

DayPilot is a modern, high-performance daily schedule assistant built to help users optimize their productivity using Generative AI.

## 🚀 Tech Stack

- **Next.js 15 (App Router)**: High-performance framework.
- **React 19**: Latest UI patterns.
- **Tailwind CSS & ShadCN UI**: Beautiful, responsive design.
- **Genkit 1.x**: AI integration with Gemini.
- **Firebase**: Backend services (Auth & Firestore).

## 📂 Project Structure

- `src/app/`: App router pages and layouts.
- `src/components/`: Reusable UI components (Task cards, Timeline, etc.).
- `src/ai/`: AI logic and Genkit flows.
- `src/lib/`: Types and utility functions.
- `.next/`: **(Generated)** Compiled build artifacts. Do not edit or commit to Git.

## 🛠 Local Setup (Cursor)

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Setup**:
    - Create a `.env` file in the root.
    - Add your `GOOGLE_GENAI_API_KEY`.
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
4.  **Access the App**:
    - Open `http://localhost:9002` in your browser.

## 🔗 Connecting to a Remote Git Repository (GitHub)

To push this project to your own GitHub account:

1.  **Initialize Git**:
    ```bash
    git init
    ```
2.  **Add all files**:
    ```bash
    git add .
    ```
3.  **Create initial commit**:
    ```bash
    git commit -m "Initial commit of DayPilot AI"
    ```
4.  **Add Remote Origin**:
    - Create a new repository on GitHub.
    - Copy the repository URL (e.g., `https://github.com/your-username/daypilot-ai.git`).
    ```bash
    git remote add origin <YOUR_REPOSITORY_URL>
    ```
5.  **Push to GitHub**:
    ```bash
    git branch -M main
    git push -u origin main
    ```

## ✨ Core Features
- **AI Assistant**: Automated daily schedule optimization.
- **Visual Dashboard**: Real-time progress and productivity metrics.
- **Responsive Navigation**: Mobile-first design with a slide-out menu.
- **Dark Mode**: Toggleable themes for comfortable viewing.
- **Task Management**: CRUD operations with local state stability.
