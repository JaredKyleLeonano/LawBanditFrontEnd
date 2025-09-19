import type { Session } from "@supabase/supabase-js";
import { api } from "./api";

export const createClass = async (
  title: FormDataEntryValue,
  session: Session | null
) => {
  try {
    const response = await api.post(
      "/createClass",
      { title: title },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating class:", error);
  }
};

export const getClasses = async (session: Session | null) => {
  try {
    const response = await api.get("/getClasses", {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    return response;
  } catch (err) {
    console.error("Error retrieving classes:", err);
  }
};

export const updateClass = async (
  class_id: number,
  title: string,
  session: Session | null
) => {
  try {
    const response = await api.put(
      `/updateClass/${class_id}`,
      { class_title: title },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error updating class title:", err);
  }
};

export const deleteClass = async (
  class_id: number,
  session: Session | null
) => {
  try {
    const response = await api.delete(`/deleteClass/${class_id}`, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error deleting class:", err);
  }
};
