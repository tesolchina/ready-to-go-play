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

