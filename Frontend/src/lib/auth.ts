import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import { API_URL } from "./api";

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    emailOTPClient()
  ]
});

export const { signIn, signUp, useSession, signOut } = authClient;
