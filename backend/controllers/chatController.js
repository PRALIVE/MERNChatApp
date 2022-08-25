const { populate } = require('../databasemodels/chatModel');
const Chat = require('../databasemodels/chatModel');
const User = require("../databasemodels/userModel");


const accessChats = async function(req,res){
  const {userId} = req.body;

  if(!userId){
    console.log("UserID not passed");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat:false,
    $and:[
        { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
  .populate("users","-password")
  .populate("latestMessage");

    if(isChat.length > 0 ){
        res.send(isChat[0]);
    }else{
        var chatData = {
            chatname :"Chat 2",
            isGroupChat:false,
            users:[req.user._id,userId],
        };


        try {
            var createdChat = await Chat.create(chatData);
            var FullChat = await Chat.find({_id: createdChat._id}).populate("users","-password")
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }  
};

const fetchchats = async function(req,res){
    try {
        var chatdata = await Chat.find(
            { users: { $elemMatch: { $eq: req.user._id } } 
        })
        .populate("users","-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });
        
        
         chatdata= await User.populate(chatdata, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(chatdata);

    } catch (error) {
        res.status(400);
       throw new Error(error.message);
    }
};

const createGroupChat= async function(req,res){
    var {users,name}= req.body;

    if(!users || !name){
       return res.status(400).send({message:"Please fill the all fields"});
    }

    users=JSON.parse(users);

    if(users.length <2){
        return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);

    try {
        const groupchat = await Chat.create({
            chatname: name,
            isGroupChat:true,
            users:users,
            groupAdmin:req.user,
        })
        
        const FullChat = await Chat.findOne({_id:groupchat._id})
              .populate("users","-password")
              .populate("groupAdmin","-password");

        res.status(200).json(FullChat);

    } catch (error) {
       res.status(400);
    throw new Error(error.message);  
    }
}

const renameChat = async function(req, res){
  const { chatId, chatname } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatname: chatname,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
};

const addtoGroup = async function(req,res){

     const { chatId, userId}= req.body;

     const add = await Chat.findByIdAndUpdate(chatId,{ $push:{users:userId}},{new:true})
       .populate("users","-password")
       .populate("groupAdmin","-password");
    
    if(!add){
     res.status(404);
    throw new Error("Chat Not Found");
    }else{
       res.json(add);
    }
};
const removeFromGroup = async function(req,res){

     const { chatId, userId}= req.body;

     const add = await Chat.findByIdAndUpdate(chatId,{ $pull:{users:userId}},{new:true})
       .populate("users","-password")
       .populate("groupAdmin","-password");
    
    if(!add){
     res.status(404);
    throw new Error("Chat Not Found");
    }else{
       res.json(add);
    }
};

module.exports = {accessChats,fetchchats,createGroupChat,renameChat,addtoGroup,removeFromGroup};