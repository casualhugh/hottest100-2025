import { usePocket } from "@/contexts/PocketContext";
import { useEffect, useState } from "react";
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

  const targetDate = new Date("2025-01-25T02:00:00Z");
  const calculateTimeLeft = () => {
    const now = new Date();
    const nowTimestamp = now.getTime(); // Get timestamp of current date/time
    const targetTimestamp = targetDate.getTime(); // Get timestamp of target date

    const difference = Math.abs(targetTimestamp - nowTimestamp); // Calculate the absolute difference in milliseconds

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

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
        <div className="flex justify-center space-x-4 text-2xl font-medium">
          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold text-white">
              {timeLeft.days}
            </span>
            <span>Days</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold text-white">
              {timeLeft.hours}
            </span>
            <span>Hours</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold text-white">
              {timeLeft.minutes}
            </span>
            <span>Minutes</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold text-white">
              {timeLeft.seconds}
            </span>
            <span>Seconds</span>
          </div>
        </div>
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
