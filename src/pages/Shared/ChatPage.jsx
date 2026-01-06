import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Chat from "../../componenets/shared/Chat";
import { useAuth } from "../../firebase/AuthContext";

// ChatPage
// What this component does:
// -> Displays the chat screen for a specific coach-client conversation.
// -> Extracts the subscriptionId from the URL.
// -> Restores selected client/coach context after page refresh.
// -> Determines which name to show at the top of the chat.
//
// Where it's used:
// -> Routes like /chat/:subscriptionId.
// -> Used by both coaches and clients.
//
// Notes:
// -> Chat UI and message logic live inside the Chat component.
// -> This page only handles routing + context restoration.
export default function ChatPage() {
  // Extract subscriptionId from the URL (after /chat/)
  // Example: /chat/abc123_XYZ456 -> subscriptionId = "abc123_XYZ456"
  const { subscriptionId } = useParams();

  // Logged-in user + selected client/coach from AuthContext
  const { user, selectedClient, setSelectedClient, selectedCoach, setSelectedCoach } = useAuth();

  // Restore selected client/coach after page refresh
  // -> Context state is lost on refresh, but localStorage persists.
  // -> This ensures chat still knows who the "other side" is.
  useEffect(() => {
    // if selectedClient is empty/null, try restoring it from localStorage
    if (!selectedClient) {
      const savedClient = localStorage.getItem("selectedClient");
      if (savedClient) setSelectedClient(JSON.parse(savedClient));
    }

    // if selectedCoach is empty/null, try restoring it from localStorage
    if (!selectedCoach) {
      const savedCoach = localStorage.getItem("selectedCoach");
      if (savedCoach) setSelectedCoach(JSON.parse(savedCoach));
    }
  }, [selectedClient, selectedCoach, setSelectedClient, setSelectedCoach]);

  // Decide which name to display above the chat
  // -> Coach sees the client's name
  // -> Client sees the coach's name
  let chatName = "Chat";

  // if the logged-in user is a coach, display the client's name
  if (user?.role === "coach" && selectedClient?.searchName) {
    chatName = selectedClient.searchName;
  }

  // if the logged-in user is a client, display the coach's name
  else if (user?.role === "client" && selectedCoach?.searchName) {
    chatName = selectedCoach.searchName;
  }

  // Render the chat page layout
  return (
    <div className="container mt-3">
      {/* Chat header (name of the other participant) */}
      <h4>{chatName}</h4>

      {/* Chat:
        -> Handles fetching, displaying, and sending messages.
        -> subscriptionId identifies the specific coach-client conversation. */}
      <Chat subscriptionId={subscriptionId} />
    </div>
  );
}
