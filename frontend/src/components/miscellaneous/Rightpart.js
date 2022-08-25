import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/GlobalHooks";
import SingleChat from "./SingleChatBox";

function Rightpart({ fetchAgain, setFetchAgain }) {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      bg="white"
      w={{ base: "100%", md: "69%" }}
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
}

export default Rightpart;
