// Updated auth.ts
import { account } from "./appwrite";
import { OAuthProvider } from "appwrite";

export const loginWithGoogle = async () => {
  try {
    const successUrl = import.meta.env.VITE_APPWRITE_REDIRECT_SUCCESS;
    const failureUrl = import.meta.env.VITE_APPWRITE_REDIRECT_FAILURE;

    console.log("Starting Google OAuth flow...");
    
    // Directly initiate OAuth session without creating an anonymous session.
    await account.createOAuth2Session(
      OAuthProvider.Google,
      successUrl,
      failureUrl
    );
  } catch (error) {
    console.error("Google OAuth login failed:", error);
    window.location.href = failureUrl;
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
    localStorage.removeItem("sessions");
    window.location.reload();
  } catch (error) {
    console.error("Logout failed", error);
  }
};

export const getUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    console.error("Get user failed", error);
    return null;
  }
};




export const checkSession = async () => {
  try {
    // Try to get all sessions first
    const sessions = await account.listSessions();
    console.log('Current sessions:', sessions);
    
    const currentSession = await account.getSession('current');
    console.log('Current session:', currentSession);
    
    return currentSession !== null;
  } catch (error) {
    console.error("Session check failed:", error);
    return false;
  }
};