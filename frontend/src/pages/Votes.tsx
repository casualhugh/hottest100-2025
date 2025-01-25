import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { usePocket } from "@/contexts/PocketContext";
import AutoCompleteInput from "@/components/AutoCompleteInput";

const NO_VOTES = [
  { name: "", artist: "", id: "" },
  { name: "", artist: "", id: "" },
  { name: "", artist: "", id: "" },
  { name: "", artist: "", id: "" },
  { name: "", artist: "", id: "" },
  { name: "", artist: "", id: "" },
  { name: "", artist: "", id: "" },
  { name: "", artist: "", id: "" },
  { name: "", artist: "", id: "" },
  { name: "", artist: "", id: "" },
];

function Name() {
  const { id } = useParams<{ id: string }>();
  const query = new URLSearchParams(window.location.search);
  const alt_user_id = query.get("user_id");
  const name = query.get("name");
  const { user, game, pb, updateVotes } = usePocket();
  const [songs, setSongs] = useState([]);

  const [votes, setVotes] = useState([...NO_VOTES]);
  const [votes_data, setVoteData] = useState({
    id: "",
    name: name ? name : "",
  });
  console.log(name);
  const user_id =
    alt_user_id &&
    game &&
    game.owner == user.id &&
    game?.players &&
    game?.players.indexOf(alt_user_id) != -1
      ? alt_user_id
      : user?.id;
  const loadVotes = () => {
    if (user && game) {
      pb.collection("votes")
        .getFirstListItem(`user="${user_id}"`, { expand: "votes,user" })
        .then((res: any) => {
          if (res && res?.expand?.votes) {
            const newVotes = [...NO_VOTES];
            res.expand.votes.forEach((vote: any, i: number) => {
              newVotes[i] = { ...vote };
            });
            setVotes(newVotes);
          } else {
            setVotes([...NO_VOTES]);
          }
          if (res?.id) {
            setVoteData({ id: res.id, name: res.expand.user.name });
          } else {
            setVoteData({ id: "", name: "" });
          }
        })
        .catch(() => {
          setVotes([...NO_VOTES]);
          setVoteData({ id: "", name: "" });
        });
    }
  };

  useEffect(() => {
    const loadJSON = async () => {
      try {
        const songs_json: any = await import("../assets/songs.json"); // Adjust the path to your JSON file
        setSongs(songs_json.default);
      } catch (error) {
        console.error("Error loading songs JSON:", error);
      }
    };
    loadJSON();

    loadVotes();
  }, [user]);

  const navigate = useNavigate();

  const handleUpdateVote = (i: number, input: any) => {
    const newVotes = [...votes];
    newVotes[i] = input;
    setVotes(newVotes);
  };

  const handleVoteNameChange = (i: number, input: string) => {
    const newVotes = [...votes];
    newVotes[i].name = input;
    setVotes(newVotes);
  };

  const handleVoteArtistChange = (i: number, input: string) => {
    const newVotes = [...votes];
    newVotes[i].artist = input;
    setVotes(newVotes);
  };

  const handleSave = async () => {
    const update = votes.filter((v: any) => v.id !== "").map((v: any) => v.id);

    await updateVotes(user_id, votes_data.id, update);
    loadVotes();
  };

  const handleGoToGame = () => {
    navigate(`/game/${id}`);
  };

  return (
    <div>
      <div className="max-w-md mx-auto p-4 text-center  max-h-[calc(100vh)] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-mainbg scrollbar-track-secondarybg">
        <p className="mt-8 text-xl font-bold text-center my-4">
          {name
            ? `Enter ${name}s votes`
            : votes_data.name.length > 0
            ? `Enter ${votes_data.name}s votes`
            : "Enter your votes"}
        </p>
        <p>Only the official hottest 100 list is available for voting.</p>
        <p>
          If your votes aren't saving try refresh the screen before you enter
          them in.
        </p>
        {votes.map((vote, index) => (
          <AutoCompleteInput
            key={`${index}`}
            songs={songs}
            hasId={votes[index].id.length > 0}
            votes={votes}
            songInput={vote.name}
            updateVote={(input: any) => handleUpdateVote(index, input)}
            setSongInput={(e: any) => handleVoteNameChange(index, e)}
            artistInput={vote.artist}
            setArtistInput={(e: any) => handleVoteArtistChange(index, e)}
          />
        ))}
        <button
          onClick={handleSave}
          className="bg-primarybg mt-2 w-full p-4 rounded-lg  font-bold text-black"
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
