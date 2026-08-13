import Link from "next/link";
import styles from "./TopNav.module.css";

export default function TopNav({ current = "home" }) {
  return (
    <nav className={styles.nav}>
      <a href="#">Knowledge Hub</a>
      <a href="#">Policy Labs</a>
      {current === "fort-biosphere" ? (
        <Link href="/" className={styles.brand}>
          ETHOS&rsquo;26
        </Link>
      ) : (
        <Link href="/fort-biosphere">Fort Biosphere</Link>
      )}
      <a href="#">Secretariat</a>
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
