import type { APIRoute } from "astro";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: import.meta.env.ANTHROPIC_API_KEY });

export const POST: APIRoute = async ({ request }) => {
  const { message } = await request.json();
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: message }],
  });
  return new Response(JSON.stringify({ reply: response.content[0].text }));
};