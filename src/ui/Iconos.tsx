// Íconos geométricos de trazo grueso, en currentColor.

interface Props {
  tamano?: number;
  className?: string;
}

const base = (tamano: number, className?: string) => ({
  viewBox: "0 0 24 24",
  width: tamano,
  height: tamano,
  className,
  "aria-hidden": true as const,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.75,
});

export function IconoAjustes({ tamano = 22, className }: Props) {
  return (
    <svg {...base(tamano, className)}>
      <path d="M2 6h20M2 12h20M2 18h20" />
      <rect x="13" y="3.5" width="5" height="5" fill="currentColor" stroke="none" />
      <rect x="5" y="9.5" width="5" height="5" fill="currentColor" stroke="none" />
      <rect x="15" y="15.5" width="5" height="5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconoCerrar({ tamano = 20, className }: Props) {
  return (
    <svg {...base(tamano, className)}>
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  );
}

export function IconoVolver({ tamano = 20, className }: Props) {
  return (
    <svg {...base(tamano, className)}>
      <path d="M3 12h19" />
      <path d="M10 4.5L2.5 12l7.5 7.5" fill="none" />
    </svg>
  );
}

export function IconoMas({ tamano = 24, className }: Props) {
  return (
    <svg {...base(tamano, className)} strokeWidth={3.5}>
      <path d="M12 2.5v19M2.5 12h19" />
    </svg>
  );
}

export function IconoFlecha({ tamano = 18, className }: Props) {
  return (
    <svg {...base(tamano, className)}>
      <path d="M2 12h19" />
      <path d="M14 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}
