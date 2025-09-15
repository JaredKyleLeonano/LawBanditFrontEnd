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
    console.log("Upload syllabus response:", response.data);
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
    console.log("Retrieve syllabi response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error uploading PDF:", err);
  }
};

export const updateSyllabus = async (
  syllabus_id: number,
  title: FormDataEntryValue,
  session: Session | null
) => {
  try {
    const response = await axios.put(
      `http://localhost:4000/updateSyllabus/${syllabus_id}`,
      { syllabus_title: title },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );
    console.log("Update response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error updating Syllabus Title:", err);
  }
};

export const deleteSyllabus = async (
  syllabus_id: number,
  session: Session | null
) => {
  try {
    const response = await axios.delete(
      `http://localhost:4000/deleteSyllabus/${syllabus_id}`,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );
    console.log("Delete Syllabus response:", response.data);
  } catch (err) {
    console.log("Error deleting syllabus:", err);
  }
};
