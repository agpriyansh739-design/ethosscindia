import PolicyLabs from "../components/PolicyLabs";

export const metadata = {
  // The "| ETHOS 2026" suffix comes from the root layout's title template.
  title: "Policy Labs",
  description:
    "The six Policy Labs of ETHOS 2026 — the summit's committees, split across a junior section (ages 11–14) and a senior section (ages 15–18).",
};

export default function PolicyLabsPage() {
  return (
    <main>
      <PolicyLabs />
    </main>
  );
}
