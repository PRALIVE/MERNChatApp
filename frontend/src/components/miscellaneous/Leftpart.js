import { AddIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { ChatState } from "../Context/GlobalHooks";
import ChatLoading from "../Avatar/ChatLoading";
import GroupChatModal from "../Avatar/GroupChatModal";
import { getSender } from "../../config/ChatLogic";
import "./styles.css";
function Leftpart({ fetchAgain }) {
  const [loggedUser, setLoggedUser] = useState();
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderWidth="1px"
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          display="flex"
          w="100%"
          height="90px"
          bg="#53BDEB"
          justifyContent="space-between"
          alignItems="center"
        >
          Chats
          <GroupChatModal>
            <Button
              display="flex"
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              rightIcon={<AddIcon />}
            >
              New Group
            </Button>
          </GroupChatModal>
        </Box>
        <Box
          display="flex"
          flexDir="column"
          bg="white"
          w="100%"
          h="100%"
          overflowY="hidden"
        > 
          {chats ? (
            <div className="leftchatname">
              {chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  minH="60px"
                  bg={selectedChat === chat ? "#F0F2F5" : "white"}
                  color={selectedChat === chat ? "black" : "black"}
                  px={3}
                  py={3}
                  borderTopWidth="1.4px"
                  key={chat._id}
                  display="flex"
                >
                  <div className="imageavatar">
                    {!chat.isGroupChat ? (
                      <div>
                        <img className="imageavatar" src={chat.users[1].pic} />
                      </div>
                    ) : (
                      <Avatar
                        mr={2}
                        bg="grey"
                        size="md"
                        cursor="pointer"
                        name="GroupChat"
                        //src={user.pic}
                      />
                    )}
                  </div>
                  <div>
                    <Text className="chatname">
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatname}
                    </Text>
                    {chat.latestMessage && (
                      <Text className="below-chatname">
                        {chat.latestMessage.sender.name === user.name
                          ? "You"
                          : chat.latestMessage.sender.name}
                        :{" "}
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content}
                      </Text>
                    )}
                  </div>
                </Box>
              ))}
            </div>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
  );
}

export default Leftpart;
