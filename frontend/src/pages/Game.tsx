import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";
import { FaGear } from "react-icons/fa6";
import { usePocket } from "@/contexts/PocketContext";
import useSWR from "swr";
import { useEffect, useState } from "react";
import SVGComponent from "@/components/AnimatedLogo";
import Rules from "@/components/Rule";
import CountDown from "@/components/CountDown";

// const individual = [
//   "is now simon says eveyone must do what they say only if they preceed it with simon says until the song finishes otherwise drink",
//   "for 1 minute must answer rapid-fire questions from others. If they hesitate or answer incorrectly, they drink.",
//   "must do a truth or dare decided on by everyone else or drink",
//   "is now banned from saying a word decided on by everyone else for the next 10 songs if they say it they drink",
//   "must sing the chrous of this song others count how many times they mess up the lyrics and they drink that many times",
//   "must guess the time without looking at a clock and drink however many minutes they are away",
//   "must guess the month this song was release on and drink however many months they are away (check spotify)",
//   "gets to dish out a drink for every person in your party",
//   "voted for this so must take a drink for every letter in the songs name",
//   "isn't allowed to move until the song finishes",
//   "must dance until the song is over",
// ];

// const group = [
//   "are now simon says eveyone must do what they say only if they preceed it with simon says until the song finishes otherwise drink",
//   "for 1 minute must answer rapid-fire questions from others. If they hesitate or answer incorrectly, they drink.",
//   "must do a truth or dare decided on by everyone else or drink",
//   "are now banned from saying a word decided on by everyone else for the next 10 songs if they say it they drink",
//   "must sing this song others count how many times they mess up the lyrics",
//   "must guess the time without looking at a clock and drink however many minutes they are away",
//   "must guess the month this song was release on and drink however many months they are away (check spotify)",
//   "get to dish out a drink for every person in your party",
//   "are now drinking buddies and must drink when the others drink for the next 5 songs",
//   "voted for this so must take a drink for every letter in the songs name",
//   "aren't allowed to move until the song finishes",
//   "must dance until the song is over",
// ];

const Game = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [countDownStarted, setCountDownStarted] = useState(false);
  const [nowPlaying, setNowPlaying] = useState({
    name: "Loading...",
    artist: "",
    rule: "",
    position: 0,
  });
  const { pb, showCode, game } = usePocket();
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
        position: data.countdown_position,
      });
      pb.collection("played").subscribe(
        "*",
        function (e: any) {
          if (e.action === "create") {
            setNowPlaying({
              name: e.record.expand.song.name,
              artist: e.record.expand?.song?.artist,
              rule: e.record.expand?.song.game_rule,
              position: data.countdown_position,
            });
          }
        },
        {
          expand: "song",
        }
      );
    }
  }, [data]);
  function capitalizeFirstLetter(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }
  const player_names = game?.votes
    ? game.votes
        .filter((vote: any) => vote.expand.user.name.length > 0)
        .map(
          (vote: any) =>
            capitalizeFirstLetter(vote.expand.user.name) +
            ` votes played ${vote.played.length}`
        )
    : [];
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
        {nowPlaying.position > 0 && (
          <h1 className="text-center font-bold text-lg">
            #{nowPlaying.position}
          </h1>
        )}
        <h1 className="text-center font-bold text-lg">
          {nowPlaying.name} - {nowPlaying.artist}
        </h1>

        <p className="text-center  text-gray-300">
          {player_names.length > 0
            ? `${player_names.join(" | ")}`
            : "Waiting for players..."}
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
