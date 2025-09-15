import { useNavigate, Outlet } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faCirclePlay,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  faBorderAll,
  faShareNodes,
  faGraduationCap,
  faEllipsisVertical,
  faArrowRightFromBracket,
  faXmark,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { createClass, getClasses } from "../api/classes";
import type { Session } from "@supabase/supabase-js";
import { useClasses } from "../context/classesContext";

function App() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddClassAnimation, setShowAddClassAnimation] = useState(false);
  const [classDropdown, setClassDropdown] = useState(false);
  const { classes, setClasses } = useClasses();

  useEffect(() => {
    if (!session) console.log("testing");
    else {
      const retrieveClasses = async (session: Session | null) => {
        try {
          console.log("SESSION IS:", session?.user.app_metadata.provider);
          const response = await getClasses(session);
          setClasses(response?.data);
        } catch (err) {
          console.error("Error retrieving classes:", err);
        }
      };

      retrieveClasses(session);
    }
  }, [session, navigate]);

  const settingsToggleAnimation = () => {
    if (showSettings) {
      setTimeout(() => setVisible(!visible), 100);
    } else {
      setVisible(!visible);
    }
  };

  const addClassToggleAnimation = () => {
    if (showAddClass) {
      setShowAddClass(!showAddClass);
      setShowAddClassAnimation(!showAddClassAnimation);
    } else {
      setShowAddClass(!showAddClass);
      setTimeout(() => setShowAddClassAnimation(!showAddClassAnimation), 100);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#171514] pt-4 flex flex-col">
      <div
        className={`${
          showAddClass ? "flex" : "hidden"
        } absolute inset-0 justify-center items-center w-screen h-screen z-100 backdrop-blur-xl bg-black/40`}
      >
        <div
          className={`flex flex-col w-2xl relative transition duration-300 ease-out 
            ${
              showAddClassAnimation
                ? "opacity-100 -translate-y-28"
                : "opacity-0 -translate-y-20"
            }`}
        >
          <div className="flex flex-col items-center relative">
            <p className="font-Georgia text-6xl mb-8 text-white">
              Create a class
            </p>
            <button
              onClick={() => {
                addClassToggleAnimation();
              }}
              className="absolute right-5 -top-1.5 hover:cursor-pointer"
            >
              <FontAwesomeIcon
                className="text-[#b4b4b4]"
                icon={faXmark}
              ></FontAwesomeIcon>
            </button>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const formData = new FormData(e.currentTarget);
              const title = formData.get("title");

              if (!title) {
                console.error("title cannot be blank");
                return;
              } else {
                await createClass(title, session);
              }
            }}
            className="flex flex-col border-1 border-[#373534] bg-[#2b2827] rounded-3xl p-14"
          >
            <label className="font-medium text-lg text-[#c0bfbf]">
              CLASS NAME
            </label>
            <input
              name="title"
              className="text-lg font-medium text-white px-6 py-5 rounded-2xl mt-6 bg-[#22201f]"
              placeholder="e.g., Constitutional Law, Torts, Contracts, etc."
            ></input>
            <button
              className="text-lg font-medium px-6 py-5 rounded-2xl bg-white mt-8 hover:cursor-pointer"
              type="submit"
            >
              <FontAwesomeIcon className="mr-3" icon={faPlus}></FontAwesomeIcon>
              Create Class
            </button>
          </form>
        </div>
      </div>

      <img
        src="/icons/lawbanditLogo.svg"
        alt="Law Bandit Logo"
        loading="lazy"
        className="w-20 h-20 ml-5 mb-1"
      ></img>
      <div className="flex h-full [&_li]:hover:cursor-pointer">
        <nav className="flex flex-col h-full border-r-1 border-[#292726] w-60 py-4">
          <ul className="text-[#95a3af] [&_li]:hover:text-white [&_li]:hover:bg-[#1c1a19] [&_li]:px-6 [&_li]:py-3 [&_li]:duration-200 [&_li]:transition [&_li]:ease-out">
            <div className="relative z-30 bg-[#171514]">
              <li onClick={() => navigate("home")}>
                <FontAwesomeIcon
                  className="text-lg mr-3"
                  icon={faHouse}
                ></FontAwesomeIcon>
                Home
              </li>
              <li
                onClick={() => {
                  addClassToggleAnimation();
                  console.log(showAddClass);
                }}
              >
                <FontAwesomeIcon
                  className="text-lg mr-3"
                  icon={faPlus}
                ></FontAwesomeIcon>
                New Class
              </li>
              <li onClick={() => setClassDropdown(!classDropdown)}>
                <FontAwesomeIcon
                  className="text-lg mr-3"
                  icon={faBorderAll}
                ></FontAwesomeIcon>
                Classes
                <FontAwesomeIcon
                  className={`ml-18 transform transition duration-300 ${
                    classDropdown ? "scale-y-[-1]" : "scale-y-[1]"
                  }`}
                  icon={faChevronDown}
                ></FontAwesomeIcon>
              </li>
            </div>
            <div
              className={`${
                classDropdown ? "max-h-32" : "max-h-0"
              } transition-all ease-out duration-300 overflow-hidden`}
            >
              <ul className="text-sm px-8">
                {classes.map((cls, index) => (
                  <li
                    key={index}
                    onClick={() => navigate("classes", { state: { cls } })}
                    className="!px-0"
                  >
                    {cls.title}
                  </li>
                ))}
              </ul>
            </div>
            <hr className="text-[#292726] mx-6 my-4"></hr>
            <li>
              <FontAwesomeIcon
                className="text-lg mr-3"
                icon={faShareNodes}
              ></FontAwesomeIcon>
              Shared
            </li>
            <li>
              <FontAwesomeIcon
                className="text-lg mr-3"
                icon={faGraduationCap}
              ></FontAwesomeIcon>
              Tutorials
            </li>
            <li>
              <FontAwesomeIcon
                className="text-lg mr-3"
                icon={faCirclePlay}
              ></FontAwesomeIcon>
              Subscribed
            </li>
          </ul>
          <div className="flex flex-col mt-auto py-3 text-white">
            <div
              className={`relative mx-3 top-6 transition ${
                showSettings ? "translate-y-0" : "translate-y-1"
              }`}
            >
              <ul
                className={`bg-white rounded-lg [&_li]:px-4 [&_li]:py-3 transition [&_li]:hover:bg-[#f3efeb] ${
                  showSettings ? "opacity-100" : "opacity-0 pointer-events-none"
                }
                    ${visible ? "display" : "hidden"}`}
              >
                <li className="text-black rounded-t-lg">
                  <FontAwesomeIcon
                    className="mr-3"
                    icon={faUser}
                  ></FontAwesomeIcon>
                  Settings
                </li>
                <hr className="text-[#e7e3e0]"></hr>
                <li onClick={signOut} className="text-red-600 rounded-b-lg">
                  <FontAwesomeIcon
                    className="mr-3"
                    icon={faArrowRightFromBracket}
                  ></FontAwesomeIcon>
                  Sign Out
                </li>
              </ul>
            </div>
            <hr className="text-[#292726] mx-6 mb-10"></hr>
            <div className="flex mb-16 justify-center items-center hover:bg-[#1c1a19] mx-3 py-3 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-white mr-3 ml-1 flex items-center justify-center text-gray-800">
                SU
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium">sample user</p>
                <p className="text-xs text-[#8b8386]">Not Subscribed</p>
              </div>
              <button
                className="ml-10 mr-1 hover:cursor-pointer"
                onClick={() => {
                  setShowSettings(!showSettings);
                  settingsToggleAnimation();
                }}
              >
                <FontAwesomeIcon
                  className="text-[#8b8386] text-xs "
                  icon={faEllipsisVertical}
                ></FontAwesomeIcon>
              </button>
            </div>
          </div>
        </nav>
        <div className="flex-grow-1 h-full">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
}

export default App;
