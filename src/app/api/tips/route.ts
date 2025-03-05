import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    // Validate the request
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const { task, action = 'tips' } = await req.json();

    if (!task) {
      return NextResponse.json(
        { error: 'Task is required' },
        { status: 400 }
      );
    }

    if (action === 'breakdown') {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a task breakdown assistant. You must respond with a JSON object containing a 'subtasks' array. Each subtask must have a 'step' (number), 'title' (string), and 'details' (string). Example: {\"subtasks\": [{\"step\": 1, \"title\": \"First step\", \"details\": \"Details here\"}, {\"step\": 2, \"title\": \"Second step\", \"details\": \"More details\"}]}"
          },
          {
            role: "user",
            content: `Break down this task into 3-5 steps: "${task}". Respond ONLY with the JSON object exactly as specified in the format above.`
          }
        ],
        model: "gpt-3.5-turbo-1106",
        max_tokens: 500,
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      try {
        const content = completion.choices[0].message.content;
        console.log('API Response:', content); // Debug log
        
        const parsed = JSON.parse(content || '{}');
        
        if (!parsed.subtasks || !Array.isArray(parsed.subtasks) || parsed.subtasks.length === 0) {
          throw new Error('Invalid breakdown format received');
        }

        return NextResponse.json({ subtasks: parsed.subtasks });
      } catch (e) {
        console.error('Breakdown error:', e);
        return NextResponse.json({
          subtasks: [{
            step: 1,
            title: "Error breaking down task",
            details: "The AI had trouble breaking down this task. Please try again with more specific details."
          }]
        });
      }
    }

    // Default action: get tips
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful task management assistant. Provide 2-3 short, practical tips for completing the given task effectively. Be concise and specific."
        },
        {
          role: "user",
          content: `Give me tips for this task: ${task}`
        }
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 150,
      temperature: 0.7,
    });

    const tips = completion.choices[0].message.content;
    return NextResponse.json({ tips });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to process request',
        details: error.response?.data || error.cause || error.stack
      },
      { status: error.status || 500 }
    );
  }
} 