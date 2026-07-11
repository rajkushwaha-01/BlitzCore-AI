import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
} from "@langchain/core/messages";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function generateResponse(messages) {
  const history = [
    new SystemMessage(
      "You are a helpful, friendly, and knowledgeable AI assistant. Provide accurate and concise answers."
    ),
    ...messages.map((message) => {
      if (message.role === "user") {
        return new HumanMessage(message.content);
      }

      return new AIMessage(message.content);
    }),
  ];

  const response = await geminiModel.invoke(history);

  return response.content;
}

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`
You are a helpful assistant that generates concise and descriptive titles for chat conversations.

Generate a title in 2-4 words only.
Do not use quotation marks.
Do not add punctuation.
Return only the title.
    `),

    new HumanMessage(`
Generate a title for this conversation:

${message}
    `),
  ]);

  return response.content;
}