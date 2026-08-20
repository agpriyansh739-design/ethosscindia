"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import TopNav from "./TopNav";
import styles from "./PolicyLabs.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const SECTIONS = [
  {
    id: "junior",
    eyebrow: "Junior Delegation · Ages 11 – 14",
    title: "The learner’s lived experience",
    note: "Two Policy Labs, grounded in what students directly experience in school and how education can better support their growth.",
    footnote:
      "Junior Labs participate only in sessions designed for their age group — keeping discussion developmentally appropriate while still substantive.",
    labs: [
      {
        n: "I",
        name: "Learning, Well-being & School Experience",
        question: "What kind of environment enables every learner to thrive?",
        topics: [
          "Joyful & Experiential Learning",
          "Student Well-Being & Mental Health",
          "Student Voice & Participation",
          "Creativity, Sports & Co-Curriculars",
        ],
      },
      {
        n: "II",
        name: "Future Learning & Global Citizenship",
        question:
          "What knowledge, skills and values should every learner develop by 2050 and beyond?",
        topics: [
          "Technology & AI in Learning",
          "Digital Citizenship",
          "Life Skills & Values",
          "Global Citizenship",
          "Responsible Leadership",
        ],
      },
    ],
  },
  {
    id: "senior",
    eyebrow: "Senior Delegation · Ages 15 – 18",
    title: "Thinking like policymakers",
    note: "Four Policy Labs move beyond personal experience into system-level educational reform.",
    labs: [
      {
        n: "I",
        name: "Curriculum & Assessment Reform",
        question:
          "How should curriculum and assessment evolve to prepare learners for the future?",
        topics: [
          "Curriculum Redesign",
          "Competency-Based Learning",
          "Exam Reform",
          "Interdisciplinary Education",
          "Personalized Pathways",
        ],
      },
      {
        n: "II",
        name: "AI, Innovation & Digital Education",
        question:
          "How can technology transform education while ensuring equity, ethics and accessibility?",
        topics: [
          "Artificial Intelligence in Education",
          "Educational Technology & Digital Transformation",
          "Digital Equity & Inclusive Access",
          "Ethical & Responsible AI",
          "Future-Ready Smart Classrooms",
        ],
      },
      {
        // The source slide runs this lab's heading on into its question;
        // given a title of its own it matches the pattern of the other
        // five, with the full question kept intact beneath.
        n: "III",
        name: "Climate, Sustainability & Green Skills",
        question:
          "How can education empower learners as stewards of a sustainable, climate-resilient future?",
        topics: [
          "Climate Literacy",
          "Sustainable Development",
          "Biodiversity",
          "Circular Economy",
          "Green Skills",
        ],
      },
      {
        n: "IV",
        name: "Future Skills, Higher Ed. & Employability",
        question:
          "How should education prepare young people for higher education, work and global citizenship?",
        topics: [
          "Entrepreneurship",
          "Financial Literacy",
          "Vocational Education",
          "University Readiness",
          "Lifelong Learning",
        ],
      },
    ],
  },
];

function Lab({ lab }) {
  return (
    <article className={styles.lab} data-lab>
      <div className={styles.labTop}>
        <span className={styles.labNum}>{lab.n}</span>
        {lab.tba && <span className={styles.chip}>Title to be confirmed</span>}
      </div>

      <h3 className={styles.labName}>{lab.name}</h3>
      <span className={styles.labRule} />

      <p className={styles.labQuestion}>{lab.question}</p>

      <ul className={styles.topics}>
        {lab.topics.map((t) => (
          <li key={t} className={styles.topic}>
            {t}
          </li>
        ))}
      </ul>

      {/* A span rather than an <a href="#">, so clicking does nothing at
          all — no jump to the top of the page, no stray "#" appended to
          the URL. The hover treatment is driven by the class, not the
          element, so it still animates. Swap to an anchor once the
          guides have somewhere to point. */}
      <div className={styles.labActions}>
        <span
          className={`${styles.labBtn} ${styles.labBtnGhost}`}
          role="button"
          aria-disabled="true"
        >
          <span className={styles.ghostLabel}>Background Guide</span>
          <span className={styles.ghostArrow} aria-hidden="true">
            &rarr;
          </span>
        </span>
      </div>
    </article>
  );
}

// Brush radius in CSS pixels, how long a stroke takes to vanish, and how
// far apart dabs are laid along the path.
const BRUSH = 78;
const LIFETIME = 1500;
const SPACING = 14;
// Bounds the redraw cost of a long fast stroke; at this cap the oldest
// dabs are already nearly transparent, so dropping them is invisible.
const MAX_DABS = 320;

export default function PolicyLabs() {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const ledeRef = useRef(null);
  const brushRef = useRef(null);

  // Paintbrush reveal. An offscreen canvas holds the stroke as an alpha
  // mask; the visible one redraws the artwork each frame and keeps only
  // the pixels that mask covers. A CSS-tiled version can only ever
  // produce squares — a mask is what allows a real brush edge.
  //
  // The mask is rebuilt from scratch every frame out of a list of
  // timestamped dabs, rather than being faded in place. Fading in place
  // (drawing transparent black over it with destination-out) multiplies
  // the remaining alpha rather than subtracting from it, so in 8-bit
  // alpha it never actually reaches zero: once a pixel is at 1/255 it
  // rounds back to itself forever and the stroke is stencilled onto the
  // page permanently. Rebuilding guarantees it disappears, and makes
  // LIFETIME an exact duration instead of a decay rate.
  useEffect(() => {
    if (window.matchMedia("(max-width: 860px)").matches) return;

    const canvas = brushRef.current;
    if (!canvas) return;

    const vctx = canvas.getContext("2d");
    const mask = document.createElement("canvas");
    const mctx = mask.getContext("2d");

    const img = new window.Image();
    img.src = "/images/policy-labs-reveal.jpg";

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let last = null;
    let dabs = [];

    // The brush shape is rendered once into its own canvas and then
    // stamped. Building a radial gradient per dab per frame would mean
    // hundreds of gradient allocations every frame.
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = BRUSH * 2;
    const sctx = sprite.getContext("2d");
    const sg = sctx.createRadialGradient(
      BRUSH,
      BRUSH,
      0,
      BRUSH,
      BRUSH,
      BRUSH
    );
    sg.addColorStop(0, "rgba(255,255,255,1)");
    sg.addColorStop(0.45, "rgba(255,255,255,0.55)");
    sg.addColorStop(1, "rgba(255,255,255,0)");
    sctx.fillStyle = sg;
    sctx.fillRect(0, 0, BRUSH * 2, BRUSH * 2);

    const resize = () => {
      // Capped: the stroke is soft, so extra pixel density buys nothing
      // visible and costs a full-viewport composite every frame.
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = mask.width = Math.round(w * dpr);
      canvas.height = mask.height = Math.round(h * dpr);
      vctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const now = performance.now();

      if (!last) {
        dabs.push({ x, y, t: now });
        last = { x, y };
        return;
      }

      // Dabs are laid at a fixed spacing along the path rather than one
      // per event: a fast flick fires far fewer mousemoves than the
      // distance it covers, which would leave a dotted trail instead of
      // a continuous stroke.
      const dist = Math.hypot(x - last.x, y - last.y);
      if (dist < SPACING) return;

      const steps = Math.min(80, Math.floor(dist / SPACING));
      for (let i = 1; i <= steps; i++) {
        dabs.push({
          x: last.x + ((x - last.x) * i) / steps,
          y: last.y + ((y - last.y) * i) / steps,
          t: now,
        });
      }
      if (dabs.length > MAX_DABS) dabs.splice(0, dabs.length - MAX_DABS);
      last = { x, y };
    };

    const drawCover = () => {
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = w / h;
      let dw, dh, dx, dy;
      if (cr > ir) {
        dw = w;
        dh = w / ir;
        dx = 0;
        dy = (h - dh) / 2;
      } else {
        dh = h;
        dw = h * ir;
        dy = 0;
        dx = (w - dw) / 2;
      }
      vctx.drawImage(img, dx, dy, dw, dh);
    };

    const loop = () => {
      const now = performance.now();

      // Drop expired dabs, then rebuild the mask from what remains. Each
      // dab's opacity is purely a function of its own age, so the stroke
      // is guaranteed to be fully gone LIFETIME after the cursor stops.
      while (dabs.length && now - dabs[0].t > LIFETIME) dabs.shift();

      mctx.save();
      mctx.setTransform(1, 0, 0, 1, 0, 0);
      mctx.clearRect(0, 0, mask.width, mask.height);
      mctx.restore();

      for (let i = 0; i < dabs.length; i++) {
        const d = dabs[i];
        const life = 1 - (now - d.t) / LIFETIME;
        // Eased so the trail holds its strength then falls away, rather
        // than dimming linearly from the moment it is painted.
        mctx.globalAlpha = Math.max(0, life * life) * 0.55;
        mctx.drawImage(sprite, d.x - BRUSH, d.y - BRUSH, BRUSH * 2, BRUSH * 2);
      }
      mctx.globalAlpha = 1;

      vctx.save();
      vctx.setTransform(1, 0, 0, 1, 0, 0);
      vctx.clearRect(0, 0, canvas.width, canvas.height);
      vctx.restore();

      if (img.complete && img.naturalWidth) {
        drawCover();
        // Keep only what the brush has covered.
        vctx.globalCompositeOperation = "destination-in";
        vctx.save();
        vctx.setTransform(1, 0, 0, 1, 0, 0);
        vctx.drawImage(mask, 0, 0);
        vctx.restore();
        // Tint what survived, so type stays readable over it.
        vctx.globalCompositeOperation = "source-atop";
        vctx.fillStyle = "rgba(9,5,6,0.42)";
        vctx.fillRect(0, 0, w, h);
        vctx.globalCompositeOperation = "source-over";
      }

      raf = requestAnimationFrame(loop);
    };

    resize();
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  useEffect(() => {
    // SplitText rewrites the DOM of whatever it touches, so every
    // instance has to be reverted on cleanup or the markup is left
    // shredded on the next mount.
    const splits = [];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        [titleRef.current, ledeRef.current],
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.15,
        }
      );

      // No parallax on the background: it is a single fixed layer behind
      // the whole page, so it holds completely still while the content
      // scrolls over it.

      // Headings and body copy reveal line by line from behind a mask,
      // rather than the whole block fading at once — the same treatment
      // used on the Partnership and Mission sections, so the page moves
      // like the rest of the site.
      gsap.utils.toArray("[data-split]").forEach((el) => {
        const split = new SplitText(el, { type: "lines", mask: "lines" });
        splits.push(split);
        gsap.set(split.lines, { yPercent: 110, opacity: 0 });
        gsap.to(split.lines, {
          yPercent: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%" },
        });
      });

      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%" },
          }
        );
      });

      gsap.utils.toArray("[data-grid]").forEach((grid) => {
        gsap.fromTo(
          grid.querySelectorAll("[data-lab]"),
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: grid, start: "top 85%" },
          }
        );
      });
    }, rootRef);

    return () => {
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.page}>
      {/* One fixed layer behind everything rather than a background per
          section: it never moves, so there is no parallax and no seam
          between the hero and the labs below. */}
      <div className={styles.pageBg} aria-hidden="true">
        <Image
          src="/images/policy-labs-bg.jpg"
          alt=""
          fill
          priority
          className={styles.pageBgImage}
        />
        <div className={styles.pageBgScrim} />
      </div>

      {/* Paintbrush reveal — see the effect above. */}
      <canvas ref={brushRef} className={styles.brush} aria-hidden="true" />

      <section className={styles.hero}>
        <TopNav current="policy-labs" />

        <div className={`container ${styles.heroContent}`}>
          <h1 ref={titleRef} className={styles.title}>
            Policy Labs
          </h1>
          <p ref={ledeRef} className={styles.lede}>
            Six rooms. Six questions facing education under SDG&nbsp;4.
          </p>
        </div>
      </section>

      <section className={styles.body}>
        <div className={`container ${styles.bodyInner}`}>
          <p className={styles.intro} data-split>
            A Policy Lab is where the summit does its actual work. Each one
            takes a single question facing education under Sustainable
            Development Goal&nbsp;4, puts it in front of a room of delegates,
            and asks them to research it, argue it out, and leave with a
            written position. Those positions are what the summit carries
            forward into its consultation report.
          </p>

          {SECTIONS.map((section) => (
            <div key={section.id} className={styles.section}>
              <header className={styles.sectionHead}>
                <span className={styles.sectionAges} data-reveal>
                  {section.eyebrow}
                </span>
                <h2 className={styles.sectionTitle} data-split>
                  {section.title}
                </h2>
                <span className={styles.doubleRule} aria-hidden="true" />
                <p className={styles.sectionNote} data-split>
                  {section.note}
                </p>
              </header>

              <div className={styles.grid} data-grid>
                {section.labs.map((lab) => (
                  <Lab key={lab.n} lab={lab} />
                ))}
              </div>

              {section.footnote && (
                <p className={styles.footnote} data-reveal>
                  {section.footnote}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
