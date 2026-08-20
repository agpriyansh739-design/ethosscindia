import { Fraunces, Inter, Rozha_One, Anton, Yatra_One } from "next/font/google";
import localFont from "next/font/local";
import SmoothScroll from "./components/SmoothScroll";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const devanagari = Rozha_One({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  weight: "400",
  display: "swap",
});

const anton = Anton({
  subsets: ["latin"],
  variable: "--font-anton",
  weight: "400",
  display: "swap",
});

// Separate from --font-devanagari (Rozha One, used by Hero's subtitle)
// so this doesn't also change that — a more decorative/brush-feeling
// Devanagari face for the CloudTransition wordmark specifically.
const devanagariScript = Yatra_One({
  subsets: ["devanagari"],
  variable: "--font-devanagari-script",
  weight: "400",
  display: "swap",
});

// Personal-use license only — see app/fonts/ for the Readme. Do not ship
// this to a public/commercial deployment without buying a Corporate
// License from creatypestudio.co/brittany first.
const script = localFont({
  src: "./fonts/BrittanySignatureScript.ttf",
  variable: "--font-script",
  display: "swap",
});

// Also personal-use only (MrLetters/Belinda Script) — commercial rights
// need to be purchased separately before a public/commercial launch.
const scriptAlt = localFont({
  src: "./fonts/BelindaScript.ttf",
  variable: "--font-script-alt",
  display: "swap",
});

// Switzer (Swiss Typefaces, via Fontshare) — free for personal & commercial use.
const switzer = localFont({
  src: "./fonts/Switzer-Extrabold.otf",
  variable: "--font-switzer",
  weight: "800",
  display: "swap",
});

// Personal-use only (RGB Studio/Tempting) — see the author's note bundled
// with the download. Buy a commercial license before a public launch.
const tempting = localFont({
  src: "./fonts/Tempting.otf",
  variable: "--font-tempting",
  display: "swap",
});

// Personal-use only (1001Fonts FFP license) — commercial use needs
// written permission from the author before a public/commercial launch.
const shivaraja = localFont({
  src: "./fonts/Shivaraja.ttf",
  variable: "--font-shivaraja",
  display: "swap",
});

export const metadata = {
  // Required for Open Graph and Twitter images to resolve to absolute
  // URLs — without it those tags are emitted as relative paths, which
  // most social platforms and crawlers refuse to fetch.
  metadataBase: new URL("https://ethosscindia.com"),

  title: {
    // Sub-pages set only their own name and inherit the suffix, so every
    // tab and search result stays branded without repeating it by hand.
    default: "ETHOS 2026 — SDG 4 Summit | The Scindia School × UNESCO",
    template: "%s | ETHOS 2026",
  },

  // Written to survive Google's ~155-character truncation: the who, what
  // and why land in the first sentence, because everything after it may
  // be cut. The previous description was a single generic clause, which
  // is part of why Google substituted body copy from the page instead.
  description:
    "ETHOS 2026 is a global student consultation forum hosted by The Scindia School, Gwalior, with the UNESCO Student & Youth Network. Six Policy Labs. 11–18 year olds shaping the future of education under SDG 4.",

  keywords: [
    "ETHOS 2026",
    "ETHOS Scindia",
    "The Scindia School",
    "UNESCO",
    "SDG 4",
    "Quality Education",
    "student consultation forum",
    "Policy Labs",
    "Gwalior",
    "youth summit",
    "Model UN",
  ],

  applicationName: "ETHOS 2026",
  authors: [{ name: "The Scindia School" }],
  creator: "The Scindia School",
  publisher: "The Scindia School",
  alternates: { canonical: "/" },

  openGraph: {
    type: "website",
    siteName: "ETHOS 2026",
    url: "https://ethosscindia.com",
    title: "ETHOS 2026 — SDG 4 Summit | The Scindia School × UNESCO",
    description:
      "A global student consultation forum on the future of education. Six Policy Labs, delegates aged 11–18, in collaboration with the UNESCO Student & Youth Network.",
    locale: "en_IN",
  },

  twitter: {
    card: "summary_large_image",
    title: "ETHOS 2026 — SDG 4 Summit",
    description:
      "A global student consultation forum on the future of education, hosted by The Scindia School with the UNESCO Student & Youth Network.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Lets Google show a full-size preview image and a longer snippet
      // rather than defaulting to a clipped one.
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${script.variable} ${scriptAlt.variable} ${devanagari.variable} ${anton.variable} ${devanagariScript.variable} ${switzer.variable} ${tempting.variable} ${shivaraja.variable}`}
    >
      <body>
        {/* Structured data. This is how Google associates a name and a
            logo with the domain rather than treating it as an unknown
            site — the favicon alone only covers the small icon beside
            the URL. Kept to facts that are certain: no event dates here,
            because incorrect structured data is penalised, and the
            summit's dates are not something to guess at. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://ethosscindia.com/#organization",
                  name: "ETHOS 2026",
                  alternateName: "ETHOS — SDG 4 Summit",
                  url: "https://ethosscindia.com",
                  logo: "https://ethosscindia.com/icon.png",
                  parentOrganization: {
                    "@type": "EducationalOrganization",
                    name: "The Scindia School",
                    address: {
                      "@type": "PostalAddress",
                      addressLocality: "Gwalior",
                      addressRegion: "Madhya Pradesh",
                      addressCountry: "IN",
                    },
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://ethosscindia.com/#website",
                  url: "https://ethosscindia.com",
                  name: "ETHOS 2026",
                  description:
                    "A global student consultation forum on the future of education under SDG 4, hosted by The Scindia School with the UNESCO Student & Youth Network.",
                  publisher: { "@id": "https://ethosscindia.com/#organization" },
                  inLanguage: "en-IN",
                },
              ],
            }),
          }}
        />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
