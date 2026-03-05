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

## 🔗 Connecting to GitHub (Remote Repository)

To push this project to your GitHub account using a **Personal Access Token (PAT)**:

1.  **Initialize Git**:
    ```bash
    git init
    git add .
    git commit -m "Initial commit of DayPilot AI"
    ```
2.  **Create a New Repo**:
    - Go to [GitHub](https://github.com/new) and create a repository (e.g., `daypilot-ai`).
3.  **Add Remote with Token**:
    - Replace `<YOUR_TOKEN>` with your PAT and `<USERNAME>` with your GitHub username.
    ```bash
    git remote add origin https://<YOUR_TOKEN>@github.com/<USERNAME>/daypilot-ai.git
    ```
4.  **Push to GitHub**:
    ```bash
    git branch -M main
    git push -u origin main
    ```

> **Security Note**: Never share your Personal Access Token or commit it directly into your code files.

## ✨ Core Features
- **AI Assistant**: Automated daily schedule optimization.
- **Visual Dashboard**: Real-time progress and productivity metrics.
- **Responsive Navigation**: Mobile-first design with a slide-out menu.
- **Dark Mode**: Toggleable themes for comfortable viewing.
- **Task Management**: CRUD operations with local state stability.
