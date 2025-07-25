import { usePocket } from "@/contexts/PocketContext";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Name() {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const [validName, setValidName] = useState(true);
  const { user, updateName, votesDone, login, guestRegister } = usePocket();
  const navigate = useNavigate();

  const handleNameChange = (e: any) => {
    setName(e.target.value);
    setValidName(true);
  };

  const handleEnterName = () => {
    if (name.length > 0) {
      if (user) {
        updateName(name).then(() => {
          if (user.email) {
            votesDone().then((done: any) => {
              if (done) {
                navigate(`/game/${id}`);
              } else {
                navigate(`/votes/${id}`);
              }
            });
          } else navigate(`/question/${id}?name=${encodeURIComponent(name)}`);
        });
      } else {
        navigate(`/question/${id}?name=${encodeURIComponent(name)}`);
      }
    } else {
      setValidName(false);
    }
  };

  const handleSpectate = () => {
    if (user) {
      updateName(null).then(() => {
        navigate(`/game/${id}`);
      });
    } else {
      guestRegister(null).then((login_info: any) => {
        login(login_info.username, login_info.password).then(() => {
          navigate(`/game/${id}`);
        });
      });
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold text-center my-4">
          Hottest 100 2025 the game
        </h1>
        <p className="">Game Code: {`${id}`}</p>
        <p className="mt-8 text-xl font-bold text-center my-4">
          Enter your name
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent the default form submission
            handleEnterName();
          }}
          className="space-y-4"
        >
          <div
            className={`ml-24 mr-24 bg-black bg-opacity-50 ${
              !validName ? "border border-red-600 border-4" : ""
            }`}
          >
            <input
              value={name || ""}
              onChange={handleNameChange}
              type="text"
              placeholder="Enter name..."
              className="py-2 text-center bg-transparent focus:outline-none w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-primarybg mt-2 w-full p-4 rounded-lg font-bold text-white"
          >
            Enter
          </button>
        </form>
      </div>

      <div className="ml-8 mr-8">
        <button
          className="bg-secondarybg mt-2 w-full text-white font-bold p-4"
          onClick={handleSpectate}
        >
          Spectate Game (No votes)
        </button>
      </div>
    </div>
  );
}

export default Name;
