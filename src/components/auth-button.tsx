"use client";

import { useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";
import { LogIn, UserRound } from "lucide-react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
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
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseAvailable) return;

    initializeVleresoAppCheck();
    return onAuthStateChanged(getFirebaseAuth(), (nextUser) => {
      setUser(nextUser);
      setReady(true);

      if (nextUser) {
        syncUserProfile(nextUser).catch((caughtError) => {
          setError(getProfileSyncErrorMessage(caughtError));
          console.error("Firebase profile sync failed", caughtError);
        });
      }
    });
  }, [firebaseAvailable]);

  async function handleSignIn() {
    setError(null);
    setIsSigningIn(true);

    try {
      await signInWithPopup(getFirebaseAuth(), getGoogleProvider());
    } catch (caughtError) {
      if (isPopupBlockedError(caughtError)) {
        await signInWithRedirect(getFirebaseAuth(), getGoogleProvider());
        return;
      }

      const message = getSignInErrorMessage(caughtError);

      if (message) {
        setError(message);
        console.error("Google sign-in failed", caughtError);
      }
    } finally {
      setIsSigningIn(false);
    }
  }

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
      <div className="relative">
        <button
          className="focus-ring inline-flex items-center gap-2 rounded-md bg-stone-950 px-3 py-2 text-sm font-semibold text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-500"
          disabled={isSigningIn}
          onClick={handleSignIn}
        >
          <LogIn size={16} />
          {isSigningIn ? "Duke hyrë..." : "Hyr me Google"}
        </button>
        {error ? <AuthError message={error} /> : null}
      </div>
    );
  }

  return (
    <div className="relative">
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
      {error ? <AuthError message={error} /> : null}
    </div>
  );
}

async function syncUserProfile(user: User) {
  const userRef = doc(getFirebaseDb(), "users", user.uid);
  const profile = {
    id: user.uid,
    auth_provider: "google",
    email: user.email,
    display_name: user.displayName,
    avatar_url: user.photoURL,
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
}

function AuthError({ message }: { message: string }) {
  return (
    <p className="absolute right-0 top-full z-40 mt-2 w-72 rounded-md border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-700 shadow-sm">
      {message}
    </p>
  );
}

function isPopupBlockedError(error: unknown) {
  return error instanceof FirebaseError && error.code === "auth/popup-blocked";
}

function getSignInErrorMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return "Hyrja me Google dështoi. Provo përsëri.";
  }

  if (
    error.code === "auth/popup-closed-by-user" ||
    error.code === "auth/cancelled-popup-request"
  ) {
    return null;
  }

  if (error.code === "auth/unauthorized-domain") {
    return "Ky domain nuk është i lejuar në Firebase Authentication.";
  }

  if (error.code === "auth/operation-not-allowed") {
    return "Google duhet aktivizuar te Firebase Authentication.";
  }

  if (error.code === "auth/popup-blocked") {
    return "Shfletuesi bllokoi dritaren e Google. Provo përsëri.";
  }

  return "Hyrja me Google dështoi. Provo përsëri.";
}

function getProfileSyncErrorMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return "Hyrja u krye, por profili nuk u ruajt. Provo përsëri.";
  }

  if (error.code === "permission-denied") {
    return "Hyrja u krye, por profili nuk u ruajt. Kontrollo Firestore rules.";
  }

  return "Hyrja u krye, por profili nuk u ruajt. Provo përsëri.";
}
