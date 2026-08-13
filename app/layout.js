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

export const metadata = {
  title: "ETHOS — SDG 4 Summit",
  description:
    "ETHOS is a summit on SDG 4: Quality Education, organized in collaboration with UNESCO.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${script.variable} ${scriptAlt.variable} ${devanagari.variable} ${anton.variable} ${devanagariScript.variable}`}
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
