import { usePocket } from "@/contexts/PocketContext";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";

function Settings() {
  const { id } = useParams<{ id: string }>();
  const { user, game, pb, guestRegister } = usePocket();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!game || !game?.expand || !user) {
      return;
    }
    if (game.owner != user.id) {
      navigate(`/game/${id}`);
      return;
    }
    if (game.expand.players) {
      const players = game.expand.players.filter(
        (player: any) => player.name && player.id != game.owner
      );
      setPlayers(players);
    } else {
      setPlayers([]);
    }
  }, [game]);

  const handleGoToGame = () => {
    navigate(`/game/${id}`);
  };

  const handleGoToVotes = (name: string, user_id: string) => {
    navigate(`/votes/${id}?user_id=${user_id}&name=${name}`);
  };

  const removePlayer = (user_id: string) => {
    const newPlayers = players
      .filter((player: any) => player.id != user_id)
      .map((player: any) => {
        return player.id;
      });
    pb.collection("games").update(game?.id, {
      players: newPlayers,
    });
  };

  const handleAddPlayer = () => {
    if (name.length > 2) {
      guestRegister(name).then((result: any) => {
        const newPlayers = [
          ...players.map((player: any) => {
            return player.id;
          }),
          result.id,
        ];
        pb.collection("games").update(game?.id, {
          players: newPlayers,
        });
        setName("");
      });
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold text-center my-4">
          Hottest 100 2025 the game
        </h1>
        <p className="">Game Code: {`${id}`}</p>
        <p className="">
          Click on a name to edit their votes. Click the X to remove them.
        </p>
      </div>

      <div className="ml-8 mr-8 ">
        {players.map((player: any, index: number) => (
          <div
            key={index}
            className="flex flex-row items-center justify-center "
            title="Click to edit votes"
          >
            <button
              onClick={() => handleGoToVotes(player.name, player.id)}
              className="bg-black bg-opacity-50 text-white mt-2 w-full p-4 rounded-lg font-bold text-center"
            >
              {player.name}
            </button>
            <button
              title="Click to remove player"
              onClick={() => removePlayer(player.id)}
              className="bg-black bg-opacity-50 text-white mt-2 p-4 rounded-lg  font-bold text-center"
            >
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
        <div className="max-w-md mx-auto text-center">
          <p className="mt-8 text-xl">Enter new players name</p>
          <div className={`bg-black bg-opacity-50 `}>
            <input
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter a name..."
              className={`py-2 text-center bg-transparent focus:outline-none`}
            />
            <button
              className="bg-primarybg mt-2 w-full text-black font-bold p-4"
              onClick={handleAddPlayer}
            >
              Add Player
            </button>
          </div>
        </div>
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
