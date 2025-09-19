// FullCalendarTasksDisplay.tsx
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin, {
  type DateClickArg,
} from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import Tippy from "@tippyjs/react";
import "tippy.js/animations/shift-away.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  faTrashCan,
  faPenToSquare,
  faCalendar,
} from "@fortawesome/free-regular-svg-icons";
import {
  createAssignment,
  deleteAssignment,
  updateAssignment,
} from "../api/assignments";
import type {
  CalendarProps,
  FormattedAssignmentType,
  MyExtendedProps,
} from "../types";
import type { EventContentArg } from "@fullcalendar/core/index.js";
import type { EventInput } from "@fullcalendar/core/index.js";

export default function FullCalendarTasksDisplay({
  filteredTasks,
  height,
  session,
  updateAssignmentSchedule,
  syllabi,
}: CalendarProps) {
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const [currentId, setCurrentId] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [currentStart, setCurrentStart] = useState("");
  const [currentEnd, setCurrentEnd] = useState("");
  const [currentEventId, setCurrentEventId] = useState(null);
  const [currentCalendarId, setCurrentCalendarId] = useState<string | null>(
    null
  );

  const [viewPopup, setViewPopup] = useState(false);
  const [viewEdit, setViewEdit] = useState(false);
  const [viewDelete, setViewDelete] = useState(false);
  const [viewCreate, setViewCreate] = useState(false);

  const formatDate = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  const setToEndOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 0);
    return d;
  };

  const toEventInput = (t: FormattedAssignmentType): EventInput => ({
    id: String(t.id),
    title: t.title,
    start: t.start,
    end: t.end || undefined,
    extendedProps: {
      syllabus_id: t.syllabus_id,
      subtitle: t.subtitle,
      event_id: t.event_id,
    } as MyExtendedProps,
  });

  const renderEventContent = (arg: EventContentArg) => {
    const syllabusId = arg.event.extendedProps.syllabus_id;
    const id = arg.event.id;
    const title = arg.event.title;
    const subtitle = arg.event.extendedProps.subtitle;
    const start = new Date(arg.event.start!);
    const end = new Date(arg.event.end!);
    const eventId = arg.event.extendedProps.event_id;

    const matchedSyllabus = syllabi.find(
      (syllabus) => syllabus.id === syllabusId
    );

    const calendarId = matchedSyllabus?.calendar_id;

    return (
      <Tippy
        content={
          <div className="flex flex-col w-100 -mb-2.5 text-white font-Geist border-1 shadow-2xl border-[#e2e0de] rounded-lg ">
            <div
              style={{ backgroundColor: matchedSyllabus?.color }}
              className="flex flex-col justify-between flex-1 px-2 pt-2 rounded-t-lg"
            >
              <div className="flex justify-between">
                <button
                  id="closePopUp"
                  className="hover:cursor-pointer p-1 rounded-full hover:bg-[#1a1a1a33] transition-all duration-300 ease-out"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
                <div className="">
                  <button
                    className="hover:cursor-pointer p-1 rounded-full hover:bg-[#1a1a1a33] transition-all duration-300 ease-out"
                    onClick={async () => {
                      setCurrentId(id);
                      setCurrentTitle(title);
                      setCurrentSubtitle(subtitle);
                      setCurrentStart(formatDate(start));
                      setCurrentEnd(formatDate(end));
                      setViewPopup(!viewPopup);
                      setViewEdit(!viewEdit);
                      setCurrentEventId(eventId ?? null);
                      setCurrentCalendarId(calendarId ?? null);
                    }}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button
                    className="hover:cursor-pointer p-1 rounded-full hover:bg-[#1a1a1a33] transition-all duration-300 ease-out"
                    onClick={() => {
                      setCurrentId(id);
                      setCurrentEventId(eventId ?? null);
                      setCurrentCalendarId(calendarId ?? null);
                      setViewPopup(!viewPopup);
                      setViewDelete(!viewDelete);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              </div>
              <p className="pt-6 font-semibold">{title}</p>
            </div>
            <div className="bg-[#1c1a19] px-2 flex flex-col pb-2 flex-1 rounded-b-lg text-xs">
              {subtitle}
              <div className="flex items-center">
                <FontAwesomeIcon className="mr-2" icon={faCalendar} />
                <p>
                  {start.toLocaleString("en-US", options).replace(" at", "")} -{" "}
                  {end.toLocaleString("en-US", options).replace(" at", "")}
                </p>
              </div>
            </div>
          </div>
        }
        trigger="click"
        appendTo={document.body}
        animation="shift-away"
      >
        <div
          style={{ backgroundColor: matchedSyllabus?.color }}
          className="w-full text-xs text-white whitespace-nowrap overflow-hidden text-ellipsis rounded-sm px-1"
        >
          {arg.event.title}
        </div>
      </Tippy>
    );
  };
  return (
    <div className="h-full">
      <div
        className={`${
          viewPopup ? "z-100" : "-z-10"
        } absolute flex inset-0 justify-center items-center w-screen h-screen backdrop-blur-xl bg-black/40`}
      >
        <div
          className={`flex flex-col w-xl absolute transition duration-300 ease-out 
            ${
              viewEdit
                ? "z-100 opacity-100 translate-y-0"
                : "-z-10 opacity-0 translate-y-10"
            }`}
        >
          <div className="flex flex-col text-white !font-Geist relative p-4 bg-[#171514] border-1 border-[#252322] rounded-xl">
            <h1 className="">Edit Assignment</h1>
            <hr className="text-[#292726] my-5 mx-4"></hr>
            <form
              className="flex flex-col gap-4"
              onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get("title") as string;
                const subtitle = formData.get("subtitle") as string;
                const start = formData.get("start") as string;
                const end = formData.get("end") as string;

                await updateAssignment(
                  currentEventId,
                  currentCalendarId,
                  session!.user.id,
                  currentId,
                  title,
                  subtitle,
                  start,
                  end,
                  session
                );

                updateAssignmentSchedule(
                  "edit",
                  Number(currentId),
                  title,
                  subtitle,
                  start,
                  end
                );

                setViewPopup(!viewPopup);
                setViewEdit(!viewEdit);
              }}
            >
              <div className="flex flex-col gap-0.5">
                <label className="font-semibold">Title</label>
                <input
                  className="bg-[#1c1a19] border-1 border-[#252322] rounded-lg p-2 focus:outline-none"
                  type="text"
                  name="title"
                  defaultValue={currentTitle}
                ></input>
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="font-semibold">Start</label>
                <input
                  className="bg-[#1c1a19] border-1 border-[#252322] rounded-lg p-2 hover:cursor-pointer focus:outline-none"
                  type="datetime-local"
                  name="start"
                  defaultValue={currentStart}
                ></input>
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="font-semibold">End</label>
                <input
                  className="bg-[#1c1a19] border-1 border-[#252322] rounded-lg p-2 hover:cursor-pointer focus:outline-none"
                  type="datetime-local"
                  name="end"
                  defaultValue={currentEnd}
                ></input>
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="font-semibold">Subtitle</label>
                <textarea
                  className="bg-[#1c1a19] border-1 border-[#252322] rounded-lg p-2 focus:outline-none"
                  rows={3}
                  name="subtitle"
                  defaultValue={currentSubtitle}
                ></textarea>
              </div>
              <div className="flex justify-around">
                <button
                  type="button"
                  onClick={() => {
                    setViewPopup(!viewPopup);
                    setViewEdit(!viewEdit);
                  }}
                  className="hover:cursor-pointer hover:bg-[#32323280] transition-all duration-300 ease-out py-1 px-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="hover:cursor-pointer hover:bg-[#32323280] transition-all duration-300 ease-out py-1 px-2 rounded-lg"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>

        <div
          className={`flex flex-col w-xl absolute transition duration-300 ease-out 
            ${
              viewDelete
                ? "z-100 opacity-100 -translate-y-15"
                : "-z-10 opacity-0 translate-y-10"
            }`}
        >
          <div className="flex flex-col text-white !font-Geist relative p-4 bg-[#171514] border-1 border-[#252322] rounded-xl">
            <h1 className="font-semibold text-2xl self-center">
              Confirm Deletion
            </h1>
            <hr className="text-[#292726] my-5 mx-4"></hr>
            <p className="mb-6 self-center">
              Are you sure you want to delete this assignment?
            </p>
            <div className="flex justify-around">
              <button
                type="button"
                onClick={() => {
                  setViewPopup(!viewPopup);
                  setViewDelete(!viewDelete);
                }}
                className="hover:cursor-pointer hover:bg-[#32323280] transition-all duration-300 ease-out py-1 px-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteAssignment(
                    currentEventId,
                    currentCalendarId,
                    session!.user.id,
                    Number(currentId),
                    session
                  );
                  updateAssignmentSchedule("delete", Number(currentId));
                  setViewPopup(!viewPopup);
                  setViewDelete(!viewDelete);
                }}
                className="hover:cursor-pointer hover:bg-[#32323280] text-red-600 transition-all duration-300 ease-out py-1 px-2 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>

        <div
          className={`flex flex-col w-xl absolute transition duration-300 ease-out 
            ${
              viewCreate
                ? "z-100 opacity-100 translate-y-0"
                : "-z-10 opacity-0 translate-y-10"
            }`}
        >
          <div className="flex flex-col text-white !font-Geist relative p-4 bg-[#171514] border-1 border-[#252322] rounded-xl">
            <h1 className="">Create Assignment</h1>
            <hr className="text-[#292726] my-5 mx-4"></hr>
            <form
              className="flex flex-col gap-4"
              onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const syllabusId = formData.get("syllabus") as string;
                const title = formData.get("title") as string;
                const subtitle = formData.get("subtitle") as string;
                const start = formData.get("start") as string;
                const end = formData.get("end") as string;

                const matchedSyllabus = syllabi.find(
                  (syllabus) => syllabus.id === Number(syllabusId)
                );

                const calendarId = matchedSyllabus?.calendar_id;

                const response = await createAssignment(
                  calendarId,
                  session!.user.id,
                  syllabusId,
                  title,
                  subtitle,
                  start,
                  end,
                  session
                );

                updateAssignmentSchedule(
                  "create",
                  response[0].id,
                  title,
                  subtitle,
                  start,
                  end,
                  Number(syllabusId)
                );

                setViewPopup(!viewPopup);
                setViewCreate(!viewCreate);
              }}
            >
              <div className="flex flex-col gap-0.5">
                <label className="font-semibold">Title</label>
                <input
                  className="bg-[#1c1a19] border-1 border-[#252322] rounded-lg p-2 focus:outline-none"
                  type="text"
                  name="title"
                ></input>
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="font-semibold">Start</label>
                <input
                  className="bg-[#1c1a19] border-1 border-[#252322] rounded-lg p-2 hover:cursor-pointer focus:outline-none"
                  type="datetime-local"
                  name="start"
                  defaultValue={currentStart}
                ></input>
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="font-semibold">End</label>
                <input
                  className="bg-[#1c1a19] border-1 border-[#252322] rounded-lg p-2 hover:cursor-pointer focus:outline-none"
                  type="datetime-local"
                  name="end"
                  defaultValue={currentEnd}
                ></input>
              </div>
              <div className="flex flex-col gap-0.5">
                <label>Syllabus</label>
                <select
                  name="syllabus"
                  className="bg-[#1c1a19] border-1 border-[#252322] rounded-lg p-2"
                >
                  {syllabi.map((syllabus) => (
                    <option
                      key={syllabus.id}
                      value={syllabus.id}
                      className="!font-Geist"
                    >
                      {syllabus.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="font-semibold">Subtitle</label>
                <textarea
                  className="bg-[#1c1a19] border-1 border-[#252322] rounded-lg p-2 focus:outline-none"
                  rows={3}
                  name="subtitle"
                ></textarea>
              </div>
              <div className="flex justify-around">
                <button
                  type="button"
                  onClick={() => {
                    setViewPopup(!viewPopup);
                    setViewCreate(!viewCreate);
                  }}
                  className="hover:cursor-pointer hover:bg-[#32323280] transition-all duration-300 ease-out py-1 px-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="hover:cursor-pointer hover:bg-[#32323280] transition-all duration-300 ease-out py-1 px-2 rounded-lg"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="rounded-xl text-gray-400 font-Geist h-full">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,title,next",
            center: "today",
            right: "listWeek,dayGridMonth,timeGridWeek,timeGridDay", // listWeek optional
          }}
          events={filteredTasks.map(toEventInput)}
          eventContent={renderEventContent}
          selectable={true}
          editable={true}
          height={height}
          dayMaxEvents={1}
          eventDrop={async (info) => {
            const syllabusId = info.event.extendedProps.syllabus_id;
            const id = info.event.id;
            const title = info.event.title;
            const subtitle = info.event.extendedProps.subtitle;
            const start = formatDate(info.event.start!);
            const end = formatDate(info.event.end!);
            const eventId = info.event.extendedProps.event_id;

            const matchedSyllabus = syllabi.find(
              (syllabus) => syllabus.id === syllabusId
            );

            const calendarId = matchedSyllabus?.calendar_id;
            console.log("THIS IS THE CALENDAR ID:", calendarId);

            await updateAssignment(
              eventId,
              calendarId,
              session!.user.id,
              id,
              title,
              subtitle,
              start,
              end,
              session
            );
          }}
          dateClick={(arg: DateClickArg) => {
            console.log("testing date click", arg);
            console.log("testiNG start date:", arg.date);
            setCurrentStart(formatDate(arg.date));
            setCurrentEnd(formatDate(setToEndOfDay(arg.date)));
            setViewPopup(!viewPopup);
            setViewCreate(!viewCreate);
          }}
        />
      </div>
    </div>
  );
}
