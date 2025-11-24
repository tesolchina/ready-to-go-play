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

