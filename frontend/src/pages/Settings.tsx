import { usePocket } from "@/contexts/PocketContext";
import { IoMdClose } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";

function Settings() {
  const { id } = useParams<{ id: string }>();
  const { pb, user, showCode, toggleShowCode, game, leaveGame, logout } =
    usePocket();
  const navigate = useNavigate();

  const handleGoToGame = () => {
    navigate(`/game/${id}`);
  };

  const handleGoToHowToPlay = () => {
    navigate(`/info/${id}`);
  };

  const handleGoToVotes = () => {
    navigate(`/votes/${id}`);
  };

  const handleManageGame = () => {
    navigate(`/manage/${id}`);
  };

  const handleCloseGame = () => {
    pb.collection("games")
      .delete(game.id)
      .then(() => {
        navigate("/");
      });
  };

  const handleLeaveGame = () => {
    navigate("/");
    leaveGame(game.game_code);
  };

  const toggleGameCodeVisibility = () => {
    toggleShowCode();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNameChange = () => {
    navigate(`/name/${id}`);
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
        {game.owner === user.id ? (
          <button
            className="bg-black bg-opacity-50 text-white mt-2 w-full p-4 rounded-lg  font-bold"
            onClick={handleCloseGame}
            title="Warning this cannot be undone."
          >
            Delete Game
          </button>
        ) : (
          <button
            className="bg-black bg-opacity-50 text-white mt-2 w-full p-4 rounded-lg  font-bold"
            onClick={handleLeaveGame}
          >
            Leave Game
          </button>
        )}
        <button
          className="bg-black bg-opacity-50 text-white mt-2 w-full p-4 rounded-lg  font-bold"
          onClick={handleLogout}
        >
          Log out
        </button>
        <button
          className="bg-black bg-opacity-50 text-white mt-2 w-full p-4 rounded-lg  font-bold"
          onClick={handleNameChange}
        >
          {`${user.name.length == 0 ? "Join game" : "Change name"}`}
        </button>

        {game && game.owner == user.id && (
          <button
            className="bg-black bg-opacity-50 text-white mt-2 w-full p-4 rounded-lg  font-bold"
            onClick={handleManageGame}
          >
            Manage game
          </button>
        )}
        <button
          className="bg-black bg-opacity-50 text-white mt-2 w-full p-4 rounded-lg  font-bold"
          onClick={handleGoToVotes}
        >
          Enter Votes
        </button>

        <button
          className="bg-black bg-opacity-50 text-white mt-2 w-full p-4 rounded-lg  font-bold"
          onClick={toggleGameCodeVisibility}
        >
          {showCode ? "Hide game code" : "Show game code"}
        </button>
        <button
          className="bg-primarybg mt-2 w-full text-black font-bold p-4"
          onClick={handleGoToHowToPlay}
        >
          How to play
        </button>
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
