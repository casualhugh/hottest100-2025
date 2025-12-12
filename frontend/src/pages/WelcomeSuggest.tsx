import CountDown from "@/components/CountDown";
import { usePocket } from "@/contexts/PocketContext";
import { useNavigate } from "react-router-dom";

function WelcomeSuggest() {
   const { user } = usePocket();
    const navigate = useNavigate();
  const handleSuggestRule = () => {
    if (user) navigate("/suggest/");
    else navigate("/login/?next=/suggest/");
  };

  return (
    <div>
      <div className="max-w-md mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold text-center my-4">
          Welcome to Hottest 100 The game
        </h1>

        <p className="">
          Each song in the countdown comes with its own drinking rule, and you can also drop in the songs you voted for so there are extra rules when your picks show up. It gets silly pretty quickly.
          I am still putting this together, so if you have any ideas or suggestions, send them my way.
        </p>
        <CountDown />
      </div>

      <div className="ml-8 mr-8 ">
        <button
          className="bg-secondarybg mt-2 w-full text-white font-bold p-4"
          onClick={handleSuggestRule}
        >
          Make a game rule suggestion
        </button>
      </div>
    </div>
  );
}

export default WelcomeSuggest;
