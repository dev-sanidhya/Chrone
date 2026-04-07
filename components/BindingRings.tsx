interface BindingRingsProps {
  primaryColor: string;
}

export default function BindingRings({ primaryColor }: BindingRingsProps) {
  return (
    <div className="relative z-20 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 pb-2 pt-4">
      <div className="pointer-events-none absolute left-1/2 top-0 h-5 w-24 -translate-x-1/2 rounded-b-[1.4rem] border-x border-b border-zinc-600 bg-zinc-900/65" />
      <div className="flex items-center justify-center gap-5 py-2.5 sm:gap-7">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="relative flex items-center justify-center">
            <div
              className="h-5 w-5 rounded-full border-[3px] shadow-inner sm:h-6 sm:w-6"
              style={{
                borderColor: i % 4 === 0 ? primaryColor : i % 4 === 2 ? '#d1d5db' : '#9ca3af',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.15)',
              }}
            />
            <div className="absolute h-2.5 w-2.5 rounded-full bg-zinc-900 sm:h-3 sm:w-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
