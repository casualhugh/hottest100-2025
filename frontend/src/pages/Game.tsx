import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";
import { FaGear } from "react-icons/fa6";
import { usePocket } from "@/contexts/PocketContext";
import useSWR from "swr";
import { useEffect, useState } from "react";
import SVGComponent from "@/components/AnimatedLogo";
const Game = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nowPlaying, setNowPlaying] = useState({
    name: "Loading...",
    artist: "",
    rule: "",
  });
  const { pb } = usePocket();
  const handleSettings = () => {
    navigate(`/settings/${id}`);
  };

  const { data, isLoading, mutate } = useSWR(
    "/getNowPlaying",
    async () =>
      await pb.collection("played").getFirstListItem("", {
        expand: "song",
        sort: "-played_at",
      })
  );
  // todo: Sub to now playing and update when that does
  useEffect(() => {
    if (data && data?.expand) {
      setNowPlaying({
        name: data.expand.song.name,
        artist: data.expand?.song?.artist,
        rule: data.expand?.song.game_rule,
      });
      pb.collection("played").subscribe(
        "*",
        function (e) {
          if (e.action === "create") {
            setNowPlaying({
              name: e.record.expand.song.name,
              artist: e.record.expand?.song?.artist,
              rule: e.record.expand?.song.game_rule,
            });
          }
        },
        {
          expand: "song",
        }
      );
    }
  }, [data]);

  return (
    <>
      <div className="absolute top-0 left-0 text-4xl">Game code: {`${id}`}</div>
      {nowPlaying.rule.length ? (
        <div className="text-4xl">{nowPlaying.rule}</div>
      ) : (
        <SVGComponent />
      )}
      <div className="fixed bottom-0 left-0 w-full bg-black/50">
        <h1 className="text-center font-bold text-lg">
          {nowPlaying.name} - {nowPlaying.artist}
        </h1>

        <p className="text-center  text-gray-300">Hugh played 0</p>
      </div>
      <button
        onClick={handleSettings}
        className="bg-primarybg hover:bg-orange-700 text-black font-bold py-4 px-4 rounded-full absolute top-0 right-0 mt-6 mr-6"
      >
        <FaGear size={32} />
      </button>
    </>
  );
};

export default Game;
