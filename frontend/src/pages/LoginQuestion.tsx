import { usePocket } from "@/contexts/PocketContext";
import { useNavigate, useParams } from "react-router-dom";

function LoginQuestion() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, votesDone, login, guestRegister } = usePocket();
  const query = new URLSearchParams(window.location.search);
  const name = query.get("name");
  const handleLogin = () => {
    // Already logged in as a real user - go to vote page
    if (user && user?.email) {
      navigate(`/votes/${id}`);
      return;
    }
    if (name) {
      navigate(`/login/?next=/votes/${id}&name=${encodeURIComponent(name)}`);
    } else {
      navigate(`/login/?next=/name/${id}`);
    }
  };

  const handleGoToVotes = () => {
    if (!user) {
      guestRegister(name).then((login)=>{
        login(login.username, login.password);
      });
    }
    votesDone().then((done) => {
      if (done) {
        navigate(`/game/${id}`);
      } else {
        navigate(`/votes/${id}`);
      }
    });
  };

  return (
    <div>
      <div className="max-w-md mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold text-center my-4">
          Hottest 100 2025 the game
        </h1>
        <p className="">Do you want to save your votes between games?</p>
      </div>

      <div className="ml-8 mr-8 ">
        <button
          className="bg-black bg-opacity-50 text-white mt-2 w-full p-4 rounded-lg  font-bold"
          onClick={handleGoToVotes}
        >
          Stay Anonymous
        </button>

        <button
          className="bg-black bg-opacity-50 text-white mt-2 w-full p-4 rounded-lg  font-bold"
          onClick={handleLogin}
        >
          Login / Sign up
        </button>
      </div>
    </div>
  );
}

export default LoginQuestion;
