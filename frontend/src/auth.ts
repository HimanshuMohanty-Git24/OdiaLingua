// src/auth.ts
import { account, OAuthProvider } from "./appwrite"

export const loginWithGoogle = async () => {
  try {
    // This will redirect to Google OAuth
    await account.createOAuth2Session(
      OAuthProvider.Google,
      import.meta.env.VITE_APPWRITE_REDIRECT_SUCCESS, // success URL
      import.meta.env.VITE_APPWRITE_REDIRECT_FAILURE   // failure URL
    )
  } catch (error) {
    console.error("Google login failed:", error)
    throw error
  }
}

// Function to get current user (matches your ChatUI expectation)
export const getUser = async () => {
  try {
    return await account.get()
  } catch {
    return null
  }
}

// Function to logout (matches your ChatUI expectation)
export const logoutUser = async () => {
  try {
    await account.deleteSession('current')
    // Clear any local storage if needed
    localStorage.removeItem("sessions")
  } catch (error) {
    console.error("Logout failed:", error)
    throw error
  }
}

// Additional helper functions
export const getCurrentUser = getUser // Alias for consistency
export const logout = logoutUser // Alias for consistency
