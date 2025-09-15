import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadSyllabus } from "../api/syllabi";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowUp } from "@fortawesome/free-solid-svg-icons";

const UploadPdf = ({ classId }: { classId: string }) => {
  const { session } = useAuth();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const formData = new FormData();
      formData.append("pdf", acceptedFiles[0]);
      formData.append("classId", classId);

      await uploadSyllabus(formData, session);
    },
    [session, classId]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [],
    },
    multiple: false,
  });

  return (
    <div
      className="p-14 m-2 border-2 border-dotted rounded-3xl text-[#c0bfbf] hover:cursor-pointer"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col justify-center items-center">
        <FontAwesomeIcon className="text-4xl mb-2" icon={faFileArrowUp} />
        {isDragActive ? (
          <p>Drop the file here</p>
        ) : (
          <p>Choose a file or drag and drop here</p>
        )}
      </div>
    </div>
  );
};

export default UploadPdf;
