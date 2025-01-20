import { usePocket } from "@/contexts/PocketContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generate } from "random-words";
function NewGame() {
  const navigate = useNavigate();
  const { user, votesDone, logout, gameExists, pb } = usePocket();

  async function generateUniqueGameCode() {
    // Generate a game code
    const game_code = generate({
      minLength: 5,
      maxLength: 15,
      exactly: 1,
      join: "-",
    });

    // Check if the game code exists
    const exists = await gameExists(game_code);

    // If it exists, recursively call the function to generate a new code
    if (exists) {
      return generateUniqueGameCode();
    }

    // Return the unique game code
    return game_code;
  }

  useEffect(() => {
    if (!user) navigate("/login?next=/new/");
    if (!user.email) {
      logout();
      navigate("/login?next=/new/");
    }
    try {
      pb.collection("games")
        .getList(1, 50, {
          filter: `owner="${user.id}"`,
        })
        .then((resultList: any) => {
          generateUniqueGameCode().then((new_game_code) => {
            const game_code =
              resultList.items.length > 0
                ? resultList.items[0].game_code
                : new_game_code;
            pb.collection("games")
              .create({
                owner: user.id,
                players: [user.id],
                game_code: game_code,
              })
              .then(() => {
                if (!user?.name) {
                  navigate(`/name/${game_code}`);
                  return;
                }
                votesDone().then((done: any) => {
                  if (done) {
                    navigate(`/game/${game_code}`);
                  } else {
                    navigate(`/votes/${game_code}`);
                  }
                });
              })
              .catch(() => {
                navigate("/");
                return;
              });
          });
        })
        .catch((e: any) => {
          console.log("NOT WORKING", e);
        });
    } catch (e) {}
  }, [user]);
  return <div>New Game</div>;
}

export default NewGame;
