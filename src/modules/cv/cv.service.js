import Groq from "groq-sdk";
import pdfParse from "pdf-parse-new";
import { uploadToCloudinary } from "../../utils/cloudinary.js";
import Profile from "../../models/profile.model.js";
import { GROQ_API_KEY } from "../../config/env.js";
 
// Lazy initialization — only created when parseCV is actually called
// Prevents CI crashes when GROQ_API_KEY is not set in test environment
let groqClient;
const getGroqClient = () => {
  if (!groqClient) {
    groqClient = new Groq({ apiKey: GROQ_API_KEY });
  }
  return groqClient;
};
 
// ── Upload CV to Cloudinary ─────────────────────────────────────
export const uploadCV = async (userId, fileBuffer, mimetype) => {
  const result = await uploadToCloudinary(fileBuffer, mimetype, {
    folder: "hire-dey-go/cvs",
    resource_type: "raw",
    public_id: `cv_${userId}_${Date.now()}`,
    format: "pdf",
  });
 
  let profile = await Profile.findOne({ userId });
  if (profile) {
    profile.resumeUrl = result.secure_url;
    await profile.save();
  } else {
    await Profile.create({ userId, resumeUrl: result.secure_url });
  }
 
  return { resumeUrl: result.secure_url };
};
 
// ── Extract text from PDF buffer ────────────────────────────────
const extractTextFromPDF = async (buffer) => {
  const data = await pdfParse(buffer);
  return data.text;
};
 
// ── Parse CV with Groq API ────────────────────────────────────
export const parseCV = async (userId, fileBuffer) => {
  const rawText = await extractTextFromPDF(fileBuffer);
 
  if (!rawText || rawText.trim().length < 50) {
    const err = new Error("Could not extract text from CV. Please ensure it is not a scanned image.");
    err.statusCode = 422;
    throw err;
  }
 
  const prompt = `You are a CV parser. Extract structured data from the following CV text and return ONLY a valid JSON object with no markdown, no backticks, no explanation.
 
The JSON must follow this exact structure:
{
  "firstName": "string or null",
  "lastName": "string or null",
  "email": "string or null",
  "phone": "string or null",
  "location": "string or null",
  "bio": "string (2-3 sentence professional summary) or null",
  "skills": ["array", "of", "skill", "strings"],
  "experience": [
    {
      "title": "string",
      "company": "string",
      "location": "string or null",
      "from": "YYYY-MM-DD or null",
      "to": "YYYY-MM-DD or null",
      "current": false,
      "description": "string or null"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "fieldOfStudy": "string or null",
      "from": "YYYY-MM-DD or null",
      "to": "YYYY-MM-DD or null",
      "current": false,
      "description": "string or null"
    }
  ]
}
 
CV Text:
${rawText.slice(0, 8000)}`;
 
  const completion = await getGroqClient().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2000,
    temperature: 0.2,
  });
 
  const responseText = completion.choices[0].message.content.trim();
 
  const cleaned = responseText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/, "")
    .trim();
 
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const err = new Error("Failed to parse CV data from AI response");
    err.statusCode = 500;
    throw err;
  }
 
  let profile = await Profile.findOne({ userId });
  if (profile) {
    profile.parsedResume = parsed;
    await profile.save();
  } else {
    await Profile.create({ userId, parsedResume: parsed });
  }
 
  return parsed;
};
 
// ── Apply parsed CV data to profile ────────────────────────────
export const applyParsedCV = async (userId) => {
  const profile = await Profile.findOne({ userId });
 
  if (!profile) {
    const err = new Error("No profile found");
    err.statusCode = 404;
    throw err;
  }
 
  if (!profile.parsedResume) {
    const err = new Error("No parsed CV data found. Please parse a CV first.");
    err.statusCode = 400;
    throw err;
  }
 
  const parsed = profile.parsedResume;
 
  if (parsed.firstName && !profile.firstName) profile.firstName = parsed.firstName;
  if (parsed.lastName && !profile.lastName) profile.lastName = parsed.lastName;
  if (parsed.phone && !profile.phone) profile.phone = parsed.phone;
  if (parsed.location && !profile.location) profile.location = parsed.location;
  if (parsed.bio && !profile.bio) profile.bio = parsed.bio;
 
  if (parsed.skills?.length) {
    const existing = new Set(profile.skills.map((s) => s.toLowerCase()));
    const newSkills = parsed.skills.filter((s) => !existing.has(s.toLowerCase()));
    profile.skills = [...profile.skills, ...newSkills];
  }
 
  if (parsed.experience?.length) {
    profile.experience = [...profile.experience, ...parsed.experience];
  }
 
  if (parsed.education?.length) {
    profile.education = [...profile.education, ...parsed.education];
  }
 
  profile.parsedResume = null;
  await profile.save();
 
  return profile;
};
 