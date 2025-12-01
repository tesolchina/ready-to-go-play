# Lab 3 Instructions: Literature Review Screening

## Task Overview
Screen and categorize the first 10 studies from a CSV file containing research on BAWE (British Academic Written English) and data-driven learning.

## Input-Process-Output Model

### 📥 Input
**File:** `Data/Literature/bawe_ddl_studies.csv`
- Contains ~200 studies with titles, abstracts, authors, year, and journal information
- Some abstracts may be missing

**Prompt File:** `Data/Prompts/lab3_prompt.md`
- Contains categorization instructions for the LLM

### ⚙️ Process
1. **Read the CSV file** and extract the first 10 entries
2. **For each study (1-10):**
   - Extract the title and abstract (if available)
   - If abstract is missing, use only the title
   - Send title + abstract to the LLM via API along with the prompt from `Data/Prompts/lab3_prompt.md`
   - Collect the LLM's categorization response
   - Update the process log with progress
3. **Handle missing data gracefully:**
   - Flag studies with missing abstracts
   - Note "Abstract not available" in relevant output fields
   - Use only title for categorization when abstract is missing

### 📤 Output
1. **Screening Results CSV:** `Lab3_Results/screening_results.csv`
   - Columns: Title, Authors, Year, Study_Context, Research_Objective, Data_Analyzed, Main_Findings, Implications, Abstract_Missing_Flag
   
2. **Process Log:** `Lab3_Results/process_log.txt`
   - Track progress with timestamps
   - Format: `[TIMESTAMP] Processing study X of 10: [Title]`
   - Include completion status for each study

## Instructions for Builder

Please perform the following tasks:

1. **Create output directory:**
   - Create folder: `Lab3_Results`

2. **Initialize process log:**
   - Create `Lab3_Results/process_log.txt`
   - Write header: `Literature Review Screening - Lab 3\nStarted: [TIMESTAMP]\n`

3. **Read input files:**
   - Read CSV: `Data/Literature/bawe_ddl_studies.csv`
   - Read prompt: `Data/Prompts/lab3_prompt.md`
   - Extract first 10 entries from CSV

4. **Process each study:**
   - For each of the first 10 studies:
     a. Log: `[TIMESTAMP] Processing study X of 10: [Title]`
     b. Extract title and abstract (check if abstract exists)
     c. Combine title + abstract (or title only if abstract missing)
     d. Send to LLM API with the prompt from `lab3_prompt.md`
     e. Parse LLM response to extract categorization fields
     f. Store results
     g. Log: `[TIMESTAMP] Completed study X of 10`

5. **Generate output CSV:**
   - Create `Lab3_Results/screening_results.csv`
   - Include columns: Title, Authors, Year, Study_Context, Research_Objective, Data_Analyzed, Main_Findings, Implications, Abstract_Missing_Flag
   - Write all categorization results

6. **Finalize log:**
   - Write: `\n[TIMESTAMP] Processing complete. 10 studies categorized.\nResults saved to: Lab3_Results/screening_results.csv`

## Expected Results

After completion, you should have:
- ✅ A CSV file with 10 categorized studies
- ✅ A process log showing the workflow execution
- ✅ Structured categorization data ready for analysis

## Notes
- This workflow can be scaled to process all ~200 studies by adjusting the instruction (change "first 10" to "all entries")
- The process log helps track progress and debug if issues occur
- Missing abstracts should be handled gracefully without stopping the workflow
