import type { Session } from "@supabase/supabase-js";
import axios from "axios";

export const saveTokens = async (
  user_id: string,
  provider: string,
  provider_token: string,
  refresh_token: string,
  expires_at: number,
  expires_in: number,
  session: Session | null
) => {
  try {
    const response = await axios.post(
      "http://localhost:4000/saveTokens",
      {
        user_id,
        provider,
        provider_token,
        refresh_token,
        expires_at,
        expires_in,
      },
      {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error saving tokens", err);
  }
};

export const deleteTokens = async (
  user_id: string,
  session: Session | null
) => {
  try {
    console.log("USER ID", user_id);
    const response = await axios.delete(
      `http://localhost:4000/deleteTokens/${user_id}`,
      {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error saving tokens", err);
  }
};
