type BrandLogoProps = {
  compact?: boolean;
  className?: string;
};

export default function BrandLogo({ compact = false, className = "" }: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 64 64" aria-hidden="true" className="size-12 shrink-0">
        <rect x="1" y="1" width="62" height="62" rx="17" fill="#0A2038" stroke="#C9A227" strokeWidth="2" />
        <path d="M14 47 29.5 15h5L50 47h-7.6l-3.1-7H24.7l-3.1 7H14Zm13.5-13.2h9L32 23.5l-4.5 10.3Z" fill="#E7C55E" />
        <path d="M36.2 25.7h7.3c5.1 0 8.5 2.8 8.5 7.1 0 3.1-1.8 5.4-4.8 6.4L53 47h-8.1l-6.6-9.6h4.4c1.8 0 2.9-1 2.9-2.5 0-1.6-1.1-2.5-2.9-2.5h-6.5v-6.7Z" fill="#F8F6EF" />
      </svg>
      {!compact && (
        <span className="leading-none">
          <span className="block font-[var(--font-heading)] text-[1.35rem] font-semibold tracking-[0.16em] text-white">ASHER</span>
          <span className="mt-1.5 block text-[0.58rem] font-semibold tracking-[0.42em] text-[#e4c462]">REALTY</span>
        </span>
      )}
    </span>
  );
}
