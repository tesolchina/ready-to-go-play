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

