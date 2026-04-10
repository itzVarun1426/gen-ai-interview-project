import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


const interviewReportSchema = z.object({
  matchscore: z.number().min(0).max(100).int(),

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

      //  remove null / undefined
      if (!item) return null;

      // 🔹 STRING CASE
      if (typeof item === "string") {

        //  TRY JSON PARSE FIRST (FIXED ORDER)
        try {
          const parsedItem = JSON.parse(item);

          if (type === "skill" && parsedItem.skill) {
            return {
              skill: parsedItem.skill,
              severity: ["low", "medium", "high"].includes(parsedItem.severity)
                ? parsedItem.severity
                : "medium",
            };
          }

          item = parsedItem;

        } catch {

          //  HANDLE "skill:React" ONLY IF NOT JSON
          if (type === "skill" && item.includes(":") && !item.includes("{")) {
            const [key, value] = item.split(":");

            if (key.toLowerCase().includes("skill")) {
              return { skill: value.trim(), severity: "medium" };
            }
            if (key.toLowerCase().includes("severity")) {
              return null;
            }
          }

          //  QUESTION STRING → CONVERT TO OBJECT
          if (type === "question") {
            return {
              question: item,
              intention: "Assess understanding and problem-solving ability",
              answer: "Explain the concept clearly, describe your approach step-by-step, include examples, and justify your reasoning."
            };
          }

          if (type === "skill") {
            return {
              skill: item,
              severity: "medium",
            };
          }

          if (type === "plan") {
            return {
              day: index + 1,
              focused_topic: item,
              task: ["Revise topic", "Practice problems"],
            };
          }
        }
      }

      //  NUMBER CASE
      if (typeof item === "number") {
        return {
          day: item,
          focused_topic: "General Preparation",
          task: ["Revise concepts", "Practice problems"],
        };
      }

      //  OBJECT CASE
      if (typeof item === "object") {

        //  CLEAN INVALID KEYS
        const cleanItem = {};
        for (let key in item) {
          if (key !== "null" && item[key] !== null && item[key] !== undefined) {
            cleanItem[key] = item[key];
          }
        }

        //  QUESTION FIX
        if (type === "question") {
          return {
            question:
              typeof cleanItem.question === "string" && cleanItem.question.trim()
                ? cleanItem.question
                : "Explain a technical concept",

            intention:
              typeof cleanItem.intention === "string" && cleanItem.intention.trim()
                ? cleanItem.intention
                : "Assess understanding",

            answer:
              typeof cleanItem.answer === "string" && cleanItem.answer.trim()
                ? cleanItem.answer
                : "Explain the concept clearly, describe your approach, include examples, and justify your solution.",
          };
        }

        //  SKILL FIX
        if (type === "skill") {
          return {
            skill:
              typeof cleanItem.skill === "string" && cleanItem.skill.trim()
                ? cleanItem.skill
                : "General Skill",

            severity:
              ["low", "medium", "high"].includes(cleanItem.severity)
                ? cleanItem.severity
                : "medium",
          };
        }

        //  PLAN FIX
        if (type === "plan") {
          let topic = cleanItem.focused_topic;

          // HANDLE STRINGIFIED JSON
          if (typeof topic === "string" && topic.includes('"task"')) {
            try {
              const cleaned = topic.trim().startsWith("{") ? topic : `{${topic}}`;
              const extracted = JSON.parse(cleaned);

              return {
                day: extracted.day || cleanItem.day || index + 1,
                focused_topic: extracted.focused_topic || "General Topic",
                task: Array.isArray(extracted.task)
                  ? extracted.task
                  : ["Revise topic", "Practice questions"],
              };
            } catch {}
          }

          return {
            day:
              typeof cleanItem.day === "number"
                ? cleanItem.day
                : index + 1,

            focused_topic:
              typeof cleanItem.focused_topic === "string" && cleanItem.focused_topic.trim()
                ? cleanItem.focused_topic
                : "General Topic",

            task:
              Array.isArray(cleanItem.task) && cleanItem.task.length
                ? cleanItem.task
                : ["Revise topic", "Practice questions"],
          };
        }
      }

      return null;
    })
    .filter(Boolean);
}


async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  try {
    const prompt = `
You are a highly experienced technical interviewer and career coach.

STRICT RULES (FOLLOW EXACTLY):

1. Return ONLY valid JSON (no explanation, no markdown)
2. DO NOT return arrays of strings
3. DO NOT skip any field
4. EVERY question MUST be an object with:
   - question
   - intention
   - answer
5. The "answer" MUST be DETAILED (minimum 2-3 lines)
6. DO NOT leave answer empty or generic
7. DO NOT shorten output

WRONG ❌:
"technicalQuestions": ["question1", "question2"]

WRONG ❌:
{ "question": "...", "intention": "..." }

CORRECT ✅:
{
  "question": "...",
  "intention": "...",
  "answer": "Detailed explanation with approach, examples, and reasoning"
}

REQUIREMENTS:

- EXACTLY 8 technical questions
- EXACTLY 8 behavioral questions
- Behavioral answers MUST follow STAR method:
  Situation → Task → Action → Result
-title is a single liner short title for this report to be shown to user 

FINAL OUTPUT FORMAT:

{
  "matchscore": number,
  "technicalQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "behavioralQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "skillsGaps": [
    {
      "skill": string,
      "severity": "low" | "medium" | "high"
    }
  ],
  "preparationPlan": [
    {
      "day": number,
      "focused_topic": string,
      "task": string[]
    }
  ],
  "title": string
}

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      // model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(interviewReportSchema),
      },
    });

    let parsed = JSON.parse(
      response.text.replace(/```json|```/g, "").trim()
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
    // console.log(" DATA before fixing:", parsed);

 
    parsed.technicalQuestions = fixArray(parsed.technicalQuestions, "question").slice(0, 10);
    parsed.behavioralQuestions = fixArray(parsed.behavioralQuestions, "question").slice(0, 10);
    parsed.skillsGaps = fixArray(parsed.skillsGaps, "skill");
    parsed.preparationPlan = fixArray(parsed.preparationPlan, "plan").slice(0, 7);


    if (!parsed.matchscore || typeof parsed.matchscore !== "number") {
      parsed.matchscore = 70;
    }

    // console.log("FINAL CLEAN DATA:", parsed);

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

export { generateInterviewReport };