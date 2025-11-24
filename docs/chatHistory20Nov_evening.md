# Understanding code structure and future development
_Exported on 24/11/2025 at 20:43:27 GMT+8 from Cursor (2.1.26)_

---

**User**

在/src/components/ui下面有许多代码，这些代码具体在什么地方使用到了？有没有可以合并或者删除的部分？



hooks下的文件的用处是什么？

如果要增加login功能的话，具体需要怎么操作？



My programmer colleague has questions above about the codes developed by Lovable here /Users/simonwang/Documents/Usage/AItutorNew/ready-to-go-play



I think we need a systematic introduction of different modules of the codes 

then we need advice on how to further develop the codes in a modular way and make it easier for maintenance 



we need to figure out how to leverage AI to generate codes without losing sight and control over the programmes and the software structure 



while we can ask AI to generate new functions, we also need to be able to underestand how different parts of the codes work and how to test the functions and how to debug especially when the platform grows in complexity 



create a new folder for docs and maintenance without affecting the platform 

---

**Cursor**


Analyzing the codebase structure and creating documentation. Starting by exploring key directories.



Searching for UI component usage and reviewing hooks and authentication:



Checking the main entry point and creating documentation:



Creating documentation structure and analysis files:



Creating documentation files:


```markdown
# Documentation Index

This folder contains comprehensive documentation for the Academic EAP Platform codebase.

## 📚 Documentation Structure

### Architecture
- **[Module Architecture Overview](./architecture/MODULE_ARCHITECTURE.md)** - High-level system architecture and module organization
- **[Component System](./components/COMPONENT_SYSTEM.md)** - UI component library structure and usage

### Components
- **[UI Components Usage Report](./components/UI_COMPONENTS_USAGE.md)** - Detailed analysis of which UI components are used and where
- **[Custom Components](./components/CUSTOM_COMPONENTS.md)** - Documentation for application-specific components

### Hooks
- **[Hooks Documentation](./hooks/HOOKS.md)** - Purpose and usage of all custom React hooks

### Guides
- **[Authentication & Login Guide](./guides/AUTHENTICATION_GUIDE.md)** - How to implement and extend authentication
- **[Development Guidelines](./guides/DEVELOPMENT_GUIDELINES.md)** - Best practices for development
- **[AI-Assisted Development](./guides/AI_ASSISTED_DEVELOPMENT.md)** - How to leverage AI while maintaining code quality
- **[Testing & Debugging](./guides/TESTING_DEBUGGING.md)** - Testing strategies and debugging techniques

### Maintenance
- **[Code Cleanup Recommendations](./maintenance/CODE_CLEANUP.md)** - Suggestions for removing unused code
- **[Modular Development Strategy](./maintenance/MODULAR_DEVELOPMENT.md)** - Strategies for maintaining modularity

## 🚀 Quick Start

1. **New to the codebase?** Start with [Module Architecture Overview](./architecture/MODULE_ARCHITECTURE.md)
2. **Adding a new feature?** Read [Development Guidelines](./guides/DEVELOPMENT_GUIDELINES.md)
3. **Working with UI?** Check [UI Components Usage Report](./components/UI_COMPONENTS_USAGE.md)
4. **Implementing auth?** See [Authentication & Login Guide](./guides/AUTHENTICATION_GUIDE.md)
5. **Using AI to code?** Review [AI-Assisted Development](./guides/AI_ASSISTED_DEVELOPMENT.md)

## 📝 Document Maintenance

This documentation is maintained alongside the codebase. When making significant changes:
- Update relevant documentation files
- Keep examples current
- Note breaking changes in migration guides

```

```markdown
# UI Components Usage Analysis

This document analyzes the usage of UI components from `/src/components/ui` across the codebase.

## Overview

The UI components are based on [shadcn/ui](https://ui.shadcn.com/), a collection of reusable components built on Radix UI and Tailwind CSS. These are **copy-paste components** (not installed as dependencies), meaning you have full control over their code.

## Component Usage Summary

### ✅ Frequently Used Components

These components are actively used throughout the application:

| Component | Usage Count | Key Files |
|-----------|-------------|-----------|
| **Button** | 30+ files | Most pages and components |
| **Card** | 20+ files | Index, Lessons, Blog, Dashboard, etc. |
| **Input** | 15+ files | Forms, Auth, VocabularyBuilder, etc. |
| **Label** | 12+ files | Forms and input fields |
| **Textarea** | 10+ files | Forms, chat interfaces, editors |
| **Alert** | 8+ files | Error messages, notifications |
| **Badge** | 7+ files | Status indicators, tags |
| **Tabs** | 5+ files | Auth, TeacherDashboard, etc. |
| **Sidebar** | 10+ files | Navigation, AppSidebar |
| **Collapsible** | 6+ files | Expandable sections |
| **ScrollArea** | 4+ files | Long content areas |
| **Dialog** | 3+ files | Modals, VocabularyBuilder |
| **Select** | 2+ files | Dropdowns, PhrasebankExercises |
| **Progress** | 1 file | VocabularyBuilder |
| **RadioGroup** | 1 file | FeedbackForm |
| **Skeleton** | 2 files | Loading states |

### ⚠️ Rarely/Unused Components

These components exist but are **not currently used** in the codebase:

| Component | Status | Recommendation |
|-----------|--------|---------------|
| **Accordion** | Unused | Can be removed if not needed |
| **Alert Dialog** | Unused | Keep if planning modals |
| **Aspect Ratio** | Unused | Can be removed |
| **Avatar** | Unused | Keep if planning user profiles |
| **Breadcrumb** | Unused | Can be removed |
| **Calendar** | Unused | Keep if planning date pickers |
| **Carousel** | Unused | Can be removed |
| **Chart** | Unused | Keep if planning analytics |
| **Checkbox** | Unused | Keep for forms |
| **Command** | Unused | Keep if planning command palette |
| **Context Menu** | Unused | Can be removed |
| **Drawer** | Unused | Keep as alternative to Dialog |
| **Dropdown Menu** | Unused | Keep for future menus |
| **Form** | Unused | **Keep** - Useful for form validation |
| **Hover Card** | Unused | Can be removed |
| **Input OTP** | Unused | Keep if planning 2FA |
| **Menubar** | Unused | Can be removed |
| **Navigation Menu** | Unused | Can be removed |
| **Pagination** | Unused | Keep if planning paginated lists |
| **Popover** | Unused | Keep as alternative to Tooltip |
| **Resizable** | Unused | Keep if planning resizable panels |
| **Separator** | Used (1x) | Keep - used in AppSidebar |
| **Sheet** | Unused | Keep as mobile-friendly drawer |
| **Slider** | Unused | Keep if planning range inputs |
| **Sonner** | Used (1x) | Keep - toast notifications |
| **Switch** | Unused | Keep for toggle switches |
| **Table** | Used (1x) | Keep - used in TeacherDashboard |
| **Toast/Toaster** | Used (2x) | Keep - notification system |
| **Toggle** | Unused | Can be removed |
| **Toggle Group** | Unused | Can be removed |
| **Tooltip** | Used (1x) | Keep - used in App.tsx |

## Detailed Usage by Component

### Button (`button.tsx`)
**Used in:** Almost every page and component
- Forms (Auth, VocabularyBuilder, etc.)
- Navigation actions
- Submit buttons
- Action buttons in cards

### Card (`card.tsx`)
**Used in:** Content display, dashboards, lessons
- `Index.tsx` - Feature cards
- `Lessons.tsx` - Lesson cards
- `Blog.tsx` - Blog post cards
- `TeacherDashboard.tsx` - Dashboard cards
- `VocabularyBuilder.tsx` - Exercise cards

### Input (`input.tsx`)
**Used in:** All forms
- `Auth.tsx` - Login/signup forms
- `VocabularyBuilder.tsx` - Word input
- `TeacherDashboard.tsx` - Form inputs
- `PatternAnalyzer.tsx` - Text input

### Sidebar (`sidebar.tsx`)
**Used in:** Navigation
- `AppSidebar.tsx` - Main navigation
- Multiple lesson pages
- Blog pages
- Dashboard pages

### Tabs (`tabs.tsx`)
**Used in:**
- `Auth.tsx` - Sign in/Sign up tabs
- `TeacherDashboard.tsx` - Dashboard sections

### Dialog (`dialog.tsx`)
**Used in:**
- `VocabularyBuilder.tsx` - Word details modal

### Select (`select.tsx`)
**Used in:**
- `PhrasebankExercises.tsx` - Exercise type selection

## Recommendations

### 🗑️ Safe to Remove (if not planning to use)
1. **Accordion** - Can use Collapsible instead
2. **Aspect Ratio** - Rarely needed
3. **Breadcrumb** - Not used in current design
4. **Carousel** - Not used
5. **Context Menu** - Not used
6. **Hover Card** - Not used
7. **Menubar** - Not used
8. **Navigation Menu** - Not used
9. **Toggle/Toggle Group** - Not used

### 🔒 Keep for Future Use
1. **Form** - Essential for form validation with react-hook-form
2. **Checkbox** - Common in forms
3. **Switch** - Common UI pattern
4. **Calendar** - Date selection
5. **Chart** - Analytics dashboards
6. **Command** - Command palette (popular pattern)
7. **Drawer/Sheet** - Mobile-friendly modals
8. **Dropdown Menu** - Context menus
9. **Input OTP** - Two-factor authentication
10. **Pagination** - List pagination
11. **Popover** - Tooltip alternative
12. **Resizable** - Split panels
13. **Slider** - Range inputs

### ✅ Actively Used - Keep
All components marked as "Frequently Used" should be kept.

## Component Dependencies

Some components depend on others:
- `toggle-group.tsx` imports from `toggle.tsx`
- `sidebar.tsx` uses `Skeleton`
- `toaster.tsx` uses `toast.tsx`
- `use-toast.ts` (hook) is used by toast system

## File Locations

All UI components are located in:
```
/src/components/ui/
```

Each component is self-contained and can be customized directly.

## Best Practices

1. **Don't modify shadcn components directly** - Instead, create wrapper components if you need custom behavior
2. **Check usage before removing** - Use `grep` to find all imports before deleting
3. **Document customizations** - If you modify a component, document why
4. **Keep components focused** - Each component should do one thing well

## Finding Component Usage

To find where a component is used:
```bash
grep -r "from.*components/ui/COMPONENT_NAME" src/
```

Example:
```bash
grep -r "from.*components/ui/button" src/
```

```

```markdown
# Custom Hooks Documentation

This document describes all custom React hooks in the `/src/hooks` directory.

## Overview

Custom hooks encapsulate reusable logic and state management. The codebase currently has 3 custom hooks.

## Hooks Directory Structure

```
/src/hooks/
├── use-mobile.tsx          # Mobile breakpoint detection
├── use-toast.ts            # Toast notification system
└── useAIServiceGuard.ts    # AI service activation guard
```

## Hook Details

### 1. `use-mobile.tsx`

**Purpose:** Detects if the current viewport is mobile-sized.

**Location:** `/src/hooks/use-mobile.tsx`

**Usage:**
```typescript
import { useIsMobile } from "@/hooks/use-mobile";

function MyComponent() {
  const isMobile = useIsMobile();
  
  return (
    <div>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  );
}
```

**Implementation Details:**
- Uses `window.matchMedia` to detect screen width
- Breakpoint: 768px (standard mobile breakpoint)
- Returns `boolean` - `true` if mobile, `false` if desktop
- Handles window resize events automatically
- Initial state is `undefined` until first render (prevents SSR issues)

**When to Use:**
- Conditional rendering based on screen size
- Responsive component behavior
- Mobile-specific UI adjustments

**Example Use Cases:**
- Show/hide sidebar on mobile
- Adjust layout for mobile vs desktop
- Change component size or behavior

---

### 2. `use-toast.ts`

**Purpose:** Manages toast notifications throughout the application.

**Location:** `/src/hooks/use-toast.ts`

**Usage:**
```typescript
import { useToast } from "@/hooks/use-toast";

function MyComponent() {
  const { toast } = useToast();
  
  const handleAction = () => {
    toast({
      title: "Success",
      description: "Action completed successfully",
      variant: "default", // or "destructive"
    });
  };
  
  return <button onClick={handleAction}>Do Something</button>;
}
```

**API:**
```typescript
const { toast, dismiss, toasts } = useToast();

// Show a toast
toast({
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: ToastActionElement;
});

// Dismiss a toast
dismiss(toastId?: string);

// Access all toasts
toasts: ToasterToast[];
```

**Implementation Details:**
- Uses React reducer pattern for state management
- Global state shared across all components
- Toast limit: 1 (configurable via `TOAST_LIMIT`)
- Auto-removal delay: 1,000,000ms (very long - effectively manual dismiss)
- Each toast has a unique ID
- Supports actions (buttons) in toasts

**Toast Variants:**
- `default` - Standard notification
- `destructive` - Error/warning notification

**When to Use:**
- Success messages
- Error notifications
- Warning messages
- General user feedback

**Example Use Cases:**
- Form submission feedback
- API error messages
- Authentication status messages
- Action confirmations

**Related Components:**
- `@/components/ui/toast.tsx` - Toast component
- `@/components/ui/toaster.tsx` - Toaster container (renders toasts)
- `@/components/ui/sonner.tsx` - Alternative toast system (Sonner)

**Note:** There's also a `use-toast.ts` file in `/src/components/ui/` which is the same file. This is a duplicate - consider consolidating.

---

### 3. `useAIServiceGuard.ts`

**Purpose:** Guards AI service features and ensures API key is configured before use.

**Location:** `/src/hooks/useAIServiceGuard.ts`

**Usage:**
```typescript
import { useAIServiceGuard } from "@/hooks/useAIServiceGuard";

function AIFeatureComponent() {
  const { isActivated, checkAndNotify } = useAIServiceGuard();
  
  const handleAIAction = () => {
    // Check if AI service is activated
    if (!checkAndNotify()) {
      return; // Early return if not activated
    }
    
    // Proceed with AI feature
    // ...
  };
  
  return (
    <button 
      onClick={handleAIAction}
      disabled={!isActivated}
    >
      Use AI Feature
    </button>
  );
}
```

**API:**
```typescript
const { isActivated, checkAndNotify } = useAIServiceGuard();

// isActivated: boolean - Whether AI service is configured
// checkAndNotify(): boolean - Checks activation and shows toast if not
```

**Implementation Details:**
- Depends on `AIServiceContext` for activation state
- Uses `useToast` for user notifications
- Uses `useNavigate` for navigation to configuration
- Shows toast notification if AI service not activated
- Toast includes action button to navigate to configuration

**When to Use:**
- Before calling AI APIs
- In AI-powered features
- When user tries to use AI functionality

**Example Use Cases:**
- AI chat features
- AI-powered content generation
- AI analysis tools
- Any feature requiring API key

**Related Context:**
- `@/contexts/AIServiceContext.tsx` - Provides AI service state

---

## Hook Usage Patterns

### Pattern 1: Conditional Rendering
```typescript
const isMobile = useIsMobile();
return isMobile ? <MobileView /> : <DesktopView />;
```

### Pattern 2: Guard Pattern
```typescript
const { checkAndNotify } = useAIServiceGuard();
if (!checkAndNotify()) return null;
```

### Pattern 3: User Feedback
```typescript
const { toast } = useToast();
toast({ title: "Success", description: "Done!" });
```

## Best Practices

1. **Use hooks for reusable logic** - If logic is used in multiple components, extract to a hook
2. **Keep hooks focused** - Each hook should have a single responsibility
3. **Document hook behavior** - Add JSDoc comments for complex hooks
4. **Test hooks** - Use React Testing Library for hook testing
5. **Handle edge cases** - Consider SSR, unmounting, and error states

## Creating New Hooks

When creating a new hook:

1. **Place in `/src/hooks/`**
2. **Follow naming convention:** `use-*.ts` or `use*.ts`
3. **Export as named export**
4. **Add TypeScript types**
5. **Document usage in this file**

Example:
```typescript
// src/hooks/use-custom-feature.ts
import { useState, useEffect } from 'react';

export function useCustomFeature() {
  const [state, setState] = useState();
  
  useEffect(() => {
    // Hook logic
  }, []);
  
  return { state, setState };
}
```

## Hook Dependencies

```
useAIServiceGuard
  ├── AIServiceContext (context)
  ├── useToast (hook)
  └── useNavigate (react-router)

use-toast
  └── @/components/ui/toast (component types)

use-mobile
  └── React (useState, useEffect)
```

## Testing Hooks

To test hooks, use React Testing Library:

```typescript
import { renderHook } from '@testing-library/react';
import { useIsMobile } from '@/hooks/use-mobile';

test('detects mobile viewport', () => {
  const { result } = renderHook(() => useIsMobile());
  // Test implementation
});
```

## Future Hook Ideas

Consider creating hooks for:
- `useDebounce` - Debounce values/function calls
- `useLocalStorage` - Sync state with localStorage
- `useAuth` - Already exists as context, could be hook wrapper
- `useApi` - API request handling
- `useForm` - Form state management (or use react-hook-form)

```

```markdown
# Authentication & Login Implementation Guide

This guide explains how authentication works in the application and how to extend it.

## Current Authentication System

The application uses **Supabase Authentication** for user management. Supabase provides:
- Email/password authentication
- Email confirmation
- Password reset
- Session management
- User metadata storage

## Architecture Overview

```
┌─────────────────┐
│   Auth.tsx      │  ← Login/Signup UI
│   (Page)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AuthContext    │  ← Authentication state & methods
│  (Context)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Supabase       │  ← Backend authentication service
│  Client         │
└─────────────────┘
```

## Key Files

### 1. Authentication Context
**File:** `/src/contexts/AuthContext.tsx`

This is the central authentication provider that:
- Manages user session state
- Provides authentication methods (signIn, signUp, signOut, etc.)
- Handles auth state changes
- Manages password reset flow

**Key Methods:**
```typescript
signUp(email, password, fullName)    // Register new user
signIn(email, password)               // Login
signOut()                             // Logout
resetPassword(email)                  // Send password reset email
updatePassword(newPassword)           // Update password after reset
resendConfirmation(email)             // Resend email confirmation
```

**State:**
```typescript
user: User | null              // Current user object
session: Session | null        // Current session
loading: boolean               // Loading state
isAuthenticated: boolean       // Computed auth status
```

### 2. Authentication Page
**File:** `/src/pages/Auth.tsx`

The UI for authentication with:
- Sign In tab
- Sign Up tab
- Password reset form
- Email confirmation resend
- Password update (after reset link)

### 3. Supabase Client
**File:** `/src/integrations/supabase/client.ts`

Configures the Supabase client connection.

## How to Use Authentication

### Basic Usage

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, signOut } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Protected Routes

Currently, routes are **not automatically protected**. To add protection:

**Option 1: Component-Level Protection**
```typescript
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedComponent() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/auth" />;
  
  return <div>Protected Content</div>;
}
```

**Option 2: Route Guard Component**
```typescript
// src/components/ProtectedRoute.tsx
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  
  return <>{children}</>;
}
```

Then use in `App.tsx`:
```typescript
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## Adding Login Functionality

### Current Status

✅ **Login is already implemented!** The application has:
- Full authentication system
- Login page at `/auth`
- Sign up functionality
- Password reset
- Email confirmation

### What You Might Want to Add

#### 1. **Automatic Route Protection**

Add a route guard to protect certain routes:

```typescript
// src/components/ProtectedRoute.tsx
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
}
```

#### 2. **User Profile Page**

Create a user profile page:

```typescript
// src/pages/Profile.tsx
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Profile() {
  const { user, signOut } = useAuth();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Email: {user?.email}</p>
        <p>Name: {user?.user_metadata?.full_name}</p>
        <button onClick={signOut}>Sign Out</button>
      </CardContent>
    </Card>
  );
}
```

#### 3. **Role-Based Access Control**

Add roles to user metadata and check them:

```typescript
// In AuthContext, add role checking
const isTeacher = user?.user_metadata?.role === 'teacher';
const isStudent = user?.user_metadata?.role === 'student';

// Create role-based guard
export function TeacherRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const isTeacher = user?.user_metadata?.role === 'teacher';
  
  if (!isTeacher) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}
```

#### 4. **Social Login (OAuth)**

Add OAuth providers in Supabase dashboard, then:

```typescript
// In AuthContext.tsx, add OAuth methods
const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });
  return { error };
};

const signInWithGitHub = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });
  return { error };
};
```

#### 5. **Session Persistence**

Sessions are already persisted by Supabase. To check session on app load:

```typescript
// Already implemented in AuthContext
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setUser(session?.user ?? null);
  });
}, []);
```

## Authentication Flow

### Sign Up Flow
```
1. User fills signup form
2. AuthContext.signUp() called
3. Supabase creates user
4. Confirmation email sent
5. User clicks email link
6. User redirected to app (authenticated)
```

### Sign In Flow
```
1. User fills login form
2. AuthContext.signIn() called
3. Supabase validates credentials
4. Session created
5. User redirected to home
```

### Password Reset Flow
```
1. User clicks "Forgot password"
2. User enters email
3. AuthContext.resetPassword() called
4. Reset email sent
5. User clicks link in email
6. User redirected to /auth?reset=true
7. User enters new password
8. AuthContext.updatePassword() called
9. Password updated, user signed in
```

## Testing Authentication

### Manual Testing

1. **Sign Up:**
   - Go to `/auth`
   - Click "Sign Up" tab
   - Fill form and submit
   - Check email for confirmation
   - Click confirmation link

2. **Sign In:**
   - Go to `/auth`
   - Enter credentials
   - Should redirect to home

3. **Password Reset:**
   - Click "Forgot password"
   - Enter email
   - Check email for reset link
   - Click link and set new password

### Programmatic Testing

```typescript
// Test authentication state
const { isAuthenticated, user } = useAuth();
console.log('Authenticated:', isAuthenticated);
console.log('User:', user);
```

## Common Issues & Solutions

### Issue: "Auth session missing!" when updating password

**Solution:** User must use the reset link in the same browser session. The link contains a session token.

### Issue: User not redirected after login

**Solution:** Check `Auth.tsx` - redirect happens in `useEffect` when `isAuthenticated` becomes true.

### Issue: Session not persisting

**Solution:** Supabase handles this automatically. Check browser localStorage for Supabase session.

## Security Considerations

1. **Email Confirmation:** Currently required for signup
2. **Password Strength:** Minimum 6 characters (consider increasing)
3. **Institutional Emails:** UI warns about institutional emails only
4. **Session Management:** Handled by Supabase (secure)
5. **HTTPS:** Required in production

## Next Steps

1. ✅ Authentication is implemented
2. 🔄 Add route protection (optional)
3. 🔄 Add user profile page (optional)
4. 🔄 Add role-based access (optional)
5. 🔄 Add OAuth providers (optional)

## Related Files

- `/src/contexts/AuthContext.tsx` - Auth state management
- `/src/pages/Auth.tsx` - Auth UI
- `/src/integrations/supabase/client.ts` - Supabase config
- `/src/integrations/supabase/types.ts` - TypeScript types

## Supabase Dashboard

Configure authentication settings in:
- Supabase Dashboard → Authentication → Settings
- Enable/disable providers
- Configure email templates
- Set password requirements
- Configure redirect URLs

```


Creating the architecture overview and development guides:


```markdown
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

```

```markdown
# Development Guidelines

This document outlines best practices and guidelines for developing and maintaining the Academic EAP Platform.

## Code Organization

### File Structure

```
src/
├── components/        # Reusable components
│   ├── ui/           # UI component library
│   └── [name].tsx    # Custom components
├── pages/            # Route components
├── contexts/         # React Context providers
├── hooks/            # Custom React hooks
├── lib/              # Utilities and helpers
└── integrations/     # Third-party integrations
```

### Naming Conventions

**Components:**
- PascalCase: `MyComponent.tsx`
- Descriptive names: `UserProfile.tsx` not `Profile.tsx`

**Hooks:**
- camelCase with `use` prefix: `useAuth.ts`, `use-mobile.tsx`

**Utilities:**
- camelCase: `utils.ts`, `apiClient.ts`

**Constants:**
- UPPER_SNAKE_CASE: `API_BASE_URL`, `MAX_RETRIES`

**Files:**
- Match export name: `export default MyComponent` → `MyComponent.tsx`

## Component Development

### Component Structure

```typescript
// 1. Imports
import React from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

// 3. Component
export function MyComponent({ title, onClick }: MyComponentProps) {
  // 4. Hooks
  const [state, setState] = React.useState();
  
  // 5. Handlers
  const handleClick = () => {
    // Logic
    onClick?.();
  };
  
  // 6. Render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick}>Click me</Button>
    </div>
  );
}

// 7. Export
export default MyComponent;
```

### Component Best Practices

✅ **Do:**
- Keep components small and focused
- Use TypeScript for type safety
- Extract reusable logic to hooks
- Use semantic HTML
- Follow accessibility guidelines

❌ **Don't:**
- Create components that do too much
- Mix business logic with UI
- Use `any` type (use `unknown` if needed)
- Hardcode values (use constants)
- Ignore accessibility

### Component Composition

```typescript
// ✅ Good: Composed components
function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}

function CardHeader({ title }: { title: string }) {
  return <div className="card-header">{title}</div>;
}

// Usage
<Card>
  <CardHeader title="Hello" />
</Card>

// ❌ Bad: Monolithic component
function CardWithHeader({ title, children }: Props) {
  return (
    <div className="card">
      <div className="card-header">{title}</div>
      {children}
    </div>
  );
}
```

## State Management

### When to Use Context

✅ **Use Context for:**
- Global authentication state
- Theme preferences
- User preferences
- Shared service configuration

❌ **Don't use Context for:**
- Local component state
- Frequently changing state
- Derived state (use `useMemo` instead)

### Context Pattern

```typescript
// 1. Define context type
interface MyContextType {
  value: string;
  setValue: (value: string) => void;
}

// 2. Create context
const MyContext = createContext<MyContextType | undefined>(undefined);

// 3. Create provider
export function MyProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState('');
  
  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
}

// 4. Create hook
export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within MyProvider');
  }
  return context;
}
```

## TypeScript Guidelines

### Type Safety

```typescript
// ✅ Good: Explicit types
interface User {
  id: string;
  email: string;
  name?: string;
}

function getUser(id: string): Promise<User> {
  // Implementation
}

// ❌ Bad: Using any
function getUser(id: any): any {
  // Implementation
}
```

### Type Definitions

- Define interfaces for component props
- Use type aliases for unions
- Export types from dedicated files if reused
- Use `unknown` instead of `any` when type is truly unknown

## Styling Guidelines

### Tailwind CSS

```typescript
// ✅ Good: Use Tailwind classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">

// ❌ Bad: Inline styles (unless dynamic)
<div style={{ display: 'flex', padding: '16px' }}>
```

### Class Name Merging

```typescript
import { cn } from '@/lib/utils';

// Merge classes
<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className // Allow override
)}>
```

## Error Handling

### API Errors

```typescript
try {
  const response = await fetch('/api/endpoint');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
} catch (error) {
  console.error('API error:', error);
  toast({
    title: "Error",
    description: error instanceof Error ? error.message : "Unknown error",
    variant: "destructive",
  });
  throw error;
}
```

### Component Error Boundaries

```typescript
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## API Integration

### Fetch Pattern

```typescript
async function fetchData<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
  return response.json();
}
```

### Supabase Pattern

```typescript
import { supabase } from '@/integrations/supabase/client';

async function getData() {
  const { data, error } = await supabase
    .from('table')
    .select('*');
  
  if (error) throw error;
  return data;
}
```

## Testing Guidelines

### Component Testing

```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

test('renders component', () => {
  render(<MyComponent title="Test" />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

### Hook Testing

```typescript
import { renderHook } from '@testing-library/react';
import { useMyHook } from './useMyHook';

test('hook works correctly', () => {
  const { result } = renderHook(() => useMyHook());
  expect(result.current.value).toBe(expected);
});
```

## Git Workflow

### Commit Messages

```
feat: Add user profile page
fix: Fix authentication redirect
docs: Update README
refactor: Extract common logic to hook
test: Add tests for auth flow
chore: Update dependencies
```

### Branch Naming

```
feature/user-profile
fix/auth-redirect
docs/update-readme
```

## Code Review Checklist

- [ ] Code follows style guidelines
- [ ] TypeScript types are correct
- [ ] No console.logs in production code
- [ ] Error handling is implemented
- [ ] Accessibility considered
- [ ] Performance optimized (if needed)
- [ ] Tests added/updated
- [ ] Documentation updated

## Performance Optimization

### React Optimization

```typescript
// Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething();
}, [dependencies]);

// Memoize components
const MemoizedComponent = React.memo(MyComponent);
```

### Bundle Optimization

- Use dynamic imports for large components
- Remove unused dependencies
- Use tree-shaking friendly imports
- Consider code splitting for routes

## Accessibility

### ARIA Labels

```typescript
<button aria-label="Close dialog">×</button>
```

### Keyboard Navigation

- Ensure all interactive elements are keyboard accessible
- Use proper focus management
- Provide skip links for navigation

### Semantic HTML

```typescript
// ✅ Good
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

// ❌ Bad
<div onClick={handleClick}>Home</div>
```

## Documentation

### Code Comments

```typescript
/**
 * Calculates the total price including tax
 * @param price - Base price
 * @param taxRate - Tax rate as decimal (e.g., 0.1 for 10%)
 * @returns Total price with tax
 */
function calculateTotal(price: number, taxRate: number): number {
  return price * (1 + taxRate);
}
```

### Component Documentation

- Document props with JSDoc
- Provide usage examples
- Note any special requirements

## Security

### Input Validation

```typescript
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

### XSS Prevention

- Use React's built-in XSS protection
- Sanitize user input
- Use `dangerouslySetInnerHTML` sparingly

### API Keys

- Never commit API keys
- Use environment variables
- Store sensitive data securely

## Related Documentation

- [Module Architecture](../architecture/MODULE_ARCHITECTURE.md)
- [AI-Assisted Development](./AI_ASSISTED_DEVELOPMENT.md)
- [Testing & Debugging](./TESTING_DEBUGGING.md)

```

```markdown
# AI-Assisted Development Guide

This guide explains how to effectively use AI tools (like Cursor, GitHub Copilot, ChatGPT) to generate code while maintaining control and understanding of your codebase.

## Philosophy

**Goal:** Leverage AI to accelerate development while maintaining:
- Code quality
- Architecture consistency
- Team understanding
- Long-term maintainability

## Best Practices

### 1. Start with Context

**✅ Good Approach:**
```
"Add a user profile page that displays the current user's email and name.
Use the existing AuthContext for user data.
Follow the same styling patterns as the TeacherDashboard page.
Add a route at /profile."
```

**❌ Bad Approach:**
```
"Create a profile page"
```

**Why:** Providing context helps AI understand:
- Existing patterns
- Architecture decisions
- Styling conventions
- Integration points

### 2. Break Down Complex Tasks

**✅ Good:**
```
Task 1: Create ProtectedRoute component
Task 2: Add /profile route
Task 3: Create Profile page component
Task 4: Add navigation link
```

**❌ Bad:**
```
"Add complete authentication system with protected routes, profile page, 
and role-based access control"
```

**Why:** Smaller tasks are:
- Easier to review
- Less error-prone
- More testable
- Easier to understand

### 3. Review Before Accepting

**Always:**
1. Read the generated code
2. Understand what it does
3. Check for:
   - Security issues
   - Performance problems
   - Architecture violations
   - Type errors
4. Test the code
5. Refactor if needed

**Never:**
- Blindly accept AI-generated code
- Skip testing
- Ignore type errors

### 4. Use AI for Boilerplate, Not Logic

**✅ Good Use Cases:**
- Component structure
- Type definitions
- API client setup
- Test scaffolding
- Documentation

**⚠️ Use with Caution:**
- Business logic
- Security-critical code
- Complex algorithms
- Performance-sensitive code

### 5. Maintain Documentation

**After AI generates code:**
1. Update relevant documentation
2. Add comments explaining complex logic
3. Document any deviations from patterns
4. Note any AI-generated code sections

## Workflow

### Step 1: Planning

Before asking AI to generate code:

1. **Understand the requirement**
   - What problem are we solving?
   - What are the constraints?
   - What are the edge cases?

2. **Identify integration points**
   - Which existing modules are involved?
   - What APIs/data sources are needed?
   - What UI patterns should be followed?

3. **Break into subtasks**
   - List specific, actionable tasks
   - Order by dependencies
   - Estimate complexity

### Step 2: Generation

When asking AI to generate code:

1. **Provide context:**
   ```
   "In the Academic EAP Platform, add a feature to export lesson data.
   The app uses React + TypeScript, Tailwind CSS, and Supabase.
   Similar export features exist in TeacherDashboard.tsx.
   Use the existing Button and Card components from @/components/ui."
   ```

2. **Specify requirements:**
   ```
   "The export should:
   - Support CSV and JSON formats
   - Include lesson title, date, and completion status
   - Show a loading state during export
   - Handle errors gracefully
   - Use the toast system for notifications"
   ```

3. **Request specific patterns:**
   ```
   "Follow the same error handling pattern as VocabularyBuilder.tsx.
   Use the useToast hook for notifications.
   Type all props and return values."
   ```

### Step 3: Review

After AI generates code:

1. **Code Review Checklist:**
   - [ ] Does it follow project conventions?
   - [ ] Are types correct?
   - [ ] Is error handling present?
   - [ ] Are accessibility concerns addressed?
   - [ ] Is performance acceptable?
   - [ ] Are there security issues?

2. **Integration Check:**
   - [ ] Does it integrate with existing code?
   - [ ] Are dependencies correct?
   - [ ] Are imports correct?
   - [ ] Does it follow existing patterns?

3. **Testing:**
   - [ ] Does it compile?
   - [ ] Does it run without errors?
   - [ ] Do edge cases work?
   - [ ] Are there type errors?

### Step 4: Refinement

After review:

1. **Fix issues:**
   - Correct type errors
   - Fix integration problems
   - Add missing error handling
   - Improve performance if needed

2. **Refactor:**
   - Extract reusable logic
   - Improve naming
   - Add comments
   - Optimize structure

3. **Document:**
   - Update relevant docs
   - Add code comments
   - Note any deviations

## Common Patterns

### Pattern 1: Component Generation

**Prompt:**
```
"Create a React component called UserCard that displays user information.
Props: user (User type), onEdit (optional callback)
Use Card component from @/components/ui/card
Show email, name, and role
Add an edit button if onEdit is provided
Follow TypeScript best practices"
```

**Review:**
- Check prop types
- Verify UI component usage
- Ensure accessibility
- Test with different user data

### Pattern 2: Hook Generation

**Prompt:**
```
"Create a custom hook useDebounce that debounces a value.
Input: value (any type), delay (number, default 300ms)
Output: debounced value
Use useState and useEffect
Follow the same pattern as use-mobile.tsx"
```

**Review:**
- Check hook dependencies
- Verify cleanup logic
- Test with different delays
- Ensure no memory leaks

### Pattern 3: API Integration

**Prompt:**
```
"Add a function to fetch lesson data from Supabase.
Table: lessons
Fields: id, title, content, created_at
Use the existing supabase client from @/integrations/supabase/client
Return typed data
Handle errors with try/catch
Follow the pattern in lib/supabaseWithAI.ts"
```

**Review:**
- Verify Supabase query syntax
- Check error handling
- Verify types
- Test with real data

## Maintaining Control

### 1. Understand the Codebase

**Before using AI:**
- Read existing code
- Understand architecture
- Know the patterns
- Identify conventions

**Resources:**
- [Module Architecture](../architecture/MODULE_ARCHITECTURE.md)
- [Development Guidelines](./DEVELOPMENT_GUIDELINES.md)
- Existing code examples

### 2. Test Everything

**Always test AI-generated code:**
- Manual testing
- Type checking
- Linting
- Integration testing

### 3. Keep It Simple

**Prefer:**
- Simple, readable code
- Clear patterns
- Explicit behavior
- Well-documented code

**Avoid:**
- Overly clever solutions
- Premature optimization
- Complex abstractions
- Magic numbers/strings

### 4. Iterate Gradually

**Process:**
1. Generate minimal working code
2. Test and verify
3. Add features incrementally
4. Refactor as needed

**Don't:**
- Generate everything at once
- Skip testing steps
- Accept without review

## Debugging AI-Generated Code

### Common Issues

1. **Type Errors**
   - AI may use incorrect types
   - Solution: Check types, add explicit types

2. **Import Errors**
   - AI may use wrong import paths
   - Solution: Verify paths, check tsconfig

3. **Missing Dependencies**
   - AI may forget dependencies
   - Solution: Check useEffect dependencies

4. **Pattern Mismatches**
   - AI may not follow project patterns
   - Solution: Refactor to match patterns

### Debugging Strategy

1. **Read the error message**
   - Understand what went wrong
   - Check line numbers
   - Look for type mismatches

2. **Check similar code**
   - Find working examples
   - Compare patterns
   - Identify differences

3. **Simplify**
   - Remove complex parts
   - Test incrementally
   - Add complexity back

4. **Ask for clarification**
   - If stuck, ask AI to explain
   - Request simpler version
   - Ask for alternatives

## Code Review for AI-Generated Code

### Review Checklist

- [ ] Code follows project conventions
- [ ] Types are correct and explicit
- [ ] Error handling is present
- [ ] Performance is acceptable
- [ ] Security concerns addressed
- [ ] Accessibility considered
- [ ] Tests are added/updated
- [ ] Documentation updated
- [ ] No hardcoded values
- [ ] Proper cleanup (useEffect, etc.)

### Red Flags

⚠️ **Watch out for:**
- Missing error handling
- Hardcoded values
- Missing type definitions
- Incorrect import paths
- Security vulnerabilities
- Performance issues
- Accessibility problems

## Learning from AI

### Use AI as a Learning Tool

**When AI generates code:**
1. **Understand why** it chose that approach
2. **Learn new patterns** it introduces
3. **Question assumptions** it makes
4. **Research** unfamiliar APIs/patterns

### Build Understanding

**Don't just copy-paste:**
- Read and understand the code
- Experiment with modifications
- Learn the underlying concepts
- Build your own solutions

## Tools and Resources

### AI Tools

- **Cursor** - AI-powered editor
- **GitHub Copilot** - Code completion
- **ChatGPT/Claude** - Code generation and explanation

### Verification Tools

- **TypeScript Compiler** - Type checking
- **ESLint** - Code quality
- **React DevTools** - Component debugging
- **Browser DevTools** - Runtime debugging

### Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

## Example Workflow

### Scenario: Add Export Feature

**Step 1: Plan**
- Identify: Export lesson data
- Integration: TeacherDashboard, Supabase
- UI: Button, Dialog, Loading state

**Step 2: Generate**
```
"Add export functionality to TeacherDashboard.
Export lesson data as CSV.
Use Dialog component for format selection.
Show loading state during export.
Handle errors with toast notifications."
```

**Step 3: Review**
- Check code structure
- Verify types
- Test export functionality
- Check error handling

**Step 4: Refine**
- Fix any issues
- Add tests
- Update documentation
- Optimize if needed

## Conclusion

AI is a powerful tool when used correctly:
- ✅ Provides context and requirements
- ✅ Reviews all generated code
- ✅ Tests thoroughly
- ✅ Maintains understanding
- ✅ Documents changes

Remember: **You are the architect, AI is the assistant.**

## Related Documentation

- [Development Guidelines](./DEVELOPMENT_GUIDELINES.md)
- [Testing & Debugging](./TESTING_DEBUGGING.md)
- [Module Architecture](../architecture/MODULE_ARCHITECTURE.md)

```


Creating the remaining documentation files:


```markdown
# Testing & Debugging Guide

This guide covers testing strategies and debugging techniques for the Academic EAP Platform.

## Testing Strategy

### Testing Pyramid

```
        /\
       /  \      E2E Tests (Few)
      /____\     
     /      \    Integration Tests (Some)
    /________\   
   /          \  Unit Tests (Many)
  /____________\
```

### Unit Tests

**Purpose:** Test individual functions, components, and hooks in isolation.

**Tools:**
- Vitest (or Jest)
- React Testing Library
- @testing-library/user-event

**Example:**
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Integration Tests

**Purpose:** Test how components work together.

**Example:**
```typescript
import { render, screen } from '@testing-library/react';
import { Auth } from '@/pages/Auth';
import { AuthProvider } from '@/contexts/AuthContext';

test('user can sign in', async () => {
  render(
    <AuthProvider>
      <Auth />
    </AuthProvider>
  );
  
  // Test sign in flow
  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /sign in/i });
  
  // ... test interactions
});
```

### E2E Tests

**Purpose:** Test complete user flows.

**Tools:**
- Playwright
- Cypress

**Example:**
```typescript
test('user can complete lesson', async ({ page }) => {
  await page.goto('/lessons');
  await page.click('text=Lesson 1');
  await page.fill('[name="answer"]', 'Test answer');
  await page.click('button:has-text("Submit")');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

## Component Testing

### Testing React Components

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
  
  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<MyComponent onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  test('handles async operations', async () => {
    render(<MyComponent />);
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByText('Loaded')).toBeInTheDocument();
    });
  });
});
```

### Testing with Context

```typescript
import { render } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';

const renderWithAuth = (ui: React.ReactElement) => {
  return render(<AuthProvider>{ui}</AuthProvider>);
};

test('shows user email when authenticated', () => {
  renderWithAuth(<UserProfile />);
  // Test with authenticated context
});
```

### Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react';
import { useMyHook } from './useMyHook';

test('hook updates value', () => {
  const { result } = renderHook(() => useMyHook());
  
  act(() => {
    result.current.setValue('test');
  });
  
  expect(result.current.value).toBe('test');
});
```

## API Testing

### Mocking API Calls

```typescript
import { vi } from 'vitest';

// Mock fetch
global.fetch = vi.fn();

test('fetches data correctly', async () => {
  const mockData = { id: 1, name: 'Test' };
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => mockData,
  });
  
  const result = await fetchData('/api/test');
  expect(result).toEqual(mockData);
});
```

### Testing Supabase

```typescript
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Test' }],
        error: null,
      }),
    })),
  },
}));
```

## Debugging Techniques

### Browser DevTools

**React DevTools:**
- Inspect component tree
- View props and state
- Profile performance
- Debug hooks

**Chrome DevTools:**
- Console for logging
- Network tab for API calls
- Sources for breakpoints
- Performance for profiling

### Console Debugging

```typescript
// Strategic console.logs
console.log('Component rendered:', props);
console.log('State:', state);
console.log('API response:', data);

// Use console.group for organized logs
console.group('User Action');
console.log('Step 1:', step1);
console.log('Step 2:', step2);
console.groupEnd();
```

### React DevTools

1. **Component Inspector:**
   - Select component in tree
   - View props, state, hooks
   - Edit props/state (development)

2. **Profiler:**
   - Record performance
   - Identify slow renders
   - Optimize re-renders

### Debugging State

```typescript
// Add useEffect to log state changes
useEffect(() => {
  console.log('State changed:', state);
}, [state]);

// Use React DevTools Profiler
// Add breakpoints in browser DevTools
```

### Debugging API Calls

```typescript
// Log API requests
const fetchData = async (url: string) => {
  console.log('Fetching:', url);
  try {
    const response = await fetch(url);
    console.log('Response:', response);
    const data = await response.json();
    console.log('Data:', data);
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

### Network Debugging

**Chrome DevTools Network Tab:**
- View all requests
- Check request/response headers
- Inspect payloads
- Monitor timing

**Supabase Debugging:**
```typescript
// Enable Supabase logging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
  console.log('Session:', session);
});
```

## Common Issues & Solutions

### Issue: Component Not Updating

**Possible Causes:**
- State not updating
- Props not changing
- Context not updating
- Re-render blocked

**Debug:**
```typescript
// Add logging
useEffect(() => {
  console.log('Component rendered');
  console.log('Props:', props);
  console.log('State:', state);
}, [props, state]);

// Check React DevTools
// Verify state updates
```

### Issue: API Call Failing

**Debug:**
```typescript
// Check network tab
// Verify URL
console.log('API URL:', url);
console.log('Headers:', headers);

// Check response
console.log('Status:', response.status);
console.log('Response:', await response.text());
```

### Issue: Type Errors

**Debug:**
- Check TypeScript errors in IDE
- Verify types match
- Check import paths
- Ensure types are exported

### Issue: Styling Problems

**Debug:**
- Inspect element in DevTools
- Check computed styles
- Verify Tailwind classes
- Check for CSS conflicts

## Performance Debugging

### React Profiler

1. Open React DevTools
2. Go to Profiler tab
3. Click Record
4. Interact with app
5. Stop recording
6. Analyze results

### Performance Monitoring

```typescript
// Measure render time
const startTime = performance.now();
// ... component render
const endTime = performance.now();
console.log('Render time:', endTime - startTime, 'ms');

// Use React.memo for expensive components
const MemoizedComponent = React.memo(ExpensiveComponent);
```

### Bundle Analysis

```bash
# Analyze bundle size
npm run build
npx vite-bundle-visualizer
```

## Testing Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ✅ Good: Test what user sees
expect(screen.getByText('Welcome')).toBeInTheDocument();

// ❌ Bad: Test implementation details
expect(component.state.isVisible).toBe(true);
```

### 2. Use Semantic Queries

```typescript
// ✅ Good: Use accessible queries
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText(/email/i);

// ❌ Bad: Use implementation queries
screen.getByTestId('submit-button');
```

### 3. Test User Flows

```typescript
// Test complete user journey
test('user can sign up and access dashboard', async () => {
  // Sign up
  // Verify email
  // Sign in
  // Access dashboard
});
```

### 4. Mock External Dependencies

```typescript
// Mock API calls
// Mock timers
// Mock browser APIs
```

### 5. Keep Tests Isolated

```typescript
// Each test should be independent
// Clean up after tests
// Don't rely on test order
```

## Debugging Workflow

### Step 1: Reproduce

1. Identify the issue
2. Reproduce consistently
3. Note steps to reproduce

### Step 2: Isolate

1. Narrow down the problem
2. Check if it's component/API/state issue
3. Remove unrelated code

### Step 3: Investigate

1. Add logging
2. Use DevTools
3. Check network requests
4. Inspect state

### Step 4: Fix

1. Implement fix
2. Test the fix
3. Verify no regressions

### Step 5: Document

1. Document the issue
2. Document the solution
3. Add tests if needed

## Tools

### Testing Tools

- **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing
- **MSW** - API mocking

### Debugging Tools

- **React DevTools** - React debugging
- **Chrome DevTools** - Browser debugging
- **VS Code Debugger** - Code debugging
- **Redux DevTools** - State debugging (if using Redux)

## Continuous Testing

### Pre-commit

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage"
  }
}
```

### CI/CD

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm test

- name: Check coverage
  run: npm run test:coverage
```

## Related Documentation

- [Development Guidelines](./DEVELOPMENT_GUIDELINES.md)
- [AI-Assisted Development](./AI_ASSISTED_DEVELOPMENT.md)
- [Module Architecture](../architecture/MODULE_ARCHITECTURE.md)

```

```markdown
# Code Cleanup Recommendations

This document identifies code that can be safely removed or consolidated.

## UI Components Cleanup

### Safe to Remove

These UI components are **not used** anywhere in the codebase and can be removed:

1. **accordion.tsx** - Not used (use Collapsible instead)
2. **aspect-ratio.tsx** - Not used
3. **breadcrumb.tsx** - Not used
4. **carousel.tsx** - Not used
5. **context-menu.tsx** - Not used
6. **hover-card.tsx** - Not used
7. **menubar.tsx** - Not used
8. **navigation-menu.tsx** - Not used
9. **toggle.tsx** - Not used (only used by toggle-group)
10. **toggle-group.tsx** - Not used

**Removal Command:**
```bash
cd src/components/ui
rm accordion.tsx aspect-ratio.tsx breadcrumb.tsx carousel.tsx \
   context-menu.tsx hover-card.tsx menubar.tsx navigation-menu.tsx \
   toggle.tsx toggle-group.tsx
```

### Keep for Future Use

These components are not currently used but may be needed:
- **alert-dialog.tsx** - Useful for confirmations
- **avatar.tsx** - User profiles
- **calendar.tsx** - Date selection
- **chart.tsx** - Analytics
- **checkbox.tsx** - Forms
- **command.tsx** - Command palette
- **drawer.tsx** - Mobile modals
- **dropdown-menu.tsx** - Menus
- **form.tsx** - Form validation
- **input-otp.tsx** - 2FA
- **pagination.tsx** - List pagination
- **popover.tsx** - Tooltip alternative
- **resizable.tsx** - Split panels
- **sheet.tsx** - Mobile drawer
- **slider.tsx** - Range inputs
- **switch.tsx** - Toggle switches

## Duplicate Files

### use-toast.ts

**Issue:** `use-toast.ts` exists in two locations:
- `/src/hooks/use-toast.ts`
- `/src/components/ui/use-toast.ts`

**Recommendation:** 
- Keep the one in `/src/hooks/` (more appropriate location)
- Remove the one in `/src/components/ui/`
- Update imports if needed

**Action:**
```bash
# Check which one is used
grep -r "from.*hooks/use-toast" src/
grep -r "from.*components/ui/use-toast" src/

# Remove duplicate (after verifying)
rm src/components/ui/use-toast.ts
```

## Backup Files

### Backup Files to Remove

These `.backup` files can be removed:

1. **SimpleActivityCreator.tsx.backup**
2. **AIAgents.tsx.backup**
3. **InteractiveLearningReflection.tsx.backup**
4. **LeverageEducationalResources.tsx.backup**
5. **VibeCoding.tsx.backup**

**Removal Command:**
```bash
find src/ -name "*.backup" -delete
```

## Unused Dependencies

### Check for Unused npm Packages

```bash
# Install depcheck
npm install -g depcheck

# Check for unused dependencies
depcheck
```

**Common candidates:**
- Check if all Radix UI packages are used
- Verify all dependencies in package.json are needed

## Code Consolidation Opportunities

### 1. Toast System

**Current:** Two toast systems (toast and sonner)

**Recommendation:** 
- Choose one (recommend keeping `toast` as it's more integrated)
- Remove the other if not needed

**Check usage:**
```bash
grep -r "sonner" src/
grep -r "useToast\|toast" src/
```

### 2. Similar Components

**Check for duplicate logic:**
- Lesson components may share common patterns
- Form components may have similar validation
- Consider extracting shared logic to hooks or utilities

## File Organization

### Consolidate Related Files

**Consider:**
- Grouping lesson components better
- Organizing utility functions
- Creating index files for cleaner imports

## Cleanup Checklist

### Before Cleanup

- [ ] Create a backup branch
- [ ] Verify components are truly unused
- [ ] Check for any dynamic imports
- [ ] Search for string references
- [ ] Test the application

### During Cleanup

- [ ] Remove unused UI components
- [ ] Remove backup files
- [ ] Remove duplicate files
- [ ] Update imports if needed
- [ ] Run tests

### After Cleanup

- [ ] Verify app still works
- [ ] Check bundle size reduction
- [ ] Update documentation
- [ ] Commit changes

## Safe Removal Process

### Step 1: Identify

```bash
# Find unused components
grep -r "from.*components/ui/COMPONENT" src/
```

### Step 2: Verify

- Check for dynamic imports
- Search for string references
- Check if used in tests

### Step 3: Remove

```bash
# Remove file
rm src/components/ui/COMPONENT.tsx
```

### Step 4: Test

```bash
# Build and test
npm run build
npm test
```

### Step 5: Verify

- Check app still works
- Verify no runtime errors
- Check bundle size

## Bundle Size Impact

Removing unused components will:
- Reduce bundle size
- Improve build time
- Simplify codebase
- Make maintenance easier

**Estimate:** Removing 10 unused components could save ~50-100KB (gzipped).

## Maintenance Script

Create a cleanup script:

```bash
#!/bin/bash
# scripts/cleanup.sh

echo "Removing unused UI components..."
cd src/components/ui
rm -f accordion.tsx aspect-ratio.tsx breadcrumb.tsx carousel.tsx \
     context-menu.tsx hover-card.tsx menubar.tsx navigation-menu.tsx \
     toggle.tsx toggle-group.tsx

echo "Removing backup files..."
find ../.. -name "*.backup" -delete

echo "Removing duplicate use-toast..."
# After verifying which one to keep
# rm use-toast.ts  # if keeping hooks version

echo "Cleanup complete!"
```

## Recommendations Summary

### Immediate Actions

1. ✅ Remove 10 unused UI components
2. ✅ Remove 5 backup files
3. ✅ Consolidate duplicate use-toast.ts
4. ✅ Run depcheck for unused npm packages

### Future Considerations

1. 🔄 Consolidate toast systems
2. 🔄 Extract shared lesson logic
3. 🔄 Organize file structure better
4. 🔄 Create index files for cleaner imports

## Related Documentation

- [UI Components Usage](../components/UI_COMPONENTS_USAGE.md)
- [Development Guidelines](../guides/DEVELOPMENT_GUIDELINES.md)
- [Module Architecture](../architecture/MODULE_ARCHITECTURE.md)

```

```markdown
# Modular Development Strategy

This document outlines strategies for maintaining modularity as the codebase grows.

## Current State

The application currently uses a **component-based architecture** with:
- React components
- Context API for state
- Feature-based page organization
- Shared UI component library

## Modularity Principles

### 1. Separation of Concerns

**Each module should:**
- Have a single responsibility
- Be independently testable
- Have clear interfaces
- Minimize dependencies

### 2. Loose Coupling

**Modules should:**
- Not depend on implementation details
- Communicate through well-defined interfaces
- Be replaceable without affecting others

### 3. High Cohesion

**Related code should:**
- Be grouped together
- Share common purpose
- Be easy to find and maintain

## Module Structure

### Proposed Structure

```
src/
├── modules/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── lessons/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── index.ts
│   └── phrasebank/
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       └── index.ts
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── types/
└── app/
    ├── components/
    ├── pages/
    └── routing/
```

## Module Design Patterns

### Pattern 1: Feature Module

**Structure:**
```
modules/feature-name/
├── components/      # Feature-specific components
├── hooks/          # Feature-specific hooks
├── lib/            # Feature utilities
├── types.ts        # Feature types
├── context.tsx     # Feature context (if needed)
└── index.ts        # Public API
```

**Example:**
```
modules/auth/
├── components/
│   ├── LoginForm.tsx
│   └── SignUpForm.tsx
├── hooks/
│   └── useAuth.ts
├── lib/
│   └── authUtils.ts
├── types.ts
├── AuthContext.tsx
└── index.ts
```

### Pattern 2: Shared Module

**Structure:**
```
shared/
├── components/     # Reusable components
├── hooks/         # Reusable hooks
├── lib/           # Shared utilities
└── types/         # Shared types
```

**Example:**
```
shared/
├── components/
│   ├── Button.tsx
│   └── Card.tsx
├── hooks/
│   └── useDebounce.ts
└── lib/
    └── utils.ts
```

## Migration Strategy

### Phase 1: Identify Modules

**Current features that could be modules:**
1. **Auth Module** - Authentication logic
2. **Lessons Module** - Lesson management
3. **Phrasebank Module** - Phrasebank tools
4. **AI Service Module** - AI integration
5. **Teacher Dashboard Module** - Teacher features

### Phase 2: Extract to Modules

**Step-by-step:**

1. **Create module directory:**
   ```bash
   mkdir -p src/modules/auth/{components,hooks,lib}
   ```

2. **Move related files:**
   ```bash
   mv src/contexts/AuthContext.tsx src/modules/auth/
   mv src/pages/Auth.tsx src/modules/auth/components/
   ```

3. **Create module index:**
   ```typescript
   // src/modules/auth/index.ts
   export { AuthProvider, useAuth } from './AuthContext';
   export { default as AuthPage } from './components/Auth';
   ```

4. **Update imports:**
   ```typescript
   // Before
   import { useAuth } from '@/contexts/AuthContext';
   
   // After
   import { useAuth } from '@/modules/auth';
   ```

### Phase 3: Refactor Gradually

**Don't do everything at once:**
- Start with one module
- Test thoroughly
- Move to next module
- Repeat

## Module Communication

### 1. Direct Imports

```typescript
// Module A imports from Module B
import { useAuth } from '@/modules/auth';
```

### 2. Shared Context

```typescript
// Shared context for cross-module communication
import { AppContext } from '@/shared/contexts/AppContext';
```

### 3. Event System

```typescript
// For loose coupling
import { eventBus } from '@/shared/lib/eventBus';

// Emit event
eventBus.emit('user:logged-in', user);

// Listen to event
eventBus.on('user:logged-in', handleLogin);
```

## Module Boundaries

### What Belongs in a Module

✅ **Include:**
- Feature-specific components
- Feature-specific hooks
- Feature-specific utilities
- Feature types
- Feature context (if needed)

❌ **Don't Include:**
- Shared UI components (use `shared/`)
- App-level routing (use `app/`)
- Global state (use `shared/contexts/`)

## Best Practices

### 1. Clear Public API

**Each module should export:**
- Main components
- Hooks
- Types
- Utilities (if needed)

**Example:**
```typescript
// src/modules/auth/index.ts
export { AuthProvider, useAuth } from './AuthContext';
export { default as AuthPage } from './components/Auth';
export type { User, AuthState } from './types';
```

### 2. Internal Organization

**Keep implementation details private:**
```typescript
// ✅ Export public API
export { useAuth } from './hooks/useAuth';

// ❌ Don't export internals
// export { validateEmail } from './lib/validation';
```

### 3. Dependency Management

**Rules:**
- Modules can depend on `shared/`
- Modules can depend on other modules (carefully)
- Avoid circular dependencies
- Keep dependencies minimal

### 4. Testing

**Test modules independently:**
```typescript
// tests/modules/auth/auth.test.tsx
import { render } from '@testing-library/react';
import { AuthProvider } from '@/modules/auth';

test('auth module works', () => {
  // Test auth module
});
```

## Code Organization

### File Naming

```
modules/feature-name/
├── components/
│   ├── FeatureComponent.tsx
│   └── FeatureForm.tsx
├── hooks/
│   └── useFeature.ts
├── lib/
│   └── featureUtils.ts
├── types.ts
└── index.ts
```

### Import Paths

**Use path aliases:**
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/modules/*": ["src/modules/*"],
      "@/shared/*": ["src/shared/*"]
    }
  }
}
```

## Refactoring Checklist

### Before Refactoring

- [ ] Identify module boundaries
- [ ] Plan module structure
- [ ] Identify dependencies
- [ ] Create backup branch

### During Refactoring

- [ ] Create module directory
- [ ] Move files
- [ ] Update imports
- [ ] Create module index
- [ ] Update tests

### After Refactoring

- [ ] Test thoroughly
- [ ] Update documentation
- [ ] Verify no regressions
- [ ] Review code

## Example: Auth Module Migration

### Current Structure

```
src/
├── contexts/
│   └── AuthContext.tsx
├── pages/
│   └── Auth.tsx
└── integrations/
    └── supabase/
```

### Target Structure

```
src/
├── modules/
│   └── auth/
│       ├── components/
│       │   └── Auth.tsx
│       ├── hooks/
│       │   └── useAuth.ts
│       ├── lib/
│       │   └── authUtils.ts
│       ├── types.ts
│       ├── AuthContext.tsx
│       └── index.ts
└── integrations/
    └── supabase/  # Shared
```

### Migration Steps

1. **Create structure:**
   ```bash
   mkdir -p src/modules/auth/{components,hooks,lib}
   ```

2. **Move files:**
   ```bash
   mv src/contexts/AuthContext.tsx src/modules/auth/
   mv src/pages/Auth.tsx src/modules/auth/components/
   ```

3. **Create index:**
   ```typescript
   // src/modules/auth/index.ts
   export { AuthProvider, useAuth } from './AuthContext';
   export { default as AuthPage } from './components/Auth';
   ```

4. **Update imports:**
   ```typescript
   // src/App.tsx
   import { AuthPage } from '@/modules/auth';
   ```

5. **Test:**
   ```bash
   npm test
   npm run build
   ```

## Benefits of Modularity

### 1. Maintainability

- Easier to find code
- Clearer responsibilities
- Simpler testing
- Better organization

### 2. Scalability

- Easy to add features
- Independent development
- Team collaboration
- Code reuse

### 3. Testing

- Test modules independently
- Mock dependencies easily
- Isolated test suites
- Better coverage

### 4. Performance

- Code splitting by module
- Lazy loading
- Smaller bundles
- Better caching

## Challenges & Solutions

### Challenge: Circular Dependencies

**Solution:**
- Use dependency injection
- Extract shared code to `shared/`
- Use event system for communication

### Challenge: Shared Code

**Solution:**
- Move to `shared/` directory
- Create clear boundaries
- Document dependencies

### Challenge: Migration Effort

**Solution:**
- Migrate gradually
- One module at a time
- Test thoroughly
- Don't rush

## Tools & Resources

### Code Organization

- **ESLint** - Enforce import rules
- **TypeScript** - Type checking
- **Path aliases** - Clean imports

### Analysis

- **Dependency-cruiser** - Analyze dependencies
- **Bundle analyzer** - Check bundle size
- **Code coverage** - Test coverage

## Related Documentation

- [Module Architecture](../architecture/MODULE_ARCHITECTURE.md)
- [Development Guidelines](../guides/DEVELOPMENT_GUIDELINES.md)
- [Code Cleanup](./CODE_CLEANUP.md)

```


Creating a summary document and verifying the documentation structure:


```markdown
# Quick Reference Guide

Quick answers to common questions about the codebase.

## Where is X used?

### UI Components
- **Button** - Used in 30+ files (most pages)
- **Card** - Used in 20+ files (content display)
- **Input** - Used in 15+ files (forms)
- **Sidebar** - Used in 10+ files (navigation)
- See [UI Components Usage](./components/UI_COMPONENTS_USAGE.md) for full list

### Hooks
- **use-mobile** - Mobile breakpoint detection
- **use-toast** - Toast notifications
- **useAIServiceGuard** - AI service activation guard
- See [Hooks Documentation](./hooks/HOOKS.md) for details

## How do I...?

### Add a new page?
1. Create component in `/src/pages/`
2. Add route in `App.tsx`
3. Add navigation link (if needed)

### Add authentication?
✅ **Already implemented!** See [Authentication Guide](./guides/AUTHENTICATION_GUIDE.md)

### Use a UI component?
```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
```

### Check if user is authenticated?
```typescript
import { useAuth } from "@/contexts/AuthContext";

const { isAuthenticated, user } = useAuth();
```

### Show a toast notification?
```typescript
import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();
toast({ title: "Success", description: "Done!" });
```

### Add a new hook?
1. Create file in `/src/hooks/`
2. Follow naming: `use-*.ts` or `use*.ts`
3. Export as named export
4. Document in [Hooks Documentation](./hooks/HOOKS.md)

## File Locations

| What | Where |
|------|-------|
| UI Components | `/src/components/ui/` |
| Custom Components | `/src/components/` |
| Pages | `/src/pages/` |
| Hooks | `/src/hooks/` |
| Contexts | `/src/contexts/` |
| Utilities | `/src/lib/` |
| Routes | `/src/App.tsx` |

## Common Patterns

### Component Structure
```typescript
import React from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  title: string;
}

export function MyComponent({ title }: Props) {
  return <Button>{title}</Button>;
}
```

### Using Context
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  // ...
}
```

### Protected Route
```typescript
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedComponent() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" />;
  return <div>Protected</div>;
}
```

## Quick Answers

**Q: Can I remove unused UI components?**  
A: Yes! See [Code Cleanup](./maintenance/CODE_CLEANUP.md) for list.

**Q: How do I test my code?**  
A: See [Testing & Debugging](./guides/TESTING_DEBUGGING.md)

**Q: How do I use AI to generate code?**  
A: See [AI-Assisted Development](./guides/AI_ASSISTED_DEVELOPMENT.md)

**Q: What's the architecture?**  
A: See [Module Architecture](./architecture/MODULE_ARCHITECTURE.md)

**Q: How do I maintain modularity?**  
A: See [Modular Development](./maintenance/MODULAR_DEVELOPMENT.md)

## Documentation Index

- [Main README](./README.md) - Documentation overview
- [Module Architecture](./architecture/MODULE_ARCHITECTURE.md) - System architecture
- [UI Components](./components/UI_COMPONENTS_USAGE.md) - Component usage
- [Hooks](./hooks/HOOKS.md) - Custom hooks
- [Authentication](./guides/AUTHENTICATION_GUIDE.md) - Auth implementation
- [Development Guidelines](./guides/DEVELOPMENT_GUIDELINES.md) - Best practices
- [AI-Assisted Development](./guides/AI_ASSISTED_DEVELOPMENT.md) - Using AI tools
- [Testing & Debugging](./guides/TESTING_DEBUGGING.md) - Testing strategies
- [Code Cleanup](./maintenance/CODE_CLEANUP.md) - Cleanup recommendations
- [Modular Development](./maintenance/MODULAR_DEVELOPMENT.md) - Modularity strategy

```


Created documentation for your codebase. Summary:

## Documentation created

### Main documentation structure

```
docs/
├── README.md                          # Documentation index
├── QUICK_REFERENCE.md                  # Quick answers to common questions
├── architecture/
│   └── MODULE_ARCHITECTURE.md         # System architecture overview
├── components/
│   └── UI_COMPONENTS_USAGE.md         # UI components usage analysis
├── hooks/
│   └── HOOKS.md                       # Custom hooks documentation
├── guides/
│   ├── AUTHENTICATION_GUIDE.md        # Login/auth implementation guide
│   ├── DEVELOPMENT_GUIDELINES.md     # Development best practices
│   ├── AI_ASSISTED_DEVELOPMENT.md     # Using AI tools effectively
│   └── TESTING_DEBUGGING.md           # Testing and debugging strategies
└── maintenance/
    ├── CODE_CLEANUP.md                # Code cleanup recommendations
    └── MODULAR_DEVELOPMENT.md         # Modular development strategy
```

## Answers to your questions

### 1. UI components usage
- Analysis in `docs/components/UI_COMPONENTS_USAGE.md`
- Frequently used: Button (30+), Card (20+), Input (15+), Sidebar (10+)
- Unused (can remove): accordion, aspect-ratio, breadcrumb, carousel, context-menu, hover-card, menubar, navigation-menu, toggle, toggle-group
- Keep for future: alert-dialog, avatar, calendar, chart, checkbox, command, drawer, dropdown-menu, form, input-otp, pagination, popover, resizable, sheet, slider, switch

### 2. Hooks purpose
Documented in `docs/hooks/HOOKS.md`:
- `use-mobile.tsx` - Detects mobile viewport (768px breakpoint)
- `use-toast.ts` - Toast notification system
- `useAIServiceGuard.ts` - Guards AI features, checks API key activation

### 3. Login functionality
Already implemented. See `docs/guides/AUTHENTICATION_GUIDE.md`:
- Full auth system using Supabase
- Login page at `/auth`
- Sign up, password reset, email confirmation
- `AuthContext` provides auth state and methods
- Optional: add route protection, user profile page, role-based access

### 4. Module introduction
See `docs/architecture/MODULE_ARCHITECTURE.md`:
- 7 core modules: Auth, AI Service, UI Components, Routing, Content, Data, Utilities
- Module dependencies and data flow
- Extension points for new features

### 5. Modular development
See `docs/maintenance/MODULAR_DEVELOPMENT.md`:
- Migration strategy from current to modular structure
- Module design patterns
- Best practices for maintaining modularity

### 6. AI-assisted development
See `docs/guides/AI_ASSISTED_DEVELOPMENT.md`:
- How to use AI tools while maintaining control
- Best practices for code generation
- Review and refinement workflows
- Common patterns and pitfalls

### 7. Testing and debugging
See `docs/guides/TESTING_DEBUGGING.md`:
- Testing strategies (unit, integration, E2E)
- Debugging techniques
- Common issues and solutions
- Performance debugging

### 8. Code cleanup
See `docs/maintenance/CODE_CLEANUP.md`:
- List of unused components to remove
- Duplicate files to consolidate
- Backup files to clean up
- Safe removal process

## Quick start

1. New to the codebase? → Start with `docs/README.md` or `docs/QUICK_REFERENCE.md`
2. Adding features? → Read `docs/guides/DEVELOPMENT_GUIDELINES.md`
3. Using AI? → See `docs/guides/AI_ASSISTED_DEVELOPMENT.md`
4. Understanding architecture? → Check `docs/architecture/MODULE_ARCHITECTURE.md`

All documentation is in the `/docs` folder and does not affect the platform code. You can update it as the codebase evolves.

Should I create any additional documentation or dive deeper into a specific area?

```plaintext
docs/
├── README.md                          # Documentation index
├── QUICK_REFERENCE.md                  # Quick answers to common questions
├── architecture/
│   └── MODULE_ARCHITECTURE.md         # System architecture overview
├── components/
│   └── UI_COMPONENTS_USAGE.md         # UI components usage analysis
├── hooks/
│   └── HOOKS.md                       # Custom hooks documentation
├── guides/
│   ├── AUTHENTICATION_GUIDE.md        # Login/auth implementation guide
│   ├── DEVELOPMENT_GUIDELINES.md     # Development best practices
│   ├── AI_ASSISTED_DEVELOPMENT.md     # Using AI tools effectively
│   └── TESTING_DEBUGGING.md           # Testing and debugging strategies
└── maintenance/
    ├── CODE_CLEANUP.md                # Code cleanup recommendations
    └── MODULAR_DEVELOPMENT.md         # Modular development strategy
```

