import Link from "next/link";
import styles from "./TopNav.module.css";

export default function TopNav({ current = "home" }) {
  return (
    <nav className={styles.nav}>
      <a href="#">Knowledge Hub</a>
      <a href="#">Policy Labs</a>
      {/* On either sub-page, the brand/home link sits first, followed
          by a link to the OTHER sub-page — Secretariat's own ordering
          stays as it already was; Fort Biosphere's was swapped so the
          brand link leads there too, matching Secretariat's layout. */}
      {current === "secretariat" || current === "fort-biosphere" ? (
        <Link href="/" className={styles.brand}>
          Ethos&rsquo;26
        </Link>
      ) : (
        <Link href="/fort-biosphere">Fort Biosphere</Link>
      )}
      {current === "fort-biosphere" ? (
        <Link href="/secretariat">Secretariat</Link>
      ) : current === "secretariat" ? (
        <Link href="/fort-biosphere">Fort Biosphere</Link>
      ) : (
        <Link href="/secretariat">Secretariat</Link>
      )}
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSe0Nq2A9PsPfT5Cl1FRtE40mPdOklA-djsQW9gyqGmDVIMT4A/viewform?usp=publish-editor"
        target="_blank"
        rel="noopener noreferrer"
      >
        Registration
      </a>
    </nav>
  );
}
