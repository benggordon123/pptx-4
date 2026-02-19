import streamlit as st
import google.generativeai as genai
import os
import json
import re
from pypdf import PdfReader

# --- Configuration & Styling ---
st.set_page_config(page_title="Excel & Data Analysis AI Power Suite", layout="wide", page_icon="📊")

# Initialize Gemini
API_KEY = os.environ.get("API_KEY", "")
if API_KEY:
    genai.configure(api_key=API_KEY)

# Custom CSS
st.markdown("""
    <style>
    .main { background-color: #f8fafc; }
    .stButton>button { width: 100%; border-radius: 12px; font-weight: bold; }
    .pptx-header {
        background: #0f172a;
        color: white;
        padding: 1.5rem;
        border-radius: 24px 24px 0 0;
        margin-bottom: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .anatomy-box {
        background: #f1f5f9;
        padding: 1rem;
        border-radius: 16px;
        border: 1px solid #e2e8f0;
    }
    .prompt-code {
        background: #0f172a;
        color: #cbd5e1;
        padding: 1rem;
        border-radius: 12px;
        font-family: monospace;
        font-size: 0.8rem;
        margin-bottom: 0.5rem;
    }
    .result-container {
        background: #0f172a;
        color: white;
        padding: 2rem;
        border-radius: 32px;
        min-height: 400px;
    }
    .time-badge {
        background: #dbeafe;
        color: #1e40af;
        padding: 0.3rem 0.8rem;
        border-radius: 99px;
        font-size: 0.75rem;
        font-weight: bold;
    }
    .formula-box {
        background: #fffbeb;
        border: 2px solid #fbbf24;
        border-radius: 16px;
        padding: 1.5rem;
        margin: 1rem 0;
    }
    .mistake-box {
        background: #fef2f2;
        border-left: 4px solid #ef4444;
        padding: 1rem;
        border-radius: 0 12px 12px 0;
        margin: 0.5rem 0;
    }
    .tip-box {
        background: #f0fdf4;
        border-left: 4px solid #22c55e;
        padding: 1rem;
        border-radius: 0 12px 12px 0;
        margin: 0.5rem 0;
    }
    </style>
""", unsafe_allow_html=True)


# --- Logic Layer ---
def call_gemini(role, task, context, format_instr, module_type="draft"):
    if not API_KEY:
        return {"error": "API Key missing. Please set your API_KEY in the environment."}

    context_instructions = {
        "excel_plan": "Create a step-by-step plan for the Excel/data task, grounded in the training PDF. Include exact menu clicks, cell references, and formula patterns where relevant.",
        "analysis": "Design an analysis workflow grounded in the training PDF. Suggest pivots, metrics, checks, and how to interpret results. Include at least one actionable recommendation.",
        "prompt_improve": "Rewrite the user's vague prompt into a precise, high-quality Excel AI prompt (goal, columns, criteria, edge cases, output). Then answer it.",
        "formula_write": "Write the exact Excel formula needed, with robust blank/error handling and a clear explanation.",
        "formula_pattern": "Identify the best formula pattern (XLOOKUP, SUMIF(S), COUNTIF(S), IF(S), INDEX/MATCH, dynamic arrays) and provide the best solution with examples.",
        "formula_fix": "Diagnose the Excel error, explain the root cause, and provide a corrected formula plus safer alternatives (IFERROR/guards).",
        "cleaning": "Provide a detailed cleaning approach using Excel formulas and/or Power Query. Standardise names, dates, currency, spaces, and data types.",
        "transform": "Provide the best method to split/combine/extract (formulas, Text to Columns, Flash Fill, Power Query), with step-by-step instructions.",
        "validate": "Create data-quality checks (duplicates, invalid formats, missing values) and show how to implement them with helper columns and conditional formatting.",
        "insights": "Extract insights and interpret results. Recommend pivots, charts, and a short narrative summary.",
        "charts": "Recommend the right chart type and provide exact Excel steps to build and format it so the insight is obvious.",
        "automation": "Design an end-to-end recurring workflow: import, clean, analyse, chart, and summarise. Include Power Query steps and a reusable prompt library."
    }

    ctx = context_instructions.get(module_type, "Solve the user's Excel/data task grounded in the training PDF.")

    pdf_ctx = retrieve_pdf_context(f"{task}\n{context}", PDF_PAGES)

    reference_block = f"\n\nTRAINING PDF REFERENCE (use as your primary source):\n{pdf_ctx}\n" if pdf_ctx else ""

    prompt = f"""Role: {role}

Task: {task}

Additional guidance:
{ctx}

Instructions:
- Use the TRAINING PDF REFERENCE as your primary source.
- Be extremely detailed and practical.
- When giving formulas, include exact Excel formulas and explain each part.
- When giving steps, include exact menu clicks and what the user should see.
- Include edge cases (blanks, not found, wrong data types) and how to handle them.
- If the user pasted sensitive data, warn them to anonymise.

User input:
{context}

{reference_block}

Output format: {format_instr}

Return ONLY valid JSON."""

    model = genai.GenerativeModel('gemini-2.5-flash-lite')

    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
            )
        )
        return json.loads(response.text)
    except Exception as e:
        return {"error": str(e)}


# --- State Management ---
if 'view' not in st.session_state:
    st.session_state.view = 'Dashboard'
if 'mode' not in st.session_state:
    st.session_state.mode = 'theory'
if 'section' not in st.session_state:
    st.session_state.section = 0

# --- Navigation ---
with st.sidebar:
    st.title("📊 Excel AI Mastery")
    st.caption("MODULE 4: EXCEL & DATA ANALYSIS WITH AI")

    menu = {
        "📊 Dashboard": "Dashboard",
        "1️⃣ Part 1: Foundations": "Foundations",
        "2️⃣ Part 2: Formulas & Functions": "Formulas",
        "3️⃣ Part 3: Data Cleaning": "Cleaning",
        "4️⃣ Part 4: Analysis, Charts & Automation": "Advanced"
    }

    selection = st.radio("Learning Modules", list(menu.keys()))
    new_view = menu[selection]
    if new_view != st.session_state.view:
        st.session_state.view = new_view
        st.session_state.mode = 'theory'
        st.session_state.section = 0

    st.divider()
    if API_KEY:
        st.success("Gemini Engine Active")
    else:
        st.warning("Set API_KEY to enable AI")

    st.divider()
    st.caption("Based on: Excel & Data Analysis with AI")
    st.caption("Duration: 2.5 to 3 hours")


# =============================================================================
# CONTENT DATA - 3 sections per module = 12 exercises total
# =============================================================================
# =============================================================================
# PDF-DRIVEN CONTENT
# =============================================================================

PDF_PATH = os.environ.get("MODULE_PDF_PATH", "Module_4_Excel_Data_Analysis_with_AI.pdf")

def _clean_pdf_text(text: str) -> str:
    text = text.replace("\u00a0", " ")
    # Remove repeated footer lines like "MODULE 4: ... 12 / 50"
    text = re.sub(r"MODULE\s+4:\s+EXCEL\s+&\s+DATA\s+ANALYSIS\s+WITH\s+AI\s+\d+\s*/\s*\d+", "", text, flags=re.IGNORECASE)
    # Remove stray page markers like "1 / 50"
    text = re.sub(r"\b\d+\s*/\s*\d+\b", "", text)
    # Collapse weird spacing (e.g., "P A R T" -> "PART")
    text = re.sub(r"\bP\s+A\s+R\s+T\b", "PART", text)
    text = re.sub(r"\bM\s+O\s+D\s+U\s+L\s+E\b", "MODULE", text)
    # Clean extra whitespace
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()

@st.cache_data(show_spinner=False)
def load_pdf_pages(path: str) -> list[str]:
    if not os.path.exists(path):
        return []
    reader = PdfReader(path)
    pages = []
    for p in reader.pages:
        pages.append(_clean_pdf_text(p.extract_text() or ""))
    return pages

def _tokenize(s: str) -> list[str]:
    return re.findall(r"[a-zA-Z]{3,}", (s or "").lower())

def retrieve_pdf_context(query: str, pages: list[str], k: int = 6, max_chars: int = 7000) -> str:
    if not pages:
        return ""
    q_tokens = _tokenize(query)
    if not q_tokens:
        return ""
    q_set = set(q_tokens)

    scored = []
    for i, text in enumerate(pages):
        t_tokens = _tokenize(text)
        if not t_tokens:
            continue
        t_set = set(t_tokens)
        score = len(q_set.intersection(t_set))
        if "prompt" in t_set:
            score += 2
        scored.append((score, i))

    scored.sort(reverse=True)
    picked = [i for score, i in scored[:k] if score > 0]
    if not picked:
        picked = list(range(min(k, len(pages))))

    chunks = []
    total = 0
    for i in picked:
        chunk = f"Page {i+1}:\n{pages[i]}\n"
        if total + len(chunk) > max_chars:
            break
        chunks.append(chunk)
        total += len(chunk)

    return "\n\n".join(chunks).strip()

PDF_PAGES = load_pdf_pages(PDF_PATH)

def _pages_excerpt(start_page: int, end_page: int) -> str:
    if not PDF_PAGES:
        return "PDF not found. Put the file next to app.py or set MODULE_PDF_PATH."
    start_i = max(0, start_page - 1)
    end_i = min(len(PDF_PAGES) - 1, end_page - 1)
    return "\n\n".join([PDF_PAGES[i] for i in range(start_i, end_i + 1)]).strip()

def build_content_from_pdf() -> dict:
    return {
        "Foundations": {
            "module_title": "Part 1: Foundations",
            "module_desc": "Understand the real cost of spreadsheet work, the shift to plain-English prompting, and what AI can do inside Excel.",
            "time": "45-60 min",
            "sections": [
                {
                    "name": "1A: The Data Problem",
                    "icon": "📉",
                    "time": "15 min",
                    "theory": {
                        "title": "The Data Problem (Why This Matters)",
                        "philosophy": _pages_excerpt(3, 6),
                        "formula": "Describe the OUTCOME in plain English, then include: columns involved, criteria, what to return if blank/error, and where the result should go.",
                        "verb": "Write / Build / Fix",
                        "instruction": "Outcome first, then column details and edge cases",
                        "constraints": "Always specify columns + blank/error handling",
                        "prompts": [
                            "I spend hours each week cleaning and reporting on data. Summarise where the time goes, then list the top 5 tasks AI can remove.",
                            "I have a CSV export with mixed dates and currency. What is the fastest AI-driven workflow in Excel to import, clean, and report?"
                        ],
                        "benefit": "You stop wrestling Excel syntax and start describing outcomes. This cuts spreadsheet time dramatically, especially cleaning and reporting.",
                        "tip": "If you only do one thing: always include what to do when cells are blank or don’t match, so you avoid #N/A and #DIV/0 errors."
                    },
                    "lab": {
                        "role": "Excel & Data Analysis AI Coach",
                        "task": "Use the training PDF as your main reference. Create a step-by-step plan to solve the user's Excel/data problem and include exact formulas or clicks where relevant. Be very detailed.",
                        "placeholder": "Describe your spreadsheet task (and paste a few sample rows or column headers). What do you want Excel to do?",
                        "format": "JSON: { 'reply': string }",
                        "module_type": "excel_plan",
                        "extra_controls": None
                    }
                },
                {
                    "name": "1B: What AI Can Do in Excel",
                    "icon": "🤖",
                    "time": "15 min",
                    "theory": {
                        "title": "What AI Can Do With Your Data",
                        "philosophy": _pages_excerpt(7, 7),
                        "formula": "Tell AI: (1) goal, (2) your columns, (3) constraints, (4) edge cases, (5) desired output format.",
                        "verb": "Analyse / Recommend",
                        "instruction": "Give AI the columns and the business question",
                        "constraints": "No vague asks, provide schema and goal",
                        "prompts": [
                            "Here are my columns: Date, Client, Service, Amount, Salesperson. What analyses and pivot tables should I build to find the biggest drivers of revenue?",
                            "I need a weekly report. Suggest a reusable Excel template with formulas, conditional formatting, and a top summary box."
                        ],
                        "benefit": "AI becomes your on-demand Excel expert: formulas, cleaning, analysis, charts, and explaining what things mean.",
                        "tip": "When asking for analysis, specify the exact outputs you want: trends, anomalies, top 3 insights, and one recommendation."
                    },
                    "lab": {
                        "role": "Excel Copilot-Style Analyst",
                        "task": "Using the PDF, generate a detailed analysis plan: what to calculate, which pivot tables to build, and which charts to use. Include exact steps and example formulas.",
                        "placeholder": "Paste your column headers and tell me what question you want answered (e.g., best month, best product, anomalies).",
                        "format": "JSON: { 'reply': string }",
                        "module_type": "analysis",
                        "extra_controls": None
                    }
                },
                {
                    "name": "1C: Good Prompts vs Bad Prompts",
                    "icon": "🧠",
                    "time": "15 min",
                    "theory": {
                        "title": "Prompting Rules That Make AI Accurate",
                        "philosophy": _pages_excerpt(40, 45),
                        "formula": "Use this structure: Goal → Columns → Criteria → Error/blank handling → Output cell/format → Example row.",
                        "verb": "Rewrite / Improve",
                        "instruction": "Turn vague prompts into precise prompts",
                        "constraints": "Must mention columns + criteria + edge cases",
                        "prompts": [
                            "Rewrite my prompt to be specific: 'write me a formula to calculate commission'",
                            "Rewrite my prompt: 'analyse my data' so it asks for (1) best performer, (2) unusual drops, (3) one action to take."
                        ],
                        "benefit": "Better prompts give better formulas and fewer errors, so you spend less time debugging and redoing work.",
                        "tip": "If AI gives you a formula, test it on 2-3 rows manually before filling down the whole sheet."
                    },
                    "lab": {
                        "role": "Prompt Engineer for Excel Tasks",
                        "task": "Take the user's rough prompt and rewrite it into a perfect Excel AI prompt using the PDF rules. Then provide the formula or steps that prompt would produce.",
                        "placeholder": "Paste the rough prompt you would normally type (and optionally your columns).",
                        "format": "JSON: { 'reply': string }",
                        "module_type": "prompt_improve",
                        "extra_controls": None
                    }
                }
            ]
        },
        "Formulas": {
            "module_title": "Part 2: Formulas & Functions",
            "module_desc": "Write formulas in plain English, cover the 12 most common formula types, and fix errors fast.",
            "time": "45-60 min",
            "sections": [
                {
                    "name": "2A: The Formula Request Formula",
                    "icon": "🧾",
                    "time": "15 min",
                    "theory": {
                        "title": "The Formula Request Formula",
                        "philosophy": _pages_excerpt(9, 10),
                        "formula": _pages_excerpt(9, 9),
                        "verb": "Write",
                        "instruction": "Describe outcome + your columns + where the result goes",
                        "constraints": "Include blank/error output rules",
                        "prompts": [
                            "Write an Excel formula to calculate total revenue. Column A = guests, column B = price per person. If A is blank, show 0.",
                            "Write a formula to flag rows where Status = Pending and Booking Date is older than 90 days. Return \"Chase\" else blank."
                        ],
                        "benefit": "You get correct formulas without memorising syntax. You also build a reusable prompt library.",
                        "tip": "Ask for both: the formula AND a short explanation of how it works, so you can troubleshoot later."
                    },
                    "lab": {
                        "role": "Excel Formula Writer",
                        "task": "Write the exact Excel formula the user needs. Include robust error handling (IF, IFERROR) and explain it step-by-step. Be very detailed.",
                        "placeholder": "Describe your goal and your columns (A, B, etc). Say what to do if blank or no match.",
                        "format": "JSON: { 'reply': string }",
                        "module_type": "formula_write",
                        "extra_controls": None
                    }
                },
                {
                    "name": "2B: Real-World Formula Patterns",
                    "icon": "🧩",
                    "time": "15 min",
                    "theory": {
                        "title": "12 Formula Types + Examples",
                        "philosophy": _pages_excerpt(10, 11),
                        "formula": "Pick the pattern (lookup, IF/IFS, SUMIF, COUNTIF, XLOOKUP, INDEX/MATCH) then specify columns, criteria, and return value.",
                        "verb": "Calculate",
                        "instruction": "Choose pattern then fill in your schema",
                        "constraints": "Return value and criteria must be explicit",
                        "prompts": [
                            "XLOOKUP: Find booking ref in column A, return guest name in column F. If not found, show Not Found.",
                            "SUMIF: Sum Amount in column D where Property in column B is \'Loch View\' and Month in column C is \'July\'."
                        ],
                        "benefit": "Once you recognise the pattern, AI can generate it instantly for any dataset.",
                        "tip": "If a lookup fails, check data types (text vs number) and extra spaces first. That causes most #N/A."
                    },
                    "lab": {
                        "role": "Excel Pattern Coach",
                        "task": "Identify which formula pattern fits the user's goal, then produce the best formula (or combo) with error handling and a worked example.",
                        "placeholder": "Explain what you’re trying to calculate and paste a sample row (or column descriptions).",
                        "format": "JSON: { 'reply': string }",
                        "module_type": "formula_pattern",
                        "extra_controls": None
                    }
                },
                {
                    "name": "2C: Fixing Errors & Advanced Functions",
                    "icon": "🛠️",
                    "time": "15 min",
                    "theory": {
                        "title": "Fix Errors Fast + Use Advanced Functions",
                        "philosophy": _pages_excerpt(12, 15),
                        "formula": "Paste the broken formula + say what it should do + describe the columns and the error. Ask AI to fix it and add IFERROR/IF guards.",
                        "verb": "Fix",
                        "instruction": "Error code + expected outcome + data schema",
                        "constraints": "Must propose a corrected formula AND why the error happened",
                        "prompts": [
                            "This formula returns #N/A: =VLOOKUP(A2,Sheet2!A:C,3,FALSE). Column A has booking refs. Fix it and add IFERROR to show blank if not found.",
                            "Explain what this formula does and rewrite it using XLOOKUP: =INDEX(F:F,MATCH(H2,A:A,0))"
                        ],
                        "benefit": "No more Googling #REF or #VALUE. You paste the problem and get the fix plus a safer version.",
                        "tip": "Ask AI to also suggest a quick data check (TRIM, VALUE, CLEAN) when fixing #N/A or #VALUE."
                    },
                    "lab": {
                        "role": "Excel Debugger",
                        "task": "Diagnose the user’s Excel formula error, explain the root cause, then provide a corrected, safer formula with edge cases handled. Be very detailed.",
                        "placeholder": "Paste your formula and the exact error (#N/A, #REF, #VALUE, etc). Also say what you expect the result to be.",
                        "format": "JSON: { 'reply': string }",
                        "module_type": "formula_fix",
                        "extra_controls": None
                    }
                }
            ]
        },
        "Cleaning": {
            "module_title": "Part 3: Data Cleaning & Transformation",
            "module_desc": "Fix messy imports, standardise formats, and transform columns quickly with AI-driven prompts and formulas.",
            "time": "45-60 min",
            "sections": [
                {
                    "name": "3A: Cleaning Messy Data",
                    "icon": "🧼",
                    "time": "15 min",
                    "theory": {
                        "title": "The Messy Data Problem",
                        "philosophy": _pages_excerpt(17, 20),
                        "formula": "Describe the mess (spaces, case, currency symbols, date formats) and ask for formulas and steps to standardise into a clean version column.",
                        "verb": "Clean",
                        "instruction": "Name the exact problems and desired final format",
                        "constraints": "Must include target format and where output goes",
                        "prompts": [
                            "Clean column A names: remove extra spaces and convert to Proper Case.",
                            "Convert currency text like '\u00a31,250' into numbers. Keep negatives and blanks safe."
                        ],
                        "benefit": "Cleaning is where most spreadsheet time is lost. AI helps you standardise fast so analysis actually works.",
                        "tip": "Always keep the original column and create a new cleaned column, so you can compare before vs after."
                    },
                    "lab": {
                        "role": "Excel Data Cleaning Specialist",
                        "task": "Create a detailed cleaning plan for the user's dataset. Provide exact formulas (TRIM, CLEAN, PROPER, SUBSTITUTE, VALUE, DATEVALUE) and step-by-step instructions.",
                        "placeholder": "Paste a few messy rows and describe what’s wrong (spaces, dates, currency, duplicates).",
                        "format": "JSON: { 'reply': string }",
                        "module_type": "cleaning",
                        "extra_controls": None
                    }
                },
                {
                    "name": "3B: Transforming Columns",
                    "icon": "🔀",
                    "time": "15 min",
                    "theory": {
                        "title": "Split, Combine, Extract",
                        "philosophy": _pages_excerpt(21, 21),
                        "formula": "Tell AI whether you want to split, combine, or extract. Provide the pattern (space, comma, postcode format) and sample values.",
                        "verb": "Split / Combine",
                        "instruction": "Provide sample values and the delimiter/pattern",
                        "constraints": "Must handle messy edge cases",
                        "prompts": [
                            "Split full name into First Name and Last Name (names may have middle initials).",
                            "Split UK address into Street, Town, Postcode. Postcode format is like IV1 1AA."
                        ],
                        "benefit": "You stop doing manual text-to-columns and get repeatable transformations you can reuse.",
                        "tip": "If using Text to Columns, ask AI whether Power Query is better when you need to repeat the task weekly."
                    },
                    "lab": {
                        "role": "Excel Transformation Coach",
                        "task": "Design a transformation for the user: either formulas, Text to Columns, Flash Fill, or Power Query. Provide the best method and detailed steps.",
                        "placeholder": "Tell me what you want to split/combine/extract and paste 5 example cells.",
                        "format": "JSON: { 'reply': string }",
                        "module_type": "transform",
                        "extra_controls": None
                    }
                },
                {
                    "name": "3C: Duplicates, Validation, Standards",
                    "icon": "✅",
                    "time": "15 min",
                    "theory": {
                        "title": "Standardise and Validate",
                        "philosophy": _pages_excerpt(18, 18) + "\n\n" + _pages_excerpt(44, 45),
                        "formula": "Ask AI for: dedupe rules, validation checks, and a reusable cleaning checklist you can apply every import.",
                        "verb": "Validate",
                        "instruction": "Define what counts as a duplicate and the expected format",
                        "constraints": "Must propose checks before analysis",
                        "prompts": [
                            "Find duplicate rows where Email matches, keep the most recent Date, delete the rest. Give steps or formulas.",
                            "Flag invalid postcodes in column D and highlight them with conditional formatting."
                        ],
                        "benefit": "A standard cleaning checklist reduces hidden errors that ruin reports and decisions.",
                        "tip": "Build a 'cleaning library' prompt list you reuse for every import: names, dates, currency, duplicates, and blanks."
                    },
                    "lab": {
                        "role": "Data Quality Auditor",
                        "task": "Create a detailed data quality checklist for the user’s dataset and provide Excel steps to implement it (conditional formatting, validation, helper columns).",
                        "placeholder": "Describe your dataset and what 'clean' should look like. Mention key columns (email, dates, amounts, IDs).",
                        "format": "JSON: { 'reply': string }",
                        "module_type": "validate",
                        "extra_controls": None
                    }
                }
            ]
        },
        "Advanced": {
            "module_title": "Part 4: Analysis, Visualisation & Automation",
            "module_desc": "Turn numbers into insights, build charts and pivots, use Copilot, and automate repetitive workflows with Power Query.",
            "time": "45-60 min",
            "sections": [
                {
                    "name": "4A: Insights & Pivot Tables",
                    "icon": "📊",
                    "time": "15 min",
                    "theory": {
                        "title": "Turning Numbers into Insights",
                        "philosophy": _pages_excerpt(24, 25),
                        "formula": "Ask AI: top 3 insights, best/worst performers, anomalies, and one recommendation. Then ask for a pivot table spec.",
                        "verb": "Analyse",
                        "instruction": "Specify the questions and desired outputs",
                        "constraints": "Must include at least 1 action recommendation",
                        "prompts": [
                            "Identify trends and anomalies in this dataset, then tell me one action I should take.",
                            "Create a pivot table: total Amount by Salesperson for each month. Explain exact steps."
                        ],
                        "benefit": "You get analysis that is faster and more structured, with clear pivots and interpretations.",
                        "tip": "If you paste pivot results into AI, ask it to interpret what changed month-to-month and why."
                    },
                    "lab": {
                        "role": "Excel Analyst",
                        "task": "Give a detailed analysis workflow: metrics to compute, pivot tables to build, and how to interpret the results. Include step-by-step Excel instructions.",
                        "placeholder": "Paste a small table (or pivot output) and tell me the business question you want answered.",
                        "format": "JSON: { 'reply': string }",
                        "module_type": "insights",
                        "extra_controls": None
                    }
                },
                {
                    "name": "4B: Charts & Visualisation",
                    "icon": "📈",
                    "time": "15 min",
                    "theory": {
                        "title": "Charts That Tell the Story",
                        "philosophy": _pages_excerpt(26, 29),
                        "formula": "Ask: which chart type fits my question, how to set it up, and how to label it so the insight is obvious.",
                        "verb": "Visualise",
                        "instruction": "Choose chart type based on question (trend, compare, composition)",
                        "constraints": "Must recommend chart + setup steps",
                        "prompts": [
                            "I have monthly revenue for 12 months. Which chart should I use and how should I format it to show the trend clearly?",
                            "I want to compare sales by property. Which bar chart is best and how do I build it?"
                        ],
                        "benefit": "You get faster charts that communicate insights, not just visuals.",
                        "tip": "Ask AI to also suggest 1 sentence you can put above the chart as the key takeaway."
                    },
                    "lab": {
                        "role": "Data Visualisation Coach",
                        "task": "Recommend the best chart type for the user's data and give exact Excel steps to build it. Include formatting tips and what insight it should highlight.",
                        "placeholder": "Describe your data and what you want to show (trend, comparison, share, distribution).",
                        "format": "JSON: { 'reply': string }",
                        "module_type": "charts",
                        "extra_controls": None
                    }
                },
                {
                    "name": "4C: Copilot & Automation",
                    "icon": "⚙️",
                    "time": "15 min",
                    "theory": {
                        "title": "Copilot, Power Query, and Repeatable Workflows",
                        "philosophy": _pages_excerpt(31, 37) + "\n\n" + _pages_excerpt(48, 50),
                        "formula": "If the task repeats monthly: ask AI for a template + Power Query steps + a prompt library to reuse.",
                        "verb": "Automate",
                        "instruction": "Describe the recurring workflow and ask for a reusable template + automation steps",
                        "constraints": "Must include verification steps and data privacy guidance",
                        "prompts": [
                            "Walk me through setting up Power Query to import and clean my weekly CSV automatically.",
                            "Help me build a reusable report template with formulas, conditional formatting, charts, and a top summary box."
                        ],
                        "benefit": "You build a system: import → clean → analyse → chart → summary, then refresh it in minutes.",
                        "tip": "Do not paste sensitive personal data into public AI tools. Anonymise first, or use Copilot inside Excel if available."
                    },
                    "lab": {
                        "role": "Excel Automation Specialist",
                        "task": "Design an end-to-end automated workflow for the user: import, clean, analyse, chart, and summarise. Include Power Query steps where relevant. Be very detailed.",
                        "placeholder": "Describe the recurring report you make (where the data comes from, how often, and what outputs you need).",
                        "format": "JSON: { 'reply': string }",
                        "module_type": "automation",
                        "extra_controls": None
                    }
                }
            ]
        }
    }

content = build_content_from_pdf()
# =============================================================================
# UI RENDERING
# =============================================================================

def render_theory(section_data):
    theory = section_data['theory']

    st.markdown(f"""
        <div class="pptx-header">
            <div style="display:flex; align-items:center; gap:1rem;">
                <span style="font-size:2rem;">{section_data['icon']}</span>
                <span style="font-weight:900; letter-spacing:0.1em;">{theory['title'].upper()}</span>
            </div>
            <div><span class="time-badge">⏱ {section_data['time']}</span></div>
        </div>
    """, unsafe_allow_html=True)

    col1, col2 = st.columns([7, 5], gap="large")

    with col1:
        st.subheader("Core Philosophy")
        st.write(theory['philosophy'])

        st.markdown(f"""<div class="formula-box">
            <p style="font-size:0.7rem; color:#92400e; font-weight:bold; margin-bottom:0.5rem;">THE FORMULA</p>
            <p style="font-size:0.9rem; margin:0;">{theory['formula']}</p>
        </div>""", unsafe_allow_html=True)

        st.markdown("#### Prompt Anatomy")
        acols = st.columns(3)
        with acols[0]:
            st.markdown(f"""<div class="anatomy-box">
                <p style="font-size:0.6rem; color:#94a3b8; font-weight:bold; margin-bottom:0.5rem;">OPTIMAL VERB</p>
                <p style="font-size:1.1rem; font-weight:900; margin:0;">"{theory['verb']}"</p>
            </div>""", unsafe_allow_html=True)
        with acols[1]:
            st.markdown(f"""<div class="anatomy-box">
                <p style="font-size:0.6rem; color:#94a3b8; font-weight:bold; margin-bottom:0.5rem;">KEY INSTRUCTION</p>
                <p style="font-size:0.7rem; font-weight:bold; margin:0;">{theory['instruction']}</p>
            </div>""", unsafe_allow_html=True)
        with acols[2]:
            st.markdown(f"""<div class="anatomy-box">
                <p style="font-size:0.6rem; color:#94a3b8; font-weight:bold; margin-bottom:0.5rem;">CONSTRAINT</p>
                <p style="font-size:0.7rem; font-weight:bold; margin:0;">{theory['constraints']}</p>
            </div>""", unsafe_allow_html=True)

        st.markdown("<br>#### Example Prompts", unsafe_allow_html=True)
        for p in theory['prompts']:
            st.markdown(f'<div class="prompt-code">{p}</div>', unsafe_allow_html=True)

    with col2:
        st.success(f"**Workplace Strategy**\n\n{theory['benefit']}")

        st.markdown(f"""<div class="tip-box">
            <p style="font-weight:bold; margin-bottom:0.3rem;">Pro Tip</p>
            <p style="margin:0;">{theory['tip']}</p>
        </div>""", unsafe_allow_html=True)

        st.markdown(f"""<div class="mistake-box">
            <p style="font-weight:bold; margin-bottom:0.3rem;">Common Mistakes</p>
            <p style="margin:0;">Accepting without checking | Vague prompts | Mixed data types (text vs number) | Missing blank/error handling | Not iterating to a safer formula</p>
        </div>""", unsafe_allow_html=True)

        if st.button("Launch Interactive Lab", type="primary"):
            st.session_state.mode = 'lab'
            st.rerun()


def render_lab(section_data):
    lab = section_data['lab']

    st.button("Back to Theory", on_click=lambda: setattr(st.session_state, 'mode', 'theory'))
    st.title(f"Lab: {section_data['name']}")

    lcol, rcol = st.columns([1, 1], gap="large")

    with lcol:
        st.caption("1. ASSEMBLE THE PROMPT")
        st.info(f"**Persona:** {lab['role']}")
        st.warning(f"**Task:** {lab['task']}")

        user_input = st.text_area("Context (Raw Content)", placeholder=lab['placeholder'], height=200)

        current_task = lab['task']

        if lab.get('extra_controls') == 'stance':
            stance = st.selectbox("Stance", ["Agree", "Decline", "Negotiate"])
            current_task = f"Rewrite this draft with a stance of '{stance}'. Priority: Maintain relationship while being {stance.lower()}."

        elif lab.get('extra_controls') == 'email_type':
            email_type = st.selectbox("Email Type", [
                "Thank You", "Follow-Up", "Request", "Confirmation",
                "Introduction", "Update", "Apology", "Decline",
                "Invitation", "Reminder", "Inquiry", "Feedback"
            ])
            current_task = f"Generate a complete '{email_type}' email using the details provided."

        elif lab.get('extra_controls') == 'tone_select':
            tone_col1, tone_col2 = st.columns(2)
            with tone_col1:
                primary_tone = st.selectbox("Primary Tone", [
                    "Professional", "Friendly", "Formal", "Casual", "Warm", "Concise"
                ])
            with tone_col2:
                secondary_tone = st.selectbox("Secondary Tone (optional)", [
                    "None", "Empathetic", "Assertive", "Urgent", "Diplomatic",
                    "Apologetic", "Enthusiastic", "Cautious", "Confident"
                ])
            tone_str = primary_tone if secondary_tone == "None" else f"{primary_tone} yet {secondary_tone}"
            current_task = f"Rewrite this email in a '{tone_str}' tone. Keep the core message identical."

        elif lab.get('extra_controls') == 'culture_select':
            culture = st.selectbox("Target Audience", [
                "UK / British", "US / American", "Formal European", "Direct Nordic", "Formal Asian / Japanese"
            ])
            current_task = f"Rewrite this email adapted for a '{culture}' audience. Adjust formality, directness, pleasantries, and sign-off conventions."

        elif lab.get('extra_controls') == 'difficult_type':
            diff_type = st.selectbox("Situation Type", [
                "Delivering Bad News", "Declining a Request", "Chasing Payment", "Saying No to Boss", "Managing Conflict"
            ])
            current_task = f"Draft a professional email for this situation: '{diff_type}'. Be honest, respectful, empathetic, and offer alternatives."

        elif lab.get('extra_controls') == 'followup_urgency':
            urgency = st.selectbox("Follow-up Stage", [
                "First gentle follow-up (3 days)", "Second follow-up (1 week)", "Third/final follow-up (2+ weeks)", "Payment chase"
            ])
            current_task = f"Draft a follow-up email at the '{urgency}' stage. Match the appropriate level of firmness."

        if st.button("Run Lab Test", type="primary", disabled=not user_input):
            with st.spinner("AI Engine Processing..."):
                result = call_gemini(lab['role'], current_task, user_input, lab['format'], lab['module_type'])
                st.session_state.last_result = result

    with rcol:
        st.caption("2. RESULT ANALYSIS")
        if 'last_result' in st.session_state:
            res = st.session_state.last_result
            if "error" in res:
                st.error(res["error"])
            else:
                result_html = ""
                if 'reply' in res:
                    result_html += f"<p>{res['reply']}</p>"
                if 'suggestions' in res:
                    for s in res['suggestions']:
                        result_html += f"<p>* {s}</p>"
                if 'warmth' in res:
                    result_html += f"<p style='font-size:1.5rem; font-weight:bold;'>Warmth: {res['warmth']}%</p>"
                    result_html += f"<p style='font-size:1.5rem; font-weight:bold;'>Professionalism: {res['professionalism']}%</p>"
                    result_html += f"<p style='color:#60a5fa;'>Improvement: {res['improvement']}</p>"
                if 'responseDraft' in res:
                    result_html += f"<h3>Crisis Response</h3><p>{res['responseDraft']}</p>"
                    result_html += "<p style='color:#94a3b8; font-size:0.8rem;'>Insights:</p>"
                    for i in res.get('psychologicalInsights', []):
                        result_html += f"<p>* {i}</p>"
                if 'summary' in res:
                    result_html += f"<h3>Summary</h3><p>{res['summary']}</p>"
                    result_html += "<p style='color:#94a3b8; font-size:0.8rem;'><strong>Action Items:</strong></p>"
                    for a in res.get('actionItems', []):
                        result_html += f"<p>- {a}</p>"
                    result_html += f"<p style='color:#fbbf24;'>Urgency: {res.get('urgency', 'N/A')}</p>"
                if 'proposedSlots' in res:
                    result_html += "<p><strong>Proposed Times:</strong></p>"
                    for t in res['proposedSlots']:
                        result_html += f"<p>- {t}</p>"
                    result_html += f"<p>{res['confirmationMessage']}</p>"

                st.markdown(f'<div class="result-container">{result_html}</div>', unsafe_allow_html=True)
        else:
            st.markdown("""
            <div style="height:400px; display:flex; align-items:center; justify-content:center; color:#94a3b8; border:2px dashed #e2e8f0; border-radius:32px;">
                Waiting for Lab Execution...
            </div>
            """, unsafe_allow_html=True)


# =============================================================================
# MAIN VIEW
# =============================================================================

if st.session_state.view == "Dashboard":
    st.title("Excel & Data Analysis AI Power Suite")
    st.write("Module 4: Stop wrestling with formulas. Let AI do the Excel.")
    st.caption("Total Duration: 2.5 to 3 hours | 4 Parts | 12 Exercises")

    st.divider()

    for key, mod in content.items():
        with st.expander(f"**{mod['module_title']}** - {mod['time']}", expanded=False):
            st.write(mod['module_desc'])
            for i, sec in enumerate(mod['sections']):
                st.write(f"{sec['icon']} **{sec['name']}** - {sec['time']}")

    st.divider()

    st.markdown("""
    ### How This Works
    Each part has **3 sections** with theory + a hands-on AI lab. Work through them in order:

    **Part 1 - Foundations**: why data work is a time sink, what AI can do, and how to write prompts that avoid errors.

    **Part 2 - Formulas & Functions**: write any formula in plain English, cover the common patterns, then fix errors fast.

    **Part 3 - Data Cleaning**: standardise names, dates, currency, remove mess, and transform columns safely.

    **Part 4 - Analysis, Charts & Automation**: pivots, insights, charts, Copilot prompts, and repeatable workflows with Power Query.
    """)

    st.divider()
    st.markdown("### Common AI Data Mistakes to Avoid")
    mistakes = [
        ("Accepting Without Checking", "Test AI formulas on 2-3 rows before filling down"),
        ("Vague Prompts", "Specify columns, criteria, and what to do if blank or not found"),
        ("Mixed Data Types", "Numbers stored as text and extra spaces break lookups and maths"),
        ("Not Iterating", "Tell AI what’s wrong and ask for a safer formula or alternative"),
        ("Sharing Sensitive Data", "Anonymise personal/client info before pasting into public tools"),
        ("Skipping a Checklist", "Use a repeatable clean → analyse → chart → summary workflow")
    ]
    mcols = st.columns(3)
    for i, (title, desc) in enumerate(mistakes):
        with mcols[i % 3]:
            st.markdown(f"""<div class="mistake-box">
                <p style="font-weight:bold; margin-bottom:0.2rem;">{title}</p>
                <p style="margin:0; font-size:0.85rem;">{desc}</p>
            </div>""", unsafe_allow_html=True)

else:
    mod = content[st.session_state.view]
    sections = mod['sections']

    st.markdown(f"### {mod['module_title']}")
    st.caption(f"{mod['time']} | {mod['module_desc']}")

    sec_cols = st.columns(len(sections))
    for i, sec in enumerate(sections):
        with sec_cols[i]:
            is_active = st.session_state.section == i
            if st.button(
                f"{sec['icon']} {sec['name']}\n{sec['time']}",
                key=f"sec_{i}",
                type="primary" if is_active else "secondary"
            ):
                st.session_state.section = i
                st.session_state.mode = 'theory'
                if 'last_result' in st.session_state:
                    del st.session_state.last_result
                st.rerun()

    st.divider()

    current_section = sections[st.session_state.section]

    if st.session_state.mode == 'theory':
        render_theory(current_section)
    else:
        render_lab(current_section)