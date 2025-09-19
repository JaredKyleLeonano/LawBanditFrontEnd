import React, { createContext, useContext, useState, useEffect } from "react";

import { supabase } from "../supabaseClient";
import { AuthError } from "@supabase/supabase-js";
import type { Session } from "@supabase/supabase-js";
import { saveTokens } from "../api/google";
import { useRef } from "react";
import type {
  AuthContextType,
  ResponseType,
  AuthProviderProps,
} from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<AuthProviderProps> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const hasSavedTokens = useRef(false);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }: { data: { session: Session | null } }) =>
        setSession(session)
      );

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => setSession(session)
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user && session.provider_token && !hasSavedTokens.current) {
      hasSavedTokens.current = true;
      const retrieveTokens = async () => {
        await saveTokens(
          session.user.id,
          session.user.app_metadata.provider!,
          session.provider_token!,
          session.provider_refresh_token!,
          session.expires_at!,
          session.expires_in,
          session
        );
      };
      retrieveTokens();
    }
  }, [session]);

  const signUp = async (
    email: string,
    password: string
  ): Promise<ResponseType> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
      });
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error("Error signing up:", error);
      return { success: false, data: null, error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error signing out:", error);
      return { success: false, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });
      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error("Error signing in:", error);
      return { success: false, data: null, error: error as AuthError };
    }
  };

  const signInOAuth = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          scopes: "https://www.googleapis.com/auth/calendar",
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error signing in:", error);
      return { success: false, error };
    }
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { session, signUp, signOut, signIn, signInOAuth } },
    children
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
