import type { Session } from "@supabase/supabase-js";
import axios from "axios";

export const createClass = async (
  title: FormDataEntryValue,
  session: Session | null
) => {
  try {
    const response = await axios.post(
      "http://localhost:4000/createClass",
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
    const response = await axios.get("http://localhost:4000/getClasses", {
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
    const response = await axios.put(
      `http://localhost:4000/updateClass/${class_id}`,
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
    const response = await axios.delete(
      `http://localhost:4000/deleteClass/${class_id}`,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log("Error deleting class:", err);
  }
};
