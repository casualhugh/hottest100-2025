import { useNavigate, useParams } from "react-router-dom";
import SimpleGame from "./SimpleGame";

const Game = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  if (!id) {
    navigate(`/`);
  }
  return id && <SimpleGame id={id} />;
};

export default Game;
