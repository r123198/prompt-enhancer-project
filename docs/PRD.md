You are absolutely right to double-check the assignment document. Pivoting back to the structured, multi-step flow is the correct move based on the provided text.

According to the file, the assignment is specifically asking for a **structured, step-by-step discovery flow** rather than an advanced conversational chatbot.

Here is exactly what the document states to support this:

* It explicitly asks you to build a "structured discovery flow" that guides the user.


* It suggests utilizing specific UI controls, stating you can use "any input type: free text, single choice, multiple choice, yes/no, sliders, etc.". This points directly to a form-based or wizard-like interface.


* The logic is linear: the user goes through the steps, the platform gathers "all the information", and *then* it generates the final prompt.



While you *can* use AI to generate the steps themselves, a pure back-and-forth chat interface abandons the UI design evaluation (like how you use sliders or multiple-choice inputs) that the reviewers are explicitly looking for.

Here is the corrected PRD, reverting back to the structured multi-step flow while retaining all of your strict architectural constraints.

---

### **Product Requirements Document: Prompt Enhancer App**

**1. Product Overview**
The Prompt Enhancer is a fictional web application designed to assist non-technical users who utilize "vibe coding" platforms like Lovable, Base44, and Emergent. Vague user prompts inevitably lead to vague, unsatisfactory applications. This tool provides a guided discovery flow to extract the necessary requirements from the user and generates a comprehensive, well-crafted prompt that can be pasted directly into their chosen AI builder.

**2. Technical Architecture & Scope**

* **Platform & Framework:** Web Application built with Next.js (App Router).


* **LLM Integration:** OpenRouter API utilizing the assigned model.


* **Secrets Management:** OpenRouter API keys will be securely managed via a `.env.local` file for local development.
* **API Usage Constraints:** The provided API key is restricted exclusively to application functionality (generating the final output prompt) and is deliberately excluded from developer-side AI coding tools.


* **Infrastructure:** Strictly client-side UI and Next.js server actions/API routes; no external backend, database, or authentication is required.


* **Coding Standards:**
* **Clean Architecture:** Strictly decouple business logic from UI components.
* **Object-Oriented Design (OOD):** Prioritize class-based encapsulation for domain logic (e.g., a `FlowStateManager` class).
* **Strict Static Typing:** Enforce 100% strict static typing at compile-time. The `any` type is strictly prohibited.



**3. Required Pages & Project Structure**
Given the stateless nature of the application where nothing needs to be saved, the project will utilize a minimal routing structure:

* **`app/page.tsx` (The Main Interactive Hub):** A polished workspace that hosts the multi-step guided discovery flow interface. It dynamically swaps step components based on the state of the underlying domain class.
* **`app/api/generate/route.ts` (or Server Action):** A secure server-side route handler to execute the OpenRouter API request, keeping the API key protected.

**4. Core Features & User Flow**

* **The Multi-Step Guided Discovery Flow:** An interactive, multi-step interface utilizing various input types (free text, single choice, multiple choice, yes/no, sliders) to uncover what the user wants to build.


* **Domain State Aggregation (OOP):** A TypeScript domain class aggregating inputs from every step with strict compile-time validation, ensuring the payload sent to the LLM is perfectly structured.
* **OpenRouter LLM Integration:** A backend routine that formats the aggregated state into a structured system message payload after all information is gathered.


* **Output Presentation:** A dedicated, read-only UI text block presenting the final generated, well-written prompt.


* **Session Reset Mechanics:** A mechanism to restart the process from the beginning, clearing all previous inputs.



**5. Design & UX Guidelines**

* **Design Integration:** The user interface layout will be structured leveraging Google Stitch via the Model Context Protocol (MCP).


* **Aesthetics:** Implementing a minimalist visual language—such as a clean Japandi-inspired aesthetic or structured neo-brutalism—will ensure the multi-step flow feels highly intentional, smooth, and not intimidating.


* **Evaluation Criteria:** Visual polish, UI design quality, and UX clarity are core focus areas.



**6. Deliverables & Submission Requirements**

* **GitHub Repository:** A public link containing the complete, runnable codebase.


* **AI Artifacts:** All AI-specific files (e.g., `.claude` folders, `context.md`, custom skills) must be committed to demonstrate the AI development workflow. `TODO` comments must be added for skipped features.


* **Walkthrough Video (5-10 min):** A screen recording showcasing the app, code structure, design process, AI tool usage, and future improvements.