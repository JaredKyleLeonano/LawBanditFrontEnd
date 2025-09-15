import React, { useContext, createContext, useState } from "react";
import type { ReactNode } from "react";

interface ClassType {
  id: number;
  syllabus_id: number | null;
  title: string;
  created_at: Date;
}

interface ClassContextType {
  classes: ClassType[];
  setClasses: React.Dispatch<React.SetStateAction<ClassType[]>>;
}

const ClassesContext = createContext<ClassContextType | undefined>(undefined);

export const useClasses = () => {
  const classes = useContext(ClassesContext);
  if (!classes)
    throw new Error("useClasses must be used inside ClassesProvider");
  return classes;
};

export const ClassesProvider = ({ children }: { children: ReactNode }) => {
  const [classes, setClasses] = useState<ClassType[]>([]);

  return React.createElement(
    ClassesContext.Provider,
    { value: { classes, setClasses } },
    children
  );
};
