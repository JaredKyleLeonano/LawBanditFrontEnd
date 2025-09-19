import type { Session, User, AuthError } from "@supabase/supabase-js";
import type { ReactNode } from "react";

export interface AssignmentType {
  syllabus_id: number;
  user_id: string;
  id: number;
  title: string;
  subtitle: string;
  deadline: Date;
  start: string;
  end: string;
  created_at: Date;
  event_id: string;
}

export interface AuthContextType {
  session: Session | null;
  signUp: (email: string, password: string) => Promise<ResponseType>;
  signOut: () => void;
  signIn: (email: string, password: string) => Promise<ResponseType>;
  signInOAuth: () => void;
}

export interface ResponseType {
  success: boolean;
  data: DataType | null;
  error: AuthError | null;
}

export interface DataType {
  user: User | null;
  session: Session | null;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface FormattedAssignmentType {
  id: number;
  syllabus_id: number;
  title: string;
  subtitle: string;
  start: string;
  end: string;
  event_id: string;
}

export interface SyllabusType {
  id: number;
  title: string;
  color: string;
  calendar_id: string;
  class_id: string;
}

export type CalendarProps = {
  filteredTasks: FormattedAssignmentType[];
  height?: number | string;
  session: Session | null;
  updateAssignmentSchedule: (
    action: string,
    id?: number,
    title?: string,
    subtitle?: string,
    start?: string,
    end?: string,
    syllabus_id?: number
  ) => void;
  syllabi: SyllabusType[];
};

export interface MyExtendedProps {
  syllabus_id: number;
  subtitle: string;
  event_id: string;
}
