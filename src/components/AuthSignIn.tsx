import { useAuth } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";

const AuthSignIn = () => {
  const { signIn } = useAuth();
  // const { signInOAuth } = useAuth();

  return (
    <div className="w-120 p-10 flex flex-col justify-center bg-[#1f1e1d] border-1 border-[#2c2a29] rounded-2xl shadow-2xl">
      <h1 className="font-Georgia text-4xl text-white text-center  mb-4">
        Sign In
      </h1>
      <AuthForm signAction={signIn} signIn={true}></AuthForm>
      {/* <div className="flex items-center my-14">
        <hr className="border-[#9ca3af] flex-grow"></hr>
        <p className="text-[#9ca3af] mx-6 font-Geist text-md">Or</p>
        <hr className="border-[#9ca3af] flex-grow"></hr>
      </div>
      <button
        onClick={signInOAuth}
        className="flex bg-white self-center px-3.5 py-4 w-full justify-center items-center font-Geist font-semibold text-lg rounded-lg 
        hover:bg-[#e8e8e0] hover:-translate-y-1 hover:shadow-sm shadow-white cursor-pointer transition ease-out duration-200"
      >
        <img
          src="/icons/googleIcon.svg"
          className="w-6 h-6 mr-2"
          alt="Google logo"
          loading="lazy"
        />
        Sign in with Google
      </button> */}
      <p className="text-[#9ca3af] mt-2 font-Geist self-center">
        Don't have an account?{" "}
        <Link to={"/signUp"} className="underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default AuthSignIn;
