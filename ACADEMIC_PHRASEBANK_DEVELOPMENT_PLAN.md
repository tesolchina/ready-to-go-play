# Academic PhraseBank Chatbot - Development Plan

## 📋 Executive Summary

This document outlines a comprehensive development plan for building and enhancing the Academic PhraseBank chatbot module. The chatbot will help students and researchers with academic writing by providing appropriate phrases, sentence structures, and language patterns from the Manchester Academic PhraseBank.

**Current Status**: Module needs to be created from scratch  
**Target**: Fully functional, feature-rich academic writing assistant  
**Timeline**: Phased approach with iterative improvements

---

## 🎯 Phase 1: Core Implementation (MVP)

### 1.1 Backend Edge Function
**File**: `supabase/functions/academic-phrasebank-chat/index.ts`

**Objectives**:
- Create Supabase Edge Function for handling chat requests
- Integrate with AI API (using existing Lovable API Gateway pattern)
- Implement conversation history management
- Add system prompt for academic writing assistance

**Key Features**:
- [ ] CORS headers configuration
- [ ] Request validation and error handling
- [ ] System prompt definition (academic writing focus)
- [ ] Conversation history support
- [ ] AI API integration (DeepSeek or Gemini via Lovable Gateway)
- [ ] Response formatting

**System Prompt Template**:
```typescript
const systemPrompt = `You are an Academic PhraseBank assistant. Your role is to help students and researchers with academic writing by providing appropriate phrases, sentence structures, and language patterns commonly used in academic contexts.

You specialize in:
- Introducing ideas and research
- Describing methods and procedures
- Presenting results and findings
- Discussing implications and conclusions
- Citing and referencing
- Hedging and cautious language
- Transitions and signposting

Provide clear, contextual examples and explain when certain phrases are most appropriate. Always maintain an academic, professional tone.`;
```

**Technical Requirements**:
- Follow pattern from `provide-feedback/index.ts`
- Use Lovable API Gateway for AI calls
- Support both initial queries and follow-up conversations
- Temperature: 0.7 (balanced creativity)
- Max tokens: 2000 (sufficient for detailed responses)

**Estimated Time**: 2-3 hours

---

### 1.2 Frontend React Component
**File**: `src/pages/AcademicPhraseBank.tsx`

**Objectives**:
- Create user-friendly chat interface
- Implement message display and input handling
- Connect to backend edge function
- Add loading states and error handling

**Key Features**:
- [ ] Chat message display (user/AI messages)
- [ ] Message input with send button
- [ ] Loading indicators
- [ ] Error handling and user feedback
- [ ] Conversation history persistence (localStorage)
- [ ] Clear conversation button
- [ ] Responsive design

**UI Components to Use**:
- `Card`, `CardHeader`, `CardContent` from `@/components/ui/card`
- `Button` from `@/components/ui/button`
- `Textarea` from `@/components/ui/textarea`
- `Loader2`, `Send`, `MessageSquare` from `lucide-react`
- `useToast` for notifications

**Reference**: Use `PromptBuilder.tsx` as inspiration for chat UI patterns

**Estimated Time**: 3-4 hours

---

### 1.3 Routing Integration
**File**: `src/App.tsx`

**Objectives**:
- Add route for Academic PhraseBank page
- Update navigation if needed

**Changes**:
- [ ] Import `AcademicPhraseBank` component
- [ ] Add route: `<Route path="/phrasebank" element={<AcademicPhraseBank />} />`
- [ ] Place above catch-all route

**Estimated Time**: 15 minutes

---

### 1.4 Navigation Update
**File**: `src/pages/Index.tsx` (optional)

**Objectives**:
- Add card/link to Academic PhraseBank on homepage

**Features**:
- [ ] New section or card linking to `/phrasebank`
- [ ] Descriptive text about the tool
- [ ] Icon (e.g., `BookOpen` or `FileText`)

**Estimated Time**: 30 minutes

---

## 🚀 Phase 2: Enhanced Features

### 2.1 PhraseBank Content Integration
**File**: `supabase/functions/academic-phrasebank-chat/index.ts`

**Objectives**:
- Integrate actual PhraseBank content as context
- Use RAG (Retrieval Augmented Generation) approach
- Provide more accurate, context-aware responses

**Approach Options**:

**Option A: Embed PhraseBank in System Prompt** (Simpler)
- Parse `phrasebank_content.md`
- Extract key phrases by category
- Include in system prompt context
- **Pros**: Simple, fast
- **Cons**: Token limits, less dynamic

**Option B: Vector Search** (Advanced)
- Store PhraseBank content in Supabase vector database
- Use embeddings for semantic search
- Retrieve relevant phrases based on user query
- **Pros**: Scalable, accurate
- **Cons**: Requires vector DB setup

**Option C: Structured Data + Keyword Matching** (Balanced)
- Parse markdown into structured JSON
- Store in Supabase table or edge function storage
- Keyword-based retrieval with AI enhancement
- **Pros**: Good balance, manageable
- **Cons**: Requires parsing logic

**Recommended**: Start with Option A, migrate to Option C later

**Implementation Steps**:
- [ ] Parse `phrasebank_content.md` to extract categories and phrases
- [ ] Create structured data format (JSON)
- [ ] Add retrieval function to edge function
- [ ] Integrate retrieved phrases into AI context
- [ ] Test with various query types

**Estimated Time**: 4-6 hours

---

### 2.2 Category-Based Navigation
**File**: `src/pages/AcademicPhraseBank.tsx`

**Objectives**:
- Add sidebar or tabs for PhraseBank categories
- Allow users to browse by category
- Quick access to common phrases

**Categories to Include**:
- Introducing work
- Referring to sources
- Describing methods
- Reporting results
- Discussing findings
- Writing conclusions
- Being cautious
- Being critical
- Compare and contrast
- Defining terms
- Describing trends
- Explaining causality
- Giving examples
- Signalling transition

**Features**:
- [ ] Category sidebar or dropdown
- [ ] Click category to see example phrases
- [ ] "Use this category" button to start chat with context
- [ ] Category-based quick examples

**Estimated Time**: 3-4 hours

---

### 2.3 Advanced Chat Features
**File**: `src/pages/AcademicPhraseBank.tsx`

**Objectives**:
- Enhance chat experience with modern features

**Features**:
- [ ] Message timestamps
- [ ] Copy message to clipboard
- [ ] Export conversation (markdown/text)
- [ ] Search conversation history
- [ ] Markdown rendering in AI responses
- [ ] Code block syntax highlighting
- [ ] Typing indicators
- [ ] Message reactions (thumbs up/down)

**Estimated Time**: 4-5 hours

---

### 2.4 Context-Aware Suggestions
**File**: `src/pages/AcademicPhraseBank.tsx` + Edge Function

**Objectives**:
- Provide smart suggestions based on user's writing context

**Features**:
- [ ] "What I'm writing" input field
- [ ] Context analysis (e.g., "introduction", "methodology", "results")
- [ ] Suggested phrases based on context
- [ ] Example sentences with user's content
- [ ] Tone/style suggestions

**Estimated Time**: 3-4 hours

---

## 🎨 Phase 3: User Experience Enhancements

### 3.1 Writing Assistant Mode
**File**: New component or enhancement to existing

**Objectives**:
- Allow users to paste their writing and get suggestions

**Features**:
- [ ] Text input area for user's draft
- [ ] Highlight areas needing improvement
- [ ] Suggest alternative phrases inline
- [ ] Accept/reject suggestions
- [ ] Export improved text

**Estimated Time**: 5-6 hours

---

### 3.2 Phrase Favorites & Collections
**File**: Database schema + Frontend

**Objectives**:
- Let users save favorite phrases
- Create custom collections

**Database Schema**:
```sql
CREATE TABLE phrasebank_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  phrase TEXT NOT NULL,
  category TEXT,
  context TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE phrasebank_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Features**:
- [ ] Save phrase button on AI responses
- [ ] View saved phrases
- [ ] Create collections (e.g., "Introduction phrases", "Methodology phrases")
- [ ] Organize phrases into collections
- [ ] Export collections

**Estimated Time**: 4-5 hours

---

### 3.3 Usage Analytics
**File**: Database + Dashboard component

**Objectives**:
- Track usage patterns
- Help users understand their writing habits

**Features**:
- [ ] Track most-used categories
- [ ] Writing style analysis
- [ ] Improvement suggestions based on usage
- [ ] Weekly/monthly reports

**Estimated Time**: 3-4 hours

---

## 🔧 Phase 4: Technical Improvements

### 4.1 Performance Optimization
**Objectives**:
- Improve response times
- Reduce API costs
- Better caching

**Improvements**:
- [ ] Response caching for common queries
- [ ] Debounce user input
- [ ] Stream responses (if API supports)
- [ ] Optimize PhraseBank content loading
- [ ] Lazy load categories

**Estimated Time**: 3-4 hours

---

### 4.2 Error Handling & Resilience
**Objectives**:
- Robust error handling
- Graceful degradation
- Better user feedback

**Improvements**:
- [ ] Retry logic for failed API calls
- [ ] Fallback responses
- [ ] Clear error messages
- [ ] Offline mode (cached responses)
- [ ] Rate limiting handling

**Estimated Time**: 2-3 hours

---

### 4.3 Testing
**Objectives**:
- Ensure reliability
- Prevent regressions

**Testing Areas**:
- [ ] Unit tests for edge function
- [ ] Component tests for React UI
- [ ] Integration tests for full flow
- [ ] E2E tests for user scenarios
- [ ] Performance tests

**Estimated Time**: 4-6 hours

---

## 📚 Phase 5: Documentation & Polish

### 5.1 User Documentation
**Objectives**:
- Help users understand and use the tool effectively

**Deliverables**:
- [ ] In-app help/tutorial
- [ ] Tooltips and hints
- [ ] Example queries
- [ ] Best practices guide
- [ ] Video tutorial (optional)

**Estimated Time**: 2-3 hours

---

### 5.2 Developer Documentation
**Objectives**:
- Document architecture and maintenance

**Deliverables**:
- [ ] Code comments
- [ ] Architecture diagram
- [ ] API documentation
- [ ] Deployment guide
- [ ] Contributing guidelines

**Estimated Time**: 2-3 hours

---

## 🎯 Priority Roadmap

### Must Have (MVP - Week 1)
1. ✅ Backend edge function
2. ✅ Frontend React component
3. ✅ Basic routing
4. ✅ Simple chat interface

### Should Have (Week 2-3)
1. PhraseBank content integration (Option A)
2. Category navigation
3. Enhanced chat features (copy, export)
4. Better error handling

### Nice to Have (Week 4+)
1. Writing assistant mode
2. Favorites & collections
3. Usage analytics
4. Performance optimizations

---

## 📊 Success Metrics

### User Engagement
- Daily active users
- Average session length
- Messages per session
- Return user rate

### Quality Metrics
- User satisfaction (thumbs up/down)
- Response relevance (user feedback)
- Time to first response
- Error rate

### Technical Metrics
- API response time
- Error rate
- Uptime
- Cost per query

---

## 🔄 Iteration Plan

### Sprint 1 (Week 1): MVP
- Core functionality
- Basic UI
- Integration with app

### Sprint 2 (Week 2): Content Integration
- PhraseBank content parsing
- Category system
- Enhanced responses

### Sprint 3 (Week 3): UX Polish
- Advanced chat features
- Better UI/UX
- Performance improvements

### Sprint 4 (Week 4+): Advanced Features
- Writing assistant mode
- Favorites system
- Analytics

---

## 🛠️ Technical Stack

### Backend
- **Runtime**: Deno (Supabase Edge Functions)
- **AI API**: Lovable Gateway → DeepSeek/Gemini
- **Storage**: Supabase (for favorites/collections later)

### Frontend
- **Framework**: React + TypeScript
- **UI Library**: shadcn-ui + Tailwind CSS
- **State**: React Hooks
- **Routing**: React Router
- **HTTP Client**: Supabase Client

### Data
- **PhraseBank Content**: Markdown file (4631 lines)
- **Future**: Supabase database for user data

---

## 🚨 Known Challenges & Solutions

### Challenge 1: Large PhraseBank Content
**Problem**: 4631 lines of markdown content  
**Solution**: 
- Parse and structure data
- Use selective retrieval
- Consider pagination/chunking

### Challenge 2: Token Limits
**Problem**: AI API token limits  
**Solution**:
- Smart context selection
- Summarize PhraseBank content
- Use embeddings for retrieval

### Challenge 3: Response Quality
**Problem**: Generic vs. specific responses  
**Solution**:
- Context-aware prompts
- User writing context input
- Category-specific system prompts

---

## 📝 Next Steps

1. **Review this plan** with stakeholders
2. **Set up development environment** (if not ready)
3. **Start with Phase 1.1** (Backend Edge Function)
4. **Test incrementally** after each phase
5. **Gather user feedback** early and often

---

## 📞 Questions to Resolve

1. Which AI model to use? (DeepSeek, Gemini, or other?)
2. Should PhraseBank content be stored in database or embedded?
3. Do we need user authentication for favorites?
4. What's the target response time?
5. Should this be a standalone tool or integrated into lessons?

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Author**: Development Team  
**Status**: Planning Phase

