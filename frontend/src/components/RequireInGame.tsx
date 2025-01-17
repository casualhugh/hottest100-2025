import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { usePocket } from "../contexts/PocketContext";
import { useEffect } from "react";

export const RequireInGame = () => {
  const { id } = useParams<{ id: string }>();
  const { pb, user, gameExists, votesDone, joinGame } = usePocket();
  const navigate = useNavigate();
  const location = useLocation();

  const notAllowed = () => {
    gameExists(id).then((exists) => {
      if (exists) {
        joinGame(id).then((success) => {
          if (success) {
            if (user && user.name) {
              if (!user?.email) {
                navigate(`/question/${id}`);
                return;
              }
              votesDone().then((done) => {
                if (done) {
                  navigate(`/game/${id}`);
                } else {
                  navigate(`/votes/${id}`);
                }
              });
              return;
            } else navigate(`/name/${id}`);
          } else {
            navigate("/");
          }
        });
      } else {
        navigate("/");
      }
    });
  };

  useEffect(() => {
    if (user) {
      try {
        pb.collection("games")
          .getFirstListItem(`game_code = "${id}"`, { expand: "players" })
          .then((resultList) => {
            if (resultList.length === 0) {
              notAllowed();
            }
          })
          .catch((e) => {
            notAllowed();
          });
      } catch (e) {
        notAllowed();
      }
    } else {
      notAllowed();
    }
  }, [id, user]);

  if (!user) {
    return <Navigate to={{ pathname: "/" }} state={{ location }} replace />;
  }

  return <Outlet />;
};
