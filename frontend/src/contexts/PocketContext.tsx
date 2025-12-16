import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from "react";
import PocketBase from "pocketbase";
import { useInterval } from "usehooks-ts";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://api.hottest100game.com/";
const fiveMinutesInMs = 300000;
const twoMinutesInMs = 120000;
interface PocketContextType {
  register: any;
  login: any;
  logout: any;
  user: any;
  token: any;
  pb: any;
  updateName: any;
  updateVotes: any;
  guestRegister: any;
  votesDone: any;
  gameExists: any;
  joinGame: any;
  leaveGame: any;
  game: any;
  showCode: any;
  toggleShowCode: any;
  createSuggestion: any;
  getSuggestions: any;
}
const PocketContext = createContext<PocketContextType>({
  register: () => {},
  login: () => {},
  logout: () => {},
  user: {},
  token: "",
  pb: () => {},
  updateName: () => {},
  updateVotes: () => {},
  guestRegister: () => {},
  votesDone: false,
  gameExists: false,
  joinGame: () => {},
  leaveGame: () => {},
  game: null,
  showCode: false,
  toggleShowCode: () => {},
  createSuggestion: () => {},
  getSuggestions: () => {},
});

function getRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters[randomIndex];
  }

  return result;
}

export const PocketProvider = ({ children }: any) => {
  const pb = useMemo(() => new PocketBase(BASE_URL), []);
  pb.autoCancellation(false);
  const [token, setToken] = useState(pb.authStore.token);
  const [user, setUser] = useState(pb.authStore.model);
  const [game, setGame] = useState({});
  const [showCode, setShowCode] = useState(true);
  const location = useLocation();
  const id = location.pathname.split("/").pop();

  const toggleShowCode = () => {
    setShowCode(!showCode);
  };



  const getVotes = async (players: any) => {
    const filter = `user.id = "` + players.join(`" || user.id = "`) + `"`;
    return pb
      .collection(`votes`)
      .getList(1, 100, {
        filter,
        expand: "user",
      })
      .then((resultList) => {
        if (resultList && resultList?.items) {
          return resultList.items;
        }
        return [];
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSuggestions = async (user_id: string | undefined) => {
    if (user_id === undefined || user_id === "undefined") return [];
    const filter = `user.id = "` + user_id + `"`;
    return pb
      .collection(`suggestions`)
      .getList(1, 100, {
        filter,
        // expand: "song",
      })
      .then((resultList) => {
        console.log(resultList);
        if (resultList && resultList?.items) {
          return resultList.items;
        }
        return [];
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getGame = () => {
    if (id && id.length > 0) {
      try {
        pb.collection("games")
          .getFirstListItem(`game_code = "${id}"`, {
            expand: "players",
          })
          .then((resultList) => {
            if (resultList) {
              getVotes(resultList.players).then((votes) => {
                const game_data = { ...resultList, votes };
                setGame(game_data);
              });

              pb.collection("games").subscribe(
                resultList.id,
                function (e) {
                  if (e.action === "update") {
                    getVotes(resultList.players).then((votes) => {
                      const game_data = { ...e.record, votes };
                      setGame(game_data);
                    });
                  }
                },
                {
                  expand: "players",
                }
              );

              pb.collection("votes").subscribe(
                "*",
                function (e) {
                  if (e.action === "update" || e.action === "create") {
                    getVotes(resultList.players).then((votes) => {
                      const game_data = { ...e.record, votes };
                      setGame(game_data);
                    });
                  }
                },
                {
                  expand: "players",
                }
              );
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } catch (e) {}
    }
  };

  useEffect(() => {
    getGame();
    return pb.authStore.onChange((token, model) => {
      getGame();
      setToken(token);
      setUser(model);
    });
  }, [id]);

  const register = useCallback(
    async (name: string | null, username: string, password: string) => {
      await pb.collection("users").create({
        name: name ? name : username,
        username,
        email: `${username}@hottest100game.com`,
        password,
        passwordConfirm: password,
      });
      return login(username, password);
    },
    []
  );

  const guestRegister = useCallback(async (name: string) => {
    const username = getRandomString(8);
    const password = getRandomString(16);
    const result = await pb.collection("users").create({
      name,
      username,
      password,
      passwordConfirm: password,
    });
    return { ...result, password };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const result = await pb
      .collection("users")
      .authWithPassword(username, password);
    if (result?.record) {
      setUser(result.record);
    }
    if (result?.token) {
      setToken(result.token);
    }
    return result;
  }, []);

  const updateName = useCallback(async (name: string) => {
    if (user) {
      await pb.collection("users").update(user.id, { name });
      await refreshSession();
    }
  }, []);

  const updateVotes = useCallback(
    async (user_id: string, vote_id: string, votes: string[]) => {
      if (user) {
        if (vote_id.length > 0) {
          return await pb.collection("votes").update(vote_id, { votes });
        } else {
          return await pb.collection("votes").create({
            user: user_id,
            votes,
          });
        }
      }
    },
    []
  );

  const createSuggestion = useCallback(
    async (user_id: string|null, song_id: string, song_name: string, song_artist: string, suggestion: string) => {
      return await pb.collection("suggestions").create({
        user: user_id,
        suggestion,
        song: song_id,
        song_id_bk: song_id,
        song_name,
        song_artist,
      });
    },
    []
  );

  const logout = useCallback(() => {
    pb.authStore.clear();
    setUser(null);
  }, []);

  const votesDone = useCallback(async () => {
    if (user) {
      try {
        const resultList = await pb
          .collection("votes")
          .getFirstListItem(`user = "${user.id}"`, {});
        return resultList.votes.length == 10;
      } catch (e) {}
    } else {
    }
    return false;
  }, [user]);

  const gameExists = useCallback(async (game_code: string) => {
    const result = await pb.send(`/api/hottest/exists/${game_code}`, {});
    return result.success;
  }, []);

  const joinGame = useCallback(async (game_code: string) => {
    const result = await pb.send(`/api/hottest/join/${game_code}`, {
      method: "POST",
    });
    return result.success;
  }, []);

  const leaveGame = useCallback(async (game_code: string) => {
    const result = await pb.send(`/api/hottest/leave/${game_code}`, {
      method: "POST",
    });
    return result.success;
  }, []);

  const refreshSession = useCallback(async () => {
    if (!pb.authStore.isValid) return;
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const expirationWithBuffer =
      decoded && decoded?.exp
        ? (decoded?.exp + fiveMinutesInMs) / 1000
        : fiveMinutesInMs;
    if (tokenExpiration && tokenExpiration < expirationWithBuffer) {
      await pb.collection("users").authRefresh();
    }
  }, [token]);

  useInterval(refreshSession, token ? twoMinutesInMs : null);
  return (
    <PocketContext.Provider
      value={{
        register,
        login,
        logout,
        user,
        token,
        pb,
        updateName,
        updateVotes,
        guestRegister,
        votesDone,
        gameExists,
        joinGame,
        leaveGame,
        game,
        showCode,
        toggleShowCode,
        createSuggestion,
        getSuggestions,
      }}
    >
      {children}
    </PocketContext.Provider>
  );
};

export const usePocket = () => useContext(PocketContext);
