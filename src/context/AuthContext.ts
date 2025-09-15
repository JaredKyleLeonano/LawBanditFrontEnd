import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { supabase } from "../supabaseClient";
import { AuthError } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  signUp: (email: string, password: string) => Promise<ResponseType>;
  signOut: () => void; // expose the setter
  signIn: (email: string, password: string) => Promise<ResponseType>;
  signInOAuth: () => void; // expose the setter
}

export interface ResponseType {
  success: boolean;
  data: DataType | null;
  error: AuthError | null;
}

interface DataType {
  user: User | null;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthProviderProps> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);

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
  const navigate = useNavigate();
  if (!context) {
    navigate("/");
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
