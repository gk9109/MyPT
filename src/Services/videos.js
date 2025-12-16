import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

// Get all videos of a specific coach (matches your current schema)
export async function getCoachVideos(coachUid) {
  try {
    const videosRef = collection(db, "videos", coachUid, "exercises");
    const snap = await getDocs(videosRef);

    return snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(), // { coachUid, name, tag, videoUrl, createdAt, ... }
    }));
  } catch (err) {
    console.log("getCoachVideos error:", err);
    return [];
  }
}

