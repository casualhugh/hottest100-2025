import CountDown from "@/components/CountDown";
import { usePocket } from "@/contexts/PocketContext";
import {  useState } from "react";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const [gameCode, setGameCode] = useState("");
  const [validCode, setValidCode] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const { user, votesDone, gameExists } = usePocket();
  const navigate = useNavigate();

  const handleCodeChange = (e: any) => {
    setGameCode(e.target.value);
    setValidCode(true);
    setErrorMsg("");
  };

  const handleEnterGame = () => {
    if (gameCode.length > 3) {
      gameExists(gameCode).then((exists: any) => {
        if (exists) {
          setValidCode(true);
          if (user && user.name) {
            if (!user?.email) {
              navigate(`/question/${gameCode}`);
              return;
            }
            votesDone().then((done: any) => {
              if (done) {
                navigate(`/game/${gameCode}`);
              } else {
                navigate(`/votes/${gameCode}`);
              }
            });
            return;
          } else navigate(`/name/${gameCode}`);
        } else {
          setErrorMsg("Game Code does not exist");
          setValidCode(false);
        }
      });
    } else {
      setValidCode(false);
      setErrorMsg("Game Code must be more than 3 letters");
    }
  };

  const handleNewGame = () => {
    if (user) navigate("/new/");
    else navigate("/login/?next=/new/");
  };

  return (
    <div>
      <div className="max-w-md mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold text-center my-4">
          Welcome to Hottest 100 2025 The game
        </h1>

        <p className="">
          This is a game like Kahoot where you can choose to host a game or join
          one. If you're hosting, you'll be given a unique code that you can
          share with friends.
        </p>
        <CountDown setTimerDone={() => {}} />
        <p className="mt-8">Enter your game code</p>
        <div
          className={`ml-24 mr-24 bg-black bg-opacity-50  ${
            !validCode ? "border border-red-600 border-4" : ""
          }`}
        >
          <input
            value={gameCode || ""}
            onChange={handleCodeChange}
            type="text"
            placeholder="elephants"
            className={`py-2 text-center bg-transparent focus:outline-none`}
          />
        </div>
        <p>{errorMsg}</p>
      </div>

      <div className="ml-8 mr-8 ">
        <button
          className="bg-primarybg  mt-2 w-full p-4 rounded-lg  font-bold text-black"
          onClick={handleEnterGame}
        >
          Enter
        </button>
        <button
          className="bg-secondarybg mt-2 w-full text-black font-bold p-4"
          onClick={handleNewGame}
        >
          Host game
        </button>
      </div>
    </div>
  );
}

export default Welcome;
