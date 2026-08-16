"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./TopNav.module.css";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSe0Nq2A9PsPfT5Cl1FRtE40mPdOklA-djsQW9gyqGmDVIMT4A/viewform?usp=publish-editor";

// Built as data rather than inline JSX so the desktop row and the mobile
// menu render from one source — the two can't drift apart. Ordering is
// unchanged: on either sub-page the brand/home link takes the middle
// slot, followed by a link to the OTHER sub-page.
function buildItems(current) {
  const items = [
    { label: "Knowledge Hub", href: "#" },
    { label: "Policy Labs", href: "#" },
  ];

  if (current === "home") {
    items.push({ label: "Fort Biosphere", href: "/fort-biosphere" });
    items.push({ label: "Secretariat", href: "/secretariat" });
  } else {
    items.push({ label: "Ethos’26", href: "/", brand: true });
    items.push(
      current === "fort-biosphere"
        ? { label: "Secretariat", href: "/secretariat" }
        : { label: "Fort Biosphere", href: "/fort-biosphere" }
    );
  }

  items.push({ label: "Registration", href: FORM_URL, external: true });
  return items;
}

function NavLink({ item, className, onClick }) {
  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {item.label}
      </a>
    );
  }
  if (item.href === "#") {
    return (
      <a href="#" className={className} onClick={onClick}>
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} className={className} onClick={onClick}>
      {item.label}
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
          {items.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              className={styles.sheetLink}
              onClick={() => setOpen(false)}
            />
          ))}
        </div>
      )}
    </>
  );
}
