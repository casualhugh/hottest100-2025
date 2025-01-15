import { usePocket } from "@/contexts/PocketContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NewGame() {
  const navigate = useNavigate();
  const { user, votesDone, pb } = usePocket();

  


  useEffect(() => {
    if (!user) navigate("/login?next=/new/");
    // Todo generate new game and get game id
    const game_code = "1234";
    if (!user?.name) {
      navigate(`/name/${game_code}`);
      return;
    }
    votesDone().then((done) => {
      if (done) {
        navigate(`/game/${game_code}`);
      } else {
        navigate(`/votes/${game_code}`);
      }
    });
  }, [user]);
  return <div>New Game</div>;
}

export default NewGame;
