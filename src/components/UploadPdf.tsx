import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadSyllabus } from "../api/syllabi";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowUp } from "@fortawesome/free-solid-svg-icons";

const UploadPdf = ({
  classId,
  onUploadComplete,
}: {
  classId: string;
  onUploadComplete: () => void;
}) => {
  const [uploading, setUploading] = useState(false);
  const auth = useAuth();
  const session = auth?.session;

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      const formData = new FormData();
      formData.append("pdf", acceptedFiles[0]);
      formData.append("classId", classId);
      formData.append("user_id", session!.user.id);

      if (session!.user.app_metadata.provider == "google")
        formData.append("isGoogle", "true");
      else formData.append("isGoogle", "false");

      await uploadSyllabus(formData, session!);
      console.log("COMPLETED");
      setUploading(false);
      onUploadComplete?.();
    },
    [session, classId, onUploadComplete]
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
      className={`p-14 m-2 border-2 border-dotted rounded-3xl text-[#c0bfbf] ${
        uploading ? "hover:cursor-not-allowed" : "hover:cursor-pointer"
      }`}
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
