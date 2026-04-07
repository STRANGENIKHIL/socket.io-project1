import Message from '../models/Message.model.js';

const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('join-room', (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room: ${roomId}`);
            // Broadcast to other users in the room
            socket.to(roomId).emit('receive-message', {
                sender: 'System',
                content: `A new user has joined the room.`,
                roomId,
                createdAt: new Date().toISOString()
            });
        });

        socket.on('send-message', async (data) => {
            try {
                // If the data comes from Postman as a string, parse it automatically
                if (typeof data === 'string') {
                    data = JSON.parse(data);
                }

                if (!data || !data.roomId || !data.sender || !data.content) {
                    console.error('Invalid message data received:', data);
                    return;
                }

                // Save message to DB
                const newMessage = new Message({
                    roomId: data.roomId,
                    sender: data.sender,
                    content: data.content,
                });
                const savedMessage = await newMessage.save();
                
                console.log('✅ Successfully saved to MongoDB:', savedMessage.content);
                console.log(`Broadcasting to room: ${data.roomId}`);

                // Broadcast to everyone in the room including sender
                io.to(data.roomId).emit('receive-message', savedMessage);
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

export default socketHandler;
