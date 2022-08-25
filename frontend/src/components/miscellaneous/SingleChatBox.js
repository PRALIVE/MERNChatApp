import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import "./styles.css";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import GroupChats from "../Avatar/GroupChatsapperance";
import UpdateGroupChatModal from "../Avatar/GroupSettings";
import ProfileModal from "../Avatar/ProfileBadge";
import SingleChats from "../Avatar/SingleChatsapperance";
import { ChatState } from "../Context/GlobalHooks";
import io from "socket.io-client";
import { getSender, getSenderFull } from "../../config/ChatLogic";
import ScrollableFeed from "react-scrollable-feed";
import "./chatapplogo.png";

const ENDPOINT = "https://chattingapp2222.herokuapp.com/";  //"http://localhost:5000";
var socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const eventhandler = async (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };
  const sendMessage = async () => {
    if (newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          `/api/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        setMessages([...messages, data]);
        socket.emit("new message", data);
        setNewMessage("");
        setFetchAgain(!fetchAgain);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            bg="#F0F2F5"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                  <IconButton display={{ base: "flex" }} icon={<ViewIcon />} />
                </ProfileModal>
              </>
            ) : (
              <>
                {selectedChat.chatname.toUpperCase()}
                <>{istyping ? <div>Loading...</div> : <></>}</>
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            //bg="#EFEAE2"
            w="100%"
            h="100%"
            overflowY="hidden"
            className="back"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <ScrollableFeed className="messages">
                {!selectedChat.isGroupChat ? (
                  <SingleChats messages={messages} />
                ) : (
                  <GroupChats messages={messages} />
                )}
              </ScrollableFeed>
            )}

            <FormControl
              display="flex"
              justifyContent="center"
              onKeyDown={eventhandler}
              id="first-name"
              isRequired
              mt={5}
              mb={3}
            >
              {istyping ? <div>Loading...</div> : <></>}
              <Input
                variant="filled"
                bg="white"
                width="90%"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
              <Button
                type="button"
                marginLeft="8px"
                colorScheme="whatsapp"
                onClick={sendMessage}
              >
                Send
              </Button>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          className="openwindow"
        >
          <div className="insidewindow">
            <div>Click on a user to start chatting</div>
          </div>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
