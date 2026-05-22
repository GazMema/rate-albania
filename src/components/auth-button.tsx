"use client";

import { useEffect, useState } from "react";
import { LogIn, UserRound } from "lucide-react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import {
  getFirebaseAuth,
  getFirebaseDb,
  getGoogleProvider,
  hasFirebaseEnv,
  initializeVleresoAppCheck,
} from "@/lib/firebase/client";

export function AuthButton() {
  const firebaseAvailable = hasFirebaseEnv();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!firebaseAvailable);

  useEffect(() => {
    if (!firebaseAvailable) return;

    initializeVleresoAppCheck();
    return onAuthStateChanged(getFirebaseAuth(), (nextUser) => {
      setUser(nextUser);
      setReady(true);
    });
  }, [firebaseAvailable]);

  if (!firebaseAvailable) {
    return (
      <span className="hidden rounded-md border border-stone-200 px-3 py-2 text-xs text-stone-500 sm:inline-flex">
        Demo pa Firebase
      </span>
    );
  }

  if (!ready) {
    return <span className="text-sm text-stone-500">...</span>;
  }

  if (!user) {
    return (
      <button
        className="focus-ring inline-flex items-center gap-2 rounded-md bg-stone-950 px-3 py-2 text-sm font-semibold text-white hover:bg-stone-800"
        onClick={async () => {
          const result = await signInWithPopup(
            getFirebaseAuth(),
            getGoogleProvider(),
          );
          const userRef = doc(getFirebaseDb(), "users", result.user.uid);
          const profile = {
            id: result.user.uid,
            auth_provider: "google",
            email: result.user.email,
            display_name: result.user.displayName,
            avatar_url: result.user.photoURL,
            updated_at: serverTimestamp(),
          };
          const existingProfile = await getDoc(userRef);

          await setDoc(
            userRef,
            existingProfile.exists()
              ? profile
              : {
                  ...profile,
                  role: "user",
                  trust_score: 50,
                  created_at: serverTimestamp(),
                },
            { merge: true },
          );
        }}
      >
        <LogIn size={16} />
        Hyr me Google
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href="/me"
        className="hidden items-center gap-2 rounded-md border border-stone-200 px-3 py-2 text-sm font-medium sm:inline-flex"
      >
        <UserRound size={16} />
        {user.displayName ?? "Profili"}
      </a>
      <button
        className="focus-ring rounded-md px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100"
        onClick={() => signOut(getFirebaseAuth())}
      >
        Dil
      </button>
    </div>
  );
}
