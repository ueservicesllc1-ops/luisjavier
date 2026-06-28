import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Session {
  id: string;
  clientId: string;
  title: string;
  date: Timestamp;
  coverImageUrl: string;
  status: "processing" | "ready" | "archived";
  description: string;
  location: string;
  photoCount: number;
  videoCount: number;
}

export interface Photo {
  id: string;
  sessionId: string;
  filename: string;
  b2Key: string;
  thumbnailKey: string;
  width: number;
  height: number;
  size: number;
  downloadCount: number;
  order: number;
}

export interface Video {
  id: string;
  sessionId: string;
  filename: string;
  b2Key: string;
  thumbnailKey: string;
  duration: number;
  size: number;
}

export interface ClientProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: Timestamp;
}

export async function getClientProfile(uid: string): Promise<ClientProfile | null> {
  const docRef = doc(db, "clients", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { uid: docSnap.id, ...docSnap.data() } as ClientProfile;
  }
  return null;
}

export async function getClientSessions(clientId: string): Promise<Session[]> {
  const q = query(
    collection(db, "sessions"),
    where("clientId", "==", clientId),
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Session));
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const docRef = doc(db, "sessions", sessionId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Session;
  }
  return null;
}

export async function getSessionPhotos(sessionId: string): Promise<Photo[]> {
  const q = query(
    collection(db, "photos"),
    where("sessionId", "==", sessionId),
    orderBy("order", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Photo));
}

export async function getSessionVideos(sessionId: string): Promise<Video[]> {
  const q = query(
    collection(db, "videos"),
    where("sessionId", "==", sessionId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Video));
}
