// OpenAI & Google Gemini Configuration with Vercel AI SDK
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { buildPortfolioContext } from './context-builder';
import { buildSystemPrompt, FALLBACK_MESSAGES } from './prompts';

if (!process.env.OPENAI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  console.warn('Neither OPENAI_API_KEY nor GOOGLE_GENERATIVE_AI_API_KEY is defined. AI features will be disabled.');
}

export interface AIResponseOptions {
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  temperature?: number;
  model?: string;
}

export async function generateAIResponse(
  userMessage: string,
  options: AIResponseOptions = {}
): Promise<{ content: string; error?: string }> {
  try {
    const useGoogle = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const useOpenAI = !!process.env.OPENAI_API_KEY;

    // Check if any AI provider is configured
    if (!useGoogle && !useOpenAI) {
      return {
        content: FALLBACK_MESSAGES.ERROR,
        error: 'AI API key not configured',
      };
    }

    // Build context from portfolio data
    const portfolioContext = await buildPortfolioContext();
    const systemPrompt = buildSystemPrompt(portfolioContext);

    // Prepare conversation history
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...(options.conversationHistory || []),
      { role: 'user' as const, content: userMessage },
    ];

    // Select model
    let model;
    if (useGoogle) {
        // Use Gemini Flash (Free tier available) by default if Google key is present
        // or user requested gemini model
        // Note: Using gemini-1.5-flash-001 (specific stable version) to avoid 404s
        model = google(options.model?.includes('gemini') ? options.model : 'models/gemini-2.5-flash');
    } else {
        model = openai(options.model || 'gpt-4o-mini');
    }

    // Generate response using Vercel AI SDK
    const { text } = await generateText({
      model,
      messages,
      temperature: options.temperature !== undefined ? options.temperature / 100 : 0.7,
    });

    return { content: text };
  } catch (error) {
    console.error('Error generating AI response:', error);
    return {
      content: FALLBACK_MESSAGES.ERROR,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Test function to validate AI setup
export async function testAIConnection(): Promise<boolean> {
  try {
    const useGoogle = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const useOpenAI = !!process.env.OPENAI_API_KEY;

    if (!useGoogle && !useOpenAI) {
      return false;
    }

    let model;
    if (useGoogle) {
        model = google('models/gemini-1.5-flash-001');
    } else {
        model = openai('gpt-4o-mini');
    }

    const { text } = await generateText({
      model,
      messages: [{ role: 'user', content: 'Say "OK" if you can read this.' }],
    });

    return text.toLowerCase().includes('ok');
  } catch (error) {
    console.error('AI connection test failed:', error);
    return false;
  }
}
