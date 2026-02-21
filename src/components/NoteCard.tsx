const NoteCard = ({
  title,
  timeStamp,
}: {
  title: string;
  timeStamp: string;
}) => {
  return (
    <div className="flex flex-col relative justify-center items-center w-full h-full bg-white rounded-xl transition-transform duration-300 ease-out hover:-translate-y-2 hover:cursor-not-allowed">
      <p className="absolute top-5 left-5 text-sm font-medium py-1.5 px-3.5 bg-[#e2e0de] rounded-md">
        {title.toUpperCase()}
      </p>
      <p className="text-2xl font-bold translate-y-2">{title}</p>
      <div className="flex justify-between items-center absolute bottom-5 w-full">
        <p className="text-xs text-[#979592] ml-5">{timeStamp}</p>
        <div className="flex gap-2 px-3 py-2 mr-5 bg-[#e2e0de] rounded-2xl">
          <div className="w-2 h-2 rounded-full bg-black"></div>
          <div className="w-2 h-2 rounded-full bg-[#9e9d9b]"></div>
          <div className="w-2 h-2 rounded-full bg-[#9e9d9b]"></div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
