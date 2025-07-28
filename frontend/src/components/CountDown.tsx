import { useEffect, useState } from "react";

function CountDown() {
  const targetDate = new Date("2025-08-02T00:00:00Z");
  const calculateTimeLeft = () => {
    const now = new Date();
    const nowTimestamp = now.getTime(); // Get timestamp of current date/time
    const targetTimestamp = targetDate.getTime(); // Get timestamp of target date

    const difference = targetTimestamp - nowTimestamp;
    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);
  if (
    timeLeft.days == 0 &&
    timeLeft.hours == 0 &&
    timeLeft.minutes == 0 &&
    timeLeft.seconds == 0
  ) {
    return <></>;
  }
  return (
    <div className="flex justify-center space-x-4 text-2xl font-medium">
      <div className="flex flex-col items-center">
        <span className="text-5xl font-bold text-white">{timeLeft.days}</span>
        <span>Days</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-5xl font-bold text-white">{timeLeft.hours}</span>
        <span>Hours</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-5xl font-bold text-white">
          {timeLeft.minutes}
        </span>
        <span>Minutes</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-5xl font-bold text-white">
          {timeLeft.seconds}
        </span>
        <span>Seconds</span>
      </div>
    </div>
  );
}
export default CountDown;
