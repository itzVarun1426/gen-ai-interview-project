import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const GeminiModel = "gemini-2.5-flash-lite";

const interviewReportSchema = z.object({
  matchScore: z.number().min(0).max(100).int(),

  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    }).strict()
  ).min(1).max(10),

  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    }).strict()
  ).min(1).max(10),

  skillsGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    }).strict()
  ).min(1),

  preparationPlan: z.array(
    z.object({
      day: z.number().int(),
      focused_topic: z.string(),
      task: z.array(z.string()),
    }).strict()
  ).min(1).max(7),

  title: z.string().describe("it representes one liner about the whole report to be showed to the user")

}).strict();


function fixArray(arr, type) {
  if (!Array.isArray(arr)) return [];

  return arr
    .map((item, index) => {
      if (item === null || item === undefined) return null;

      if (typeof item === "string" && item.trim().startsWith("{")) {
        try {
          const parsed = JSON.parse(item);
          if (typeof parsed === "object" && parsed !== null) {
            item = parsed;
          }
        } catch (e) { }
      }

      if (type === "question") {
        let question = "Contextual question missing";
        let intention = "N/A - Context Missing. The AI unfortunately skipped providing an interviewer intent.";
        let answer = "N/A - Context Missing. The AI unfortunately skipped providing a suggested answer strategy for this question.";

        if (typeof item === "string") {
          question = item;
        } else if (typeof item === "object") {
          if (typeof item.question === "string" && item.question.trim()) question = item.question;
          if (typeof item.intention === "string" && item.intention.trim()) intention = item.intention;
          if (typeof item.answer === "string" && item.answer.trim()) answer = item.answer;
        }
        return { question, intention, answer };
      }

      if (type === "skill") {
        let skill = "General Skill";
        let severity = "medium";

        if (typeof item === "string") {
          skill = item.includes(":") ? item.split(":")[0].trim() : item;
        } else if (typeof item === "object") {
          if (typeof item.skill === "string" && item.skill.trim()) skill = item.skill;
          if (["low", "medium", "high"].includes(item.severity)) severity = item.severity;
        }
        return { skill, severity };
      }

      if (type === "plan") {
        let day = index + 1;
        let focused_topic = "General Topic";
        let task = ["Revise topic", "Practice questions"];

        if (typeof item === "number") {
          day = item;
        } else if (typeof item === "string") {
          focused_topic = item;
        } else if (typeof item === "object") {
          if (typeof item.day === "number") day = item.day;
          else if (typeof item.day === "string" && !isNaN(parseInt(item.day))) day = parseInt(item.day);

          if (typeof item.focused_topic === "string" && item.focused_topic.trim()) focused_topic = item.focused_topic;

          if (Array.isArray(item.task) && item.task.length > 0) {
            const stringTasks = item.task.filter(t => typeof t === "string");
            if (stringTasks.length > 0) task = stringTasks;
          }
        }

        day = isNaN(day) ? index + 1 : Math.floor(day); // Required for Zod Int parsing
        return { day, focused_topic, task };
      }

      return null;
    })
    .filter(Boolean);
}


async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  try {
    const prompt = `
You are a highly experienced technical interviewer and career coach.

STRICT INSTRUCTIONS:
1. Return ONLY valid JSON structured precisely according to the Schema.
2. "technicalQuestions" MUST contain 6 distinct technical question objects.
3. "behavioralQuestions" MUST contain 6 distinct behavioral/situational question objects.
4. "skillsGaps" and "preparationPlan" must be fully populated (max 7 days plan).
5. Provide high quality, detailed paragraphs for all "answer" and "intention" fields.

Below is the EXACT JSON format your response must follow. Do not deviate from this shape:
{
  "matchScore": 85,
  "title": "Software Developer Intern Evaluation",
  "technicalQuestions": [
    {
      "question": "How does Node.js handle async operations?",
      "intention": "Assess understanding of the event loop.",
      "answer": "Explain the call stack, web APIs, and callback queue."
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Tell me about a time you optimized slow code.",
      "intention": "Test practical optimization experience.",
      "answer": "Candidate should share a STAR method story."
    }
  ],
  "skillsGaps": [
    {
      "skill": "Docker",
      "severity": "medium"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focused_topic": "Node Basics",
      "task": ["Review Event Loop", "Build simple API"]
    }
  ]
}

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

    const response = await genai.models.generateContent({
      model: GeminiModel,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    });
    console.log("AI RESPONSE:", response.text);

    const responseText = response.text;

    let parsed = JSON.parse(
      responseText.replace(/```json|```/g, "").trim()
    );


    delete parsed.feedbackSummary;
    delete parsed.strengths;
    delete parsed.areasForImprovement;


    if (!Array.isArray(parsed.preparationPlan)) {
      if (parsed.preparationPlan && typeof parsed.preparationPlan === "object") {
        parsed.preparationPlan = [parsed.preparationPlan];
      } else {
        parsed.preparationPlan = [];
      }
    }


    parsed.technicalQuestions = fixArray(parsed.technicalQuestions, "question").slice(0, 10);
    parsed.behavioralQuestions = fixArray(parsed.behavioralQuestions, "question").slice(0, 10);
    parsed.skillsGaps = fixArray(parsed.skillsGaps, "skill");
    parsed.preparationPlan = fixArray(parsed.preparationPlan, "plan").slice(0, 7);

    // Provide fallback for matchScore if model misses it
    if (!parsed.matchScore || typeof parsed.matchScore !== "number") {
      // Fallback: check if the model used lowercase matchscore
      if (parsed.matchscore && typeof parsed.matchscore === "number") {
        parsed.matchScore = parsed.matchscore;
        delete parsed.matchscore;
      } else {
        parsed.matchScore = 70;
      }
    }

    const result = interviewReportSchema.safeParse(parsed);

    if (!result.success) {
      console.error("ZOD ERROR:", result.error);
      return null;
    }


    return result.data;

  } catch (error) {
    console.error("❌ Error:", error.message);
    return null;
  }
}

export { generateInterviewReport, evaluateAnswer };

async function evaluateAnswer({ question, intention, modelAnswer, userAnswer, audioBase64, mimeType }) {
  try {
    const prompt = `
You are an expert technical interviewer. Evaluate the candidate's answer to the following question.

Question: ${question}
Interviewer Intention: ${intention}
Ideal Model Answer: ${modelAnswer}

Candidate's Provided Answer (Text): ${userAnswer || "No text provided, please transcribe from audio if available."}

STRICT INSTRUCTIONS:
1. If audio is provided, prioritize transcribing it accurately.
2. Evaluate the answer based on technical accuracy, clarity, and the interviewer's intent.
3. Return ONLY valid JSON in this format:
{
  "userAnswer": "The full transcription of what the user said (or the text provided)",
  "score": 0-100,
  "improvements": ["Specific area to improve", "Another point"],
  "drawbacks": ["What was missing or incorrect"]
}
`;

    const parts = [{ text: prompt }];
    if (audioBase64 && mimeType) {
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: audioBase64
        }
      });
    }

    const response = await genai.models.generateContent({
      model: GeminiModel,
      contents: [{ role: "user", parts }],
      config: {
        responseMimeType: "application/json",
      },
    });

    console.log("EVALUATION AI RESPONSE:", response.text);
    return JSON.parse(response.text.replace(/```json|```/g, "").trim());
  } catch (error) {
    console.error("Evaluation AI Error:", error);
    return {
      userAnswer: userAnswer || "Error transcribing answer",
      score: 50,
      improvements: ["Check your internet connection", "Ensure mic quality is good"],
      drawbacks: ["AI evaluation failed"]
    };
  }
}
