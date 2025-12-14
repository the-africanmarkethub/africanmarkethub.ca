import { useEffect, useState } from "react";

export default function useUKGreeting() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();

      // Get UK time parts 
      const ukDay = new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        timeZone: "Europe/London",
      }).format(now);

      const ukHour = Number(
        new Intl.DateTimeFormat("en-GB", {
          hour: "numeric",
          hourCycle: "h23",
          timeZone: "Europe/London",
        }).format(now)
      );

      let greet =
        ukHour < 12
          ? "Good morning"
          : ukHour < 18
          ? "Good afternoon"
          : "Good evening";

      if (ukDay === "Saturday" || ukDay === "Sunday") {
        greet += " Happy Weekend!";
      }

      setGreeting(
        `${greet}`
      );
    };

    // Initial run
    updateGreeting();

    // Update every minute
    const interval = setInterval(updateGreeting, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return greeting;
}
