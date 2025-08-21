import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
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

// Firestore converters
export const projectConverter = {
  toFirestore(p: Omit<Project, "id">) { return p; },
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): Project {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      title: data.title as string,
      description: data.description as string,
      cover: data.cover as string | undefined,
      tags: data.tags as string[] | undefined,
      url: data.url as string | undefined,
      createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000) : undefined,
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
