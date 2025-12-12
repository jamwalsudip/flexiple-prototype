/// <reference types="vite/client" />
import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// OpenAI's SDK blocks browser use unless explicitly allowed.
const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true,
});

const ensureApiKey = () => {
  if (!apiKey) {
    throw new Error("Missing OpenAI API key (VITE_OPENAI_API_KEY).");
  }
};

// Dynamically load PDF.js from CDN
let pdfjsLib: any = null;
const loadPdfJs = async () => {
  if (pdfjsLib) return pdfjsLib;
  
  // Load pdf.js from CDN
  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  document.head.appendChild(script);
  
  await new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = reject;
  });
  
  pdfjsLib = (window as any).pdfjsLib;
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  
  return pdfjsLib;
};

// Extract text from PDF using pdf.js
const extractTextFromPDF = async (base64Data: string): Promise<string> => {
  const pdfjs = await loadPdfJs();
  
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const pdf = await pdfjs.getDocument({ data: bytes }).promise;
  let fullText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");
    fullText += pageText + "\n";
  }

  return fullText.trim();
};

export const generateJobDescription = async (
  title: string,
  skills: string[],
  expRange: string,
  location: string
): Promise<string> => {
  ensureApiKey();

  const prompt = `You are a professional job description writer. Write a concise, engaging job description for a ${title} role.

Details:
- Skills: ${skills.join(", ")}
- Experience: ${expRange}
- Location: ${location || "Remote"}

Format in Markdown with:
1) Role Summary
2) Key Responsibilities
3) Requirements
4) Why Join Us (generic placeholder)`;

  const response = await openai.responses.create({
    model: "gpt-5.1",
    input: prompt,
    reasoning: {
      effort: "medium",
    },
  });

  return response.output_text?.trim() || "Could not generate description.";
};

export const parseResumeWithOpenAI = async (
  base64Data: string,
  mimeType: string
): Promise<any> => {
  ensureApiKey();

  const systemPrompt = `You are an expert HR resume parser. Analyze the resume content and extract information into a JSON object.

REQUIRED JSON STRUCTURE:
{
  "fullName": "string - candidate's full name from header/contact block",
  "role": "string - current or most recent job title",
  "skills": ["string array - technical and professional skills, infer from experience if not explicitly listed"],
  "yearsExperience": "number - total years calculated from work experience dates",
  "location": "string - city, state/country",
  "summary": "string - 2-4 sentence professional summary, generate if not present",
  "email": "string - email address",
  "phone": "string - phone number in original format",
  "linkedinUrl": "string - LinkedIn URL if present",
  "experience": [
    {
      "company": "string - company name",
      "role": "string - job title",
      "startDate": "string - start year or month/year",
      "endDate": "string - end year or 'Present'",
      "description": ["string array - bullet points describing responsibilities/achievements"]
    }
  ],
  "education": [
    {
      "institution": "string - school/university name",
      "degree": "string - degree name and field",
      "startDate": "string - start year",
      "endDate": "string - end year"
    }
  ]
}

RULES:
- Extract ALL work experience entries, not just the most recent
- Extract ALL education entries
- For yearsExperience, calculate total from earliest job to latest (or present)
- Each experience entry MUST have a description array with at least one bullet point
- Leave fields as empty strings "" if not found (not null)
- Return empty arrays [] for experience/education if none found
- Return ONLY the JSON object, no additional text`;

  let inputContent: any;

  // Handle different file types
  if (mimeType === "application/pdf") {
    // Extract text from PDF
    const pdfText = await extractTextFromPDF(base64Data);
    console.log("Extracted PDF text:", pdfText.substring(0, 500) + "...");
    
    inputContent = `${systemPrompt}\n\nParse this resume text and extract the information:\n\n${pdfText}`;
  } else if (mimeType.startsWith("image/")) {
    // Use vision capability with image input
    inputContent = [
      { type: "input_text", text: `${systemPrompt}\n\nParse this resume image and extract all information:` },
      {
        type: "input_image",
        image_url: `data:${mimeType};base64,${base64Data}`,
      },
    ];
  } else {
    throw new Error(`Unsupported file type: ${mimeType}. Please upload a PDF or image.`);
  }

  const response = await openai.responses.create({
    model: "gpt-5.1",
    input: inputContent,
    reasoning: {
      effort: "medium",
    },
    text: {
      format: {
        type: "json_object",
      },
    },
  });

  const content = response.output_text;
  if (!content) throw new Error("No response from OpenAI.");

  const parsed = JSON.parse(content);
  console.log("Parsed resume data:", parsed);

  // Ensure arrays exist and have proper structure
  // Cap skills to maximum 10 (most important ones from the API)
  const allSkills = Array.isArray(parsed.skills) ? parsed.skills : [];
  return {
    ...parsed,
    skills: allSkills.slice(0, 10),
    yearsExperience: typeof parsed.yearsExperience === "number" ? parsed.yearsExperience : 0,
    experience: Array.isArray(parsed.experience) ? parsed.experience.map((exp: any) => ({
      company: exp.company || "",
      role: exp.role || "",
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      description: Array.isArray(exp.description) ? exp.description : [],
    })) : [],
    education: Array.isArray(parsed.education) ? parsed.education.map((edu: any) => ({
      institution: edu.institution || "",
      degree: edu.degree || "",
      startDate: edu.startDate || "",
      endDate: edu.endDate || "",
    })) : [],
  };
};
