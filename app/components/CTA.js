"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import styles from "./CTA.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function CTA() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const actionsRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText(headlineRef.current, {
        type: "lines",
        mask: "lines",
      });

      gsap.set(split.lines, { yPercent: 110 });
      gsap.to(split.lines, {
        yPercent: 0,
        duration: 1,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });

      gsap.fromTo(
        actionsRef.current,
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          delay: 0.3,
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );

      gsap.fromTo(
        footerRef.current,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 1,
          scrollTrigger: { trigger: footerRef.current, start: "top 95%" },
        }
      );

      return () => split.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.glow} />
      <div className="container">
        <h2
          ref={headlineRef}
          className={styles.headline}
          style={{ marginTop: "24px" }}
        >
          Help shape the agenda for education.
        </h2>

        <div ref={actionsRef} className={styles.actions}>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSe0Nq2A9PsPfT5Cl1FRtE40mPdOklA-djsQW9gyqGmDVIMT4A/viewform?usp=publish-editor"
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-solid ${styles.registerBtn}`}
          >
            Register Now
          </a>
        </div>

        <div ref={footerRef} className={styles.footer}>
          <span className={styles.footerLeft}>
            ETHOS Summit &mdash; SDG&nbsp;4 &middot; In collaboration with
            UNESCO
          </span>
        </div>
      </div>
    </section>
  );
}
