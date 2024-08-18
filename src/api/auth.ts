import { auth, provider, signInWithPopup, signOut } from "./set_firebase";

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
