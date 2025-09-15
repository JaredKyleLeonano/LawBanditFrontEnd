import type { ProcessedEvent } from "@aldabil/react-scheduler/types";
import type { Session } from "@supabase/supabase-js";
import axios from "axios";

interface AssignmentType {
  syllabus_id: number;
  user_id: string;
  id: number;
  title: string;
  subtitle: string;
  deadline: Date;
  start: Date;
  end: Date;
  created_at: Date;
}

const formatAssignmentSchedule = (assignments: AssignmentType[]) => {
  return assignments.map((assignment) => ({
    event_id: assignment.id,
    syllabus_id: assignment.syllabus_id,
    title: assignment.title,
    subtitle: assignment.subtitle,
    start: new Date(assignment.start),
    end: new Date(assignment.end),
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
  event: ProcessedEvent,
  session: Session | null
) => {
  try {
    const response = await axios.post(
      "http://localhost:4000/createAssignment",
      event,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );
    console.log("Create assignment response:", response);
  } catch (error) {
    console.error("Error creating assignment:", error);
  }
};

export const updateAssignment = async (
  event: ProcessedEvent,
  session: Session | null
) => {
  try {
    const response = await axios.put(
      `http://localhost:4000/updateAssignment/${event.event_id}`,
      event,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );
    console.log("Update response:", response.data);
  } catch (err) {
    console.error("Error uploading PDF:", err);
  }
};

export const deleteAssignment = async (
  eventId: number,
  session: Session | null
) => {
  try {
    const response = await axios.delete(
      `http://localhost:4000/deleteAssignment/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );
    console.log("Delete response:", response.data);
  } catch (err) {
    console.log("Error deleting assignment:", err);
  }
};
