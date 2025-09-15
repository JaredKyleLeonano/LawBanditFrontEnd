import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";

function Authentication() {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      console.log("SESSION EXISTS", session);
      navigate("/dashboard");
    }
  }, [session, navigate]);

  if (!session) {
    console.log("NO SESSION", session);
    return (
      <>
        <Toaster
          toastOptions={{
            style: {
              fontSize: "1.25rem",
              width: "fit-content",
              whiteSpace: "nowrap",
            },
          }}
          className="flex justify-center"
          position="top-center"
          closeButton={true}
          richColors
        />
        <div className="bg-[radial-gradient(circle,#1c1a19_20%,#171514_73%)] w-screen h-screen flex items-center justify-center">
          <div className="absolute text-white top-0 left-0">
            <img
              src="/icons/lawbanditLogo.svg"
              alt="Law Bandit Logo"
              loading="lazy"
              className="w-20 h-20 mt-4 ml-6"
            ></img>
          </div>
          <Outlet />
        </div>
      </>
    );
  }
}

export default Authentication;
