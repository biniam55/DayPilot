# DayPilot - AI-Powered Daily Planner

DayPilot is a modern, high-performance daily schedule assistant built to help users optimize their productivity using Generative AI.

## 🚀 Tech Stack

- **Next.js 15 (App Router)**: High-performance framework.
- **React 19**: Latest UI patterns.
- **Tailwind CSS & ShadCN UI**: Beautiful, responsive design.
- **Genkit 1.x**: AI integration with Gemini.

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
    - Add your `GOOGLE_GENAI_API_KEY` and Firebase keys.
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
5.  **Access the App**:
    - Open `http://localhost:9002` in your browser.

## 📦 Pushing to GitHub

1.  **Stage Files**:
    ```bash
    git add .
    ```
2.  **Commit**:
    ```bash
    git commit -m "Finalize DayPilot AI project"
    ```
3.  **Create Repository**:
    - Create a new repository on [GitHub](https://github.com/new).
4.  **Push**:
    ```bash
    git remote add origin YOUR_GITHUB_REPO_URL
    git branch -M main
    git push -u origin main
    ```

## ✨ Core Features
- **AI Assistant**: Automated daily schedule optimization.
- **Visual Dashboard**: Real-time progress and productivity metrics.
- **Responsive Navigation**: Mobile-first design with a slide-out menu.
- **Dark Mode**: Toggleable themes for comfortable viewing.
- **Task Management**: CRUD operations with local state stability.