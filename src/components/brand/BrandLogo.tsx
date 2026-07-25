import Image from "next/image";

type BrandLogoProps = {
  compact?: boolean;
  className?: string;
};

export default function BrandLogo({
  compact = false,
  className = "",
}: BrandLogoProps) {
  if (compact) {
    return (
      <span className={`relative block size-12 ${className}`}>
        <Image
          src="/brand/asher-mark.png"
          alt="Asher Realty"
          fill
          priority
          className="object-contain"
          sizes="48px"
        />
      </span>
    );
  }

  return (
    <span className={`relative block h-14 w-[190px] sm:w-[220px] ${className}`}>
      <Image
        src="/brand/asher-logo-horizontal.png"
        alt="Asher Realty — Find Better. Invest Smarter."
        fill
        priority
        className="object-contain object-left"
        sizes="(max-width: 640px) 190px, 220px"
      />
    </span>
  );
}
