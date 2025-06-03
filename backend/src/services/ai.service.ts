import axios from 'axios';
import { logger } from '../utils/logger';
import { Readable } from 'stream';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OLLAMA_API_URL = 'http://localhost:11434/api/chat';

export async function analyzeDocumentWithAI(text: string, product?: string): Promise<string> {
  const messages = [
    {
      role: 'system',
      content: `You are an expert in internal audit and compliance. Analyze the following document text for the product: ${product || 'N/A'}. Generate a detailed, actionable list of security controls to be implemented for this product. Format your response as JSON with keys: summary, controls (array of detailed controls), risks (array of detailed risks).`
    },
    {
      role: 'user',
      content: text
    }
  ];

  // Try OpenAI first if key is present
  if (OPENAI_API_KEY) {
    try {
      const response: any = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-3.5-turbo',
          messages
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.choices[0].message.content;
    } catch (err) {
      logger.info('OpenAI analysis failed, falling back to Ollama. Error: ' + (err instanceof Error ? err.message : JSON.stringify(err)));
    }
  } else {
    logger.info('No OpenAI API key found, using Ollama for analysis.');
  }

  // Fallback to Ollama (streaming response)
  try {
    const ollamaResponse = await axios.post(
      OLLAMA_API_URL,
      {
        model: 'llama3.2:latest', // Change model name if needed
        messages
      },
      { responseType: 'stream' }
    );

    let fullContent = '';
    const stream = ollamaResponse.data as Readable;
    for await (const chunk of stream) {
      const lines = chunk.toString().split('\n').filter(Boolean);
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.message && parsed.message.content) {
            fullContent += parsed.message.content;
          }
        } catch (e) {
          // Ignore lines that aren't valid JSON
        }
      }
    }
    return fullContent;
  } catch (ollamaErr) {
    logger.error('Both OpenAI and Ollama analysis failed: ' + (ollamaErr instanceof Error ? ollamaErr.message : JSON.stringify(ollamaErr)));
    throw new Error('Both OpenAI and Ollama analysis failed.');
  }
}
