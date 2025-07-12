import { usePocket } from "@/contexts/PocketContext";
import SimpleGame from "./SimpleGame";
import { useEffect } from "react";

const GuestGame = () => {
const { user, login, guestRegister } = usePocket();
useEffect(() => {
    if (!user) {
        guestRegister(null).then((login_info: any) => {
        login(login_info.username, login_info.password).then(() => {
        });
        });
    }
}, []);
  return <SimpleGame id={"default"} />;
};

export default GuestGame;
