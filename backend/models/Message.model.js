import mongoose from 'mongoose';

const messageSchema = mongoose.Schema(
    {
        roomId: {
            type: String,
            required: true,
            index: true // index for faster queries
        },
        sender: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
