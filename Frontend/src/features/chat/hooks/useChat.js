import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, addMessages } from "../chat.sclice";
import { useDispatch } from "react-redux";


export const useChat = () => {

    const dispatch = useDispatch()


    async function handleSendMessage({ message, chatId }) {
        dispatch(setLoading(true))
        try {
            const data = await sendMessage({ message, chatId })
            const { chat, aiMessage } = data
            if (!chatId)
                dispatch(createNewChat({
                    chatId: chat._id,
                    title: chat.title,
                }))
            dispatch(addNewMessage({
                chatId: chatId || chat._id,
                content: message,
                role: "user",
            }))
            dispatch(addNewMessage({
                chatId: chatId || chat._id,
                content: aiMessage.content,
                role: aiMessage.role,
            }))
            dispatch(setCurrentChatId(chat._id))
        } catch (err) {
            dispatch(setError(err?.message || "Failed to send message"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetChats() {
        dispatch(setLoading(true))
        try {
            const data = await getChats()
            const { chats } = data
            dispatch(setChats(chats.reduce((acc, chat) => {
                acc[ chat._id ] = {
                    id: chat._id,
                    title: chat.title,
                    messages: [],
                    lastUpdated: chat.updatedAt,
                }
                return acc
            }, {})))
        } catch (err) {
            dispatch(setError(err?.message || "Failed to load chats"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleOpenChat(chatId, chats) {
        if (chats[ chatId ]?.messages.length === 0) {
            dispatch(setLoading(true))
            try {
                const data = await getMessages(chatId)
                const { messages } = data

                const formattedMessages = messages.map(msg => ({
                    content: msg.content,
                    role: msg.role,
                }))

                dispatch(addMessages({
                    chatId,
                    messages: formattedMessages,
                }))
            } catch (err) {
                dispatch(setError(err?.message || "Failed to load messages"))
            } finally {
                dispatch(setLoading(false))
            }
        }
        dispatch(setCurrentChatId(chatId))
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat
    }

}