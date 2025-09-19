import { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import type { ResponseType } from "../types";

const passwordValidator = (password: string) => {
  if (
    validator.isStrongPassword(password, {
      minLength: 6,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 1,
    })
  )
    return true;
  else return false;
};

const AuthForm = ({
  signAction,
  signIn,
}: {
  signAction: (email: string, password: string) => Promise<ResponseType>;
  signIn: boolean;
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordHidden, setPasswordHidden] = useState<boolean>(true);
  const [confirmPasswordHidden, setConfirmPasswordHidden] =
    useState<boolean>(true);
  const navigate = useNavigate();

  return (
    <form
      className="flex flex-col font-Geist"
      onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await signAction(email, password);
        if (!signIn && response.success) {
          toast.success(
            "Successfully created a new user! Check your email for confirmation"
          );
          navigate("../signIn", { replace: true });
        } else if (!signIn) {
          toast.error(`Error signing up: ${response.error?.message}`);
        } else {
          toast.error(`Error signing in: ${response.error?.message}`);
        }
      }}
    >
      <div className="flex flex-col">
        <label className="text-[#9ca3af] text-sm mb-2 font-medium">Email</label>
        <input
          name={"email"}
          type={"email"}
          className="w-full bg-white px-3.5 py-4 rounded-lg focus:outline-none"
          placeholder={"Enter your email"}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        ></input>
        <p className="text-red-600 mb-5 h-6">
          {signIn || validator.isEmail(email) || !email ? "" : "Invalid email"}
        </p>
      </div>

      <div className="flex flex-col">
        <label className="text-[#9ca3af] text-sm mb-2 font-medium">
          Password
        </label>
        <div className="relative">
          <input
            name={"password"}
            type={passwordHidden ? "password" : "text"}
            className="w-full bg-white px-3.5 py-4 rounded-lg focus:outline-none"
            placeholder={"Enter your password"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          <button
            type="button"
            className="absolute w-10 h-10 right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setPasswordHidden(!passwordHidden)}
          >
            <FontAwesomeIcon
              icon={passwordHidden ? faEye : faEyeSlash}
              className="text-xl"
            ></FontAwesomeIcon>
          </button>
        </div>
        <p className="text-red-600 mb-5 h-6">
          {signIn || passwordValidator(password) || !password
            ? ""
            : "At least 6 characters, with a number and a symbol"}
        </p>
      </div>

      {signIn ? (
        <></>
      ) : (
        <div className="flex flex-col">
          <label className="text-[#9ca3af] text-sm mb-2 font-medium">
            Confirm Password
          </label>
          <div className="relative">
            <input
              name={"password"}
              type={confirmPasswordHidden ? "password" : "text"}
              className="w-full bg-white px-3.5 py-4 rounded-lg focus:outline-none"
              placeholder={"Re-enter your password"}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            ></input>
            <button
              type="button"
              className="absolute w-10 h-10 right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setConfirmPasswordHidden(!confirmPasswordHidden)}
            >
              <FontAwesomeIcon
                icon={confirmPasswordHidden ? faEye : faEyeSlash}
                className="text-xl"
              ></FontAwesomeIcon>
            </button>
          </div>
          <p className="text-red-600 mb-5 h-6">
            {signIn || passwordValidator(confirmPassword) || !confirmPassword
              ? ""
              : "At least 6 characters, with a number and a symbol"}
          </p>
        </div>
      )}

      <button
        type="submit"
        className={`${
          validator.isEmail(email) &&
          passwordValidator(password) &&
          (signIn || passwordValidator(confirmPassword)) &&
          (signIn || password === confirmPassword)
            ? "bg-white hover:bg-[#e8e8e0] hover:-translate-y-1 hover:shadow-sm shadow-white cursor-pointer transition ease-out duration-200"
            : "bg-[#8f8c89] pointer-events-none"
        }
          px-3.5 py-4 mt-6 rounded-lg font-semibold text-lg`}
      >
        {signIn ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default AuthForm;
