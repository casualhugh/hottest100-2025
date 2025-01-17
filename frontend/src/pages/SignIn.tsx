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

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
    setValidName(true);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (password !== confirmPassword) {
      setValidPassword(true);
    } else {
      setValidPassword(false);
    }
  };

  const handleSignIn = async () => {
    if (username.length > -1) {
      await login(username, password).then((result) => {
        if (next_url) {
          navigate(next_url);
        } else {
          navigate("/");
        }
      });
    } else {
      setValidName(false);
    }
  };

  const handleInitialSignUp = () => {
    setSigningUp(true);
  };

  const handleSignUp = async () => {
    if (username.length > -1) {
      await register(name, username, password).then((result) => {
        if (next_url) {
          navigate(next_url);
        } else {
          navigate("/");
        }
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
          Hottest 100 2025 the game
        </h1>
        <p className="mt-8 text-xl font-bold text-center my-4">
          Enter your username and password
        </p>
        <div
          className={`ml-24 mr-24 bg-black bg-opacity-50  ${
            !validName ? "border border-red-600 border-4" : ""
          }`}
        >
          <input
            value={username || ""}
            onChange={handleUserNameChange}
            type="text"
            placeholder="Enter your username..."
            className={`py-2 text-center bg-transparent focus:outline-none`}
          />
        </div>
        <div
          className={`ml-24 mr-24 my-2 bg-black bg-opacity-50  ${
            !validName ? "border border-red-600 border-4" : ""
          }`}
        >
          <input
            value={password || ""}
            onChange={handlePasswordChange}
            type="password"
            placeholder="Enter your password..."
            className={`py-2 text-center bg-transparent focus:outline-none`}
          />
        </div>
        {signingUp && (
          <div
            className={`ml-24 mr-24 my-2 bg-black bg-opacity-50  ${
              !validName ? "border border-red-600 border-4" : ""
            }`}
          >
            <input
              value={confirmPassword || ""}
              onChange={handleConfirmPasswordChange}
              type="password"
              placeholder="Confirm your password..."
              className={`py-2 text-center bg-transparent focus:outline-none`}
            />
          </div>
        )}
      </div>

      <div className="ml-8 mr-8 ">
        <button
          className={`${
            signingUp ? "bg-secondarybg" : "bg-primarybg"
          } mt-2 w-full p-4 rounded-lg  font-bold text-black`}
          onClick={signingUp ? () => setSigningUp(false) : handleSignIn}
        >
          {signingUp ? "Back to login" : "Log in"}
        </button>
        <button
          className={`${
            signingUp ? "bg-primarybg" : "bg-secondarybg"
          } mt-2 w-full text-black font-bold p-4`}
          onClick={signingUp ? handleSignUp : handleInitialSignUp}
        >
          Sign up
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
