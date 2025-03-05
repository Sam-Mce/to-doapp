import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { todo } = await request.json();
    
    if (!todo) {
      return NextResponse.json({ error: 'Todo text is required' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful task management assistant. Provide concise, practical tips for completing tasks effectively."
        },
        {
          role: "user",
          content: `Please give me 3 quick tips for this task: ${todo}`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    const tips = completion.choices[0].message.content;
    return NextResponse.json({ tips });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
} 