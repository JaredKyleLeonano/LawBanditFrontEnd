import type { Session } from "@supabase/supabase-js";
import axios from "axios";
import type { AssignmentType } from "../types";

const formatAssignmentSchedule = (assignments: AssignmentType[]) => {
  return assignments.map((assignment) => ({
    id: assignment.id,
    syllabus_id: assignment.syllabus_id,
    title: assignment.title,
    subtitle: assignment.subtitle,
    start: assignment.start,
    end: assignment.end,
    event_id: assignment.event_id,
  }));
};

export const getAssignments = async (session: Session | null) => {
  try {
    const response = await axios.get("http://localhost:4000/getAssignments", {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    console.log("Response from getAssignments:", response.data);
    const assignmentSchedule = formatAssignmentSchedule(response.data);
    return assignmentSchedule;
  } catch (err) {
    console.error("Error fetching assignments:", err);
  }
};

export const createAssignment = async (
  calendar_id: string | null = null,
  user_id: string,
  syllabus_id: string,
  title: string,
  subtitle: string,
  start: string,
  end: string,
  session: Session | null
) => {
  try {
    const response = await axios.post(
      "http://localhost:4000/createAssignment",
      { calendar_id, user_id, syllabus_id, title, subtitle, start, end },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating assignment:", error);
  }
};

export const updateAssignment = async (
  event_id: string | null = null,
  calendar_id: string | null = null,
  user_id: string,
  assignment_id: string,
  title: string,
  subtitle: string,
  start: string,
  end: string,
  session: Session | null
) => {
  try {
    const response = await axios.put(
      `http://localhost:4000/updateAssignment/${assignment_id}`,
      { event_id, calendar_id, user_id, title, subtitle, start, end },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error updating assignment:", err);
  }
};

export const deleteAssignment = async (
  event_id: string | null = null,
  calendar_id: string | null = null,
  user_id: string,
  assignment_id: number,
  session: Session | null
) => {
  try {
    const response = await axios.delete(
      `http://localhost:4000/deleteAssignment/${assignment_id}`,
      {
        data: {
          event_id,
          calendar_id,
          user_id,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log("Error deleting assignment:", err);
  }
};
