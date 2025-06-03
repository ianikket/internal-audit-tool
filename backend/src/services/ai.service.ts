import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

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
} 