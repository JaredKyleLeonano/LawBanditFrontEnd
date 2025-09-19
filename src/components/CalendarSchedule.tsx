import { useAuth } from "../context/AuthContext";
import { getSyllabi, updateSyllabus, deleteSyllabus } from "../api/syllabi";
import { getAssignments } from "../api/assignments";
import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import type { Session } from "@supabase/supabase-js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FullCalendarTasksDisplay from "./TestingCalendar";
import {
  faFloppyDisk,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import type { FormattedAssignmentType, SyllabusType } from "../types";

const CalendarSchedule = () => {
  const { session } = useAuth();
  const [assignmentSchedule, setAssignmentSchedule] = useState<
    FormattedAssignmentType[]
  >([]);
  const [syllabi, setSyllabi] = useState<SyllabusType[]>([]);
  const [selectedSyllabi, setSelectedSyllabi] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSyllabus, setEditingSyllabus] = useState<number[]>([]);
  const [tempSyllabusTitle, setTempSyllabusTitle] = useState("");
  const [syllabusToDelete, setSyllabusToDelete] = useState<number>();
  const [showDelete, setShowDelete] = useState(false);
  const calendarContainerRef = useRef<HTMLDivElement | null>(null);
  const [heightPx, setHeightPx] = useState<number>(477);

  useLayoutEffect(() => {
    const el = calendarContainerRef.current;
    if (!el) return;

    const measure = () => {
      const h = el.clientHeight;
      if (h > 0) {
        setHeightPx(h);
      }
    };

    const rafId = requestAnimationFrame(measure);

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(measure);
    });
    ro.observe(el);

    const onResize = () => requestAnimationFrame(measure);
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
    };
  }, [loading]);

  const toggleSelectedSyllabi = (syllabi_id: number) => {
    setSelectedSyllabi((prev) => {
      if (prev.includes(syllabi_id)) {
        return prev.filter((id) => id !== syllabi_id);
      } else {
        return [...prev, syllabi_id];
      }
    });
  };

  const updateAssignmentSchedule = useCallback(
    (
      action: string,
      id?: number,
      title?: string,
      subtitle?: string,
      start?: string,
      end?: string,
      syllabusId?: number,
      event_id?: string
    ) => {
      setAssignmentSchedule((prev) => {
        if (action === "edit") {
          return prev.map((assignment) =>
            assignment.id === id
              ? {
                  ...assignment,
                  title: title!,
                  subtitle: subtitle!,
                  start: start!,
                  end: end!,
                  event_id: event_id!,
                }
              : assignment
          );
        } else if (action === "delete") {
          return prev.filter((assignment) => assignment.id != id);
        } else if (action === "create") {
          return [
            ...prev,
            {
              id: id!,
              syllabus_id: syllabusId!,
              title: title!,
              subtitle: subtitle!,
              start: start!,
              end: end!,
              event_id: event_id!,
            },
          ];
        }
        return prev;
      });
    },
    [setAssignmentSchedule]
  );

  useEffect(() => {
    if (!session) return;

    const retrieveAssignmentsAndSyllabi = async (session: Session) => {
      const assignments = await getAssignments(session);
      setAssignmentSchedule(assignments ?? []);

      const syllabi = await getSyllabi(session);
      setSyllabi(syllabi);

      setSelectedSyllabi(syllabi.map((syllabus: SyllabusType) => syllabus.id));
      setLoading(false);
    };

    retrieveAssignmentsAndSyllabi(session);
  }, [session]);

  if (loading) {
    return <div>Loading...</div>;
  } else {
    const filteredTasks = assignmentSchedule.filter((task) =>
      selectedSyllabi.includes(task.syllabus_id)
    );
    return (
      <>
        <div
          className={`${
            showDelete ? "z-100" : "-z-10"
          } absolute flex inset-0 justify-center items-center w-screen h-screen backdrop-blur-xl bg-black/40`}
        >
          <div
            className={`flex flex-col w-xl absolute transition duration-300 ease-out 
            ${
              showDelete
                ? "opacity-100 -translate-y-15"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex flex-col text-white !font-Geist relative p-4 bg-[#171514] border-1 border-[#252322] rounded-xl">
              <h1 className="font-semibold text-2xl self-center">
                Confirm Deletion
              </h1>
              <hr className="text-[#292726] my-5 mx-4"></hr>
              <p className="mb-6 self-center">
                Are you sure you want to delete this syllabus?
              </p>
              <div className="flex justify-around">
                <button
                  type="button"
                  onClick={() => {
                    setShowDelete(!showDelete);
                  }}
                  className="hover:cursor-pointer hover:bg-[#32323280] transition-all duration-300 ease-out py-1 px-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    const removedSyllabus = syllabi.find(
                      (syl) => syl.id === syllabusToDelete
                    );

                    setSyllabi(
                      syllabi.filter((syl) => syl.id != syllabusToDelete)
                    );
                    setAssignmentSchedule(
                      assignmentSchedule.filter(
                        (assignment) =>
                          assignment.syllabus_id != syllabusToDelete
                      )
                    );

                    await deleteSyllabus(
                      removedSyllabus?.calendar_id,
                      removedSyllabus?.class_id,
                      session!.user.id,
                      syllabusToDelete!,
                      session
                    );

                    setShowDelete(!showDelete);
                  }}
                  className="hover:cursor-pointer hover:bg-[#32323280] text-red-600 transition-all duration-300 ease-out py-1 px-2 rounded-lg"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={calendarContainerRef}
          className="flex h-full border-1 p-6 border-[#252322] bg-[#171514] rounded-xl"
        >
          <div className="flex flex-col h-full w-full">
            <div className="flex h-full">
              <div className="flex-2 h-full ">
                <FullCalendarTasksDisplay
                  filteredTasks={filteredTasks}
                  height={heightPx}
                  session={session}
                  updateAssignmentSchedule={updateAssignmentSchedule}
                  syllabi={syllabi}
                ></FullCalendarTasksDisplay>
              </div>
              <div className="flex flex-col flex-1 bg-[#1c1a19] border-1 border-[#252322] rounded-xl ml-6 p-4">
                <h2 className="text-xl text-white font-Geist font-semibold">
                  Syllabus
                </h2>
                <hr className="text-[#292726] mx-6 mt-5 mb-3"></hr>
                {syllabi.map((syllabus) => {
                  const isEditing = editingSyllabus.includes(syllabus.id);
                  return (
                    <div
                      className="text-white font-Geist mb-2"
                      key={syllabus.id}
                    >
                      <div className="flex justify-between gap-2">
                        <div className="flex gap-2 items-start">
                          <input
                            className="mt-[0.8rem]"
                            style={{ accentColor: syllabus.color }}
                            type="checkbox"
                            defaultChecked
                            onChange={() => toggleSelectedSyllabi(syllabus.id)}
                          ></input>
                          {isEditing ? (
                            <input
                              className="bg-[#171514] p-2 border-1 border-[#252322] rounded-lg focus:outline-none"
                              value={tempSyllabusTitle}
                              onChange={(e) =>
                                setTempSyllabusTitle(e.target.value)
                              }
                            ></input>
                          ) : (
                            <p className="py-2">{syllabus.title}</p>
                          )}
                        </div>
                        <div className="flex gap-1 mt-2 items-start">
                          {isEditing ? (
                            <button
                              onClick={async () => {
                                const updatedSyllabus = await updateSyllabus(
                                  syllabus.calendar_id,
                                  syllabus.id,
                                  session!.user.id,
                                  tempSyllabusTitle,
                                  session
                                );
                                setSyllabi(
                                  syllabi.map((syllabus) =>
                                    syllabus.id === updatedSyllabus[0].id
                                      ? updatedSyllabus[0]
                                      : syllabus
                                  )
                                );
                                setEditingSyllabus((prev) =>
                                  prev.includes(syllabus.id)
                                    ? prev.filter((sid) => sid !== syllabus.id)
                                    : [...prev, syllabus.id]
                                );
                              }}
                              className="hover:cursor-pointer"
                            >
                              <FontAwesomeIcon icon={faFloppyDisk} />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setTempSyllabusTitle(syllabus.title);
                                setEditingSyllabus((prev) =>
                                  prev.includes(syllabus.id)
                                    ? prev.filter((sid) => sid !== syllabus.id)
                                    : [...prev, syllabus.id]
                                );
                              }}
                              className="hover:cursor-pointer"
                            >
                              <FontAwesomeIcon
                                className=""
                                icon={faPenToSquare}
                              />
                            </button>
                          )}

                          <button
                            onClick={async () => {
                              setSyllabusToDelete(syllabus.id);
                              setShowDelete(!showDelete);
                            }}
                            className="hover:cursor-pointer"
                          >
                            <FontAwesomeIcon className="" icon={faTrashCan} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default CalendarSchedule;
