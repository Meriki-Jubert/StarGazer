# StarGazer Project Plan

## 1. Project Brief
**Concept**: A 3D immersive storytelling platform ("StarGazer") where users can publish, read, and discuss stories.
**Key Differentiator**: An AI companion that chats about the stories like a fellow fan, embedded within a 3D interactive user interface.
**Target Audience**: Fiction writers, avid readers, and sci-fi/fantasy enthusiasts who enjoy immersive web experiences.

## 2. Technical Architecture & Stack Recommendations
To achieve the "3D and interactive" requirement while maintaining performance and SEO for stories:

*   **Frontend**: 
    *   **Framework**: Next.js 14+ (App Router) - For SSR (SEO for stories) and API routes.
    *   **UI Library**: React - Component-based architecture.
    *   **Styling**: Tailwind CSS - Rapid styling.
    *   **3D/Animation**: 
        *   `@react-three/fiber` (R3F) & `@react-three/drei`: For the 3D landing page and interactive elements.
        *   `framer-motion`: For smooth 2D transitions and UI animations.
*   **Backend / Database**:
    *   **Supabase**: Provides Postgres database (for stories/users), Authentication (Sign-up/Login), and Real-time capabilities (potentially for chat).
    *   **Alternative**: Next.js API Routes + Prisma + SQLite (for a self-contained prototype).
*   **AI Integration**:
    *   **OpenAI API (GPT-4o or GPT-3.5-turbo)**: To power the "Fan AI" persona.
    *   **Vercel SDK**: `ai` package for streaming chat responses.

## 3. MVP Definition (Minimal Viable Product)
The goal is to ship a vertical slice of the experience:

1.  **Immersive Landing Page**:
    *   3D Hero Banner (e.g., a floating book, a library, or a starry sky).
    *   Auth buttons (Login/Sign Up).
    *   Story Feed Preview (Cards floating or presented in a grid).
2.  **Authentication**: Simple Email/Password or Social Login.
3.  **Story Management**:
    *   **Publish**: Simple Markdown or Rich Text editor.
    *   **Read**: Distraction-free reading view.
4.  **AI Fan Chat**:
    *   A chat interface accessible while reading.
    *   System prompt configured to act as "two fans" or a "super fan" discussing the specific story content.

## 4. Questions & Clarifications
Before we start coding, please clarify the following to ensure we build exactly what you envision:

1.  **The "3D" Aspect**: How heavy should the 3D be?
    *   *Option A*: Full 3D navigation (walking around a library).
    *   *Option B*: 3D decorative elements (hero banner, floating objects) with standard scrolling. (Recommended for usability).
2.  **The AI Persona**: You mentioned "like two fans of the books".
    *   Should the AI simulate a conversation between *two* AI agents that the user watches/joins?
    *   Or should the AI act as *one* fan talking to the *user* (the second fan)?
3.  **Content**: Are there specific genres you want to focus on (e.g., Sci-Fi/Fantasy suits the 3D theme)?
4.  **Scope**: Do we need user profiles, likes, and comments for the MVP, or just the Core (Write-Read-Chat)?

## 5. Next Steps
Once you confirm the answers above, I will:
1.  Initialize the Next.js project.
2.  Set up the 3D environment basics.
3.  Implement the AI Chat api.
