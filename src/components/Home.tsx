import { useClasses } from "../context/classesContext";
import CalendarSchedule from "./CalendarSchedule";
import NoteCard from "./NoteCard";
import { formatDistanceToNowStrict } from "date-fns";

const Home = () => {
  const { classes } = useClasses();
  // console.log("CLASSES DETAILS", classes[0].title, classes[0].created_at);
  return (
    <div className="flex flex-col px-6 h-full">
      <div className="flex flex-col h-full px-8 pb-6">
        <h1 className="font-Georgia font-semibold text-3xl text-white ">
          Recent Notes
        </h1>
        <div className="grid grid-cols-4 flex-none h-60 gap-6 py-8 w-">
          {classes.slice(0, 4).map((cls) => (
            <NoteCard
              key={cls.id}
              title={cls.title}
              timeStamp={formatDistanceToNowStrict(new Date(cls.created_at), {
                addSuffix: true,
              })}
            ></NoteCard>
          ))}
        </div>
        <div className="flex-1">
          <CalendarSchedule></CalendarSchedule>
        </div>
      </div>
    </div>
  );
};

export default Home;
