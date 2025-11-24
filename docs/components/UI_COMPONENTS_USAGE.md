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

