import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";

function Settings() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [players, setPlayers] = useState([
    "Hugh",
    "George",
    "Louis",
    "Johnny",
    "Billy",
  ]);

  const handleGoToGame = () => {
    navigate(`/game/${id}`);
  };

  const handleGoToVotes = () => {
    navigate(`/votes/${id}`);
  };

  const handleLeaveGame = () => {
    navigate("/");
  };
  return (
    <div>
      <div className="max-w-md mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold text-center my-4">
          Hottest 100 2025 the game
        </h1>
        <p className="">Game Code: {`${id}`}</p>
      </div>

      <div className="ml-8 mr-8 ">
        {players.map((player, index) => (
          <div
            key={index}
            className="flex flex-row items-center justify-center "
          >
            <button className="bg-black bg-opacity-50 text-white mt-2 w-full p-4 rounded-lg font-bold text-center">
              {player}
            </button>
            <button className="bg-black bg-opacity-50 text-white mt-2 p-4 rounded-lg  font-bold text-center">
              X
            </button>
          </div>
        ))}

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

export default Settings;
