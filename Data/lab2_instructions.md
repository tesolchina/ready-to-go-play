# Lab 2: Analyze BAWE in Batches - Instructions

## Objective
Automate the analysis of multiple academic essays using AI Agent + LLM API, demonstrating the power of batch processing over manual chatbot interactions.

---

## Input
📁 **Source Data Folder:**
```
Data/BAWE/CORPUS_ByDiscipline
```

This folder contains 5 academic essays (text files) from different disciplines. Right-click on this folder path to copy it for use with the AI Agent.

---

## Process

### Step 1: Prepare Your Prompt
📄 **Prompt File:**
```
Data/Prompts/lab2_prompt.md
```

This file contains the instructions for the LLM on how to analyze each essay:
- Summarize main argument, methodology, and findings
- Create a Mermaid diagram visualizing the essay structure

### Step 2: Set Up API Key
Ensure you have added your API key to one of these files:
- `Data/APIkeys/Kimi.md`
- `Data/APIkeys/DeepSeek.md`
- `Data/APIkeys/openrouter.md`

### Step 3: Batch Processing Workflow
Ask the AI Agent (Builder in Trae) to:

1. **Read** each text file from `Data/BAWE/CORPUS_ByDiscipline` (one at a time)
2. **Send** the file content + prompt from `Data/Prompts/lab2_prompt.md` to the LLM API
3. **Collect** the LLM response for each file
4. **Save** all responses to the output CSV file

---

## Output
💾 **Results File:**
```
Lab2_Results/analysis_results.csv
```

The CSV file should contain columns:
- `filename`: Name of the analyzed essay file
- `discipline`: Academic discipline (extracted from filename or content)
- `summary`: LLM-generated summary
- `structure_diagram`: Mermaid diagram code
- `timestamp`: When the analysis was completed

---

## Instructions for AI Agent

Right-click to copy this file path (`Data/lab2_instructions.md`) and send it to Builder with a message like:

> "Please follow the instructions in this file to analyze all essays in the BAWE corpus using the [Kimi/DeepSeek/OpenRouter] API."

---

## Expected Outcome

After completion, you should have:
✅ A CSV file with 5 rows (one for each essay)
✅ Each row containing summary and structure visualization
✅ All processing done automatically without manual copy-paste
✅ Zero context-switching between applications

---

## Why This Matters

**Traditional Chatbot Approach:**
- Open essay 1 → Copy content → Paste to chatbot → Wait → Copy response → Paste to spreadsheet
- Open essay 2 → Copy content → Paste to chatbot → Wait → Copy response → Paste to spreadsheet
- ... repeat 5 times ...
- High cognitive load from constant context-switching
- Time-consuming manual work
- Prone to human error

**AI Agent + API Approach:**
- Write instructions once → Let AI Agent automate the entire workflow
- No context-switching
- Scalable to hundreds or thousands of files
- Consistent, repeatable results
- You focus on analysis, not mechanical tasks

This is the power of API automation! 🚀
