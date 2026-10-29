import type { Metadata, Viewport } from "next";
import { Jost } from "next/font/google";
import { MarcoApps } from "@/features/apps/MarcoApps";
import { ProveedorPWA } from "@/ui/ProveedorPWA";
import { SCRIPT_TEMA } from "@/ui/temaScript";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "AcorDesk", template: "%s · AcorDesk" },
  description: "Acordes, ensayos y conocimiento musical.",
  applicationName: "AcorDesk",
  appleWebApp: { capable: true, title: "AcorDesk", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#141311",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={jost.variable} suppressHydrationWarning>
      <head>
        {/* Aplica el tema guardado antes del primer pintado, para que no parpadee. */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body>
        <ProveedorPWA>
          <MarcoApps>{children}</MarcoApps>
        </ProveedorPWA>
      </body>
    </html>
  );
}
