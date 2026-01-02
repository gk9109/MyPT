import { useEffect, useState } from "react";
import { useAuth } from "../../firebase/AuthContext";
import { sendMessage, listenToMessages, markMessageSeen } from "../../Services/chats";

// What this component does:
// -> Implements a real-time chat UI between a coach and a client.
// -> Displays messages for a specific subscription chat.
// -> Allows sending new messages.
// -> Marks incoming messages as "seen" once they are received and rendered.
//
// Where it's used:
// -> Chat page/route (ex: /chat/:subscriptionId).
// -> subscriptionId represents the coach-client relationship chat channel.
//
// Props:
// subscriptionId (string)
// -> Unique chat identifier (usually coachUid_clientUid).
// -> Used by Services/chats to read/write messages under the correct Firestore path.
//
// Real-time behavior (important):
// -> This chat is reactive because it uses listenToMessages(...)
// -> listenToMessages is expected to wrap Firestore onSnapshot(), which pushes updates
//    instantly when the messages collection changes (no refresh needed).
//
// Notes:
// -> This component does not directly use Firestore APIs.
// -> All Firestore operations are in ../../Services/chats (send/listen/markSeen).
export default function Chat({ subscriptionId }) {
  const { user } = useAuth(); // Logged-in user (either coach or client)
  const [messages, setMessages] = useState([]); // messages = the current message list for this subscription chat
  const [newMessage, setNewMessage] = useState(""); // newMessage = input text the user is typing

  // Listen to messages in real time:
  // -> Starts a Firestore listener for this subscriptionId
  // -> Updates local state whenever a message is added/changed
  // -> Marks the OTHER user's messages as seen
  // -> Cleans up the listener when leaving the page or changing subscriptionId
  useEffect(() => {
    // Don't start listening until we have both user + subscriptionId
    if (!subscriptionId || !user) return <p>curr user didnt load</p>;

    // Start real-time listener (usually onSnapshot under the hood)
    const unsubscribe = listenToMessages(subscriptionId, (msgs) => {
      setMessages(msgs);

      // Mark messages as seen:
      // -> Only messages sent by the other user
      // -> Only messages not already marked as seen
      msgs.forEach(msg => {
        if (msg.senderUid !== user.uid && !msg.seen) {
          markMessageSeen(subscriptionId, msg.id);
        }
      });
    });
    // Cleanup: stop listening when component unmounts / dependencies change
    return () => unsubscribe();
  }, [subscriptionId, user]);

  // Send a new message (input -> Firestore)
  const handleSend = async () => {
    if (!user || newMessage.trim() === "") return;

    // sendMessage is implemented in ../../Services/chats
    await sendMessage(subscriptionId, user.uid, newMessage);
    setNewMessage(""); // Clear input after successful send
  };

  return (
      <div
        className="d-flex flex-column border rounded p-2"
        style={{ height: "80vh", maxHeight: "80vh" }}
      >
        {/* Messages area (scrollable) */}
        <div
          id="messages-container"
          className="flex-grow-1 overflow-y-auto mb-2 d-flex flex-column"
        >
          {/* Render each message as a chat bubble */}
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
                  {/* Seen indicator:
                  -> Only show "✓ seen" on messages YOU sent
                  -> Only when Firestore marked them as seen */}
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
              // Enter sends the message (Shift+Enter is allowed for multiline behavior in some apps)
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
