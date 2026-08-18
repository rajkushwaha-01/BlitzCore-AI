import { Server } from 'socket.io';

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

let io;
export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: allowedOrigins,
            credentials: true,
        },
    });

    console.log('Socket.io server initialized');

    io.on('connection', (socket) => {
        console.log('A user connected:' + socket.id);
    });
}


export function getSelection() {
    if (!io) {
        throw new Error('Socket.io server not initialized');
    }

    return io;
}