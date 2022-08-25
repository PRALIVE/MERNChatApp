
const express=require('express');
const {accessChats,fetchchats,createGroupChat,renameChat,addtoGroup,removeFromGroup} = require('../controllers/chatController');
const {protect} = require("../middleware/authMiddeleware");
const router=express.Router();

router.route("/").get(protect,fetchchats);
router.route("/").post(protect,accessChats);
router.route("/group").post(protect,createGroupChat);
router.route("/rename").put(protect,renameChat);
router.route("/groupadd").put(protect,addtoGroup);
router.route("/groupremove").put(protect,removeFromGroup);

module.exports = router;