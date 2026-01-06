// services/chats.js
import { db } from "../firebase/config";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc, doc } from "firebase/firestore";

// SERVICES: chats.js
// -> Firestore helper functions for subscription chat.
// -> Used to send messages + listen in realtime (reactive UI).
// -> Collection path used here: subscriptions/{subscriptionId}/chat

// sendMessage
// -> Adds a new chat message document.
// -> Writes to: subscriptions/{subscriptionId}/chat
// -> Why serverTimestamp:
//    -> Uses Firestore server time (not the user's PC time), so ordering is consistent.
export const sendMessage = async (subscriptionId, senderUid, text) => {
  await addDoc(collection(db, "subscriptions", subscriptionId, "chat"), {
    senderUid: senderUid,           // who sent the message (uid)
    text: text,                     // message text
    timestamp: serverTimestamp(),   // server time so messages are synced across users/devices
    seen: false                     // default: unread for the other side
  });
};

// listenToMessages
// -> Creates a realtime listener to chat messages (live updates).
// -> Reads from: subscriptions/{subscriptionId}/chat
// -> Returns: an "unsubscribe" function (VERY IMPORTANT) -> call it in useEffect cleanup.
// -> callback(messages): gives the UI an array of message objects in order.
export const listenToMessages = (subscriptionId, callback) => {
  // Build a Firestore query:
  // -> orderBy("timestamp", "asc") makes messages come oldest -> newest
  // -> without this, Firestore can return messages in an undefined order
  const q = query(
    collection(db, "subscriptions", subscriptionId, "chat"),
    orderBy("timestamp", "asc") // order by time (oldest first)
  );

  // onSnapshot keeps a live connection:
  // -> It runs once immediately with current data
  // -> Then runs again automatically every time something changes (add/update/delete)
  // -> It returns a function you must call to stop listening (unsubscribe)
  return onSnapshot(q, (snapshot) => {
    // Convert firestore docs -> normal JS objects for the UI
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,     // chat message doc id
      ...doc.data()   // senderUid, text, timestamp, seen, etc.
    }));
    // Send the updated message list back to whoever called listenToMessages
    callback(messages);
  });
};

// markMessageSeen
// -> Marks a specific message doc as "seen: true" (read).
// -> Writes to: subscriptions/{subscriptionId}/chat/{messageId}
export const markMessageSeen = async (subscriptionId, messageId) => {
  const msgRef = doc(db, "subscriptions", subscriptionId, "chat", messageId);
  await updateDoc(msgRef, { seen: true });
};
