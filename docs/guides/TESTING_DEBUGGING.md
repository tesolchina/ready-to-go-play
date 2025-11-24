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

