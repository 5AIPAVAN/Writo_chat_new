// const express = require('express');
// const { Server } = require('socket.io');
// const http = require('http');
// const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
// const UserModel = require('../models/UserModel');
// const { ConversationModel, MessageModel } = require('../models/ConversationModel');
// const getConversation = require('../helpers/getConversation');

// const app = express();

// /***socket connection */
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: process.env.FRONTEND_URL,
//         credentials: true
//     }
// });

// /***
//  * socket running at http://localhost:8080/
//  */

// // Online users set
// const onlineUser = new Set();

// // Broadcast Channel IDs
// const BROADCAST_CHANNEL_IDS = {
//     JEE: '669d47f2f4913b792cc11ef0',
//     NEET: '669fae90c5fda49c52117d6b',
//     CLASS_11: '669faf3c6b1f5158c2cf2698',
//     CLASS_12: '669fafa16b1f5158c2cf269b'
// };

// io.on('connection', async (socket) => {
//     console.log("User connected:", socket.id);

//     const token = socket.handshake.auth.token;

//     // Get current user details 
//     const user = await getUserDetailsFromToken(token);

//     console.log('user details when connected in backend',user);

//     // Create a room for the user
//     socket.join(user?._id.toString());
//     onlineUser.add(user?._id?.toString());

//     // Join the appropriate broadcast channel room based on student_course
//     switch (user?.student_course) {
//         case 'JEE':
//             socket.join(BROADCAST_CHANNEL_IDS.JEE);
//             break;
//         case 'NEET':
//             socket.join(BROADCAST_CHANNEL_IDS.NEET);
//             break;
//         case 'CLASS-11':
//             socket.join(BROADCAST_CHANNEL_IDS.CLASS_11);
//             break;
//         case 'CLASS-12':
//             socket.join(BROADCAST_CHANNEL_IDS.CLASS_12);
//             break;
//     }

//     // Emit online users
//     io.emit('onlineUser', Array.from(onlineUser));

//     // Handle message-page event
//     socket.on('message-page', async (userId) => {
//         console.log('Attempting to chat with', userId);

//         const userDetails = await UserModel.findById(userId).select("-password");

//         const payload = {
//             _id: userDetails?._id,
//             name: userDetails?.name,
//             email: userDetails?.email,
//             profile_pic: userDetails?.profile_pic,
//             online: onlineUser.has(userId) // Check if the user is online
//         };

//         socket.emit('message-user', payload);

//         let messages = [];

//         if (Object.values(BROADCAST_CHANNEL_IDS).includes(userId)) {
//             // Fetch all conversations where the receiver is the broadcast channel
//             const conversations = await ConversationModel.find({
//                 receiver: userId
//             }).populate({
//                 path: 'messages',
//                 populate: {
//                     path: 'msgByUserId',
//                     select: 'name profile_pic'
//                 }
//             }).sort({ updatedAt: 1 });

//             // Gather all messages from these conversations
//             conversations.forEach(conversation => {
//                 messages = messages.concat(conversation.messages);
//             });

//             // Sort messages by creation time (oldest to latest)
//             messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//         } else {
//             // Fetch previous messages between the two users
//             const getConversationMessage = await ConversationModel.findOne({
//                 "$or": [
//                     { sender: user?._id, receiver: userId },
//                     { sender: userId, receiver: user?._id }
//                 ]
//             }).populate({
//                 path: 'messages',
//                 populate: {
//                     path: 'msgByUserId',
//                     select: 'name profile_pic'
//                 }
//             }).sort({ updatedAt: -1 });

//             messages = getConversationMessage?.messages || [];
//         }

//         socket.emit('message', messages);
//     });

//     // Handle new message event
//     socket.on('new message', async (data) => {
//         // Check if the conversation is available between the users
//         let conversation = await ConversationModel.findOne({
//             "$or": [
//                 { sender: data?.sender, receiver: data?.receiver },
//                 { sender: data?.receiver, receiver: data?.sender }
//             ]
//         });

//         // If conversation is not available, create a new conversation
//         if (!conversation) {
//             const createConversation = await ConversationModel({
//                 sender: data?.sender,
//                 receiver: data?.receiver
//             });
//             conversation = await createConversation.save();
//         }

//         // Create a new message
//         const message = new MessageModel({
//             text: data.text,
//             imageUrl: data.imageUrl,
//             videoUrl: data.videoUrl,
//             msgByUserId: data?.msgByUserId,
//         });
//         const saveMessage = await message.save();

//         // Update the conversation with the new message
//         const updateConversation = await ConversationModel.updateOne({ _id: conversation?._id }, {
//             "$push": { messages: saveMessage?._id }
//         });

//         let messages = [];

//         if (Object.values(BROADCAST_CHANNEL_IDS).includes(data.receiver)) {
//             // Fetch all conversations where the receiver is the broadcast channel
//             const conversations = await ConversationModel.find({
//                 receiver: data.receiver
//             }).populate({
//                 path: 'messages',
//                 populate: {
//                     path: 'msgByUserId',
//                     select: 'name profile_pic'
//                 }
//             }).sort({ updatedAt: 1 });

//             // Gather all messages from these conversations
//             conversations.forEach(conversation => {
//                 messages = messages.concat(conversation.messages);
//             });

//             // Sort messages by creation time (oldest to latest)
//             messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//         } else {
//             // Fetch all messages in the conversation between the sender and receiver
//             const getConversationMessage = await ConversationModel.findOne({
//                 "$or": [
//                     { sender: data?.sender, receiver: data?.receiver },
//                     { sender: data?.receiver, receiver: data?.sender }
//                 ]
//             }).populate({
//                 path: 'messages',
//                 populate: {
//                     path: 'msgByUserId',
//                     select: 'name profile_pic'
//                 }
//             }).sort({ updatedAt: -1 });

//             messages = getConversationMessage?.messages || [];
//         }

//         // Emit message to both sender and receiver
//         io.to(data?.sender).emit('message', messages);
//         io.to(data?.receiver).emit('message', messages);

//         // If the message is sent to a broadcast channel, emit to all in the broadcast room
//         if (Object.values(BROADCAST_CHANNEL_IDS).includes(data.receiver)) {
//             io.to(data.receiver).emit('message', messages);
//         }

//         // Send conversation update to both users
//         const conversationSender = await getConversation(data?.sender);
//         const conversationReceiver = await getConversation(data?.receiver);

//         io.to(data?.sender).emit('conversation', conversationSender);
//         io.to(data?.receiver).emit('conversation', conversationReceiver);
//     });

//     // Handle sidebar event
//     socket.on('sidebar', async (currentUserId) => {
//         console.log("Current user", currentUserId);

//         const conversation = await getConversation(currentUserId);

//         socket.emit('conversation', conversation);
//     });

//     // Handle seen event
//     socket.on('seen', async (msgByUserId) => {
//         // Skip seen event handling for broadcast channels
//         if (Object.values(BROADCAST_CHANNEL_IDS).includes(msgByUserId)) return;

//         let conversation = await ConversationModel.findOne({
//             "$or": [
//                 { sender: user?._id, receiver: msgByUserId },
//                 { sender: msgByUserId, receiver: user?._id }
//             ]
//         });

//         const conversationMessageId = conversation?.messages || [];

//         const updateMessages = await MessageModel.updateMany(
//             { _id: { "$in": conversationMessageId }, msgByUserId: msgByUserId },
//             { "$set": { seen: true } }
//         );

//         // Send conversation update
//         const conversationSender = await getConversation(user?._id?.toString());
//         const conversationReceiver = await getConversation(msgByUserId);

//         io.to(user?._id?.toString()).emit('conversation', conversationSender);
//         io.to(msgByUserId).emit('conversation', conversationReceiver);
//     });

//     // Handle disconnect event
//     socket.on('disconnect', () => {
//         onlineUser.delete(user?._id?.toString());
//         console.log('User disconnected:', socket.id);
//     });
// });

// module.exports = {
//     app,
//     server
// };


//*************************************************************** */

// index.js
const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');
const UserModel = require('../models/UserModel');
const { ConversationModel, MessageModel } = require('../models/ConversationModel');
const getConversation = require('../helpers/getConversation');

const app = express();

/*** Socket connection */
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
});

/***
 * Socket running at http://localhost:8080/
 */

// Online users set
const onlineUser = new Set();

// Broadcast Channel IDs
const BROADCAST_CHANNEL_IDS = {
    JEE: '669d47f2f4913b792cc11ef0',
    NEET: '669fae90c5fda49c52117d6b',
    CLASS_11: '669faf3c6b1f5158c2cf2698',
    CLASS_12: '669fafa16b1f5158c2cf269b'
};

io.on('connection', async (socket) => {
    console.log("User connected:", socket.id);

    const token = socket.handshake.auth.token;
    const user = await getUserDetailsFromToken(token);

    if (!user) {
        console.log('User not found');
        return socket.disconnect();
    }

    // Create a room for the user
    socket.join(user?._id.toString());
    onlineUser.add(user?._id?.toString());
    console.log('User joined room:', user?._id.toString());

    // Join the appropriate broadcast channel room based on student_course
    switch (user?.student_course) {
        case 'JEE':
            socket.join(BROADCAST_CHANNEL_IDS.JEE);
            console.log('User joined JEE channel');
            break;
        case 'NEET':
            socket.join(BROADCAST_CHANNEL_IDS.NEET);
            console.log('User joined NEET channel');
            break;
        case 'Class_11':
            socket.join(BROADCAST_CHANNEL_IDS.CLASS_11);
            console.log('User joined CLASS-11 channel');
            break;
        case 'Class_12':
            socket.join(BROADCAST_CHANNEL_IDS.CLASS_12);
            console.log('User joined CLASS-12 channel');
            break;
    }

    // Emit online users
    io.emit('onlineUser', Array.from(onlineUser));

    // Handle message-page event
    socket.on('message-page', async (userId) => {
        console.log('Attempting to chat with', userId);

        const userDetails = await UserModel.findById(userId).select("-password");
        if (!userDetails) {
            console.log('User details not found');
            return socket.emit('message', []);
        }

        const payload = {
            _id: userDetails?._id,
            name: userDetails?.name,
            email: userDetails?.email,
            profile_pic: userDetails?.profile_pic,
            online: onlineUser.has(userId), // Check if the user is online
            
        };

        socket.emit('message-user', payload);

        let messages = [];

        if (Object.values(BROADCAST_CHANNEL_IDS).includes(userId)) {
            // Fetch all conversations where the receiver is the broadcast channel
            const conversations = await ConversationModel.find({
                receiver: userId
            }).populate({
                path: 'messages',
                populate: {
                    path: 'msgByUserId',
                    select: 'name profile_pic'
                }
            }).sort({ updatedAt: 1 });

            // Gather all messages from these conversations
            conversations.forEach(conversation => {
                messages = messages.concat(conversation.messages);
            });

            // Sort messages by creation time (oldest to latest)
            messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else {
            // Fetch previous messages between the two users
            const getConversationMessage = await ConversationModel.findOne({
                "$or": [
                    { sender: user?._id, receiver: userId },
                    { sender: userId, receiver: user?._id }
                ]
            }).populate({
                path: 'messages',
                populate: {
                    path: 'msgByUserId',
                    select: 'name profile_pic'
                }
            }).sort({ updatedAt: -1 });

            messages = getConversationMessage?.messages || [];
        }

        socket.emit('message', messages);
    });

    // Handle new message event
    socket.on('new message', async (data) => {
        console.log('New message received:', data);

        // Check if the conversation is available between the users
        let conversation = await ConversationModel.findOne({
            "$or": [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender }
            ]
        });

        // If conversation is not available, create a new conversation
        if (!conversation) {
            const createConversation = await ConversationModel.create({
                sender: data?.sender,
                receiver: data?.receiver
            });
            conversation = createConversation;
        }

        // Create a new message
        const message = new MessageModel({
            text: data.text,
            imageUrl: data.imageUrl,
            videoUrl: data.videoUrl,
            msgByUserId: data?.msgByUserId,
        });
        const saveMessage = await message.save();

        // Update the conversation with the new message
        await ConversationModel.updateOne({ _id: conversation?._id }, {
            "$push": { messages: saveMessage?._id }
        });

        let messages = [];

        if (Object.values(BROADCAST_CHANNEL_IDS).includes(data.receiver)) {
            // Fetch all conversations where the receiver is the broadcast channel
            const conversations = await ConversationModel.find({
                receiver: data.receiver
            }).populate({
                path: 'messages',
                populate: {
                    path: 'msgByUserId',
                    select: 'name profile_pic'
                }
            }).sort({ updatedAt: 1 });

            // Gather all messages from these conversations
            conversations.forEach(conversation => {
                messages = messages.concat(conversation.messages);
            });

            // Sort messages by creation time (oldest to latest)
            messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else {
            // Fetch all messages in the conversation between the sender and receiver
            const getConversationMessage = await ConversationModel.findOne({
                "$or": [
                    { sender: data?.sender, receiver: data?.receiver },
                    { sender: data?.receiver, receiver: data?.sender }
                ]
            }).populate({
                path: 'messages',
                populate: {
                    path: 'msgByUserId',
                    select: 'name profile_pic'
                }
            }).sort({ updatedAt: -1 });

            messages = getConversationMessage?.messages || [];
        }

        // Emit message to both sender and receiver
        io.to(data?.sender).emit('message', messages);
        io.to(data?.receiver).emit('message', messages);

        // If the message is sent to a broadcast channel, emit to all in the broadcast room
        if (Object.values(BROADCAST_CHANNEL_IDS).includes(data.receiver)) {
            io.to(data.receiver).emit('message', messages);
        }

        // Send conversation update to both users
        const conversationSender = await getConversation(data?.sender);
        console.log('convvv sender',conversationSender.length)
        const conversationReceiver = await getConversation(data?.receiver);
        console.log('covvvv receiver',conversationReceiver.length)

        io.to(data?.sender).emit('conversation', conversationSender);
        io.to(data?.receiver).emit('conversation', conversationReceiver);
    });

    // Handle sidebar event
    socket.on('sidebar', async (currentUserId) => {
        console.log("Current user:", currentUserId);

        const conversation = await getConversation(currentUserId);

        socket.emit('conversation', conversation);
    });

    // Handle seen event
    socket.on('seen', async (msgByUserId) => {
        // Skip seen event handling for broadcast channels
       // Skip seen event handling for broadcast channels
    if (
        msgByUserId === BROADCAST_CHANNEL_IDS.JEE ||
        msgByUserId === BROADCAST_CHANNEL_IDS.NEET ||
        msgByUserId === BROADCAST_CHANNEL_IDS.CLASS_11 ||
        msgByUserId === BROADCAST_CHANNEL_IDS.CLASS_12
    ) {
        return;
    }
        let conversation = await ConversationModel.findOne({
            "$or": [
                { sender: user?._id, receiver: msgByUserId },
                { sender: msgByUserId, receiver: user?._id }
            ]
        });

        if (!conversation) {
            console.log('Conversation not found for seen event');
            return;
        }

        const conversationMessageId = conversation?.messages || [];

        await MessageModel.updateMany(
            { _id: { "$in": conversationMessageId }, msgByUserId: msgByUserId },
            { "$set": { seen: true } }
        );

        // Send conversation update
        const conversationSender = await getConversation(user?._id?.toString());
        const conversationReceiver = await getConversation(msgByUserId);

        io.to(user?._id?.toString()).emit('conversation', conversationSender);
        io.to(msgByUserId).emit('conversation', conversationReceiver);
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
        onlineUser.delete(user?._id?.toString());
        console.log('User disconnected:', socket.id);
        // Emit online users
        io.emit('onlineUser', Array.from(onlineUser));
    });
});

module.exports = {
    app,
    server,
    io
};
