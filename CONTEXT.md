# Project Context: AI Prompt Enhancer

## 1. Project Overview
* This is a fictional web application designed to help non-technical "vibe coders" generate highly effective prompts for AI app builders (e.g., Lovable, Base44, Emergent).
* The app solves the problem of vague user prompts resulting in vague applications.
* The core mechanic is a multi-step guided discovery flow that aggregates user inputs and outputs a final, comprehensive system prompt.

## 2. Tech Stack & Infrastructure
* Framework: Next.js (App Router).
* Styling & UI: Generated via Google Stitch Model Context Protocol (MCP).
* AI Integration: OpenRouter API (Strictly for app functionality, not for coding).
* Backend: Strictly client-side or Next.js server actions ONLY.
* Database: None.
* Authentication: None.

## 3. Product Requirements & Scope
* State Management: The application state only exists during the active session. Nothing needs to be saved to a database.
* Flow Termination: Once the final prompt is generated and displayed with a "Copy" button, the flow ends.
* Restart Mechanics: The user must be able to restart the process from the beginning easily, wiping the previous state.

## 4. AI & OpenRouter Integration Rules
* Use the OpenRouter API exclusively to generate the final prompt based on the aggregated state of the user flow.
* The specific model will be passed dynamically or configured via environment variables.
* SECURITY: The OpenRouter API key MUST be stored in `.env.local` and never committed to version control. Do not output the raw API key in any logs or client-side responses.

## 5. UI/UX Rules
* Prioritize a clean, frictionless multi-step flow.
* Ensure smooth transitions between steps to prevent user fatigue.
* Defer exact visual layouts to the Stitch MCP, but enforce clean semantic HTML and accessibility best practices.

## 6. Coding Standards
* **Clean Architecture:** Strictly decouple business logic from UI components. Extract state management, data transformations, and OpenRouter API interactions into dedicated service layers or isolated custom hooks. Ensure React components remain purely presentational.
* **Object-Oriented Design (OOD):** Prioritize class-based encapsulation for domain logic over loose functional utilities. Group related behaviors, state handling, and data parsing into strongly-typed classes (e.g., a `PromptBuilder` or `FlowManager` class) to explicitly minimize the use of standalone helper functions.
* **Strict Static Typing:** Enforce 100% strict static typing. Every API request, response, state object, and class property must have explicitly defined interfaces or types determined at compile-time before runtime execution. The `any` type is strictly prohibited.
* Write clean, modular, and DRY code.
* Add `// TODO:` comments for any features or optimizations skipped due to time constraints, as these will be discussed in the final walkthrough video.