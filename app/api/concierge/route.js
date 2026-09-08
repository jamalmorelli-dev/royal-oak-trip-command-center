import OpenAI from 'openai';

const MAX_QUESTION_LENGTH = 2000;
const MAX_PAYLOAD_BYTES = 50_000;

export async function POST(req) {
  try {
    // Check API key presence
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: 'OPENAI_API_KEY is not configured on the server. The AI concierge is unavailable.' },
        { status: 503 }
      );
    }

    // Parse and validate payload
    let body;
    try {
      const raw = await req.text();
      if (raw.length > MAX_PAYLOAD_BYTES) {
        return Response.json(
          { error: 'Payload too large.' },
          { status: 413 }
        );
      }
      body = JSON.parse(raw);
    } catch {
      return Response.json(
        { error: 'Invalid JSON payload.' },
        { status: 400 }
      );
    }

    const { question, trip } = body;

    // Validate question
    if (!question || typeof question !== 'string' || !question.trim()) {
      return Response.json(
        { error: 'Please provide a non-empty question.' },
        { status: 400 }
      );
    }

    if (question.length > MAX_QUESTION_LENGTH) {
      return Response.json(
        { error: `Question too long (max ${MAX_QUESTION_LENGTH} characters).` },
        { status: 400 }
      );
    }

    // Validate trip data exists
    if (!trip || typeof trip !== 'object') {
      return Response.json(
        { error: 'Trip data is required.' },
        { status: 400 }
      );
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.responses.create({
      model: 'gpt-5.6-terra',
      reasoning: { effort: 'medium' },
      input: [
        {
          role: 'system',
          content: 'You are the Royal Oak Trip Concierge. Use the supplied trip data as the source of truth. Optimize for low cost, low wasted transportation, realistic pacing, and clear daily execution. Flag anything uncertain or time-sensitive instead of inventing it.',
        },
        {
          role: 'user',
          content: `TRIP DATA:\n${JSON.stringify(trip)}\n\nQUESTION:\n${question}`,
        },
      ],
    });

    return Response.json({ answer: response.output_text });
  } catch (e) {
    // Do not leak internal error details in production
    const message = e?.status === 401
      ? 'Invalid API key. Please check the server configuration.'
      : e?.message || 'Unknown server error';

    return Response.json(
      { error: message },
      { status: e?.status || 500 }
    );
  }
}
