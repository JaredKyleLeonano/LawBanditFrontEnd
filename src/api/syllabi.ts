import type { Session } from "@supabase/supabase-js";
import axios from "axios";

export const uploadSyllabus = async (
  formData: FormData,
  session: Session | null
) => {
  try {
    const response = await axios.post(
      "http://localhost:4000/uploadSyllabus",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error uploading PDF:", err);
  }
};

export const getSyllabi = async (session: Session | null) => {
  try {
    const response = await axios.get("http://localhost:4000/getSyllabi", {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error uploading PDF:", err);
  }
};

export const updateSyllabus = async (
  calendar_id: string | null = null,
  syllabus_id: number,
  user_id: string,
  title: string,
  session: Session | null
) => {
  try {
    const response = await axios.put(
      `http://localhost:4000/updateSyllabus/${syllabus_id}`,
      { calendar_id, user_id, syllabus_title: title },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error updating Syllabus Title:", err);
  }
};

export const deleteSyllabus = async (
  calendar_id: string | null = null,
  class_id: string | undefined,
  user_id: string,
  syllabus_id: number,
  session: Session | null
) => {
  try {
    const response = await axios.delete(
      `http://localhost:4000/deleteSyllabus/${syllabus_id}`,
      {
        data: {
          calendar_id,
          class_id,
          user_id,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log("Error deleting syllabus:", err);
  }
};
