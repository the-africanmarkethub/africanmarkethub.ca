"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import anime from "animejs";

interface SplashScreenProps {
  finishLoading: () => void;
}

function SplashScreen({ finishLoading }: SplashScreenProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, 10);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isMounted) {
      anime({
        targets: "#logo",
        scale: [0.8, 1.25],
        opacity: [0, 1],
        duration: 1000,
        easing: "easeInOutQuad",
        complete: finishLoading,
      });
    }
  }, [isMounted, finishLoading]);

  return (
    <div className="flex h-screen justify-center items-center">
      <Image
        src="/img/African Market Hub.svg"
        id="logo"
        alt="Logo"
        width={395.3}
        height={134}
      />
    </div>
  );
}

export default SplashScreen;
