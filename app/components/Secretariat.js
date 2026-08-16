"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TopNav from "./TopNav";
import styles from "./Secretariat.module.css";

gsap.registerPlugin(ScrollTrigger);

// Order here IS the hierarchy, and the tier grouping below renders it as
// 1 / 1 / 2 / 2 — Secretary General alone, then the Deputy alone beneath
// him, then the Director General paired with his counterpart, then the
// two heads. Position on the page is what conveys rank; there are no
// numerals on the cards.
const ROSTER = [
  {
    name: "Sayush Agarwal",
    role: "Secretary General",
    img: "/images/secretariat/secretary-general.jpg",
  },
  {
    name: "Ranveer Chauhan",
    role: "Deputy Secretary General",
    img: "/images/secretariat/deputy-secretary-general.jpg",
  },
  {
    name: "Suraj Agarwala",
    role: "Director General",
    img: "/images/secretariat/director-general.jpg",
  },
  {
    name: "Aron Bhagat",
    role: "Head of Delegate Affairs",
    img: "/images/secretariat/head-delegate-affairs.jpg",
  },
  {
    name: "Keshav Rathod",
    role: "Head of Outreach",
    img: "/images/secretariat/head-outreach.jpg",
  },
  {
    name: "Priyansh Agarwal",
    role: "Head of IT & Media",
    img: "/images/secretariat/head-it-media.jpg",
  },
];

function Card({ person }) {
  return (
    <article className={styles.card} data-card>
      <div className={styles.photoWrap}>
        <Image
          src={person.img}
          alt={`${person.name}, ${person.role}`}
          fill
          sizes="(max-width: 860px) 90vw, 380px"
          className={styles.photo}
        />
        <div className={styles.photoScrim} />
      </div>
      <div className={styles.cardText}>
        <h3 className={styles.name}>{person.name}</h3>
        <span className={styles.rule} />
        <p className={styles.role}>{person.role}</p>
      </div>
    </article>
  );
}

export default function Secretariat() {
  const outerRef = useRef(null);
  const heroRef = useRef(null);
  const groupRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const restRef = useRef(null);
  const bannerImgRef = useRef(null);
  const bannerWordRef = useRef(null);

  useEffect(() => {
    let setupZoom;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [eyebrowRef.current, titleRef.current],
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.2 }
      );

      const ORIGIN_X = 0.64;
      const ORIGIN_Y = 0.5;
      let zoomTween;

      // A hardcoded scale (e.g. 90) only clears the frame at whatever
      // viewport size it happened to be tuned against — on a wider
      // window, or a different browser zoom level, the text is a
      // different fraction of the screen, so the same multiplier
      // under- or overshoots. This measures the group's actual
      // rendered box and the actual viewport each time, and computes
      // the scale needed for the origin's distance to the FARTHEST
      // viewport corner to clear the NEAREST edge of the group's own
      // box — with a generous multiplier on top, since a glyph's
      // stroke edges aren't a clean rectangle and this can't measure
      // exact font geometry. Recomputed on resize so it stays correct
      // if the window changes size.
      setupZoom = () => {
        zoomTween?.scrollTrigger?.kill();
        zoomTween?.kill();
        gsap.set(groupRef.current, { scale: 1, transformOrigin: `${ORIGIN_X * 100}% ${ORIGIN_Y * 100}%` });

        const rect = groupRef.current.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const originXpx = rect.left + rect.width * ORIGIN_X;
        const originYpx = rect.top + rect.height * ORIGIN_Y;
        const corners = [
          [0, 0],
          [vw, 0],
          [0, vh],
          [vw, vh],
        ];
        const maxCornerDist = Math.max(
          ...corners.map(([x, y]) => Math.hypot(x - originXpx, y - originYpx))
        );
        const nearestSelfEdge =
          Math.min(rect.width * ORIGIN_X, rect.width * (1 - ORIGIN_X), rect.height * ORIGIN_Y) || 1;
        const neededScale = (maxCornerDist / nearestSelfEdge) * 20;

        // The eyebrow+title scale up together as ONE group, not
        // independently — that's what makes the eyebrow (farther from
        // the origin) rocket outward and grow faster than the title
        // (closer to it). No fade: instead of dissolving away, the
        // group just keeps scaling until every letter has swept past
        // the frame edges.
        //
        // fromTo, not to: a `to` tween records its start value once, at
        // creation. Any later ScrollTrigger.refresh() (the roster's
        // images trigger one) could re-record that baseline while the
        // group was mid-zoom, so scrolling back to the top returned the
        // title to a half-scaled state instead of its real size. Pinning
        // the start explicitly makes progress 0 always mean scale 1.
        zoomTween = gsap.fromTo(
          groupRef.current,
          { scale: 1 },
          {
            scale: neededScale,
            ease: "power1.in",
            scrollTrigger: {
              trigger: outerRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          }
        );
      };

      setupZoom();
    }, heroRef);

    window.addEventListener("resize", setupZoom);
    return () => {
      window.removeEventListener("resize", setupZoom);
      ctx.revert();
    };
  }, []);

  // Everything below the hero lives in its own context so none of it can
  // disturb the hero's zoom setup above.
  useEffect(() => {
    const cleanups = [];

    const ctx = gsap.context(() => {
      // Group photo drifts slower than the page — the usual parallax
      // depth cue, scaled up first so the drift never exposes an edge.
      gsap.fromTo(
        bannerImgRef.current,
        { yPercent: -12, scale: 1.22 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: bannerImgRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        bannerWordRef.current,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: bannerWordRef.current, start: "top 88%" },
        }
      );

      // Cards rise in per tier, so the pyramid assembles top-down in the
      // same order as the hierarchy itself.
      gsap.utils.toArray(`.${styles.tier}`).forEach((tier) => {
        gsap.fromTo(
          tier.querySelectorAll("[data-card]"),
          { autoAlpha: 0, y: 46 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            stagger: 0.14,
            ease: "power3.out",
            scrollTrigger: { trigger: tier, start: "top 85%" },
          }
        );
      });

    }, restRef);

    // Deliberately NO ScrollTrigger.refresh() here. refresh() is global —
    // it recalculates every trigger on the page, including the hero's
    // scrubbed zoom, and firing it mid-scroll (with Lenis driving the
    // scroll position) left that tween holding a stale progress, so
    // returning to the top no longer returned the title to scale 1.
    // It was only ever added to stop cards rendering invisible, and that
    // turned out to be the tier grid collapsing to zero height rather
    // than stale measurements. .photoWrap carries an explicit
    // aspect-ratio, so lazy-loaded portraits shift no layout and the
    // trigger positions are correct from first paint.

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <>
      <section ref={outerRef} className={styles.outer}>
        <div ref={heroRef} className={styles.hero}>
          <TopNav current="secretariat" />
          <Image
            src="/images/secretariat-bg.jpg"
            alt=""
            aria-hidden="true"
            fill
            priority
            className={styles.bgImage}
          />
          <div className={styles.scrim} />
          <div className="container">
            <div ref={groupRef} className={styles.group}>
              <span ref={eyebrowRef} className={styles.eyebrow}>
                The
              </span>
              <h1 ref={titleRef} className={styles.title}>
                Secretariat
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div ref={restRef}>
        <section className={styles.banner}>
          <div ref={bannerImgRef} className={styles.bannerImgWrap}>
            <Image
              src="/images/secretariat/group.jpg"
              alt="The ETHOS 2026 Secretariat"
              fill
              sizes="100vw"
              className={styles.bannerImg}
            />
          </div>
          <div className={styles.bannerScrim} />
          <span ref={bannerWordRef} className={styles.bannerWord}>
            Council
          </span>
        </section>

        <section className={styles.roster}>
          <div className={styles.rosterBg}>
            <Image
              src="/images/secretariat-bg.jpg"
              alt=""
              aria-hidden="true"
              fill
              className={styles.rosterBgImage}
            />
            <div className={styles.rosterBgScrim} />
          </div>
          <div className={`container ${styles.rosterInner}`}>
            <div className={styles.tier}>
              <Card person={ROSTER[0]} />
            </div>

            <div className={styles.tier}>
              <Card person={ROSTER[1]} />
            </div>

            <div className={`${styles.tier} ${styles.tierPair}`}>
              <Card person={ROSTER[2]} />
              <Card person={ROSTER[3]} />
            </div>

            <div className={`${styles.tier} ${styles.tierPair}`}>
              <Card person={ROSTER[4]} />
              <Card person={ROSTER[5]} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
