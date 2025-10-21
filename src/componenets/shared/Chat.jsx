import { useEffect, useState } from "react";
import { useAuth } from "../../firebase/AuthContext";
import { sendMessage, listenToMessages, markMessageSeen } from "../../Services/chats";

export default function Chat({ subscriptionId }) {
  const { user } = useAuth(); // logged in coach or client
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // listen to messages in this subscription chat
  useEffect(() => {
    // don't run until both exist
    if (!subscriptionId || !user) return <p>curr user didnt load</p>;


    // start listener
    const unsubscribe = listenToMessages(subscriptionId, (msgs) => {
      setMessages(msgs);

      // mark other user's messages as seen
      msgs.forEach(msg => {
        if (msg.senderUid !== user.uid && !msg.seen) {
          markMessageSeen(subscriptionId, msg.id);
        }
      });
    });

    return () => unsubscribe(); // cleanup
  }, [subscriptionId, user]);

  // send new message
  const handleSend = async () => {
    if (!user || newMessage.trim() === "") return;

    // sendMessage -> imported from ../../Services/chats
    await sendMessage(subscriptionId, user.uid, newMessage);
    setNewMessage(""); // clear input
  };

  return (
      <div
        className="d-flex flex-column border rounded p-2"
        style={{ height: "80vh", maxHeight: "80vh" }}
      >
        {/* messages area */}
        <div
          id="messages-container"
          className="flex-grow-1 overflow-y-auto mb-2 d-flex flex-column"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`d-flex ${
                msg.senderUid === user.uid
                  ? "justify-content-end"
                  : "justify-content-start"
              } mb-1`}
            >
              <div
                className={`p-2 rounded ${
                  msg.senderUid === user.uid
                    ? "bg-primary text-white"
                    : "bg-light text-dark"
                }`}
                style={{ maxWidth: "70%" }}
              >
                <div>{msg.text}</div>
                <small
                  className="d-block text-end"
                  style={{ fontSize: "0.7em" }}
                >
                  {msg.seen && msg.senderUid === user.uid ? "✓ seen" : ""}
                </small>
              </div>
            </div>
          ))}
        </div>
      
        {/* input area */}
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              // if Enter is pressed without Shift, send the message
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // prevent newline
                handleSend();
              }
            }}
          />
          <button className="btn btn-primary" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    );

}
