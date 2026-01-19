import CountDown from "@/components/CountDown";

function GameOver() {
  return (
    <div>
      <div className="max-w-md mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold text-center my-4">
          Welcome to Hottest 100 The game
        </h1>

        <p className="">
          We will be back for the Hottest 100 23rd Jan 2027!
        </p>
        <CountDown />
        </div>
    </div>
  );
}

export default GameOver;
