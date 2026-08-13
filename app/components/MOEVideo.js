"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./MOEVideo.module.css";

gsap.registerPlugin(ScrollTrigger);

// Positions in a 1280x720 reference frame (matches the original video's
// export size) — everything below is placed with percentages of this, so
// it scales crisply at any viewport instead of relying on a compressed
// frame sequence.
const NODES = [
  { x: 63, y: 367, r: 30, color: "#a3183a", label: "2026" },
  { x: 347, y: 514, r: 30, color: "#2f7ec7", label: "Q1 2027" },
  { x: 631, y: 231, r: 30, color: "#3ecf8e", label: "2027" },
  { x: 916, y: 514, r: 30, color: "#e0a83a", label: "2028" },
  { x: 1200, y: 331, r: 30, color: "#35c9d6", label: "2030" },
];

const segmentPath = (a, b) =>
  `M ${a.x},${a.y} C ${a.x + 90},${a.y} ${b.x - 90},${b.y} ${b.x},${b.y}`;

const SEGMENTS = NODES.slice(1).map((n, i) => segmentPath(NODES[i], n));

const TEXT_BLOCKS = [
  {
    left: "2.4%",
    top: "17.5%",
    heading: "Phase I: Evidence and Future Mapping",
    body: (
      <>
        <p className={styles.desc}>SDG&nbsp;4 progress monitoring</p>
        <p className={styles.desc}>
          <strong>Foresight exercises</strong> &middot; Global Education
          Futures Outlook Beyond 2030 working paper
          <br />
          <strong>Youth and student consultation</strong> &middot; Youth
          Agenda for Post-2030 Education
        </p>
      </>
    ),
  },
  {
    left: "16.5%",
    top: "84%",
    heading: "Global Education Meeting",
    body: (
      <p className={styles.desc}>
        Review of SDG&nbsp;4 Education 2030 progress
        <br />
        Presentation of the Youth Agenda for Post-2030 Education
        <br />
        Prioritization for post-2030 education
      </p>
    ),
  },
  {
    left: "38.6%",
    top: "3.8%",
    heading: "Phase II: Consultations on Post-2030 Education",
    body: (
      <p className={styles.desc}>
        &bull; Regional, national and stakeholder group consultations
        <br />
        &bull; Global outreach and inter-governmental engagement
      </p>
    ),
  },
  {
    left: "62.7%",
    top: "84%",
    heading: "Phase III: Global Synthesis and Validation",
    body: (
      <p className={styles.desc}>
        Synthesis of consultation results into a strategic orientation
        document for validation
      </p>
    ),
  },
];

export default function MOEVideo() {
  const outerRef = useRef(null);
  const graphicRef = useRef(null);
  const titleRef = useRef(null);
  const nodeRefs = useRef([]);
  const clipRefs = useRef([]);
  const textRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(nodeRefs.current, {
        autoAlpha: 0,
        scale: 0.5,
        transformOrigin: "50% 50%",
      });
      gsap.set(textRefs.current, { autoAlpha: 0, y: 16 });
      gsap.set(titleRef.current, { autoAlpha: 0, y: -10 });

      // Each dashed segment is revealed by growing a clipPath rect from 0
      // to its full width, left to right — simpler and crisper than
      // fighting stroke-dasharray/dashoffset math for a dashed (not
      // solid) line, and every segment here only ever moves rightward in
      // x so a horizontal clip reveals it correctly regardless of how
      // much it curves vertically.
      const T = {
        title: 0,
        node1: 0.25,
        seg1: 0.55,
        node2: 0.95,
        seg2: 1.25,
        node3: 1.65,
        seg3: 1.95,
        node4: 2.35,
        seg4: 2.65,
        node5: 3.05,
        fadeOut: 3.55,
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
      });

      tl.to(
        titleRef.current,
        { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" },
        T.title
      );

      NODES.forEach((n, i) => {
        tl.to(
          nodeRefs.current[i],
          { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2)" },
          T[`node${i + 1}`]
        );
        if (textRefs.current[i]) {
          tl.to(
            textRefs.current[i],
            { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" },
            T[`node${i + 1}`]
          );
        }
        if (i < SEGMENTS.length) {
          tl.to(
            clipRefs.current[i],
            {
              attr: { width: NODES[i + 1].x - NODES[i].x },
              duration: 0.4,
              ease: "power1.inOut",
            },
            T[`seg${i + 1}`]
          );
        }
      });

      tl.to(
        graphicRef.current,
        { autoAlpha: 0, duration: 0.35, ease: "power1.in" },
        T.fadeOut
      );
    }, outerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={outerRef} className={styles.outer}>
      <div className={styles.pin}>
        <div ref={graphicRef} className={styles.graphic}>
          <div ref={titleRef} className={styles.title}>
            <div className={styles.titleLine1}>#Education</div>
            <div className={styles.titleLine2}>Beyond 2030</div>
          </div>

          <svg
            className={styles.svg}
            viewBox="0 0 1280 720"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              {SEGMENTS.map((_, i) => (
                <clipPath key={i} id={`moe-clip-${i}`}>
                  <rect
                    ref={(el) => (clipRefs.current[i] = el)}
                    x={NODES[i].x}
                    y="0"
                    width="0"
                    height="720"
                  />
                </clipPath>
              ))}
            </defs>
            {SEGMENTS.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="6"
                strokeDasharray="16 12"
                strokeLinecap="round"
                clipPath={`url(#moe-clip-${i})`}
              />
            ))}
            {NODES.map((n, i) => (
              <circle
                key={n.label}
                ref={(el) => (nodeRefs.current[i] = el)}
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill={n.color}
              />
            ))}
          </svg>

          {NODES.map((n, i) => (
            <span
              key={n.label}
              className={styles.nodeLabel}
              style={{
                left: `${(n.x / 1280) * 100}%`,
                top:
                  i === NODES.length - 1
                    ? `${((n.y - n.r - 34) / 720) * 100}%`
                    : `${((n.y + n.r + 12) / 720) * 100}%`,
                color: n.color,
              }}
            >
              {n.label}
            </span>
          ))}

          {TEXT_BLOCKS.map((block, i) => (
            <div
              key={block.heading}
              ref={(el) => (textRefs.current[i] = el)}
              className={styles.textBlock}
              style={{ left: block.left, top: block.top }}
            >
              <h3 className={styles.heading}>{block.heading}</h3>
              {block.body}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
