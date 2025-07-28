import CountDown from "@/components/CountDown";

function GameOver() {
  return (
    <div>
      <div className="max-w-md mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold text-center my-4">
          Welcome to Hottest 100 The game
        </h1>

        <p className="">
          This is a drinking game like Kahoot where you can choose to host a game or join
          one. If you're hosting, you'll be given a unique code that you can
          share with friends.
          We will be back for the Australian Hottest 100 26th July 2025!
        </p>
        <CountDown />
        </div>
    </div>
  );
}

export default GameOver;
