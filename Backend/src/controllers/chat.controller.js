import { generateResponse, generateChatTitle } from '../services/ai.service.js';
import chatModel from '../models/chat.model.js';
import messageModel from '../models/message.model.js';



export async function sendMessage(req, res) {
  try {
    const { message } = req.body;
    const title = await generateChatTitle(message);
    const result = await generateResponse(message);


    const chat = await chatModel.create({
      user: req.user.id,
      title
    });

    const userMessage = await messageModel.create({
      chat: chat.id,
      content: message,
      role: "user"
    })

    const aiMessage = await messageModel.create({
      chat: chat._id,
      content: result,
      role: 'ai'
    });





    res.status(200).json({ title, chat, aiMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}