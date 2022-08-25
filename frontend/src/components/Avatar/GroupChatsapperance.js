import { ChatState } from "../Context/GlobalHooks";
import { isSameSenderMargin, isSameUser } from "../../config/ChatLogic";

function GroupChats({ messages }) {
  const { user } = ChatState();

  return (
    <>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "white" : "#B9F5D0"
                }`,
                marginLeft: user._id == m.sender._id ? "auto" : 50,
                marginRight: user._id == m.sender._id ? 50 : "auto",
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                //marginTop: "8px",
                borderRadius: "10px",
                borderTopLeftRadius: 0,
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.sender._id === user._id ? (
                m.content
              ) : (
                <>
                  <b>{m.sender.name}</b>
                  <br></br>
                  {m.content}
                </>
              )}
            </span>
          </div>
        ))}
    </>
  );
}

export default GroupChats;
