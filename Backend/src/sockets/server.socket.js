import { Server } from 'socket.io';

let io;
export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:5173', // Replace with your frontend URL
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