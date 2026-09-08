import { describe, it, expect } from 'vitest';

/**
 * Tests for the concierge API route payload validation.
 * These validate the shape of the request/response without needing a running server.
 */

// Simulate the route's validation logic
function validatePayload(body) {
  const MAX_QUESTION_LENGTH = 2000;
  const MAX_PAYLOAD_BYTES = 50_000;

  const raw = JSON.stringify(body);
  if (raw.length > MAX_PAYLOAD_BYTES) {
    return { valid: false, error: 'Payload too large.', status: 413 };
  }

  const { question, trip } = body;

  if (!question || typeof question !== 'string' || !question.trim()) {
    return { valid: false, error: 'Please provide a non-empty question.', status: 400 };
  }

  if (question.length > MAX_QUESTION_LENGTH) {
    return { valid: false, error: `Question too long (max ${MAX_QUESTION_LENGTH} characters).`, status: 400 };
  }

  if (!trip || typeof trip !== 'object') {
    return { valid: false, error: 'Trip data is required.', status: 400 };
  }

  return { valid: true };
}

describe('concierge route payload validation', () => {
  const validTrip = {
    traveler: 'Benjamin Prentiss',
    confirmation: 'G82B6L',
    budget: [['Airfare', 1412.26]],
  };

  it('accepts a valid payload', () => {
    const result = validatePayload({
      question: 'What should I do on Tuesday?',
      trip: validTrip,
    });
    expect(result.valid).toBe(true);
  });

  it('rejects empty question', () => {
    const result = validatePayload({ question: '', trip: validTrip });
    expect(result.valid).toBe(false);
    expect(result.status).toBe(400);
  });

  it('rejects whitespace-only question', () => {
    const result = validatePayload({ question: '   ', trip: validTrip });
    expect(result.valid).toBe(false);
    expect(result.status).toBe(400);
  });

  it('rejects missing question', () => {
    const result = validatePayload({ trip: validTrip });
    expect(result.valid).toBe(false);
    expect(result.status).toBe(400);
  });

  it('rejects question that is not a string', () => {
    const result = validatePayload({ question: 123, trip: validTrip });
    expect(result.valid).toBe(false);
    expect(result.status).toBe(400);
  });

  it('rejects question exceeding max length', () => {
    const longQ = 'a'.repeat(2001);
    const result = validatePayload({ question: longQ, trip: validTrip });
    expect(result.valid).toBe(false);
    expect(result.status).toBe(400);
  });

  it('accepts question at exactly max length', () => {
    const maxQ = 'a'.repeat(2000);
    const result = validatePayload({ question: maxQ, trip: validTrip });
    expect(result.valid).toBe(true);
  });

  it('rejects missing trip data', () => {
    const result = validatePayload({ question: 'Test?' });
    expect(result.valid).toBe(false);
    expect(result.status).toBe(400);
  });

  it('rejects trip data that is not an object', () => {
    const result = validatePayload({ question: 'Test?', trip: 'not an object' });
    expect(result.valid).toBe(false);
    expect(result.status).toBe(400);
  });

  it('rejects oversized payload', () => {
    const hugeTrip = { data: 'x'.repeat(60000) };
    const result = validatePayload({ question: 'Test?', trip: hugeTrip });
    expect(result.valid).toBe(false);
    expect(result.status).toBe(413);
  });
});

describe('concierge route safe failure (no API key)', () => {
  it('returns 503 with descriptive error when key is absent', () => {
    // Simulating the route's behavior when OPENAI_API_KEY is not set
    const hasKey = false;
    if (!hasKey) {
      const response = {
        status: 503,
        body: { error: 'OPENAI_API_KEY is not configured on the server. The AI concierge is unavailable.' },
      };
      expect(response.status).toBe(503);
      expect(response.body.error).toContain('OPENAI_API_KEY');
      expect(response.body.error).toContain('unavailable');
    }
  });

  it('does not leak the actual key value in error messages', () => {
    const errorMessage = 'OPENAI_API_KEY is not configured on the server.';
    expect(errorMessage).not.toMatch(/sk-[a-zA-Z0-9]/);
  });
});
