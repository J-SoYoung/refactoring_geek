import { onAuthStateChanged, User } from "firebase/auth";
import {
  auth,
  database,
  provider,
  signInWithPopup,
  signOut,
} from "./setting_firebase";
import { get, ref } from "firebase/database";
import { AdminUser } from "../atoms/userAtom";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("User info:", user);
    return user;
  } catch (error) {
    console.error(error);
  }
};

export const signOutFromGoogle = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Sign-Out Error:", error);
    throw error;
  }
};

////// ⭕ 이전코드
export async function login(): Promise<User | void> {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Login error:", error);
  }
}

export async function logout(): Promise<void | null> {
  try {
    await signOut(auth);
    return null;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

export function onUserStateChange(callback: (user: User | null) => void): void {
  onAuthStateChanged(auth, async (user) => {
    const updatedUser = user ? await fetchAdminUser(user) : null;
    callback(updatedUser);
  });
}

async function fetchAdminUser(user: User): Promise<AdminUser> {
  const snapshot = await get(ref(database, "admins"));
  if (snapshot.exists()) {
    const admins = snapshot.val();
    const isAdmin = admins.includes(user.uid);
    return { ...user, isAdmin };
  }
  return { ...user, isAdmin: false };
}
