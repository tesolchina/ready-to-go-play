# Module Architecture Overview

This document provides a high-level overview of the application's architecture and module organization.

## Application Overview

**Academic EAP Platform** - An educational platform for English for Academic Purposes (EAP) with AI-powered features.

**Tech Stack:**
- **Frontend:** React 18 + TypeScript + Vite
- **UI Framework:** Tailwind CSS + shadcn/ui components
- **Routing:** React Router v6
- **State Management:** React Context API
- **Backend:** Supabase (Auth, Database, Storage)
- **AI Integration:** OpenAI API (via custom service)

## Directory Structure

```
ready-to-go-play/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui component library
│   │   └── [custom].tsx    # Application-specific components
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Route components (pages)
│   ├── lib/                # Utility functions and helpers
│   ├── integrations/       # Third-party integrations
│   ├── content/            # Static content (markdown, etc.)
│   ├── App.tsx             # Main app component (routing)
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── supabase/               # Supabase configuration
└── docs/                   # Documentation (this folder)
```

## Core Modules

### 1. Authentication Module

**Location:** `/src/contexts/AuthContext.tsx`, `/src/pages/Auth.tsx`

**Purpose:** User authentication and session management

**Key Components:**
- `AuthContext` - Provides auth state and methods
- `Auth` page - Login/signup UI
- Supabase client integration

**Dependencies:**
- Supabase Auth
- React Router (for navigation)

**Usage:**
```typescript
import { useAuth } from "@/contexts/AuthContext";

const { user, isAuthenticated, signIn, signOut } = useAuth();
```

---

### 2. AI Service Module

**Location:** `/src/contexts/AIServiceContext.tsx`, `/src/lib/aiServiceGuard.ts`

**Purpose:** Manages AI service configuration and API key management

**Key Components:**
- `AIServiceContext` - AI service state
- `useAIServiceGuard` hook - Guards AI features
- `BringYourOwnKey` component - API key input

**Features:**
- API key storage (localStorage)
- Service activation status
- Request queuing
- Rate limiting

**Dependencies:**
- OpenAI API (or other AI providers)

---

### 3. UI Component Module

**Location:** `/src/components/ui/`

**Purpose:** Reusable UI component library

**Source:** shadcn/ui (copy-paste components)

**Key Components:**
- Button, Card, Input, Dialog, etc.
- Fully customizable (not npm packages)

**Usage:**
```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
```

---

### 4. Routing Module

**Location:** `/src/App.tsx`

**Purpose:** Application routing and navigation

**Routes:**
- `/` - Home/About page
- `/auth` - Authentication
- `/lessons` - Lesson listing
- `/lesson/:slug` - Individual lessons
- `/academic-phrasebank` - Phrasebank tools
- `/validate-references` - Reference validator
- `/teacher-dashboard` - Teacher tools
- And more...

**Navigation:**
- React Router v6
- Programmatic navigation via `useNavigate()`

---

### 5. Content Module

**Location:** `/src/content/`, `/src/pages/lessons/`

**Purpose:** Educational content and lessons

**Types:**
- Markdown blog posts (`/content/blog/`)
- Dynamic lessons (`/pages/lessons/`)
- Static lesson components

**Content Loading:**
- Markdown files loaded dynamically
- React components for interactive lessons

---

### 6. Data Module

**Location:** `/src/lib/`, `/src/integrations/supabase/`

**Purpose:** Data management and API interactions

**Key Files:**
- `supabase/client.ts` - Supabase client
- `supabase/types.ts` - TypeScript types
- `phrasebank-data.json` - Static phrasebank data
- `phrasebank-parser.ts` - Data parsing utilities

**Data Sources:**
- Supabase database
- Static JSON files
- External APIs (AI services)

---

### 7. Utility Module

**Location:** `/src/lib/utils.ts`

**Purpose:** Shared utility functions

**Common Utilities:**
- `cn()` - Class name merging (Tailwind)
- Date formatting
- String manipulation
- Type helpers

---

## Module Dependencies

```
┌─────────────┐
│   App.tsx   │
└──────┬──────┘
       │
       ├──► AuthContext ──► Supabase
       ├──► AIServiceContext ──► OpenAI
       ├──► Pages ──► Components ──► UI Components
       └──► Router ──► Navigation
```

## Data Flow

### Authentication Flow
```
User Action → Auth.tsx → AuthContext → Supabase → Session Update → UI Update
```

### AI Service Flow
```
User Action → Component → useAIServiceGuard → AIServiceContext → API Call → Response → UI Update
```

### Content Loading Flow
```
Route Match → Page Component → Content Loader → Markdown/JSON → Render
```

## State Management

### Context API Usage

The application uses React Context for global state:

1. **AuthContext** - User authentication state
2. **AIServiceContext** - AI service configuration

### Local State

Most components use `useState` for local state. Consider Redux/Zustand if state becomes complex.

## Integration Points

### Supabase Integration
- **Auth:** `/src/integrations/supabase/client.ts`
- **Database:** Supabase client methods
- **Storage:** Supabase storage API

### AI Integration
- **Service:** Custom service layer
- **API Key:** Stored in localStorage
- **Queue:** Request queuing system

## Module Communication

### Component → Context
```typescript
const { user } = useAuth();           // Get auth state
const { isActivated } = useAIService(); // Get AI service state
```

### Component → Component
```typescript
// Via props
<ChildComponent data={data} />

// Via context
const sharedData = useContext(MyContext);
```

### Page → Service
```typescript
// Direct API call
const response = await fetch('/api/endpoint');

// Via context method
const { signIn } = useAuth();
await signIn(email, password);
```

## Extension Points

### Adding a New Module

1. **Create module directory:**
   ```
   src/modules/my-module/
   ├── components/
   ├── hooks/
   ├── lib/
   └── types.ts
   ```

2. **Create context (if needed):**
   ```typescript
   // src/contexts/MyModuleContext.tsx
   export const MyModuleProvider = ({ children }) => {
     // Module state and logic
   };
   ```

3. **Add to App.tsx:**
   ```typescript
   <MyModuleProvider>
     <App />
   </MyModuleProvider>
   ```

4. **Create routes (if needed):**
   ```typescript
   <Route path="/my-module" element={<MyModulePage />} />
   ```

### Adding a New Page

1. Create component in `/src/pages/`
2. Add route in `App.tsx`
3. Add navigation link (if needed)

### Adding a New Feature

1. Identify which module it belongs to
2. Create components/hooks in appropriate module
3. Integrate with existing context (if needed)
4. Add routes and navigation

## Best Practices

### Module Organization
- ✅ Keep related code together
- ✅ Use clear naming conventions
- ✅ Separate concerns (UI, logic, data)
- ❌ Don't create deep nesting
- ❌ Don't mix unrelated functionality

### Component Structure
- ✅ Small, focused components
- ✅ Reusable UI components in `/components/ui/`
- ✅ Page-specific components in `/pages/`
- ✅ Shared components in `/components/`

### State Management
- ✅ Use Context for global state
- ✅ Use local state for component-specific state
- ✅ Consider lifting state up when needed
- ❌ Don't overuse Context (performance)

### File Organization
- ✅ One component per file
- ✅ Co-locate related files
- ✅ Use index files for clean imports
- ❌ Don't create too many small files

## Testing Strategy

### Unit Tests
- Test individual components
- Test utility functions
- Test hooks

### Integration Tests
- Test component interactions
- Test context providers
- Test routing

### E2E Tests
- Test user flows
- Test authentication
- Test critical features

## Performance Considerations

### Code Splitting
- Routes are code-split automatically (React Router)
- Consider lazy loading for heavy components

### Bundle Size
- Tree-shaking enabled (Vite)
- Only import what you need
- Consider removing unused UI components

### State Optimization
- Avoid unnecessary re-renders
- Use React.memo for expensive components
- Optimize context providers

## Migration Path

### Current State
- Monolithic structure (all in `/src`)
- Context-based state management
- Component-based architecture

### Future Considerations
- Module-based structure (if app grows)
- Consider state management library (if needed)
- Consider micro-frontends (if scaling)

## Related Documentation

- [Component System](./components/COMPONENT_SYSTEM.md)
- [Development Guidelines](../guides/DEVELOPMENT_GUIDELINES.md)
- [Testing & Debugging](../guides/TESTING_DEBUGGING.md)

