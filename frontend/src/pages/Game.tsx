import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";
import { FaGear } from "react-icons/fa6";
import { usePocket } from "@/contexts/PocketContext";
import useSWR from "swr";
import { useEffect, useState } from "react";
import SVGComponent from "@/components/AnimatedLogo";
import Rules from "@/components/Rule";
import CountDown from "@/components/CountDown";
import CastButton from "@/components/CastButton";

const individual = [
  "is now simon says eveyone must do what they say only if they preceed it with simon says until the song finishes otherwise drink",
  "for 1 minute must answer rapid-fire questions from others. If they hesitate or answer incorrectly, they drink.",
  "must do a truth or dare decided on by everyone else or drink",
  "is now banned from saying a word decided on by everyone else for the next 10 songs if they say it they drink",
  "must sing the chrous of this song others count how many times they mess up the lyrics and they drink that many times",
  "must guess the time without looking at a clock and drink however many minutes they are away",
  "must guess the month this song was release on and drink however many months they are away (check spotify)",
  "gets to dish out a drink for every person in your party",
  "voted for this so must take a drink for every letter in the songs name",
  "isn't allowed to move until the song finishes",
  "must dance until the song is over",
];

const group = [
  "are now simon says eveyone must do what they say only if they preceed it with simon says until the song finishes otherwise drink",
  "for 1 minute must answer rapid-fire questions from others. If they hesitate or answer incorrectly, they drink.",
  "must do a truth or dare decided on by everyone else or drink",
  "are now banned from saying a word decided on by everyone else for the next 10 songs if they say it they drink",
  "must sing this song others count how many times they mess up the lyrics",
  "must guess the time without looking at a clock and drink however many minutes they are away",
  "must guess the month this song was release on and drink however many months they are away (check spotify)",
  "get to dish out a drink for every person in your party",
  "are now drinking buddies and must drink when the others drink for the next 5 songs",
  "voted for this so must take a drink for every letter in the songs name",
  "aren't allowed to move until the song finishes",
  "must dance until the song is over",
];

const Game = () => {
  const convertStringToNumber = (inputString: string, max: number) => {
    let hash = 0;
    for (let i = 0; i < inputString.length; i++) {
      hash += inputString.charCodeAt(i);
    }
    // Scale the hash to a number between 1 and 10
    const scaledNumber = hash % max;
    return scaledNumber;
  };
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // countdownstarts should be true if it is after targetDate
  const targetDate = new Date("2025-01-25T01:00:00Z");
  const [countDownStarted, setCountDownStarted] = useState(
    targetDate.getTime() < new Date().getTime()
  );
  useEffect(() => {
    if (!countDownStarted) {
      const timer = setInterval(() => {
        setCountDownStarted(targetDate.getTime() < new Date().getTime());
      }, 1000);

      return () => clearInterval(timer); // Cleanup on unmount
    }
  }, []);

  console.log(countDownStarted);
  const [nowPlaying, setNowPlaying] = useState({
    id: "",
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
        id: data.song,
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
              id: e.record.song,
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
  const [playerRule, setPlayerRule] = useState("");
  const [showPlayerRule, setShowPlayerRule] = useState(false);
  useEffect(() => {
    if (game && game?.votes) {
      console.log(game);
      const voted_for_time = game?.votes
        .filter((vote: any) => {
          console.log(vote.votes);
          return vote.votes.includes(nowPlaying.id);
        })
        .map((vote: any) => capitalizeFirstLetter(vote.expand.user.name));
      console.log("voted", nowPlaying.id, voted_for_time);
      if (voted_for_time.length > 0) {
        if (voted_for_time.length > 1) {
          const num = convertStringToNumber(nowPlaying.name, group.length);
          const usersWithSongString =
            voted_for_time.slice(0, -1).join(", ") +
            " and " +
            voted_for_time[voted_for_time.length - 1];
          setPlayerRule(usersWithSongString + " " + group[num]);
          setShowPlayerRule(true);
        } else {
          const num = convertStringToNumber(nowPlaying.name, individual.length);
          const usersWithSongString = voted_for_time[0];
          setPlayerRule(usersWithSongString + " " + individual[num]);
          setShowPlayerRule(true);
        }
      } else {
        setShowPlayerRule(false);
        setPlayerRule("");
      }
    }
  }, [game, nowPlaying]);
  return (
    <>
      {showCode && (
        <div className="absolute top-0 left-0 text-4xl">
          Game code: {`${id}`}
        </div>
      )}
      {countDownStarted ? (
        nowPlaying.rule.length > 0 || playerRule.length > 0 ? (
          showPlayerRule && playerRule.length > 0 ? (
            <Rules rule={playerRule} />
          ) : (
            <Rules rule={nowPlaying.rule} />
          )
        ) : (
          <SVGComponent />
        )
      ) : (
        <div className="flex flex-col items-center justify-center">
          <SVGComponent />
          <CountDown />
          <p>The game rules will appear here when the countdown starts</p>
        </div>
      )}
      <div className="fixed bottom-0 left-0 w-full bg-black/50">
        {nowPlaying.position > 0 && nowPlaying.position < 101 && (
          <h1 className="text-center font-bold text-lg">
            #{nowPlaying.position}
          </h1>
        )}
        <h1 className="text-center font-bold text-4xl">
          {nowPlaying.name} - {nowPlaying.artist}
        </h1>

        <p className="text-center  text-gray-300 text-xl">
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
      <CastButton />
    </>
  );
};

export default Game;
