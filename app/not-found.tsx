"use client";
import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const ComingSoon = () => {
  const calculateTimeLeft = (): TimeLeft => {
    const targetDate = new Date("2025-05-01T00:00:00").getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    return {
      days: Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24))),
      hours: Math.max(0, Math.floor((difference / (1000 * 60 * 60)) % 24)),
      minutes: Math.max(0, Math.floor((difference / (1000 * 60)) % 60)),
      seconds: Math.max(0, Math.floor((difference / 1000) % 60)),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white">
      <div className="w-full max-w-lg text-center">
        <h1 className="animate-fade-in mb-4 text-5xl font-bold">Coming Soon</h1>
        <p className="mb-6 text-lg opacity-80">
          We&apos;re working on something amazing. Stay tuned!
        </p>

        <div className="mb-6 flex justify-center space-x-6 text-3xl font-semibold">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="flex flex-col items-center">
              <span className="text-5xl font-bold">{value}</span>
              <span className="text-sm uppercase opacity-70">{unit}</span>
            </div>
          ))}
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-full bg-gray-700 p-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-yellow-400 px-4 py-2 font-medium text-gray-900 transition hover:bg-yellow-300">
            Notify Me
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
