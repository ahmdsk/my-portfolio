import { initializeApp, getApps, FirebaseApp, getApp } from 'firebase/app';
import { getStorage } from "firebase/storage";
import { getFirestore, Firestore, DocumentData, QueryDocumentSnapshot, Timestamp, type FirestoreDataConverter, SnapshotOptions } from 'firebase/firestore';
import type { Project, Saran } from '@/types';

type ProjectDoc = Omit<Project, "id" | "createdAt"> & {
  createdAt: Timestamp | null;
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
export const storage = getStorage(app);

// Firestore converters
export const projectConverter: FirestoreDataConverter<Project> = {
  toFirestore(p): DocumentData {
    // NOTE: only used if you also choose to write via converter.
    return {
      title: p.title,
      shortDescription: p.shortDescription,
      description: p.description,
      cover: p.cover ?? null,
      coverAlt: p.coverAlt ?? null,
      tags: p.tags ?? null,
      url: p.url ?? null,
      createdAt: p.createdAt instanceof Timestamp ? p.createdAt.toDate() : null,
    };
  },
  fromFirestore(
    snap: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Project {
    const d = snap.data(options) as DocumentData; // not "any"
    const data = d as Partial<ProjectDoc>;
    return {
      id: snap.id,
      title: data.title ?? "",
      shortDescription: data.shortDescription ?? "",
      description: data.description ?? "",
      cover: (data.cover ?? null) as string | null,
      coverAlt: (data.coverAlt ?? null) as string | null,
      tags: (data.tags ?? null) as string[] | null,
      url: (data.url ?? null) as string | null,
      createdAt:
        data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
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
