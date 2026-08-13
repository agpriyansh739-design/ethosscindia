"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      // Every wheel event adds to a running target and restarts a fresh
      // `duration`-long glide from wherever the page currently sits.
      // During continuous scrolling, new events keep arriving before the
      // glide catches up, so the target kept running further ahead of
      // the animated position the longer you scrolled — that's what
      // read as acceleration. Shortening duration (was 1.15) lets it
      // catch up between events instead of the gap growing. Easing
      // itself is unchanged since the per-tick feel was already fine.
      duration: 0.7,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return children;
}
