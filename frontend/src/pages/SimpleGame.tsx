import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";
import { FaArrowLeft, FaBackward, FaGear } from "react-icons/fa6";
import { usePocket } from "@/contexts/PocketContext";
import useSWR from "swr";
import { useEffect, useState } from "react";
import SVGComponent from "@/components/AnimatedLogo";
import Rules from "@/components/Rule";
import CountDown from "@/components/CountDown";

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
  "is only allowed to whisper until the next song. Forget? Drink.",
  "must clap in rhythm to the song — mess it up, drink.",
  "gets to make up a new rule for the next 10 songs anyone that breaks it drinks",
  "is now snake eyes for the next 5 songs or someone replaces them if youo look them in the eyes you drink",
  "gets to make a word that if anyone says it they have to drink.",
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
  "are now only allowed to whisper until the next song. Forget? Drink.",
  "must clap in rhythm to the song — mess it up, drink.",
  "each get to make up a new rule for the next 10 songs anyone that breaks it drinks",
];

const no_match = [
  "First to say the name of the song gives out 6 sips",
  "First to say the name of the artist gives out 6 sips",
  "Last to say the name of the song drinks",
  "Last to say the name of the artist drinks",
  "Play a game of fingers",
  "Play a game of musical chairs (pausing the radio)",
  "Play a game of bust a jive",
  "If your name starts with the same letter as this song you drink",
  "If your name starts with the same letter as the artist you drink",
  "If you are younger than the current count down drink",
  "Drink if you've seen this artist live",
  "Everyone drink",
  "Ladies drink",
  "Men drink",
  "Shortest drinks",
  "Tallest drinks",
  "Oldest drinks",
  "Youngest drinks",
  "Clap in rhythm to the song — mess it up, drink.",
  "If you’ve never heard this song, drink",
  "Guess the year the song came out closest gives out 2, furthest drinks 2.",
  "If you can sing the chorus, give out 4 sips",
  "Last to put thumb on table drinks.",
  "Make up a new rule — next person to break it drinks.",
  "Rock, paper, scissors with the person next to you loser drinks.",
  "Everyone guesses how many Spotify streams this song has closest gives 3, furthest drinks 3.",
  "Point to the person who would like this song most majority drinks.",
  "If this artist has ever played Splendour, drink.",
  "If you’ve dyed your hair a non-natural color before, drink.",
  "If you have a tattoo, drink.",
  "Everyone born in summer drinks.",
  "Drink for every piercing you have.",
  "Everyone chant the artist name like a soccer crowd best chant gives 3, worst drinks 3.",
  "You have 10 seconds to invent a dance move and name it. Everyone else must copy it worst imitation drinks.",
  "You are now only allowed to whisper until the next song. Forget? Drink.",
  "Everyone must hold a plank for as long as they can. Last person down gives out 5.",
  "Whoever’s birthday is next gives out 3.",
  "Everyone whose parents live in the same city as them drinks.",
  "Everyone who's had a houseplant die in the last 6 months drinks.",
];

const count_msg: { [key: number]: string } = {
  100: "Starting off strong, everyone is now signed up to play 1 before #90 or 10 before #10",
  99: "Starting off strong, everyone is now signed up to play 1 before #90 or 10 before #10",
  98: "Starting off strong, everyone is now signed up to play 1 before #90 or 10 before #10",
  97: "Starting off strong, everyone is now signed up to play 1 before #90 or 10 before #10",
  96: "Starting off strong, everyone is now signed up to play 1 before #90 or 10 before #10",
  95: "Starting off strong, everyone is now signed up to play 1 before #90 or 10 before #10",
  94: "Starting off strong, everyone is now signed up to play 1 before #90 or 10 before #10",
  93: "Starting off strong, everyone is now signed up to play 1 before #90 or 10 before #10",
  92: "Starting off strong, everyone is now signed up to play 1 before #90 or 10 before #10",
  91: "Starting off strong, everyone is now signed up to play 1 before #90 or 10 before #10",
  90: "If you haven't finished 1 drink before now you must finish 10 before #10 plays",
  76: "Get ready to take a group photo at #75",
  75: "Take your group photo say 'I love triple J'",
  51: "Get ready to take your #50 grouup photo",
  50: "Take your group photo say 'Aussie aussie aussie...'",
  26: "Get ready for your #25 group photo",
  25: "Take your group photo and if you've said 'Should've been higher' finish your drink",
  11: "Get ready to take your #11 group photo",
  10: "Take your group photo and if you've been here since #90 and haven't finished 10 drinks before now you're a pussy",
  2: "Get ready to take your #1 group reaction video",
  1: "Thanks so much for playing! See you in 2026!",
};

const SimpleGame = ({ id }: { id: string | undefined }) => {
  const convertStringToNumber = (inputString: string, max: number) => {
    let hash = 0;
    for (let i = 0; i < inputString.length; i++) {
      hash += inputString.charCodeAt(i);
    }
    // Scale the hash to a number between 1 and max
    const scaledNumber = hash % max;
    return scaledNumber;
  };
  const navigate = useNavigate();
  // countdownstarts should be true if it is after targetDate
  const targetDate = new Date("2025-07-26T00:00:00Z");
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

  const handleGoBack = () => {
    navigate(`/`);
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
  const [countRule, setCountRule] = useState("");
  const [showCountRule, setShowCountRule] = useState(false);
  useEffect(() => {
    if (data && data?.expand) {
      setNowPlaying({
        id: data.song,
        name: data.expand.song.name,
        artist: data.expand?.song?.artist,
        rule:
          data.expand?.song.game_rule.length > 0
            ? data.expand?.song.game_rule
            : no_match[
                convertStringToNumber(data.expand.song.name, no_match.length)
              ],
        position: data.countdown_position,
      });
      if (count_msg.hasOwnProperty(data.countdown_position)) {
        setCountRule(count_msg[data.countdown_position]);
      } else {
        setCountRule("");
      }
      pb.collection("played").subscribe(
        "*",
        function (e: any) {
          if (e.action === "create" || e.action === "update") {
            setNowPlaying({
              id: e.record.song,
              name: e.record.expand.song.name,
              artist: e.record.expand?.song?.artist,
              rule:
                e.record.expand?.song.game_rule.length > 0
                  ? e.record.expand?.song.game_rule
                  : no_match[
                      convertStringToNumber(
                        e.record.expand.song.name,
                        no_match.length
                      )
                    ],
              position: e.record.countdown_position,
            });
            if (count_msg.hasOwnProperty(e.record.countdown_position)) {
              setCountRule(count_msg[e.record.countdown_position]);
            } else {
              setCountRule("");
            }
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
      if (voted_for_time.length > 0) {
        if (voted_for_time.length > 1) {
          const num = convertStringToNumber(nowPlaying.name, group.length);
          const usersWithSongString =
            voted_for_time.slice(0, -1).join(", ") +
            " and " +
            voted_for_time[voted_for_time.length - 1];
          setPlayerRule(usersWithSongString + " " + group[num]);
        } else {
          const num = convertStringToNumber(nowPlaying.name, individual.length);
          const usersWithSongString = voted_for_time[0];
          setPlayerRule(usersWithSongString + " " + individual[num]);
        }
      } else {
        setPlayerRule("");
      }
    }
  }, [game, nowPlaying]);

  useEffect(() => {
    if (playerRule.length > 0) {
      setShowPlayerRule(true); // Ensure it's visible initially
      const interval = setInterval(() => {
        if (countRule.length > 0) {
          if (showPlayerRule) {
            setShowPlayerRule(false);
            setShowCountRule(true);
          } else if (showCountRule) {
            setShowCountRule(false);
            setShowPlayerRule(false);
          } else {
            setShowPlayerRule(true);
            setShowCountRule(false);
          }
        } else {
          setShowPlayerRule((prev) => !prev);
        }
      }, 5000);

      return () => clearInterval(interval); // Cleanup on unmount or when playerRule changes
    } else if (countRule.length > 0) {
      const interval = setInterval(() => {
        setShowCountRule((prev) => !prev);
      }, 5000);

      return () => clearInterval(interval);
    } else {
      setShowCountRule(false);
      setShowPlayerRule(false); // Ensure it's hidden when there's no rule
    }
  }, [playerRule]);

  const duration = player_names.length * 4;
  return (
    <>
      {showCode && id != "default" && (
        <>
          <div className="absolute top-0 left-0 text-4xl">
            Game code: {`${id}`}
          </div>
        </>
      )}
      {countDownStarted &&
      nowPlaying.position > 0 &&
      nowPlaying.position < 201 ? (
        nowPlaying.rule.length > 0 ||
        playerRule.length > 0 ||
        countRule.length > 0 ? (
          showPlayerRule && playerRule.length > 0 ? (
            <Rules rule={playerRule} />
          ) : showCountRule && countRule.length > 0 ? (
            <Rules rule={countRule} />
          ) : (
            <Rules rule={nowPlaying.rule} />
          )
        ) : (
          <SVGComponent />
        )
      ) : (
        <div className="flex flex-col items-center text-center justify-center">
          <SVGComponent />
          <CountDown />
          <p className="m-4 text-center">
            The game rules will appear here when the countdown starts
          </p>
        </div>
      )}
      <div className="fixed bottom-0 left-0 w-full bg-black/50">
        {nowPlaying.position > 0 && nowPlaying.position < 201 && (
          <h1 className="text-center font-bold text-lg">
            #{nowPlaying.position}
          </h1>
        )}
        <h1 className="text-center font-bold text-4xl">
          {nowPlaying.name} - {nowPlaying.artist}
        </h1>
        {id != "default" && (
          <div className="relative overflow-hidden">
            <div
              className="flex whitespace-nowrap animate-marquee"
              style={{ animation: `marquee ${duration}s linear infinite` }}
            >
              {player_names.map((item: string, index: number) => (
                <span
                  key={index}
                  className="mx-2 text-sm text-gray-300 text-xl"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      {id != "default" && (
        <button
          onClick={handleSettings}
          className="bg-primarybg hover:bg-orange-700 text-white font-bold py-4 px-4 rounded-full absolute top-0 right-0 mt-6 mr-6"
        >
          <FaGear size={32} />
        </button>
      )}
      {id === "default" && (
        <button
          onClick={handleGoBack}
          className="bg-primarybg hover:bg-orange-700 text-white font-bold py-4 px-4 rounded-full absolute top-0 left-0 mt-6 ml-6"
        >
          <FaArrowLeft size={32} />
        </button>
      )}
    </>
  );
};

export default SimpleGame;
