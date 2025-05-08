import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the AI client with your API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Simple regex-based function to strip markdown
function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')  // bold
    .replace(/\*(.*?)\*/g, '$1')      // italic or single *
    .replace(/_(.*?)_/g, '$1')        // underscore italic
    .replace(/`(.*?)`/g, '$1')        // inline code
    .replace(/~~(.*?)~~/g, '$1')      // strikethrough
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // links
    .replace(/#+\s/g, '')             // headings
    .replace(/>\s/g, '')              // blockquotes
    .replace(/-\s|\*\s|\+\s/g, '')    // unordered list bullets
    .replace(/\r?\n|\r/g, ' ')        // newlines to spaces
    .replace(/\s{2,}/g, ' ')          // extra spaces
    .trim();
}

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 50,
        temperature: 0.1,
      },
    });

    // Clean response text
    const cleanedReply = cleanMarkdown(response.text);

    return NextResponse.json({ reply: cleanedReply });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json({ reply: "Sorry, I couldn't process that." });
  }
}