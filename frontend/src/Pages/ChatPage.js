import Toppart from "../components/miscellaneous/Toppart";
import Leftpart from "../components/miscellaneous/Leftpart";
import Rightpart from "../components/miscellaneous/Rightpart";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ChatState } from "../components/Context/GlobalHooks";
import "../App.css"

const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div className="chat-page">
      {user && <Toppart />}
      <div className="chat">
        {user && <Leftpart fetchAgain={fetchAgain} />}
        {user &&  <Rightpart  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}  />}
      </div>
    </div>
  );
};

export default ChatPage;
