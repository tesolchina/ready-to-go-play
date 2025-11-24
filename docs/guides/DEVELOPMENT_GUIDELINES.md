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

