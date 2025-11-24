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

