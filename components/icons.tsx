// Lightweight inline SVG icon set — no external icon dependency required.
// All icons inherit `currentColor` and accept standard SVG props.

import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SparkleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l1.8 4.9L18.7 9.7 13.8 11.5 12 16.4 10.2 11.5 5.3 9.7 10.2 7.9 12 3z" />
      <path d="M19 14l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9z" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19" />
      <circle cx="10" cy="8" r="3.2" />
      <path d="M20 19v-1.4a3.5 3.5 0 0 0-2.6-3.4" />
      <path d="M15.5 5.2a3.2 3.2 0 0 1 0 6" />
    </svg>
  );
}

export function InboxIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 13l2.5-7h11L20 13" />
      <path d="M4 13v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5" />
      <path d="M4 13h4l1.5 2.5h5L16 13h4" />
    </svg>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4" />
      <path d="M12 16.5h.01" />
    </svg>
  );
}

export function PulseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12h3l2-6 4 12 2-6h7" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12.5 10 17 19 7" />
    </svg>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5 11 15l4.5-5.5" />
    </svg>
  );
}

export function BrainIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 4.5A2.5 2.5 0 0 0 6.5 7 2.5 2.5 0 0 0 5 12a2.5 2.5 0 0 0 1.5 4.6A2.5 2.5 0 0 0 11 18V6a1.5 1.5 0 0 0-2-1.5z" />
      <path d="M15 4.5A2.5 2.5 0 0 1 17.5 7 2.5 2.5 0 0 1 19 12a2.5 2.5 0 0 1-1.5 4.6A2.5 2.5 0 0 1 13 18V6a1.5 1.5 0 0 1 2-1.5z" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H18a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 0 4 21.5z" />
      <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H19" />
    </svg>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function LightbulbIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.5 1 .5 1.6V16h6v-.5c0-.6 0-1.2.5-1.6A6 6 0 0 0 12 3z" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z" />
      <path d="M9.5 12 11 13.5 14.5 10" />
    </svg>
  );
}

export function LayersIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m12 3 9 5-9 5-9-5 9-5z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  );
}

export function GraduationIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m12 4 10 4-10 4L2 8l10-4z" />
      <path d="M6 10v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4" />
    </svg>
  );
}
