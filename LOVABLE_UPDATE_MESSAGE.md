# Update Message for Lovable

## New Lesson Added: Lesson 6 - GenAI Policies and Ethical Use in Academic Publishing

Hi Lovable team,

I've just pushed a new lesson to the repository that needs to be reflected in the UI. Here are the details:

### What Was Added:
- **New Lesson File**: `src/pages/lessons/Lesson6.tsx`
- **Route Added**: `/lesson/6` in `src/App.tsx`

### Lesson Details:
- **Title**: GenAI Policies and Ethical Use in Academic Publishing
- **Content**: Comprehensive lesson based on Moorhouse et al. (2025) research paper
- **Structure**: 6 interactive tabs following the established lesson pattern
  - Tab 0: The Problem (ambiguous GenAI policies)
  - Tab 1: Undesirable Behaviors (questionable research practices)
  - Tab 2: Publisher Policies (COPE guidelines, Oxford, Elsevier, Sage)
  - Tab 3: Best Practices (transparent and ethical use)
  - Tab 4: Practice (interactive disclosure statement builder)
  - Tab 5: Reflection (summary and feedback)

### UI Considerations:
1. **Navigation**: The lesson should appear in the lesson navigation/index page
2. **Routing**: The route `/lesson/6` should be accessible
3. **Styling**: Uses the same components and styling as Lesson1 (LessonHeader, TabNavigation, LessonSection, etc.)
4. **Components Used**: 
   - LessonHeader
   - TabNavigation
   - LessonSection
   - BulletPoint
   - ComprehensionCheck
   - CollapsibleSection
   - PromptBuilder
   - FeedbackForm

### Metadata for Database (if needed):
```json
{
  "title": "GenAI Policies and Ethical Use in Academic Publishing",
  "slug": "genai-policies-ethical-use",
  "subject": "Academic Publishing & Research Ethics",
  "grade_level": "Graduate/Professional Development",
  "learning_objectives": "Understand ambiguous GenAI policies in academic publishing, identify undesirable behaviors, learn publisher-specific guidelines, and develop skills for transparent and ethical GenAI disclosure in academic writing.",
  "is_public": true,
  "teacher_id": null
}
```

### Notes:
- The lesson follows the same structure and patterns as Lesson1
- All components are already available in the codebase
- No new dependencies were added
- The lesson is fully functional and ready to use

Please update the UI to reflect this new lesson. Thank you!

