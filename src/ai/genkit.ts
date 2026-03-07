import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { AI_CONFIG } from './config';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: AI_CONFIG.apiKey,
    })
  ],
  model: AI_CONFIG.model,
});
