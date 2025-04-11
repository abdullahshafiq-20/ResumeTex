import Prompt from "../models/promptSchema.js";
import NodeCache from 'node-cache';

const promptCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

export const getPrompt = async (name) => {
  // Check cache first
  const cachedPrompt = promptCache.get(name);
  if (cachedPrompt) return cachedPrompt;
  
  const prompt = await Prompt.findOne({ name, isActive: true })
    .sort({ version: -1 })
    .exec();
  
  if (!prompt) {
    throw new Error(`Prompt template "${name}" not found`);
  }
  
  // Store in cache and return
  promptCache.set(name, prompt.template);
  return prompt.template;
};

// Add a function to clear cache when prompts are updated
export const clearPromptCache = (name) => {
  if (name) {
    promptCache.del(name);
  } else {
    promptCache.flushAll();
  }
};

// Functions to replace your current prompt functions
export const getLatexPrompt = async (extractedData, CV_STRUCTURE) => {
  const data = JSON.stringify(extractedData);
  const template = await getPrompt('latex_basic');
  return template.replace('${data}', data).replace('${CV_STRUCTURE}', CV_STRUCTURE);

};

export const getLatexPromptJobTitle = async (extractedData, jobTitle, CV_STRUCTURE) => {
  const data = JSON.stringify(extractedData);
  const template = await getPrompt('latex_job_title');
  return template
    .replace('${data}', data)
    .replace(/\${jobTitle}/g, jobTitle)
    .replace('${CV_STRUCTURE}', CV_STRUCTURE);
};

export const getLatexPromptJobDescription = async (extractedData, jobTitle, jobDescription, CV_STRUCTURE) => {
  const data = JSON.stringify(extractedData);
  const template = await getPrompt('latex_job_description');
  return template
    .replace('${data}', data)
    .replace(/\${jobTitle}/g, jobTitle)
    .replace('${jobDescription}', jobDescription)
    .replace('${CV_STRUCTURE}', CV_STRUCTURE);
};