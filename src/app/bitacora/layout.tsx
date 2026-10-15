import { Suspense } from "react";
import { Marco } from "@/features/bitacora/marco/Marco";

export default function LayoutBitacora({ children }: LayoutProps<"/bitacora">) {
  return (
    <Marco>
      {/* Las pantallas leen ?id= con useSearchParams, que exige un Suspense para el build estático. */}
      <Suspense>{children}</Suspense>
    </Marco>
  );
}
