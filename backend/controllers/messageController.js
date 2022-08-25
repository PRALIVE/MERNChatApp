const User = require('../databasemodels/userModel');
const Chat = require('../databasemodels/chatModel');
const Message = require('../databasemodels/messageModel');

const allMessages = async function(req,res){
  try {
    const message = await Message.find({chat:req.params.chatId})
     .populate("sender","name email pic")
     .populate("chat");

     res.json(message);
  } catch (error) {
     res.status(401);
     throw new Error(error.message);
  }
};

const sendMessage = async function(req,res){
    const {content,chatId}= req.body;

    if(!content || !chatId){
        console.log("Invalid content and chatId");
        return res.sendStatus(400);
    }

    var message = await Message.create({
        sender:req.user._id,
        content:content,
        chat:chatId,
    });

    try {
        message= await message.populate("sender","name pic")
        message= await message.populate("chat")
        message = await User.populate(message, {
         path: "chat.users",
         select: "name pic email",
    });
        await Chat.findByIdAndUpdate(req.body.chatId,{latestMessage:message});
        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

module.exports = { sendMessage , allMessages };