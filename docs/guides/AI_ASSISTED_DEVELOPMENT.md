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

