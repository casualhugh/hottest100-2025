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
import ms from "ms";

const BASE_URL = "http://127.0.0.1:8000";
const fiveMinutesInMs = ms("5 minutes");
const twoMinutesInMs = ms("2 minutes");

const PocketContext = createContext({});

function getRandomString(length) {
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

export const PocketProvider = ({ children }) => {
  const pb = useMemo(() => new PocketBase(BASE_URL), []);
  pb.autoCancellation(false);
  const [token, setToken] = useState(pb.authStore.token);
  const [user, setUser] = useState(pb.authStore.model);

  useEffect(() => {
    return pb.authStore.onChange((token, model) => {
      setToken(token);
      setUser(model);
    });
  }, []);

  const register = useCallback(async (name, username, password) => {
    await pb.collection("users").create({
      name,
      username,
      email: `${username}@hottest100game.com`,
      password,
      passwordConfirm: password,
    });
    return login(username, password);
  }, []);

  const guestRegister = useCallback(async (name) => {
    const username = getRandomString(8);
    const password = getRandomString(16);
    await pb.collection("users").create({
      name,
      username,
      password,
      passwordConfirm: password,
    });
    return login(username, password);
  }, []);

  const login = useCallback(async (username, password) => {
    return await pb.collection("users").authWithPassword(username, password);
  }, []);

  const updateName = useCallback((name) => {
    if (user) {
      pb.collection("users").update(user.id, { name });
    }
  }, []);

  const logout = useCallback(() => {
    pb.authStore.clear();
  }, []);

  const votesDone = useCallback(async () => {
    if (user) {
      try {
        const resultList = await pb
          .collection("votes")
          .getFirstListItem(`user = "${user.id}"`, {});
        return resultList.votes.length == 10;
      } catch (e) {
        console.log("No votes", e);
      }
    } else {
      console.log("No user");
    }
    return false;
  }, [user]);

  const gameExists = useCallback(async (game_code: string) => {
    const result = await pb.send(`/api/hottest/exists/${game_code}`, {});
    return result.success;
  }, []);

  const refreshSession = useCallback(async () => {
    if (!pb.authStore.isValid) return;
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const expirationWithBuffer = (decoded.exp + fiveMinutesInMs) / 1000;
    if (tokenExpiration < expirationWithBuffer) {
      await pb.collection("users").authRefresh();
    }
  }, [token]);

  useInterval(refreshSession, token ? twoMinutesInMs : null);
  console.log("User", user);
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
        guestRegister,
        votesDone,
        gameExists,
      }}
    >
      {children}
    </PocketContext.Provider>
  );
};

export const usePocket = () => useContext(PocketContext);
