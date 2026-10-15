import type { Metadata, Viewport } from "next";
import { Jost } from "next/font/google";
import { SCRIPT_TEMA } from "@/ui/temaScript";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Bitácora de viaje", template: "%s · Bitácora de viaje" },
  description: "Registro de ensayos y conocimiento musical.",
  applicationName: "Bitácora de viaje",
  appleWebApp: { capable: true, title: "Bitácora", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f1e9d8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={jost.variable} suppressHydrationWarning>
      <head>
        {/* Aplica el tema guardado antes del primer pintado, para que no parpadee. */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
