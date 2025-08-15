import { usePocket } from "@/contexts/PocketContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validPassword, setValidPassword] = useState(true);
  const [signingUp, setSigningUp] = useState(false);
  const [validName, setValidName] = useState(true);
  const { login, register } = usePocket();
  const navigate = useNavigate();

  // Get the query params
  const query = new URLSearchParams(window.location.search);
  const next_url = query.get("next");
  const name = query.get("name");

  const handleUserNameChange = (e: any) => {
    setUserName(e.target.value);
    setValidName(e.target.value.length > 3);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
    if (e.target.value.length > 3) {
      setValidPassword(true);
    } else {
      setValidPassword(false);
    }
  };

  const handleConfirmPasswordChange = (e: any) => {
    setConfirmPassword(e.target.value);
    if (password === e.target.value) {
      setValidPassword(true);
    } else {
      setValidPassword(false);
    }
  };

  const handleSignIn = async () => {
    if (username.length > 1) {
      await login(username, password)
        .then((result: any) => {
          if (result) {
            if (next_url) {
              navigate(next_url);
            } else {
              navigate("/");
            }
          } else {
            setValidName(false);
          }
        })
        .catch((error: any) => {
          console.log(error);
          setValidName(false);
        });
    } else {
      setValidName(false);
    }
  };

  const handleSignUp = async () => {
    if (username.length > -1) {
      await register(name, username, password)
        .then((result: any) => {
          if (result) {
            if (next_url) {
              navigate(next_url);
            } else {
              navigate("/");
            }
          }
        })
        .catch((error: any) => {
          console.log(error);
          setValidName(false);
        });
    } else {
      setValidName(false);
    }
  };

  const handleBack = () => {
    navigate(`/`);
  };

  return (
    <div>
      <div className="max-w-md mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold text-center my-4">
          Hottest 100 The game
        </h1>
        <p className="mt-8 text-xl font-bold text-center my-4">
          Enter your username and password. If you have played before please make a new account.
        </p>
        <p className="mt-8 text-xl font-bold text-center my-4">
          Password must be more than 4 characters
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevents the default form submission
            signingUp ? handleSignUp() : handleSignIn();
          }}
          className="space-y-4"
        >
          <div
            className={`ml-24 mr-24 bg-black bg-opacity-50 ${
              !validName ? "border border-red-600 border-4" : ""
            }`}
          >
            <input
              value={username || ""}
              onChange={handleUserNameChange}
              type="text"
              placeholder="Enter your username..."
              autoComplete="username"
              className="py-2 text-center bg-transparent focus:outline-none w-full"
            />
          </div>
          <div
            className={`ml-24 mr-24 bg-black bg-opacity-50 ${
              !validPassword ? "border border-red-600 border-4" : ""
            }`}
          >
            <input
              value={password || ""}
              onChange={handlePasswordChange}
              type="password"
              autoComplete={`${
                signingUp ? "new-password" : "current-password"
              }`}
              placeholder="Enter your password..."
              className="py-2 text-center bg-transparent focus:outline-none w-full"
            />
          </div>
          {signingUp && (
            <div
              className={`ml-24 mr-24 bg-black bg-opacity-50 ${
                !validPassword ? "border border-red-600 border-4" : ""
              }`}
            >
              <input
                value={confirmPassword || ""}
                onChange={handleConfirmPasswordChange}
                type="password"
                autoComplete="new-password"
                placeholder="Confirm your password..."
                className="py-2 text-center bg-transparent focus:outline-none w-full"
              />
            </div>
          )}
          <button
            type="submit"
            className={`bg-primarybg mt-2 w-full p-4 rounded-lg font-bold text-white`}
          >
            {signingUp ? "Sign up" : "Log in"}
          </button>
        </form>
        <button
          className={`bg-secondarybg
           mt-2 w-full p-4 rounded-lg font-bold text-white`}
          onClick={
            signingUp ? () => setSigningUp(false) : () => setSigningUp(true)
          }
        >
          {signingUp ? "Back to login" : "Sign up"}
        </button>
        <button
          className="bg-black bg-opacity-50 mt-2 w-full text-white font-bold p-4"
          onClick={handleBack}
        >
          Back to start
        </button>
      </div>
    </div>
  );
}

export default SignIn;
