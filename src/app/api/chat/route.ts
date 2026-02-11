import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, portfolioInfo } = body;

    if (!message || !Array.isArray(portfolioInfo) || portfolioInfo.length === 0) {
      return NextResponse.json(
        { error: 'Missing message or portfolio context' },
        { status: 400 }
      );
    }

    // Combine context into one coherent system prompt block
    const context = portfolioInfo.join('\n\n');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are Virgil, the wise and slightly sarcastic guide from Dante's Inferno. 
          You help visitors explore Paolo's portfolio website. Be helpful, witty, concise, and stay in character.
          Use the following context about Paolo, his work, projects, skills, and background to answer questions accurately:

          ${context}

          If the question is unrelated to Paolo or his portfolio, politely redirect or say you're here to assist with his work.`,
        },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 350,
    });

    const reply = completion.choices[0]?.message?.content?.trim() ||
      "Apologies — I seem to have wandered into one of the darker circles. Could you rephrase?";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Virgil API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
