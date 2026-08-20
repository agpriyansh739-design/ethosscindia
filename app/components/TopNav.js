"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./TopNav.module.css";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSe0Nq2A9PsPfT5Cl1FRtE40mPdOklA-djsQW9gyqGmDVIMT4A/viewform?usp=publish-editor";

// Built as data rather than inline JSX so the desktop row and the mobile
// menu render from one source — the two can't drift apart. In the bar the
// wordmark is branding; in the mobile menu it reads "Home", where the
// wordmark alone would be an ambiguous item in a list.
const BRAND = {
  key: "home",
  label: "Ethos’26",
  sheetLabel: "Home",
  href: "/",
  brand: true,
};

const KNOWLEDGE_HUB = { key: "knowledge-hub", label: "Knowledge Hub", href: "#" };
const REGISTRATION = {
  key: "registration",
  label: "Registration",
  href: FORM_URL,
  external: true,
};

const SUB_PAGES = [
  { key: "policy-labs", label: "Policy Labs", href: "/policy-labs" },
  { key: "fort-biosphere", label: "Fort Biosphere", href: "/fort-biosphere" },
  { key: "secretariat", label: "Secretariat", href: "/secretariat" },
];

// Always five slots. On a sub-page that page gives up its own entry to
// the wordmark, which is placed in the MIDDLE slot on every page so the
// brand sits centred in the bar rather than drifting position depending
// on which page you happen to be on.
function buildItems(current) {
  if (current === "home") {
    return [KNOWLEDGE_HUB, ...SUB_PAGES, REGISTRATION];
  }

  const others = SUB_PAGES.filter((p) => p.key !== current);
  return [KNOWLEDGE_HUB, others[0], BRAND, others[1], REGISTRATION];
}

function NavLink({ item, className, onClick, inSheet = false }) {
  const label = inSheet && item.sheetLabel ? item.sheetLabel : item.label;

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {label}
      </a>
    );
  }
  if (item.href === "#") {
    return (
      <a href="#" className={className} onClick={onClick}>
        {label}
      </a>
    );
  }
  return (
    <Link href={item.href} className={className} onClick={onClick}>
      {label}
    </Link>
  );
}

export default function TopNav({ current = "home" }) {
  const [open, setOpen] = useState(false);
  const items = buildItems(current);

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.links}>
          {items.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              className={item.brand ? styles.brand : undefined}
            />
          ))}
        </div>

        {/* Five nowrap items cannot fit a phone width, so below the
            breakpoint the row is replaced by this toggle. */}
        <button
          type="button"
          className={styles.toggle}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`${styles.bar} ${open ? styles.barTop : ""}`} />
          <span className={`${styles.bar} ${open ? styles.barMid : ""}`} />
          <span className={`${styles.bar} ${open ? styles.barBot : ""}`} />
        </button>
      </nav>

      {open && (
        <div className={styles.sheet}>
          {/* The sheet sits above the nav bar, so the bar's own toggle is
              covered while the menu is open — this is the way back out. */}
          <button
            type="button"
            className={styles.sheetBack}
            onClick={() => setOpen(false)}
          >
            <span aria-hidden="true">&larr;</span> Back
          </button>

          <div className={styles.sheetLinks}>
            {items.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                inSheet
                className={styles.sheetLink}
                onClick={() => setOpen(false)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
