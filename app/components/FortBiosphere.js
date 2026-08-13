"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import TopNav from "./TopNav";
import styles from "./FortBiosphere.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

function Reveal({ as: Tag = "div", className, children, start = "top 85%" }) {
  const ref = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start },
        }
      );
    });
    return () => ctx.revert();
  }, [start]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

export default function FortBiosphere() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const imageWrapRef = useRef(null);
  const introRef = useRef(null);
  const introImageWrapRef = useRef(null);
  const closingRef = useRef(null);
  const closingImageWrapRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(introImageWrapRef.current, {
        yPercent: 12,
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
          trigger: introRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, introRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(closingImageWrapRef.current, {
        yPercent: 12,
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
          trigger: closingRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, closingRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText(titleRef.current, {
        type: "lines",
        mask: "lines",
      });
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      gsap.to(split.lines, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.2,
      });

      // Same parallax read as the main Hero video: the image drifts and
      // zooms slower than the actual scroll as you move through it.
      gsap.to(imageWrapRef.current, {
        yPercent: 12,
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      return () => split.revert();
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={heroRef} className={styles.hero}>
        <TopNav current="fort-biosphere" />
        <div ref={imageWrapRef} className={styles.imageWrap}>
          <Image
            src="/images/fort-biosphere-hero.jpg"
            alt=""
            aria-hidden="true"
            fill
            priority
            className={styles.heroImage}
          />
        </div>
        <div className={styles.scrim} />
        <div className={styles.heroTint} />
        <div className="container">
          <h1 ref={titleRef} className={styles.title}>
            Fort Biosphere
          </h1>
        </div>
      </section>

      <section ref={introRef} className={styles.introSection}>
        <div ref={introImageWrapRef} className={styles.introImageWrap}>
          <Image
            src="/images/fort-biosphere-intro-bg.jpg"
            alt=""
            aria-hidden="true"
            fill
            className={styles.introImage}
          />
        </div>
        <div className={styles.introTint} />
        <div className="container">
          <div className={styles.introText}>
            <Reveal as="p" className={styles.prose}>
              Perched atop the historic ramparts of The Scindia School in
              Gwalior, the Fort Biosphere is not a landscaped garden or a
              symbolic green initiative—it is a functioning ecological
              system shaped by observation, research, and sustained student
              involvement.
            </Reveal>
            <Reveal as="p" className={styles.prose}>
              Launched in 2020, the Fort Biosphere began as a focused effort
              to restore ecological balance within the fort campus. Early
              surveys revealed a landscape under stress: invasive plant
              species had spread aggressively, soil fertility was
              declining, and existing water bodies were underutilized.
              Rather than introducing decorative plantations or artificial
              landscaping, the project adopted a restoration-based approach
              rooted in ecological science. The guiding principle was
              simple: repair natural systems instead of redesigning them.
            </Reveal>
            <Reveal as="p" className={styles.prose}>
              What began as a two-pillar initiative centered on rewilding
              and water conservation has since evolved into a five-pillar
              sustainability framework. These pillars: Rewilding, Water
              Conservation, Waste Transformation, Energy Conservation, and
              Regenerative Farming; operate as interconnected systems
              rather than isolated projects.
            </Reveal>
            <Reveal as="p" className={styles.prose}>
              Rewilding formed the foundation. Invasive species such as
              Parthenium, Lantana, and Subabool were systematically removed
              because of their harmful impact on biodiversity and soil
              health. In their place, native species suited to the local
              climate and geology were introduced. To ensure a reliable
              supply of indigenous plants, the school established its own
              Native Plant Nursery, which now maintains thousands of
              saplings with high survival rates. These plants are used both
              within campus restoration zones and distributed to other
              institutions, extending ecological impact beyond the fort
              walls.
            </Reveal>
            <Reveal as="p" className={styles.prose}>
              One of the most visible outcomes of this effort is the
              wildflower meadow, developed across a previously barren
              stretch of land. Now home to dozens of native grass and plant
              species, it functions as a carbon sink, a pollinator habitat,
              and a field classroom where students observe ecological
              succession firsthand—from bare rock surfaces to soil
              formation and vegetation growth.
            </Reveal>
          </div>
        </div>
      </section>

      <section ref={closingRef} className={styles.closingSection}>
        <div ref={closingImageWrapRef} className={styles.closingImageWrap}>
          <Image
            src="/images/fort-biosphere-closing-bg.jpg"
            alt=""
            aria-hidden="true"
            fill
            className={styles.closingImage}
          />
        </div>
        <div className={styles.closingTint} />
        <div className="container">
          <Reveal as="p" className={styles.closing}>
            Fort Biosphere isn&rsquo;t a display garden. It&rsquo;s an
            ecosystem, a classroom, a research site, and a training
            ground — folded into how the school actually runs.
          </Reveal>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container">
          <span>The Scindia School</span>
          <span>&copy; 2026, All rights reserved</span>
        </div>
      </footer>
    </>
  );
}
