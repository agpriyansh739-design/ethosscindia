"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import styles from "./Partnership.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Partnership() {
  const sectionRef = useRef(null);
  const quoteRef = useRef(null);
  const bodyRef = useRef(null);
  const partnersRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText(quoteRef.current, {
        type: "lines",
        mask: "lines",
      });

      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      gsap.to(split.lines, {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });

      gsap.fromTo(
        bodyRef.current,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
        }
      );

      const cards = gsap.utils.toArray(`.${styles.card}`);
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: partnersRef.current, start: "top 88%" },
        }
      );

      const marks = gsap.utils.toArray(`.${styles.mark}`);
      gsap.fromTo(
        marks,
        { scale: 0.7, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.15,
          delay: 0.15,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: partnersRef.current, start: "top 88%" },
        }
      );

      return () => split.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.bgSticky}>
        <Image
          src="/images/partnership-bg.png"
          alt=""
          aria-hidden="true"
          fill
          className={styles.bgImage}
        />
        <div className={styles.bgScrim} />
      </div>
      <div className={`container ${styles.content}`}>
        <span className={styles.label}>
          The <em>Partnership</em>
        </span>

        <div className={styles.grid} style={{ marginTop: "36px" }}>
          <h2 ref={quoteRef} className={styles.quote}>
            Convened locally. Backed by a global mandate for education.
          </h2>

          <div ref={bodyRef} className={styles.body}>
            <p>
              ETHOS is organized in collaboration with UNESCO, aligning the
              summit&rsquo;s agenda with the global framework for SDG&nbsp;4
              and the wider 2030 Agenda for Sustainable Development.
            </p>
            <p>
              The partnership brings shared research, practitioner networks,
              and a common measure of success: real progress on access,
              equity, and the quality of learning.
            </p>
          </div>
        </div>

        <div ref={partnersRef} className={styles.partners}>
          <div className={styles.card}>
            <div className={styles.mark}>
              <Image
                src="/images/logo-scindia.png"
                alt="The Scindia School crest"
                width={800}
                height={700}
                className={styles.markImg}
              />
            </div>
            <div className={styles.cardText}>
              <span className={styles.cardEyebrow}>Organized by</span>
              <span className={styles.cardName}>The Scindia School</span>
            </div>
          </div>

          <div className={styles.divider} aria-hidden="true" />

          <div className={styles.card}>
            <div className={styles.mark}>
              <Image
                src="/images/logo-unesco.png"
                alt="UNESCO"
                width={750}
                height={650}
                className={styles.markImg}
              />
            </div>
            <div className={styles.cardText}>
              <span className={styles.cardEyebrow}>In collaboration with</span>
              <span className={styles.cardName}>UNESCO</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
