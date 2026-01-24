import { useNavigate } from "react-router";
import { FaArrowLeft, FaGear } from "react-icons/fa6";
import { usePocket } from "@/contexts/PocketContext";
import useSWR from "swr";
import { useEffect, useRef, useState } from "react";
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
  "is now snake eyes for the next 5 songs or someone replaces them if you look them in the eyes you drink",
  "gets to make a word that if anyone says it they have to drink for the rest of the game.",
  "must speak in an accent chosen by the group until the next song. Slip up? Drink",
  "must name 5 songs by this artist. Fail or hesitate and drink for each missed",
  "must do a shoey or take 3 drinks",
  "must keep one hand in the air until the song ends. Drop it? Drink",
  "must let the group scroll one app on their phone for 30 seconds or drink",
  "must guess how many votes this song got. Drink the difference",
  "must sit on the floor until the song finishes",
  "must nominate a drinking buddy. Every time they drink, you drink too for the next 2 songs",
  "must talk in questions only until the next song. Make a statement? Drink",
  "must name someone who would survive the apocalypse longest. Loser drinks",
  "must hold a plank for 20 seconds or drink",
  "must swap seats with someone chosen by the group",
  "must choose a word. The next person to say it drinks",
  "must let the group rename them for the next 3 songs. Anyone using their real name drinks",
  "must do 10 squats without pausing or take 2 drinks",
  "must send a risky but legal text approved by the group or drink",
  "must guess the artist before the chorus. Fail? Drink",
  "must let someone else control their drink pours for the next song",
  "must name one person they'd never want to be stuck in a lift with. That person drinks",
  "must keep a straight face while everyone tries to make them laugh until the song finishes. Laugh = drink",
  "must do rock paper scissors tournament against everyone. One drink per loss",
  "must choose between waterfall or categories starting now"
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
  "must maintain eye contact with each other until the song ends. First to look away drinks",
  "must all speak in an accent chosen by the group until the next song. Slip up? Drink",
  "must choose one person outside the group to swap drinks with immediately",
  "must each name 5 songs by this artist. Fail or hesitate and drink for each missed",
  "must all do a shoey or finish their drink each",
  "must keep one hand in the air until the song ends. Drop it? Drink",
  "must guess how many votes this song got. Drink the difference",
  "must sit on the floor until the song finishes",
  "must all nominate a drinking buddy outside the group. Every time they drink, you drink too for the next 2 songs",
  "must talk in questions only until the next song. Make a statement? Drink",
  "must hold a plank for 20 seconds or drink",
  "must choose a word. The next person outside the group to say it drinks",
  "must let the group rename you for the next 3 songs. Anyone using your real names drinks",
  "must do 10 squats non-stop or take 2 drinks",
  "must send a risky but legal text approved by the group or drink",
  "must each name one person they'd never want to be stuck in a lift with. That person drinks",
  "must keep a straight face while everyone else tries to make you laugh until the end of the song. Laugh = drink",
  "must do a rock paper scissors against everyone in the room. One drink per loss",
  "must drink every time the word 'love' is sung in this song",
  "must choose between waterfall or categories starting now"
];

const no_match = [
  "First to say the name of the song gives out 6 sips",
  "First to say the name of the artist gives out 6 sips",
  "Last to say the name of the song drinks",
  "Last to say the name of the artist drinks",
  "Play a game of fingers",
  "Play a game of musical chairs (pausing the radio)",
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
  "If you can sing the chorus, give out 4 sips",
  "Last to put thumb on a table drinks.",
  "Make up a new rule like no saying first name for the next 30 minutes if you break it drinks.",
  "Rock, paper, scissors with the person next to you loser drinks.",
  "Everyone guesses how many Spotify streams this song has closest gives 3, furthest drinks 3.",
  "Point to the person who would like this song most majority drinks.",
  "If this artist has ever played Splendour(RIP), drink.",
  "If you’ve dyed your hair a non-natural color before, drink.",
  "If you have a tattoo, drink.",
  "Everyone born in summer drinks.",
  "Drink for every piercing you have.",
  "You are now only allowed to whisper until the next song. Forget? Drink.",
  "Everyone must hold a plank for as long as they can. Last person down gives out 10.",
  "Whoever’s birthday is next gives out 3.",
  "Everyone whose parents live in the same city as them drinks.",
  "Everyone who's had a houseplant die in the last 6 months drinks.",
  "Play a game of waterfall",
  "Flip a coin everyone vote by pointing if you get it right you give out 5 sips wrong you drink 5",
  
  "Everyone must touch the floor once. Last person drinks",
  "Everyone must do 5 jumping jacks or drink",
  "Everyone points to someone they think has the worst taste in music. Most votes drinks",
  "If you’ve ever ghosted someone, drink",
  "If you have an older sibling, drink",
  "If you’ve ever re-gifted something, drink",
  "Everyone must spin around 3 times. Fall or stumble? Drink",
  "Everyone who’s wearing black drinks",
  "Everyone whose favourite color is blue drinks",
  "Everyone with a pet drinks",
  "Everyone who went to a festival last year drinks",
  "Categories words starting with the same letter as the song. Hesitate? Drink",
  "Everyone who’s ever had a crush on a teacher drinks",
  "Everyone who has ever called in sick when not sick drinks",
  "Everyone with (sun)/glasses drinks",
  "Everyone who’s had a haircut they regretted drinks",
  "Everyone who’s ever been on a plane drinks",
  "Everyone must high-five at least 3 different people. Fail? Drink",
  "Everyone must whisper a line from the song. Loud? Drink",
  "Everyone must guess the BPM of the song. Furthest drinks 3",
];

const count_msg: { [key: number]: string } = {
  100: "Starting off strong, everyone is now signed up to play 1 drink before #90 or 10 before #50",
  99: "Starting off strong, everyone is now signed up to play 1 drink before #90 or 10 before #50",
  98: "Starting off strong, everyone is now signed up to play 1 drink before #90 or 10 before #50",
  97: "Starting off strong, everyone is now signed up to play 1 drink before #90 or 10 before #50",
  96: "Starting off strong, everyone is now signed up to play 1 drink before #90 or 10 before #50",
  95: "Starting off strong, everyone is now signed up to play 1 drink before #90 or 10 before #50",
  94: "Starting off strong, everyone is now signed up to play 1 drink before #90 or 10 before #50",
  93: "Starting off strong, everyone is now signed up to play 1 drink before #90 or 10 before #50",
  92: "Starting off strong, everyone is now signed up to play 1 drink before #90 or 10 before #50",
  91: "Starting off strong, everyone is now signed up to play 1 drink before #90 or 10 before #50",
  90: "If you haven't finished 1 drink before now you must finish 10 drinks before #0 plays",
  76: "Get ready to take a group photo at #75",
  75: "Take your group photo say 'I love triple J' and tag @hottest100gamedotcom on instagram",
  51: "Get ready to take your #50 grouup photo",
  50: "Take your group photo say 'Aussie aussie aussie...' and tag @hottest100gamedotcom on instagram",
  26: "Get ready for your #25 group photo",
  25: "Take your group photo and if you've said 'Should've been higher' finish your drink. Film it and send to @hottest100gamedotcom on instagram" ,
  11: "Get ready to take your #11 group photo",
  10: "Take your group photo and if you've been here since #90 and haven't finished 10 drinks before now you're a pussy finish your drink",
  3: "Get ready to take your #2 group reaction video (becuase once #1 plays you'll be too busy crying)",
  1: "Thanks so much for playing! See you in 2027!",
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
  const targetDate = new Date("2026-01-24T01:00:00Z");
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
        console.log("setting count rule", count_msg[data.countdown_position]);
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
      const voted_for_time = game?.votes
        .filter((vote: any) => {
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
            console.log("switching to count rule");
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
        console.log("switching count rule");
      }, 5000);

      return () => clearInterval(interval);
    } else {
      setShowCountRule(false);
      setShowPlayerRule(false); // Ensure it's hidden when there's no rule
    }
  }, [playerRule, countRule]);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current || !contentRef.current) return;
      const container = containerRef.current;
      const content = contentRef.current;
      setShouldScroll(content.scrollWidth > container.clientWidth);
    };

    checkOverflow();

    // Re-check on window resize
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [player_names]);
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
      nowPlaying.position < 101 ? (
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
          <div
            className="relative w-full overflow-hidden whitespace-nowrap"
            ref={containerRef}
          >
            <div
              ref={contentRef}
              className={`inline-block whitespace-nowrap will-change-transform ${
                shouldScroll ? "animate-marquee" : ""
              }`}
              style={{ animationDuration: "20s" }}
            >
              {player_names.map((item: string, index: number) => (
                <span
                  key={index}
                  className="mx-2 text-sm text-gray-300 text-xl"
                >
                  {item}
                </span>
              ))}
              {shouldScroll &&
                player_names.map((item: string, index: number) => (
                  <span
                    key={index}
                    className="mx-2 text-sm text-gray-300 text-xl"
                  >
                    {item}
                  </span>
                ))}
              {shouldScroll &&
                player_names.map((item: string, index: number) => (
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
