
import { GoogleGenAI, Type } from "@google/genai";
import * as T from "../types";

const API_KEY = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey: API_KEY });
const MODEL_NAME = 'gemini-3-flash-preview';

const getBlueprint = (role: string, task: string, context: string, format: string): T.PromptBlueprint => ({
  role, task, context, format,
  fullPromptTemplate: `Role: ${role}\nTask: ${task}\nContext: ${context}\nFormat: ${format}`
});

// --- Module 1: Drafting ---
export const useReplyWizard = async (incoming: string, stance: T.ReplyStance): Promise<T.ReplyWizardResult> => {
  const role = "Expert Professional Communicator";
  const task = `Draft a concise email reply with a stance of: ${stance}.`;
  const context = `The user is replying to: "${incoming}"`;
  const format = "A JSON object containing the 'reply' string.";

  if (!API_KEY) return { 
    reply: `Simulation: Replying to the request with an ${stance} stance. "I've reviewed your request and I'm happy to ${stance.toLowerCase()}..."`,
    blueprint: getBlueprint(role, task, context, format)
  };

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `${role}. ${task}. ${context}. Respond in this format: ${format}`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { reply: { type: Type.STRING } }, required: ["reply"] } },
  });
  return { ...JSON.parse(response.text || "{}"), blueprint: getBlueprint(role, task, context, format) };
};

export const generateSubjectLines = async (content: string): Promise<T.SubjectLineResult> => {
  const role = "Email Marketing Strategist";
  const task = "Generate 5 high-open-rate subject lines.";
  const context = `Based on this email body: "${content}"`;
  const format = "JSON object with 'suggestions' array.";

  if (!API_KEY) return { 
    suggestions: ["Urgent: Update Needed", "Follow-up on Project", "Quick question?", "Draft Proposal", "Meeting Sync"],
    blueprint: getBlueprint(role, task, context, format)
  };

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `${role}. ${task}. ${context}. Format: ${format}`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { suggestions: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["suggestions"] } },
  });
  return { ...JSON.parse(response.text || "{}"), blueprint: getBlueprint(role, task, context, format) };
};

export const summarizeEmail = async (content: string): Promise<T.SummarizerResult> => {
  const role = "Executive Assistant";
  const task = "Extract a TL;DR summary and the single most critical action item.";
  const context = `Analyze this thread: "${content}"`;
  const format = "JSON object with 'summary' and 'actionItem'.";

  if (!API_KEY) return { 
    summary: "Discussion regarding Q4 budget cuts.", actionItem: "Confirm final numbers by Friday.",
    blueprint: getBlueprint(role, task, context, format)
  };

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `${role}. ${task}. ${context}. Format: ${format}`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { summary: { type: Type.STRING }, actionItem: { type: Type.STRING } }, required: ["summary", "actionItem"] } },
  });
  return { ...JSON.parse(response.text || "{}"), blueprint: getBlueprint(role, task, context, format) };
};

// --- Module 2: Tone ---
export const analyzeTone = async (text: string): Promise<T.ToneAnalysis> => {
  const role = "Linguistic Psychologist";
  const task = "Score the email on Warmth and Professionalism (0-100).";
  const context = `Target text: "${text}"`;
  const format = "JSON with 'warmth', 'professionalism', 'improvement'.";

  if (!API_KEY) return { 
    warmth: 60, professionalism: 85, improvement: "Add a greeting.",
    blueprint: getBlueprint(role, task, context, format)
  };

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `${role}. ${task}. ${context}. Format: ${format}`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { warmth: { type: Type.NUMBER }, professionalism: { type: Type.NUMBER }, improvement: { type: Type.STRING } }, required: ["warmth", "professionalism", "improvement"] } },
  });
  return { ...JSON.parse(response.text || "{}"), blueprint: getBlueprint(role, task, context, format) };
};

export const rewriteForEmpathy = async (text: string): Promise<T.RewriteResult> => {
  const role = "Empathy Coach";
  const task = "Rewrite text to be warmer while staying professional.";
  const context = `Original text: "${text}"`;
  const format = "JSON with 'output' string.";

  if (!API_KEY) return { output: "I really appreciate your patience while we work on this...", blueprint: getBlueprint(role, task, context, format) };

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `${role}. ${task}. ${context}. Format: ${format}`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { output: { type: Type.STRING } }, required: ["output"] } },
  });
  return { ...JSON.parse(response.text || "{}"), blueprint: getBlueprint(role, task, context, format) };
};

export const checkClarity = async (text: string): Promise<T.ClarityResult> => {
  const role = "Plain Language Editor";
  const task = "Identify corporate jargon and provide simpler alternatives.";
  const context = `Text: "${text}"`;
  const format = "JSON with 'jargonFound' array and 'readabilityScore'.";

  if (!API_KEY) return { 
    jargonFound: [{ original: "Leverage", simpler: "Use" }], readabilityScore: 70,
    blueprint: getBlueprint(role, task, context, format)
  };

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `${role}. ${task}. ${context}. Format: ${format}`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { jargonFound: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { original: { type: Type.STRING }, simpler: { type: Type.STRING } } } }, readabilityScore: { type: Type.NUMBER } }, required: ["jargonFound", "readabilityScore"] } },
  });
  return { ...JSON.parse(response.text || "{}"), blueprint: getBlueprint(role, task, context, format) };
};

// --- Module 3: Crisis ---
export const generateCrisisShield = async (contextText: string): Promise<T.CrisisAnalysis> => {
  const role = "Conflict Resolution Specialist";
  const task = "Analyze psychological triggers and draft a de-escalation reply.";
  const context = `Angry email: "${contextText}"`;
  const format = "JSON with 'psychologicalInsights' array and 'responseDraft'.";

  if (!API_KEY) return { 
    psychologicalInsights: ["Feels unheard", "Anxious about money"], responseDraft: "I hear you...",
    blueprint: getBlueprint(role, task, context, format)
  };

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `${role}. ${task}. ${context}. Format: ${format}`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { psychologicalInsights: { type: Type.ARRAY, items: { type: Type.STRING } }, responseDraft: { type: Type.STRING } }, required: ["psychologicalInsights", "responseDraft"] } },
  });
  return { ...JSON.parse(response.text || "{}"), blueprint: getBlueprint(role, task, context, format) };
};

export const detectEscalation = async (text: string): Promise<T.EscalationResult> => {
  const role = "Legal Risk Analyst";
  const task = "Assign risk level and identify linguistic triggers for escalation.";
  const context = `Text: "${text}"`;
  const format = "JSON with 'riskLevel', 'triggers', 'advice'.";

  if (!API_KEY) return { 
    riskLevel: 'Medium', triggers: ["Legal action mention"], advice: "Involve a manager.",
    blueprint: getBlueprint(role, task, context, format)
  };

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `${role}. ${task}. ${context}. Format: ${format}`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { riskLevel: { type: Type.STRING }, triggers: { type: Type.ARRAY, items: { type: Type.STRING } }, advice: { type: Type.STRING } }, required: ["riskLevel", "triggers", "advice"] } },
  });
  return { ...JSON.parse(response.text || "{}"), blueprint: getBlueprint(role, task, context, format) };
};

export const analyzeRootCause = async (text: string): Promise<T.RootCauseResult> => {
  const role = "Operations Consultant";
  const task = "Identify structural business failures causing this complaint.";
  const context = `Complaint: "${text}"`;
  const format = "JSON with 'causes' array and 'structuralFix'.";

  if (!API_KEY) return { 
    causes: ["Communication lag"], structuralFix: "Hire a VA.",
    blueprint: getBlueprint(role, task, context, format)
  };

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `${role}. ${task}. ${context}. Format: ${format}`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { causes: { type: Type.ARRAY, items: { type: Type.STRING } }, structuralFix: { type: Type.STRING } }, required: ["causes", "structuralFix"] } },
  });
  return { ...JSON.parse(response.text || "{}"), blueprint: getBlueprint(role, task, context, format) };
};

// --- Module 4: Admin ---
export const scheduleMeeting = async (thread: string): Promise<T.MeetingExtraction> => {
  const role = "Professional Scheduler";
  const task = "Extract proposed slots and write a summary.";
  const context = `Thread: "${thread}"`;
  const format = "JSON with 'proposedSlots' and 'confirmationMessage'.";

  if (!API_KEY) return { 
    proposedSlots: ["Tuesday 3pm"], confirmationMessage: "See you Tuesday.",
    blueprint: getBlueprint(role, task, context, format)
  };

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `${role}. ${task}. ${context}. Format: ${format}`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { proposedSlots: { type: Type.ARRAY, items: { type: Type.STRING } }, confirmationMessage: { type: Type.STRING } }, required: ["proposedSlots", "confirmationMessage"] } },
  });
  return { ...JSON.parse(response.text || "{}"), blueprint: getBlueprint(role, task, context, format) };
};

export const extractTasks = async (thread: string): Promise<T.TaskExtraction> => {
  const role = "Project Manager";
  const task = "Extract task list and prioritize them.";
  const context = `Thread: "${thread}"`;
  const format = "JSON with 'tasks' array (task, priority).";

  if (!API_KEY) return { 
    tasks: [{ task: "Send link", priority: "High" }],
    blueprint: getBlueprint(role, task, context, format)
  };

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `${role}. ${task}. ${context}. Format: ${format}`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { tasks: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { task: { type: Type.STRING }, priority: { type: Type.STRING } } } } }, required: ["tasks"] } },
  });
  return { ...JSON.parse(response.text || "{}"), blueprint: getBlueprint(role, task, context, format) };
};

export const craftOOO = async (contextText: string): Promise<T.OOOResult> => {
  const role = "Corporate Communications Manager";
  const task = "Draft a professional OOO auto-responder.";
  const context = `Context: "${contextText}"`;
  const format = "JSON with 'message'.";

  if (!API_KEY) return { 
    message: "I am out of office...",
    blueprint: getBlueprint(role, task, context, format)
  };

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `${role}. ${task}. ${context}. Format: ${format}`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { message: { type: Type.STRING } }, required: ["message"] } },
  });
  return { ...JSON.parse(response.text || "{}"), blueprint: getBlueprint(role, task, context, format) };
};
