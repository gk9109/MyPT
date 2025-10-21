import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Chat from "../../componenets/shared/Chat";
import { useAuth } from "../../firebase/AuthContext";

export default function ChatPage() {
  // gets the subscriptionId from the URL (the part after /chat/)
  // for example, if the URL is /chat/abc123_XYZ456
  // then subscriptionId = "abc123_XYZ456"
  const { subscriptionId } = useParams();

  // bring user info (logged in user) and stored context values from AuthContext
  const { user, selectedClient, setSelectedClient, selectedCoach, setSelectedCoach } = useAuth();

  // --- Restore selected users (client/coach) after page refresh ---
  // Context data (selectedClient, selectedCoach) gets lost when refreshing,
  // so we re-load them from localStorage if they exist there.
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

  // --- Decide which name to show at the top of the chat window ---
  // By default, show just "Chat" if we can’t identify the other user.
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
      {/* Header showing the chat name (client or coach) */}
      <h4>{chatName}</h4>

      {/* Chat component handles displaying and sending messages */}
      <Chat subscriptionId={subscriptionId} />
    </div>
  );
}
