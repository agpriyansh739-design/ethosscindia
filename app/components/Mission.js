"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Mission.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Mission() {
  const sectionRef = useRef(null);
  const statementRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // The heading stays fully visible the whole time (no hidden-state
      // fade, to avoid the earlier flicker at the CloudTransition
      // handoff) but still shifts position as you scroll — scrubbed
      // directly to scroll progress, it slides up from below into its
      // resting spot rather than just sitting there static.
      gsap.fromTo(
        statementRef.current,
        { y: 70 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top 35%",
            scrub: true,
          },
        }
      );

      // Reading spotlight: instead of one group fade-in, each paragraph
      // sits dim until it actually enters the reading band, then scrubs
      // up to full brightness as it passes through — tied directly to
      // scroll position, not a one-shot trigger. Makes a long, dense
      // article feel like it's being revealed as you read rather than
      // dumped on screen all at once.
      const items = gsap.utils.toArray(bodyRef.current.children);
      items.forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0.18, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              end: "top 48%",
              scrub: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.bgSticky}>
        <Image
          src="/images/mission-bg.png"
          alt=""
          aria-hidden="true"
          fill
          className={styles.bgImage}
        />
        <div className={styles.bgScrim} />
      </div>
      <div className={`container ${styles.content}`}>
        <h2 ref={statementRef} className={styles.statement}>
          BEYOND 2030: Reimagining the future of education in a changing
          world
        </h2>
        <div ref={bodyRef} className={styles.body}>
          <p>
            In 2015, the international community committed to the 2030
            Agenda for Sustainable Development, including the Sustainable
            Development Goal 4 (SDG&nbsp;4) to ensure inclusive and
            equitable quality education and promote lifelong learning
            opportunities for all. Since then, governments, non-state
            actors and education stakeholders worldwide have worked to
            advance this shared ambition.
          </p>
          <p>
            Yet, evidence from the 2026 Global Education Monitoring Report
            shows that progress toward SDG&nbsp;4 remains uneven and
            increasingly fragile. Gains in access have slowed, learning
            outcomes remain critically low, inequalities by income,
            geography and gender persist, financing gaps are widening, and
            the out-of-school population has risen for a seventh year in a
            row, reaching an estimated 273 million children and youth.
          </p>
          <p>
            As the 2030 horizon approaches, education systems face not
            only persistent SDG&nbsp;4 challenges, but also accelerating
            global shifts, including climate and environmental pressures,
            rising inequalities and polarization, technological
            transformation and threats to peace and democracy.
          </p>
          <p>
            Together these realities call for a renewed reflection on the
            priorities and directions of education beyond 2030 — education
            that equips every person not only to navigate a changing world
            but also to actively contribute to more just, peaceful and
            sustainable futures.
          </p>

          <h3 className={styles.subheading}>The Global Consultations</h3>

          <p>
            The SDG&nbsp;4 High-Level Steering Committee (HLSC) launched a
            three-year global consultation process (January 2026 to
            December 2028) to identify the priorities for education after
            the 2030 Agenda. The decision was taken in the context of the
            10th anniversary of the 2030 Agenda, building on the
            commitments of the Fortaleza Declaration of the 2024 Global
            Education Meeting (GEM).
          </p>
          <p>
            This consultation process seeks to identify and build
            consensus around education priorities (&ldquo;what&rdquo;) and
            strategies (&ldquo;how&rdquo;) beyond 2030, ensuring that the
            proposed agenda is holistic and responsive to global and local
            realities. Upholding education as a fundamental human right,
            and inclusion and equity as the cornerstone of the post-2030
            education agenda, the consultation aims to prioritize the
            inclusion of marginalized and underrepresented voices.
          </p>
          <p>
            The ongoing Phase&nbsp;1 consists of the foresight exercise and
            a global youth and student consultation. These first work
            streams will result in a working paper Global Education
            Futures Outlook Beyond 2030 and the Youth Agenda on Education
            Beyond 2030, respectively, to be presented at the 2027 Global
            Education Meeting.
          </p>
          <p>
            The 2027 Global Education Meeting will kick off the Phase&nbsp;2
            consultations (regional, national and stakeholder groups),
            engaging governments, civil society, teachers, youth and many
            other education actors.
          </p>
          <p>
            Contributions from all consultations will be synthesized into
            a consolidated framework (Phase&nbsp;3), to inform the United
            Nations about inter-governmental discussions on the post-2030
            development agenda.
          </p>
        </div>
      </div>
    </section>
  );
}
