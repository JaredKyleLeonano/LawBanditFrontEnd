import { Scheduler } from "@aldabil/react-scheduler";
import { useAuth } from "../context/AuthContext";
import { getSyllabi, updateSyllabus, deleteSyllabus } from "../api/syllabi";
import {
  getAssignments,
  updateAssignment,
  deleteAssignment,
  createAssignment,
} from "../api/assignments";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import type {
  CellRenderedProps,
  EventActions,
  ProcessedEvent,
} from "@aldabil/react-scheduler/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";

interface FormattedAssignmentType {
  event_id: number;
  syllabus_id: number;
  title: string;
  subtitle: string;
  start: Date;
  end: Date;
}

interface SyllabusType {
  id: number;
  title: string;
}

const CalendarSchedule = () => {
  const [assignmentSchedule, setAssignmentSchedule] = useState<
    FormattedAssignmentType[]
  >([]);
  const [syllabi, setSyllabi] = useState<SyllabusType[]>([]);
  const [selectedSyllabi, setSelectedSyllabi] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  const calendarContainerRef = useRef<HTMLDivElement | null>(null);
  const [heightPx, setHeightPx] = useState<number>(477); // sensible fallback

  useLayoutEffect(() => {
    const el = calendarContainerRef.current;
    console.log("EL IS:", el);
    if (!el) return;

    const measure = () => {
      const h = el.clientHeight;
      if (h > 0) {
        // only update when we have a real measurement
        setHeightPx(h - 76 - 48);
        // console.log('MEASURED:', h);
      }
    };

    console.log("HEIGHT IS:", heightPx);

    // initial measure after browser paints to avoid measuring too early
    const rafId = requestAnimationFrame(measure);

    // watch for size changes from children/layout
    const ro = new ResizeObserver(() => {
      // use rAF inside observer to batch reads
      requestAnimationFrame(measure);
    });
    ro.observe(el);

    // also re-measure on window resize
    const onResize = () => requestAnimationFrame(measure);
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
    };
    // re-run when number of events changes (re-measure after content loads)
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

  //Update States for viewing
  const updateAssignmentSchedule = (
    updatedEvent: FormattedAssignmentType | number,
    action: string
  ) => {
    setAssignmentSchedule((prev) => {
      if (action === "edit" && typeof updatedEvent != "number") {
        return prev.map((assignment) =>
          assignment.event_id === updatedEvent.event_id
            ? updatedEvent
            : assignment
        );
      }
      if (action === "delete" && typeof updatedEvent == "number") {
        return prev.filter((assignment) => assignment.event_id != updatedEvent);
      }
      return prev;
    });
  };

  const handleOnConfirm = async (
    event: FormattedAssignmentType,
    action: EventActions
  ) => {
    if (action === "edit") {
      updateAssignmentSchedule(event, "edit");
      await updateAssignment(event, session);
    }

    //FOLLOW UP
    if (action === "create") {
      console.log("ACTION IS:", action);
      await createAssignment(event, session);
    }
    return event;
  };

  const handleOnEventDrop = async (
    dragEvent: React.DragEvent<HTMLButtonElement>,
    droppedOn: Date,
    updatedEvent: FormattedAssignmentType,
    originalEvent: ProcessedEvent
  ) => {
    console.log("Drag Event:", dragEvent);
    console.log("Dropped On Slot:", droppedOn);
    console.log("Updated Event:", updatedEvent);
    console.log("Original Event:", originalEvent);

    updateAssignmentSchedule(updatedEvent, "edit");
    await updateAssignment(updatedEvent, session);

    return updatedEvent;
  };

  const handleOnDelete = async (eventId: number) => {
    console.log("Delete event with id:", eventId);

    updateAssignmentSchedule(eventId, "delete");
    await deleteAssignment(eventId, session);
    return eventId;
  };

  const handleSyllabusUpdate = async (
    syllabus_id: number,
    newTitle: FormDataEntryValue,
    session: Session | null
  ) => {
    const updatedSyllabus = await updateSyllabus(
      syllabus_id,
      newTitle,
      session
    );
    setSyllabi(
      syllabi.map((syllabus) =>
        syllabus.id === updatedSyllabus[0].id ? updatedSyllabus[0] : syllabus
      )
    );
  };

  const handleSyllabusDelete = async (syllabusId: number) => {
    console.log("deleting syllabus with id", syllabusId);

    setSyllabi(syllabi.filter((syllabus) => syllabus.id != syllabusId));
    setAssignmentSchedule(
      assignmentSchedule.filter(
        (assignment) => assignment.syllabus_id != syllabusId
      )
    );
    await deleteSyllabus(syllabusId, session);
  };

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
      <div
        ref={calendarContainerRef}
        className="flex h-full p-6 border-1 border-[#252322] bg-[#171514] rounded-xl"
      >
        <div className="flex flex-col h-full w-full">
          <div className="flex">
            <div className="flex-2 bg-slate-700 overflow-hidden rounded-xl">
              <Scheduler
                events={filteredTasks}
                view="month"
                height={430}
                onConfirm={handleOnConfirm}
                onEventDrop={handleOnEventDrop}
                onDelete={handleOnDelete}
              />
            </div>
            <div className="flex flex-col h-full flex-1 bg-[#1c1a19] border-1 border-[#252322] rounded-xl ml-6 p-4">
              <h2 className="text-xl text-white font-Georgia font-semibold">
                Syllabus
              </h2>
              <hr className="text-[#292726] mx-6 my-5"></hr>
              {syllabi.map((syllabus) => (
                <div className="text-white font-Geist mb-2" key={syllabus.id}>
                  <div className="flex justify-between gap-2">
                    <div className="flex gap-2 items-start">
                      <input
                        className="mt-1"
                        type="checkbox"
                        defaultChecked
                        onChange={() => toggleSelectedSyllabi(syllabus.id)}
                      ></input>
                      <p>{syllabus.title}</p>
                    </div>
                    <FontAwesomeIcon className="mt-0.5" icon={faEllipsis} />
                  </div>
                  {/* <button onClick={() => toggleSelectedSyllabi(syllabus.id)}>
                    {syllabus.id} {syllabus.title}
                  </button>
                  <form
                    onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const title = formData.get("title");
                      console.log("new title", title);
                      console.log("syllabus id", syllabus.id);
                      if (!title) {
                        console.error("title cannot be blank");
                        return;
                      } else {
                        handleSyllabusUpdate(syllabus.id, title, session);
                      }
                    }}
                  >
                    <label>edit</label>
                    <input name="title" type="text"></input>
                    <button type="submit">submit</button>
                  </form>
                  <button onClick={() => handleSyllabusDelete(syllabus.id)}>
                    delete
                  </button> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default CalendarSchedule;
