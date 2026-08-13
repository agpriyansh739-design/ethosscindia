"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Hero.module.css";
import TopNav from "./TopNav";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const markRef = useRef(null);
  const subRef = useRef(null);
  const cueRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 0.2,
        onComplete: () => {
          // Only wire up the scroll-driven fade once the entrance
          // animation has actually finished settling mark/sub/cue at
          // autoAlpha:1. Creating it earlier let this tween capture
          // autoAlpha:0 (the entrance's mid-flight value) as its
          // progress-0 anchor, so scrolling back to the top re-rendered
          // them as invisible instead of bringing them back — that was
          // the "not reappearing" bug. Explicit fromTo values here make
          // the top-of-scroll state unambiguous either way.
          gsap.fromTo(
            [markRef.current, subRef.current, cueRef.current],
            { autoAlpha: 1, y: 0 },
            {
              autoAlpha: 0,
              y: -60,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "70% top",
                scrub: true,
              },
            }
          );
        },
      });
      tl.fromTo(
        markRef.current,
        { yPercent: 120 },
        { yPercent: 0, duration: 1.4, ease: "power4.out" }
      )
        .fromTo(
          subRef.current,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" },
          "-=0.7"
        )
        .fromTo(
          cueRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8 },
          "-=0.5"
        );

      // Zoom + a slower vertical drift than the rest of the page — the
      // classic parallax read of depth as you scroll through the hero.
      gsap.to(videoRef.current, {
        scale: 1.18,
        yPercent: 26,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.hero}>
      <TopNav />
      <div className={styles.media}>
        <video
          ref={videoRef}
          className={styles.video}
          src="/videos/hero-final.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className={styles.scrim} />
      </div>

      <div className={styles.content}>
        <div className={styles.markWrap}>
          <h1 ref={markRef} className={styles.mark}>
            ETHOS
          </h1>
        </div>
        <p ref={subRef} className={styles.sub}>
          सा विद्या या विमुक्तये
        </p>
      </div>

      <div ref={cueRef} className={styles.cue}>
        <span className={styles.cueLine} />
        <span>Scroll</span>
      </div>
    </section>
  );
}
