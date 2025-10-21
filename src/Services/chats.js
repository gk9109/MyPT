// services/chats.js
import { db } from "../firebase/config";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc, doc } from "firebase/firestore";

// send a new message to the chat
export const sendMessage = async (subscriptionId, senderUid, text) => {
  await addDoc(collection(db, "subscriptions", subscriptionId, "chat"), {
    senderUid: senderUid,       // who sent the message
    text: text,                 // the actual message text
    timestamp: serverTimestamp(), // server time so messages are in sync
    seen: false                 // when created it is unread
  });
};

// listen for new messages in realtime
export const listenToMessages = (subscriptionId, callback) => {
  const q = query(
    collection(db, "subscriptions", subscriptionId, "chat"),
    orderBy("timestamp", "asc") // order by time (oldest first)
  );

  return onSnapshot(q, (snapshot) => {
    // turn firestore docs into plain objects
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages); // give the messages back
  });
};

// mark a message as read
export const markMessageSeen = async (subscriptionId, messageId) => {
  const msgRef = doc(db, "subscriptions", subscriptionId, "chat", messageId);
  await updateDoc(msgRef, { seen: true });
};
