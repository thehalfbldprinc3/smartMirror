import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/#+\s/g, '')
    .replace(/>\s/g, '')
    .replace(/-\s|\*\s|\+\s/g, '')
    .replace(/\r?\n|\r/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 100,
        temperature: 0.1,
      },
    });

    const cleanedReply = cleanMarkdown(response.text);

    return NextResponse.json({ reply: cleanedReply });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json({ reply: "Sorry, I couldn't process that." });
  }
}