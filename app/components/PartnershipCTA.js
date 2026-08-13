"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import styles from "./PartnershipCTA.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function PartnershipCTA() {
  const outerRef = useRef(null);
  const quoteRef = useRef(null);
  const bodyRef = useRef(null);
  const partnersRef = useRef(null);
  const riseRef = useRef(null);
  const headlineRef = useRef(null);
  const actionsRef = useRef(null);
  const footerRef = useRef(null);
  const baseImageRef = useRef(null);
  const riseImageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax drift on both background photos: scaled up so the drift
      // never reveals an edge, then translated a modest amount opposite
      // to scroll direction, scrubbed across the same distance the rise
      // timeline uses. Each image's own transform is independent of its
      // parent's (.rise also moves on top of this), so they compose
      // instead of fighting.
      gsap.set([baseImageRef.current, riseImageRef.current], { scale: 1.2 });
      gsap.fromTo(
        baseImageRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: outerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
          },
        }
      );
      gsap.fromTo(
        riseImageRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: outerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
          },
        }
      );

      // Partnership's own entrance — fires once, as a normal (non-scrub)
      // trigger, so its content is already settled in place by the time
      // .outer's top reaches the viewport and the pin engages.
      const quoteSplit = new SplitText(quoteRef.current, {
        type: "lines",
        mask: "lines",
      });
      gsap.set(quoteSplit.lines, { yPercent: 110, opacity: 0 });
      gsap.to(quoteSplit.lines, {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: outerRef.current, start: "top 70%" },
      });

      gsap.fromTo(
        bodyRef.current,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          scrollTrigger: { trigger: outerRef.current, start: "top 65%" },
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
          scrollTrigger: { trigger: outerRef.current, start: "top 50%" },
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
          scrollTrigger: { trigger: outerRef.current, start: "top 50%" },
        }
      );

      // Registration headline — split now, revealed later inside the
      // scrubbed timeline below, only once the rise panel has covered
      // the screen.
      const headlineSplit = new SplitText(headlineRef.current, {
        type: "lines",
        mask: "lines",
      });
      gsap.set(headlineSplit.lines, { yPercent: 110 });
      gsap.set(actionsRef.current, { autoAlpha: 0, y: 16 });
      gsap.set(footerRef.current, { autoAlpha: 0 });

      // Same non-pin sticky technique as CloudTransition: .outer's height
      // already accounts for the exact scroll distance this timeline
      // needs, so .pin sticks for exactly that long and releases with no
      // leftover dead space.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
      });

      tl.fromTo(
        riseRef.current,
        { yPercent: 100 },
        { yPercent: 0, ease: "power2.inOut", duration: 0.6 },
        0.3
      )
        .to(
          headlineSplit.lines,
          { yPercent: 0, duration: 0.3, stagger: 0.06, ease: "power3.out" },
          0.68
        )
        .to(
          actionsRef.current,
          { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out" },
          0.85
        )
        .to(footerRef.current, { autoAlpha: 1, duration: 0.15 }, 0.95);

      return () => {
        quoteSplit.revert();
        headlineSplit.revert();
      };
    }, outerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={outerRef} className={styles.outer}>
      <div className={styles.pin}>
        <div className={styles.base}>
          <Image
            ref={baseImageRef}
            src="/images/partnership-bg.png"
            alt=""
            aria-hidden="true"
            fill
            className={styles.bgImage}
          />
          <div className={styles.bgScrim} />
          <div className={`container ${styles.content}`}>
            <span className={styles.label}>
              The <em>Partnership</em>
            </span>

            <div className={styles.grid}>
              <h2 ref={quoteRef} className={styles.quote}>
                Convened locally. Backed by a global mandate for education.
              </h2>

              <div ref={bodyRef} className={styles.body}>
                <p>
                  ETHOS is organized in collaboration with UNESCO, aligning
                  the summit&rsquo;s agenda with the global framework for
                  SDG&nbsp;4 and the wider 2030 Agenda for Sustainable
                  Development.
                </p>
                <p>
                  The partnership brings shared research, practitioner
                  networks, and a common measure of success: real progress
                  on access, equity, and the quality of learning.
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
                  <span className={styles.cardEyebrow}>
                    In collaboration with
                  </span>
                  <span className={styles.cardName}>UNESCO</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={riseRef} className={styles.rise}>
          <Image
            ref={riseImageRef}
            src="/images/registration-bg.png"
            alt=""
            aria-hidden="true"
            fill
            className={styles.riseImage}
          />
          <div className={styles.riseScrim} />
          <div className="container">
            <h2 ref={headlineRef} className={styles.headline}>
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
        </div>
      </div>
    </section>
  );
}
