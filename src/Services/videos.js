import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

// SERVICES: videos.js
// -> Firestore helper functions for coach exercise videos.
// -> Used to fetch a coach's video library for exercise demos.
// -> Collection path used here: videos/{coachUid}/exercises

// getCoachVideos
// -> Fetches all video docs for a specific coach.
// -> Reads from: videos/{coachUid}/exercises
// -> Returns: array like [{ id, ...videoData }, ...]
export async function getCoachVideos(coachUid) {
  try {
    // Reference coach's exercises subcollection inside "videos"
    const videosRef = collection(db, "videos", coachUid, "exercises");
    const snap = await getDocs(videosRef);

    // Map Firestore docs into plain JS objects for the UI
    return snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(), // { coachUid, name, tag, videoUrl, createdAt, ... }
    }));
  } catch (err) {
    console.log("getCoachVideos error:", err);
    return [];
  }
}

