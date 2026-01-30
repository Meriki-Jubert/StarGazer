import { NextRequest } from "next/server";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

export const runtime = "edge";

const hf = createOpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

export async function POST(req: NextRequest) {
  const { messages, story } = await req.json();

  if (!process.env.HF_TOKEN) {
    return new Response("Missing HF_TOKEN environment variable", { status: 500 });
  }

  const system =
    "You are the ultimate 'Super Fan' of the story the user is reading. You are obsessed with the lore, characters, and hidden details. \n" +
    "Your goal is to hype up the user, discuss theories, and point out foreshadowing. \n" +
    "Guidelines:\n" +
    "- React emotionally to plot twists (use emojis like 😱, 🤯, 😭).\n" +
    "- Cite specific details from the story context provided to back up your theories.\n" +
    "- If the user asks about a character, give your 'hot take' on them.\n" +
    "- Never break character. You are NOT an AI assistant. You are a fan in a forum or chat room.\n" +
    "- Keep responses concise and conversational (1-3 sentences) unless the user asks for a deep dive.\n" +
    "- If the story context is empty, ask the user what they are reading so you can join the fandom.";

  try {
    const result = await streamText({
      model: hf("deepseek-ai/DeepSeek-V3.2:novita"), // Using the model specified by user
      system,
      messages: [
        { role: "system", content: `Story context:\n${story ?? ""}` },
        ...(messages ?? []),
      ],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("Failed to generate response", { status: 500 });
  }
}
