import { useState } from "react";
import { useClasses } from "../context/ClassesContext";
import CalendarSchedule from "./CalendarSchedule";
import NoteCard from "./NoteCard";
import { formatDistanceToNowStrict } from "date-fns";

const Home = () => {
  const { classes } = useClasses();
  const [downloading, setDownloading] = useState(false);

  const downloadFiles = () => {
    setDownloading(true);
    const files = [
      { url: "files/syllabus1.pdf", name: "SampleSyllabus1.pdf" },
      { url: "files/syllabus2.pdf", name: "SampleSyllabus2.pdf" },
    ];

    files.forEach((file, index) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = file.url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 500); // 500ms delay between files
    });
    setDownloading(false);
  };

  return (
    <div className="flex flex-col px-6 h-full">
      <div className="flex flex-col h-full px-8 pb-6">
        <h1 className="font-Georgia font-semibold text-3xl text-white ">
          Recent Notes
        </h1>
        <div className="grid grid-cols-4 grid-rows-1 flex-none h-56 gap-6 py-8 overflow-hidden">
          {classes.slice(0, 4).map((cls) => (
            <NoteCard
              key={cls.id}
              title={cls.title}
              timeStamp={formatDistanceToNowStrict(new Date(cls.created_at), {
                addSuffix: true,
              })}
            ></NoteCard>
          ))}
          {classes.length < 4 && (
            <div
              className={`flex flex-col relative justify-center items-center w-full h-full bg-white rounded-xl transition-transform duration-300 ease-out hover:-translate-y-2 ${downloading ? "cursor-wait" : "cursor-pointer"}`}
              onClick={() => downloadFiles()}
            >
              <p className="absolute top-5 left-5 text-sm font-medium py-1.5 px-3.5 bg-[#e2e0de] rounded-md">
                Note!
              </p>
              <p className="text-sm mx-5 mt-1 font-bold translate-y-2">
                Click here to download sample syllabus for testing the calendar
                feature
              </p>
            </div>
          )}

          {classes.length < 3 && (
            <div className="flex flex-col relative justify-center items-center w-full h-full bg-white rounded-xl transition-transform duration-300 ease-out hover:-translate-y-2 hover:cursor-not-allowed">
              <p className="absolute top-5 left-5 text-sm font-medium py-1.5 px-3.5 bg-[#e2e0de] rounded-md">
                Note!
              </p>
              <p className="text-sm mx-5 mt-1 font-bold translate-y-2">
                Create a class, go to the created class at the sidebar then
                upload syllabus
              </p>
            </div>
          )}

          {classes.length < 2 && (
            <div className="flex flex-col relative justify-center items-center w-full h-full bg-white rounded-xl transition-transform duration-300 ease-out hover:-translate-y-2 hover:cursor-not-allowed">
              <p className="absolute top-5 left-5 text-sm font-medium py-1.5 px-3.5 bg-[#e2e0de] rounded-md">
                Note!
              </p>
              <p className="text-sm mx-5 mt-1 font-bold translate-y-2">
                This web app is intended to not be responsive. Recommended to
                view on laptop
              </p>
            </div>
          )}
          {classes.length < 1 && (
            <div className="flex flex-col relative justify-center items-center w-full h-full bg-white rounded-xl transition-transform duration-300 ease-out hover:-translate-y-2 hover:cursor-not-allowed">
              <p className="absolute top-5 left-5 text-sm font-medium py-1.5 px-3.5 bg-[#e2e0de] rounded-md">
                Note!
              </p>
              <p className="text-sm mx-5 mt-1 font-bold translate-y-2">
                This is an imitation of Law Bandit implementing a syllabus to
                calendar feature.
              </p>
            </div>
          )}
        </div>
        <div className="flex-1">
          <CalendarSchedule></CalendarSchedule>
        </div>
      </div>
    </div>
  );
};

export default Home;
