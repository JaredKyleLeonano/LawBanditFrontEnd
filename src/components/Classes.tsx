import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faGear,
  faBookOpen,
  faUpload,
  faPlus,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFloppyDisk,
  faPenToSquare,
} from "@fortawesome/free-regular-svg-icons";

import { useEffect, useState } from "react";
import { deleteClass, updateClass } from "../api/classes";
import { useAuth } from "../context/AuthContext";
import { useClasses } from "../context/classesContext";
import UploadPdf from "./UploadPdf";
import NoteCard from "./NoteCard";
import { formatDistanceToNowStrict } from "date-fns";

const Classes = () => {
  const { state } = useLocation();
  const { session } = useAuth();
  const { classes, setClasses } = useClasses();
  const [title, setTitle] = useState("");
  const [tempTitle, setTempTitle] = useState("");
  const [editTitle, setEditTitle] = useState(false);
  const [showClassSettings, setShowClassSettings] = useState(false);
  const [showUploadSyllabus, setShowUploadSyllabus] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    setTitle(state.cls.title);
    // console.log("TITLE IS", title);
  }, [state.cls.title]);

  const timeStamp = formatDistanceToNowStrict(new Date(state.cls.created_at), {
    addSuffix: true,
  });
  return (
    <div className="flex flex-col px-6">
      <div
        className={`${
          showUploadSyllabus ? "z-100" : "-z-10"
        } absolute flex inset-0 justify-center items-center w-screen h-screen backdrop-blur-xl bg-black/40`}
      >
        <div
          className={`flex flex-col w-2xl relative transition duration-300 ease-out 
            ${
              showUploadSyllabus
                ? "opacity-100 -translate-y-28"
                : "opacity-0 -translate-y-20"
            }`}
        >
          <div className="flex flex-col items-center relative">
            <p className="font-Georgia text-6xl mb-8 text-white">
              Upload syllabus
            </p>
            <button
              onClick={() => setShowUploadSyllabus(!showUploadSyllabus)}
              className="absolute right-5 -top-1.5 hover:cursor-pointer"
            >
              <FontAwesomeIcon
                className="text-[#b4b4b4]"
                icon={faXmark}
              ></FontAwesomeIcon>
            </button>
          </div>
          <div className="flex flex-col border-1 border-[#373534] bg-[#2b2827] rounded-3xl">
            <UploadPdf classId={state.cls.id}></UploadPdf>
          </div>
        </div>
      </div>

      <div
        className={`${
          showDeleteConfirmation ? "z-100" : "-z-10"
        } absolute flex inset-0 justify-center items-center w-screen h-screen backdrop-blur-xl bg-black/40`}
      >
        <div
          className={`flex flex-col w-2xl relative transition duration-300 ease-out 
            ${
              showDeleteConfirmation
                ? "opacity-100 -translate-y-28"
                : "opacity-0 -translate-y-20"
            }`}
        >
          <div className="flex flex-col items-center relative">
            <p className="font-Georgia text-6xl mb-8 text-white">
              Delete Class
            </p>
            <button
              onClick={() => setShowDeleteConfirmation(!showDeleteConfirmation)}
              className="absolute right-5 -top-1.5 hover:cursor-pointer"
            >
              <FontAwesomeIcon
                className="text-[#b4b4b4]"
                icon={faXmark}
              ></FontAwesomeIcon>
            </button>
          </div>
          <div className="flex flex-col gap-6 text-white border-1 border-[#373534] bg-[#2b2827] rounded-3xl p-16">
            <p>
              Are you sure you want to delete this class? This action cannot be
              undone.
            </p>
            <div className="flex gap-2 justify-center font-bold">
              <button
                onClick={() =>
                  setShowDeleteConfirmation(!showDeleteConfirmation)
                }
                className="px-4 py-2 bg-[#6b7280] rounded-lg hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const response = await deleteClass(state.cls.id, session);
                  console.log("DELETE RESPONSE FROM FRONTEND:", response);
                }}
                className="px-4 py-2 bg-[#ef4444] rounded-lg hover:cursor-pointer"
              >
                Delete Class
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col px-8 pb-6">
        <ul className="flex text-sm gap-4 mb-4 items-center text-[#a29f9c] [&_li]:transition-colors duration-300 [&_li]:hover:text-white">
          <li className="">Home</li>
          <FontAwesomeIcon
            className="text-[0.5rem] text-[#5b5746]"
            icon={faChevronRight}
          ></FontAwesomeIcon>
          <li className="">Classes</li>
          <FontAwesomeIcon
            className="text-[0.5rem] text-[#5b5746]"
            icon={faChevronRight}
          ></FontAwesomeIcon>
          <li className="text-white">{title}</li>
        </ul>
        <div className="flex justify-between">
          <div className="flex items-center">
            {editTitle ? (
              <div className="flex items-baseline">
                <input
                  className="font-Georgia font-semibold text-2xl px-4 py-2 w-9/10 bg-[#2b2827] rounded-lg border-1 border-[#696765] text-white focus:outline-none"
                  defaultValue={title}
                  onChange={(e) => {
                    setTempTitle(e.target.value);
                    console.log("UPDATED temp TITLE:", tempTitle);
                  }}
                />
                <button
                  onClick={async () => {
                    if (tempTitle != title) {
                      state.cls.title = tempTitle;
                      console.log("UPDATED TITLE:", title);
                      const response = await updateClass(
                        state.cls.id,
                        tempTitle,
                        session
                      );
                      console.log("RESPONSE IS:", response[0]);
                      setClasses(
                        classes.map((cls) =>
                          cls.id === state.cls.id ? response[0] : cls
                        )
                      );
                      console.log(
                        "UPDATED CLASS IN FRONTEND RESPONSE IS:",
                        response
                      );
                    }

                    setEditTitle(!editTitle);
                  }}
                >
                  <FontAwesomeIcon
                    className="text-[#a29f9c] ml-2 hover:cursor-pointer"
                    icon={faFloppyDisk}
                  ></FontAwesomeIcon>
                </button>
              </div>
            ) : (
              <div className="flex items-baseline">
                <h1 className="font-Georgia font-semibold text-3xl text-white ">
                  {title}
                </h1>
                <button onClick={() => setEditTitle(!editTitle)}>
                  <FontAwesomeIcon
                    className="text-sm ml-6 text-[#a29f9c] hover:cursor-pointer"
                    icon={faPenToSquare}
                  ></FontAwesomeIcon>
                </button>
              </div>
            )}
          </div>
          <div className="relative flex text-sm gap-4 text-white [&_button]:px-5 [&_button]:py-2.5 [&_button]:border-1  [&_button]:border-[#373534] [&_button]:rounded-lg  [&_button]:duration-200 [&_button]:transition [&_button]:ease-out">
            <button
              className="hover:cursor-pointer hover:bg-[#1c1a19]"
              onClick={() => setShowClassSettings(!showClassSettings)}
            >
              <FontAwesomeIcon className="mr-2" icon={faGear} />
              Settings
            </button>
            <div
              className={`absolute flex flex-col gap-2 w-72 -ml-41.5 bg-[#171514] border-1 border-[#373534] rounded-lg p-4 transition-all duration-300 ease-out ${
                showClassSettings
                  ? "z-10 mt-12 opacity-100"
                  : "-z-10 mt-8 opacity-0"
              }`}
            >
              <h3 className="text-lg font-semibold">Class Settings</h3>
              <hr className="text-[#292726]"></hr>
              <button
                onClick={() =>
                  setShowDeleteConfirmation(!showDeleteConfirmation)
                }
                className="!border-0 flex items-center gap-3 w-full hover:bg-[#1c1a19] hover:cursor-pointer duration-200 transition ease-out"
              >
                <FontAwesomeIcon className="text-xs" icon={faTrashCan} />
                <p>Delete Class</p>
              </button>
            </div>
            <button className="hover:bg-[#1c1a19] hover:cursor-pointer">
              <FontAwesomeIcon className="mr-2" icon={faBookOpen} />
              Study Room
            </button>
            <button
              onClick={() => setShowUploadSyllabus(!showUploadSyllabus)}
              className="bg-white text-[#302b2f] hover:bg-[#e8e4e1] hover:cursor-pointer"
            >
              <FontAwesomeIcon className="mr-2" icon={faUpload} />
              Upload Syllabus
            </button>
          </div>
        </div>
      </div>
      <hr className="text-[#292726]"></hr>
      <div className="flex gap-6 py-8 px-32">
        <div className="flex relative justify-center group gap-0 items-center text-white w-78 h-46 border-1 border-white rounded-xl transition-transform duration-300 ease-out hover:-translate-y-2 hover:cursor-pointer">
          <FontAwesomeIcon
            className="text-4xl transition-all duration-300 ease-out group-hover:mr-28"
            icon={faPlus}
          />
          <p className="absolute text-2xl opacity-0 group-hover:ml-10 duration-150 ease-out group-hover:opacity-100 transition-all">
            Add Note
          </p>
        </div>
        <div className="w-78 h-46">
          <NoteCard title={title} timeStamp={timeStamp}></NoteCard>
        </div>
      </div>
    </div>
  );
};

export default Classes;
