"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./CloudTransition.module.css";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.defaults({ pinType: "transform" });

const FRAME_COUNT = 75;
const frameSrc = (i) =>
  `/images/explode/frame-${String(i + 1).padStart(3, "0")}.jpg`;

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP"];
const DAYS = ["30", "31", "1"];
const SPACER = 2; // blank rows padded above/below so the target lands centered
const AUG_INDEX = MONTHS.indexOf("AUG");
const SEP_INDEX = MONTHS.indexOf("SEP");

function Wheel({ items, listRef, highlightRef }) {
  const rows = [
    ...Array(SPACER).fill(null),
    ...items,
    ...Array(SPACER).fill(null),
  ];
  return (
    <div className={styles.viewport}>
      <div ref={listRef} className={styles.list}>
        {rows.map((item, i) => (
          <div key={i} className={styles.row}>
            {item}
          </div>
        ))}
      </div>
      <div className={styles.highlightClip}>
        <div ref={highlightRef} className={styles.listHighlight}>
          {rows.map((item, i) => (
            <div key={i} className={styles.row}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CloudTransition() {
  const outerRef = useRef(null);
  const sectionRef = useRef(null);
  const imgBoxRef = useRef(null);
  const rasterRef = useRef(null);
  const xMarkRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const frameIndexRef = useRef(-1);
  const aboutRef = useRef(null);
  const ethosRef = useRef(null);
  const paraRef = useRef(null);
  const panelRef = useRef(null);
  const panelContentRef = useRef(null);
  const riseRef = useRef(null);
  const eyebrowRef = useRef(null);
  const eyebrowFloatRef = useRef(null);
  const monthsRef = useRef(null);
  const monthsHiRef = useRef(null);
  const daysRef = useRef(null);
  const daysHiRef = useRef(null);

  const isReady = (i) => {
    const img = imagesRef.current[i];
    return img && img.complete && img.naturalWidth > 0;
  };

  const nearestReady = (i) => {
    if (isReady(i)) return i;
    for (let d = 1; d < FRAME_COUNT; d++) {
      if (isReady(i - d)) return i - d;
      if (isReady(i + d)) return i + d;
    }
    return -1;
  };

  const drawFrame = (index) => {
    const canvas = canvasRef.current;
    const ready = nearestReady(index);
    if (!canvas || ready === -1) return;
    if (ready === frameIndexRef.current) return;
    frameIndexRef.current = ready;

    const img = imagesRef.current[ready];
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);

    const ir = img.naturalWidth / img.naturalHeight;
    const cr = cw / ch;
    let dw, dh, dx, dy;
    if (cr > ir) {
      dw = cw;
      dh = cw / ir;
      dx = 0;
      dy = (ch - dh) / 2;
    } else {
      dh = ch;
      dw = ch * ir;
      dy = 0;
      dx = (cw - dw) / 2;
    }
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  // Preload the frame sequence in the background — it doesn't gate the
  // zoom-into-X animation, only needs to be ready by the time the
  // timeline reaches the frame-scrub phase at the end.
  useEffect(() => {
    let cancelled = false;
    const images = new Array(FRAME_COUNT);
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image();
      img.src = frameSrc(i);
      images[i] = img;
    }
    imagesRef.current = images;
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const frameProxy = { t: 0 };

    // A row at real-item index j sits at list-row (SPACER + j). With the
    // viewport showing 5 rows, its visual center is list-row (k + 2) when
    // the list is translated up by k rows. Centering item j therefore
    // needs k = j + SPACER - 2 — and since SPACER is 2 here, that's just
    // k = j. (Adding SPACER again on top of that, as this used to do,
    // double-counts the padding and centers an item 2 rows further along
    // than intended — that's what was showing MAR/"1" as the resting
    // state instead of JAN/"30".)
    const monthRows = SPACER * 2 + MONTHS.length;
    const monthUnit = 100 / monthRows;
    const monthStart = 0; // JAN, index 0 — no translation needed
    const monthAtAug = -(AUG_INDEX * monthUnit);
    const monthAtSep = -(SEP_INDEX * monthUnit);

    const dayRows = SPACER * 2 + DAYS.length;
    const dayUnit = 100 / dayRows;
    const dayAt30 = 0; // index 0 — no translation needed
    const dayAt31 = -(1 * dayUnit); // index 1
    const dayAt1 = -(2 * dayUnit); // index 2

    const ctx = gsap.context(() => {
      gsap.set([monthsRef.current, monthsHiRef.current], { yPercent: monthStart });
      gsap.set([daysRef.current, daysHiRef.current], { yPercent: dayAt30 });

      // Every phase below is placed at an explicit absolute time (seconds
      // along this timeline), not GSAP's relative "<"/"-=" shorthand.
      // Those shortcuts are relative to the most-recently-ADDED tween's
      // own start/end — once one overlapping tween is added, every
      // later un-positioned `.to()` silently inherits that earlier
      // reference point instead of the timeline's true end. That bug is
      // exactly what made the date wheel fire almost immediately instead
      // of after the months reached August. Absolute numbers sidestep it.
      const T = {
        appear: 0,
        hold: 0.16,
        rasterZoom: 0.26,
        vectorZoom: 0.42,
        megaZoom: 0.72,
        canvasVisible: 0.89,
        frameScrub: 0.89,
        // New reading beat: once the two fort halves have settled (frame
        // sequence ends at 0.89 + 0.5 = 1.39), "About", the Hindi
        // wordmark, and the paragraph fade in one after another over the
        // same still frame, before the date panel takes over.
        aboutIn: 1.39,
        ethosIn: 1.55,
        paraIn: 1.75,
        panel: 2.5,
        eyebrow: 2.7,
        monthsToAug: 2.8,
        daysTo31: 3.3,
        daysTo1: 3.5,
        monthsToSep: 3.5,
        riseUp: 3.95,
      };

      // Not using ScrollTrigger's pin:true here. GSAP's pin-spacer always
      // reserves this element's own natural CSS height *in addition to*
      // the scroll duration you give it — so even after the pin ends,
      // that natural height still has to be scrolled past normally,
      // as flat black. That's a real, unavoidable behavior of pin:true
      // (confirmed straight from GSAP's own source), not something
      // fixable with callbacks after the fact.
      //
      // Instead: .pin (below) is position: sticky, same technique
      // already used for Mission's own background image. .outer is an
      // explicit 430vh tall wrapper — 100vh (the sticky element's own
      // size) + 330vh (the scroll duration this timeline needs). A
      // sticky element genuinely only occupies exactly (parent height -
      // its own height) = 330vh of "stuck" scrolling, then releases
      // with zero leftover space, because there's no separate spacer
      // math involved at all — .outer's height *is* the total distance,
      // full stop.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
      });

      tl.fromTo(
        imgBoxRef.current,
        { yPercent: 60, scale: 0.5, opacity: 0 },
        { yPercent: 0, scale: 1.05, opacity: 1, ease: "power2.out", duration: 0.16 },
        T.appear
      )
        .to(imgBoxRef.current, { scale: 1.18, duration: 0.1, ease: "none" }, T.hold)
        // The X mark is vector from the very first frame now (no raster
        // glyph baked into the photo to hand off from), so the zoom just
        // dives straight through it — it never has a texture ceiling to
        // hit, unlike the photo behind it.
        .to(imgBoxRef.current, { scale: 4.5, ease: "power1.in", duration: 0.16 }, T.rasterZoom)
        .to(imgBoxRef.current, { scale: 6.5, ease: "power1.in", duration: 0.3 }, T.vectorZoom)
        // No separate white layer anywhere in this phase — "white" only
        // ever happens as a direct consequence of the zoom itself. The
        // transform origin sits inside the X's solid stroke, so pushing
        // scale this high moves the glyph's own edges entirely off-screen
        // in every direction; the frame is white because we are, by then,
        // deep inside solid fill — nothing fades or wipes independently
        // of that.
        .to(imgBoxRef.current, { scale: 140, ease: "power2.in", duration: 0.16 }, T.megaZoom)
        // The moment we're inside the white, the ETHOS frame sequence
        // takes over scrubbing directly — no separate blank section. The
        // canvas is hidden until exactly this point (and hides again if
        // you scroll back past it), so reversing shows the white circle
        // and zoom un-happening underneath instead of a frozen frame.
        //
        // imgBox itself is explicitly hidden here too — at scale 140 its
        // white fill reaches far enough to cover the center of the frame,
        // but not evenly in every direction, so slivers of the photo/X's
        // actual edges could still show through at the sides once the
        // frame sequence's own 16:9 box doesn't happen to fill 100% of a
        // wide viewport. Hiding it outright removes that risk instead of
        // relying on the zoom having covered literally every pixel.
        .set(canvasRef.current, { autoAlpha: 1 }, T.canvasVisible)
        .set(imgBoxRef.current, { autoAlpha: 0 }, T.canvasVisible)
        .to(
          frameProxy,
          {
            t: 1,
            duration: 0.5,
            ease: "none",
            onUpdate: () =>
              drawFrame(Math.min(FRAME_COUNT - 1, Math.floor(frameProxy.t * FRAME_COUNT))),
          },
          T.frameScrub
        )
        // "About" and the Hindi wordmark fade in over the now-settled
        // frame, then the paragraph — same still image the whole time,
        // nothing about the frame sequence itself changes here.
        .fromTo(
          aboutRef.current,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" },
          T.aboutIn
        )
        .fromTo(
          ethosRef.current,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" },
          T.ethosIn
        )
        .fromTo(
          paraRef.current,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
          T.paraIn
        )
        // Still the SAME pin, still on screen: the date panel now drops
        // down from above and covers the frame that's still showing —
        // it never unpins/scrolls away first, so the curtain genuinely
        // covers live content instead of a fresh blank section.
        .fromTo(
          panelRef.current,
          { yPercent: -100 },
          { yPercent: 0, ease: "power2.out", duration: 0.35 },
          T.panel
        )
        .fromTo(
          eyebrowRef.current,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.15, ease: "power2.out" },
          T.eyebrow
        )
        // Months scroll JAN through AUG first, on their own — the date
        // wheel doesn't move at all yet.
        .to(
          [monthsRef.current, monthsHiRef.current],
          { yPercent: monthAtAug, ease: "power2.inOut", duration: 0.5 },
          T.monthsToAug
        )
        // Only once we've landed on AUG does the date wheel start: 30, 31.
        .to(
          [daysRef.current, daysHiRef.current],
          { yPercent: dayAt31, ease: "power2.inOut", duration: 0.2 },
          T.daysTo31
        )
        // The instant the date wheel moves off 31 toward 1, the month
        // rolls AUG -> SEP in lockstep — they land together.
        .to(
          [daysRef.current, daysHiRef.current],
          { yPercent: dayAt1, ease: "power2.inOut", duration: 0.25 },
          T.daysTo1
        )
        .to(
          [monthsRef.current, monthsHiRef.current],
          { yPercent: monthAtSep, ease: "power2.inOut", duration: 0.25 },
          T.monthsToSep
        )
        // Hold on SEP/1 — it stays fully visible and static, "fixed" in
        // place — while a solid black panel rises up from the bottom
        // edge and covers it, still within this same pin. That panel is
        // the same black Mission opens on, so the handoff reads as
        // Beyond&nbsp;2030 arriving from below rather than an abrupt cut
        // or a fade to nothing.
        // Rises up covering the still-visible wheel with plain black —
        // and because .outer's height already accounts for the exact
        // scroll distance needed (see above), there's no leftover
        // trailing space after this: Mission begins immediately once
        // .outer's bottom edge is reached.
        .fromTo(
          riseRef.current,
          { yPercent: 100 },
          { yPercent: 0, ease: "power2.inOut", duration: 0.34 },
          T.riseUp
        );
      // "Save the Date" gets a life of its own, independent of the scroll
      // timeline above: a gentle continuous float, plus a magnetic drift
      // toward the cursor. Both live on the inner span so they never
      // fight the outer span's scroll-triggered entrance (opacity + y).
      gsap.to(eyebrowFloatRef.current, {
        y: -10,
        duration: 2.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, outerRef);

    const xTo = gsap.quickTo(eyebrowFloatRef.current, "x", { duration: 0.6, ease: "power3" });
    const rotTo = gsap.quickTo(eyebrowFloatRef.current, "rotation", {
      duration: 0.6,
      ease: "power3",
    });
    const onMouseMove = (e) => {
      const relX = e.clientX / window.innerWidth - 0.5; // -0.5..0.5
      xTo(relX * 28);
      rotTo(relX * 6);
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      frameIndexRef.current = -1;
      drawFrame(Math.floor(frameProxy.t * (FRAME_COUNT - 1)));
    };
    window.addEventListener("resize", onResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <section ref={outerRef} className={styles.outer}>
    <div ref={sectionRef} className={styles.pin}>
      <div ref={imgBoxRef} className={styles.imgBox}>
        <div ref={rasterRef} className={styles.raster}>
          <Image
            src="/images/fort-cutout-x.png"
            alt=""
            aria-hidden="true"
            fill
            sizes="82vw"
            unoptimized
            priority={false}
          />
        </div>
        {/* This photo has no baked-in "X" to zoom into (that was the old
            image's actual problem — a raster glyph pixelating under zoom).
            This mark is vector from the first frame and sits over an open,
            empty patch of the photo (the gap between the two fort halves),
            so it scales into the whiteout without ever going soft. */}
        <svg
          ref={xMarkRef}
          className={styles.xMark}
          viewBox="0 0 142 197"
          shapeRendering="geometricPrecision"
          aria-hidden="true"
        >
          <path
            d="M 47.378 67.608 L 52.397 95.216 46.186 125.858 C 42.770 142.711, 39.981 156.838, 39.988 157.250 C 39.994 157.662, 45.352 158, 51.893 158 L 63.786 158 64.786 152.250 C 65.335 149.088, 67.055 138.850, 68.608 129.500 L 71.431 112.500 75.143 135 C 77.184 147.375, 78.887 157.613, 78.927 157.750 C 78.967 157.887, 84.430 158, 91.067 158 C 102.090 158, 103.090 157.848, 102.619 156.250 C 102.336 155.287, 99.407 141.216, 96.110 124.980 L 90.117 95.461 95.058 68.585 C 97.776 53.803, 100 41.324, 100 40.854 C 100 40.384, 94.845 40, 88.545 40 L 77.091 40 76.551 43.250 C 76.255 45.038, 75.076 53.696, 73.932 62.491 C 72.788 71.285, 71.755 78.579, 71.635 78.698 C 71.516 78.817, 70.120 70.159, 68.532 59.457 L 65.645 40 54.002 40 L 42.358 40 47.378 67.608"
            fill="#fff"
            fillRule="evenodd"
          />
        </svg>
      </div>
      {/* Locked to the frame sequence's own 16:9 ratio so the draw()
          letterbox math below always ends up with zero letterboxing, and
          so the text overlay can be positioned with plain percentages
          that line up with the fort halves in every frame. */}
      <div className={styles.frameBox}>
      <div className={styles.frameInner}>
        <canvas ref={canvasRef} className={styles.canvas} />
        <div ref={aboutRef} className={styles.aboutText}>
          ABOUT
        </div>
        <div ref={ethosRef} className={styles.ethosText}>
          इथोस
        </div>
        <p ref={paraRef} className={styles.paraText}>
          ETHOS 2026, a global student consultation forum hosted by The
          Scindia School in collaboration with the UNESCO Student &amp;
          Youth Network, brings together young voices to contribute to the
          future of education under Sustainable Development Goal&nbsp;4
          (Quality Education). Through structured dialogue, policy
          consultations and interdisciplinary engagement, delegates will
          participate in UNESCO&rsquo;s Global Youth Consultation for the
          Post-2030 Education and Learning Agenda. This ensures that youth
          perspectives help shape the future of learning. The
          summit&rsquo;s outcomes will form part of an official
          consultation report contributing to UNESCO&rsquo;s global
          survey, with reflections informing the 2027 Global Education
          Meeting. ETHOS is more than a conference; it is The Scindia
          School&rsquo;s commitment to placing young people at the heart
          of global educational discourse. It empowers them to think
          critically, engage meaningfully and help define education
          beyond 2030.
        </p>
      </div>
      </div>

      <div ref={panelRef} className={styles.panel}>
        <Image
          src="/images/save-the-date-bg.png"
          alt=""
          aria-hidden="true"
          fill
          className={styles.panelBg}
        />
        <div ref={panelContentRef} className={styles.panelContent}>
          <span ref={eyebrowRef} className={styles.eyebrow}>
            <span ref={eyebrowFloatRef} className={styles.eyebrowFloat}>
              Save the Date
            </span>
          </span>
          <div className={styles.wheels}>
            <Wheel items={MONTHS} listRef={monthsRef} highlightRef={monthsHiRef} />
            <Wheel items={DAYS} listRef={daysRef} highlightRef={daysHiRef} />
          </div>
        </div>
      </div>
      <div ref={riseRef} className={styles.rise}>
        <Image
          src="/images/mission-bg.png"
          alt=""
          aria-hidden="true"
          fill
          className={styles.riseImage}
        />
        <div className={styles.riseScrim} />
      </div>
    </div>
    </section>
  );
}
