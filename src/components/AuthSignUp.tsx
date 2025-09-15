import { useAuth } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";

const AuthSignUp = () => {
  const { signUp } = useAuth();

  return (
    <div className="w-140 p-10 flex flex-col justify-center bg-[#1f1e1d] border-1 border-[#2c2a29] rounded-2xl shadow-2xl">
      <h1 className="font-Georgia text-4xl text-white text-center  mb-4">
        Sign Up
      </h1>
      <AuthForm signAction={signUp} signIn={false}></AuthForm>
      <p className="text-[#9ca3af] mt-2 font-Geist self-center">
        Have an account?{" "}
        <Link to={"/signIn"} className="underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default AuthSignUp;
