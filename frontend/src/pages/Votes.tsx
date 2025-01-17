import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { usePocket } from "@/contexts/PocketContext";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

const NO_VOTES = [
  { name: "", artist: "" },
  { name: "", artist: "" },
  { name: "", artist: "" },
  { name: "", artist: "" },
  { name: "", artist: "" },
  { name: "", artist: "" },
  { name: "", artist: "" },
  { name: "", artist: "" },
  { name: "", artist: "" },
  { name: "", artist: "" },
];

function Name() {
  const { id } = useParams<{ id: string }>();
  const { user, game, pb } = usePocket();

  const [votes, setVotes] = useState(NO_VOTES);

  const query = new URLSearchParams(window.location.search);
  const alt_user_id = query.get("user_id");

  useEffect(() => {
    const user_id =
      alt_user_id &&
      game &&
      game.owner == user.id &&
      game?.players &&
      game?.players.indexOf(alt_user_id) != -1
        ? alt_user_id
        : user?.id;

    if (user && game) {
      pb.collection("votes")
        .getFirstListItem(`user="${user_id}"`, { expand: "votes" })
        .then((res) => {
          if (res) {
            const newVotes = [...votes];
            res.expand.votes.forEach((vote, i) => {
              newVotes[i] = { ...vote };
            });
            setVotes(newVotes);
          } else {
            setVotes(NO_VOTES);
          }
        })
        .catch((err) => {
          setVotes(NO_VOTES);
        });
    }
  }, [user, game]);

  const navigate = useNavigate();

  const handleVoteNameChange = (i, e) => {
    const newVotes = [...votes];
    newVotes[i].name = e.target.value;
    setVotes(newVotes);
  };

  const handleVoteArtistChange = (i, e) => {
    const newVotes = [...votes];
    newVotes[i].artist = e.target.value;
    setVotes(newVotes);
  };

  const handleSave = async () => {
    if (!data) {
      const { trigger } = useSWRMutation(
        "/addVotes",
        async (_, { arg }) => await pb.collection("votes").create(arg),
        {
          onSuccess: async (vote) => {
          },
        }
      );
      await trigger({ user: user.id, votes });
    } else {
      const { trigger } = useSWRMutation(
        "/updateVotes",
        async (_, { arg }) => await pb.collection("votes").update(arg),
        {
          onSuccess: async () => await mutate(),
        }
      );
      await trigger({ id: data.id, votes });
    }
    navigate(`/game/${id}`);
  };

  const handleGoToGame = () => {
    navigate(`/game/${id}`);
  };

  return (
    <div>
      <div className="max-w-md mx-auto p-4 text-center">
        <p className="mt-8 text-xl font-bold text-center my-4">
          Enter your votes
        </p>
        {votes.map((vote, index) => (
          <div key={`${index}`}>
            <input
              key={`name-${index}`}
              value={vote.name || ""}
              onChange={(e) => handleVoteNameChange(index, e)}
              type="text"
              placeholder={`${index + 1}. Enter song name... `}
              className={`w-50 mt-1 py-2 text-center bg-black bg-opacity-50  focus:outline-none`}
            />
            <input
              key={`artist-${index}`}
              value={vote.artist || ""}
              onChange={(e) => handleVoteArtistChange(index, e)}
              type="text"
              placeholder={`${index + 1}. Enter artist... `}
              className={`w-50 ml-2 mt-1 py-2 text-center bg-black bg-opacity-50  focus:outline-none`}
            />
          </div>
        ))}
      </div>

      <div className="ml-8 mr-8 ">
        <button
          onClick={handleSave}
          className="bg-primarybg  mt-2 w-full p-4 rounded-lg  font-bold text-black"
        >
          Save
        </button>
      </div>
      <button
        onClick={handleGoToGame}
        className="bg-primarybg hover:bg-orange-700 text-black font-bold py-4 px-4 rounded-full absolute top-0 right-0 mt-6 mr-6"
      >
        <IoMdClose size={32} />
      </button>
    </div>
  );
}

export default Name;
