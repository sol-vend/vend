import { db } from "../../firebaseInit";
import { doc, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid"; // install this for clean unique IDs

export const uploadQrPayload = async (payload) => {
  const id = nanoid(12); // generates short unique ID like "aB3dF7"
  const docRef = doc(db, "qrPayloads", id);
  await setDoc(docRef, {
    payload,
    createdAt: new Date().toISOString(),
  });

  // Return the URL to encode in the QR
  return `https://solvend.link/${id}`; // OR use dynamic link base
};