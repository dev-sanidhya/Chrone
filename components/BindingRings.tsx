interface BindingRingsProps {
  primaryColor: string;
}

export default function BindingRings({ primaryColor }: BindingRingsProps) {
  return (
    <div className="flex items-center justify-center gap-5 sm:gap-7 py-2.5 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 relative z-20">
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={i} className="relative flex items-center justify-center">
          {/* Outer ring */}
          <div
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-[3px] shadow-inner"
            style={{
              borderColor: i % 4 === 0 ? primaryColor : i % 4 === 2 ? '#d1d5db' : '#9ca3af',
              boxShadow: `inset 0 1px 3px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.15)`,
            }}
          />
          {/* Inner hole */}
          <div className="absolute w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-zinc-900" />
        </div>
      ))}
    </div>
  );
}
