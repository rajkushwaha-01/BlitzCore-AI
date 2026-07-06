import { ChatGoogleGenerativeAI } from "@langchain/google-genai";


const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-flash-latest",
    apiKey: process.env.GEMINI_API_KEY
});


export async function testAi(){
    geminiModel.invoke("Hello, how are you?").then((response) => {
        console.log("AI Response:", response.text);
    }).catch((error) => {
        console.error("Error invoking AI model:", error);
    });
}

