import Image from "next/image";

const LOGO_W = 480;
const LOGO_H = 368;

export function BrandMark({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const width = Math.round((size * LOGO_W) / LOGO_H);
  return (
    <Image
      src="/logo.png"
      alt="EducAll"
      width={width}
      height={size}
      priority
      className={className}
    />
  );
}
