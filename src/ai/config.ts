// Runtime configuration for AI services
export const AI_CONFIG = {
  apiKey: process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY,
  model: 'gemini-1.5-flash', // Correct model name without prefix
};

// Validate configuration
if (!AI_CONFIG.apiKey) {
  console.warn('⚠️ AI API key not configured. AI features will not work.');
  console.warn('Please set GOOGLE_GENAI_API_KEY or GEMINI_API_KEY in your environment variables.');
}
