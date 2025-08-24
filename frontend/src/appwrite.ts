// src/appwrite.ts
import { Client, Account, OAuthProvider } from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // e.g. "https://cloud.appwrite.io/v1"
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);

// (Optionally, export OAuthProvider if needed)
export { OAuthProvider };
