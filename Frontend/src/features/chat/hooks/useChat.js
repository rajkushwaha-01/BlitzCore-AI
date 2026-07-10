import { initializeSocketConnection } from "../service/chat.socket"
import { sendMessage  , getChats , getMessages , deleteChat } from '../service/chat.api';
import { useDispatch } from "react-redux";

export const useChat = () => {

    const dispatch = useDispatch()

    function handleSendMessage ({message , chatId}) {
        
    }


    return { 
        initializeSocketConnection,
    }
    }