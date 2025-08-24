
// Schema + helpers for subscriptions

/** @typedef {"active"|"pending"|"canceled"} SubscriptionStatus */

/**
 * @typedef {Object} Subscription
 * @property {string} coachUid
 * @property {string} clientUid
 * @property {SubscriptionStatus} status
 * @property {import("firebase/firestore").Timestamp=} createdAt
 * @property {import("firebase/firestore").Timestamp=} updatedAt
 * @property {string=} createdBy
 * @property {string=} serachName
 */

// Name of the Firestore collection 
export const SUBS_COLLECTION = "subscriptions";
// Generate unique docId by combining coachUid + clientUid
export const subId = (coachUid, clientUid) => `${coachUid}_${clientUid}`;




