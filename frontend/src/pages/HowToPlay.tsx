import { IoMdClose } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";

function HowToPlay() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleGoToGame = () => {
    navigate(`/game/${id}`);
  };

  return (
    <div className="mx-auto p-4 text-center max-h-[calc(100vh)] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-mainbg scrollbar-track-secondarybg">
      <h1 className="text-3xl font-bold text-center my-4">
        Hottest 200 2025 the game
      </h1>
      <p className="">Game Code: {`${id}`}</p>
      <div
        className="ml-8 mr-8 text-xl text-justify"
        style={{ lineHeight: "2em" }}
      >
        <p>
          G'day, tune lovers and grog enthusiasts! Welcome to the unofficial
          drinking game for the Triple J Hottest 100. Grab a cold one, gather
          your mates, and let's get cracking!
        </p>

        <ul>
          <li>
            <strong>Voting:</strong> First up, punch in what you voted for in
            this year's countdown.
          </li>
          <li>
            <strong>The Countdown Conundrum:</strong> As each Hottest 100 song
            plays, a random drinking rule pops up. Could be a nip, might be a
            chug – be ready for anything!
          </li>
          <li>
            <strong>Got Your Esky Packed?: </strong> If a song you voted for
            plays, it's your turn in the spotlight, the game will assign you a
            rule to follow!
          </li>
          <li>
            <strong>No Whingers!:</strong> Mutter "should've been higher", and
            you're sculling your drink. No sooks allowed!
          </li>
          <li>
            <strong>Chrome casting:</strong> In chrome right click, press cast
            then in the pop up chose sources "Cast Screen" then select your
            chrome cast. Press F11 to go fullscreen.
          </li>
        </ul>

        <p>
          That's it, you legends! Let's make this a day to remember, or at least
          try to remember.
        </p>
        <p>Cheers! 🎶🍺</p>
        <button
          className="bg-primarybg mt-2 w-full text-black font-bold p-4"
          onClick={handleGoToGame}
        >
          Go to Game
        </button>
        <button
          onClick={handleGoToGame}
          className="bg-primarybg hover:bg-orange-700 text-black font-bold py-4 px-4 rounded-full absolute top-0 right-0 mt-6 mr-6"
        >
          <IoMdClose size={32} />
        </button>
      </div>
    </div>
  );
}

export default HowToPlay;
