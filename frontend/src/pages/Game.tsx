import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";
import { FaGear } from "react-icons/fa6";
import { usePocket } from "@/contexts/PocketContext";
import useSWR from "swr";
import { useEffect, useState } from "react";
import SVGComponent from "@/components/AnimatedLogo";
import Rules from "@/components/Rule";
import CountDown from "@/components/CountDown";
const Game = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [countDownStarted, setCountDownStarted] = useState(false);
  const [nowPlaying, setNowPlaying] = useState({
    name: "Loading...",
    artist: "",
    rule: "",
  });
  const { pb, showCode, user } = usePocket();
  const handleSettings = () => {
    navigate(`/settings/${id}`);
  };

  const { data } = useSWR(
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
        function (e: any) {
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

  function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }
  return (
    <>
      {showCode && (
        <div className="absolute top-0 left-0 text-4xl">
          Game code: {`${id}`}
        </div>
      )}
      {countDownStarted ? (
        nowPlaying.rule.length ? (
          <Rules rule={nowPlaying.rule} />
        ) : (
          <SVGComponent />
        )
      ) : (
        <div className="flex flex-col items-center justify-center">
          <SVGComponent />
          <CountDown setTimerDone={setCountDownStarted} />
        </div>
      )}
      <div className="fixed bottom-0 left-0 w-full bg-black/50">
        <h1 className="text-center font-bold text-lg">
          {nowPlaying.name} - {nowPlaying.artist}
        </h1>

        <p className="text-center  text-gray-300">
          {capitalizeFirstLetter(user.name)} votes played 0
        </p>
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
