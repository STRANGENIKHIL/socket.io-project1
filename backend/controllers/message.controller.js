import Message from '../models/Message.model.js';

// @desc    Get messages for a room
// @route   GET /api/messages/:roomId
// @access  Public
const getMessages = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        next(error);
    }
};

export { getMessages };
