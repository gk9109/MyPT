import { db, storage } from "../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// getCoachProfile(uid) -> Firestore data (or null)
export async function getCoachProfile(uid) {
  const coachRef = doc(db, "coaches", uid);
  const snap = await getDoc(coachRef);
  return snap.exists() ? snap.data() : null;
}

// saveCoachProfile(uid, data) -> updates Firestore fields
export async function saveCoachProfile(uid, data) {
  const coachRef = doc(db, "coaches", uid);
  await updateDoc(coachRef, data);
}

// uploadProfilePic(uid, file, oldPath) -> { url, path }
export async function uploadProfilePic(uid, file, oldPath = "") {
  if (oldPath) {
    try {
      await deleteObject(ref(storage, oldPath));
    } catch (err) {
      console.log("Old profile pic delete failed:", err);
    }
  }

  const safeName = file.name.replace(/\s+/g, "_");
  const path = `coachMedia/${uid}/profile/${Date.now()}_${safeName}`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  return { url, path };
}

// uploadGalleryImage(uid, file) -> { url, path }
export async function uploadGalleryImage(uid, file) {
  const safeName = file.name.replace(/\s+/g, "_");
  const path = `coachMedia/${uid}/gallery/${Date.now()}_${safeName}`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  return { url, path };
}

// deleteByPath(path) -> deletes file from Storage
export async function deleteByPath(path) {
  await deleteObject(ref(storage, path));
}
