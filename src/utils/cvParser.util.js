import pdfParse from 'pdf-parse';

export const parseResume = async (fileBuffer) => {
  try {
    // grab raw text from the pdf
    const data = await pdfParse(fileBuffer);
    const text = data.text;

    // quick regex to catch the email if it's in the doc
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
    const emailsFound = text.match(emailRegex);
    const email = emailsFound ? emailsFound[0] : null;

    // basic skill matching for the mvp. we can make this smarter in phase 3.
    const techDictionary = [
      'javascript', 'python', 'java', 'react', 'node.js', 'mongodb', 
      'sql', 'express.js', 'typescript', 'aws', 'docker', 'git', 'html', 'css'
    ];
    
    const extractedSkills = techDictionary.filter(skill => 
      text.toLowerCase().includes(skill)
    );

    return {
      email,
      skills: extractedSkills,
      rawText: text // keeping this just in case we need to debug parsing later
    };
  } catch (error) {
    console.error("pdf parsing crashed:", error);
   throw new Error('Failed to read the resume file', { cause: error });
  }
};