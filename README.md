# Vibe Coder Prompt Enhancer

Vibe Coder Prompt Enhancer is a structured, interactive web application wizard built in Next.js that helps developers and creators (vibe coders) structure their application concepts into highly effective, structured prompts. It is designed to format inputs for vibe coding platforms like Lovable, Base44, Bolt.new, and v0.

By taking a user's casual, high-level description and running them through a structured 4-step discovery wizard, it produces a detailed, comprehensive prompt outline utilizing Google's Gemini-3-Flash model via the OpenRouter API.

---

## 🌟 Key Features

1. **Structured Discovery Wizard**: A 4-step progressive flow that guides the user:
   * **Step 1: Core Idea** — Full prose details of the application.
   * **Step 2: Target Audience** — Interactive card selection for target user personas.
   * **Step 3: Key Features** — Quick-toggle chips for core functionalities (authentication, dashboards, payment, real-time messaging, and more).
   * **Step 4: Technical Requirements & Complexity** — Interactive toggles for technical needs (database, real-time sync, APIs) alongside an **App Complexity Level** slider (ranging from Simple MVP to Enterprise Scale).
2. **AI Prompt Generation**: Compiles the gathered domain data into a comprehensive instruction set using OpenRouter.
3. **High-Performance Dark Theme Aesthetics**: Leverages glassmorphic components, color-shifting glowing gradients, and responsive animations built with Google Stitch tokens.
4. **Copy-to-Clipboard & Flow Restart**: Seamlessly copy the generated prompt or start the flow over with one click.
5. **Zero-Error ESLint & TS Build**: Fully typed codebase conforming to Next.js strict compiler configurations.

---

## ⚙️ Project Structure

The project code is organized into a clean domain-separated layout:

```text
prompt-enhancer/
├── __tests__/             # Comprehensive Jest testing suite
│   ├── api/               # Integration tests for route handers
│   ├── components/        # Unit & interaction tests for UI components
│   └── domain/            # Unit tests for FlowState domain rules
├── app/                   # Next.js App Router root
│   ├── api/               # API endpoint routing
│   │   └── generate/      # /api/generate POST endpoint invoking OpenRouter
│   ├── components/        # Reusable page UI components
│   │   ├── steps/         # Wizards steps components (1 to 4)
│   │   ├── ResultDisplay  # Output card and action buttons
│   │   └── StepIndicator  # Step navigation progress indicator
│   ├── globals.css        # Core custom styles, styling tokens, and transitions
│   ├── layout.tsx         # Root HTML layout and font loading
│   └── page.tsx           # Home page client controller binding domain and views
├── domain/                # Pure Business Logic
│   └── FlowState.ts       # OOD FlowStateManager, interface types, and static configuration
├── package.json           # Scripts, dependencies, and configuration
├── tsconfig.json          # Strict TypeScript compiler options
└── jest.config.ts         # Jest and React Testing Library options
```

---

## 🚀 Setup & Local Development

### 1. Requirements
* Node.js (v18 or higher recommended)
* npm, yarn, or pnpm

### 2. Installation
Navigate into the application folder and install dependencies:
```bash
cd prompt-enhancer
npm install
```

### 3. Environment Variables Setup
Create an `.env.local` file in the `prompt-enhancer` directory:
```bash
cp .env .env.local
```
Open `.env.local` and configure your API key:
```env
OPENROUTER_API_KEY="your_openrouter_api_key_here"
```

### 4. Running the Development Server
Launch the local dev server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🧪 Testing & Verification

The codebase includes **75 unit and integration tests** verifying every component, route, and domain rule using Jest and React Testing Library.

* **Run all tests**:
  ```bash
  npm test
  ```

* **Verify TypeScript and Linting rules**:
  ```bash
  npm run lint
  ```

* **Run a production build**:
  ```bash
  npm run build
  ```
