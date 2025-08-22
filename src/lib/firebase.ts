import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getStorage } from "firebase/storage";
import { getFirestore, Firestore, DocumentData, QueryDocumentSnapshot, Timestamp, type FirestoreDataConverter } from 'firebase/firestore';
import type { Project, Saran } from '@/types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app: FirebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
export const storage = getStorage(app);

// Firestore converters
export const projectConverter: FirestoreDataConverter<Project> = {
  toFirestore(p: Project) {
    return {
      title: p.title,
      shortDescription: p.shortDescription ?? "",
      description: p.description ?? "",      // HTML
      cover: p.cover ?? null,
      coverAlt: p.coverAlt ?? null,
      tags: p.tags ?? null,
      url: p.url ?? null,
      createdAt: p.createdAt ?? Timestamp.now(),
    };
  },
  fromFirestore(snap, options): Project {
    const d = snap.data(options) as any;
    return {
      id: snap.id,
      title: d.title ?? "",
      shortDescription: d.shortDescription ?? "",
      description: d.description ?? "",
      cover: d.cover ?? null,
      coverAlt: d.coverAlt ?? null,
      tags: d.tags ?? null,
      url: d.url ?? null,
      createdAt: d.createdAt instanceof Timestamp ? d.createdAt.toDate() : d.createdAt ?? null,
    };
  },
};

export const saranConverter = {
  toFirestore(s: Omit<Saran, "id">) { return s; },
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): Saran {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      name: data.name as string,
      message: data.message as string,
      userId: data.userId as string,
      createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000) : undefined,
    };
  },
};
