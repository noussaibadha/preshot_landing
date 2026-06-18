// Colored lights, sampled directly from the Figma background. They are anchored
// at the bottom (y ≈ 105%) and fade upward to transparent so the top stays black.
// Split across two layers that drift in opposite directions for a living shimmer.
const lightsBlue =
  'radial-gradient(58% 62% at 15% 106%, rgba(56,86,247,0.95) 0%, rgba(56,86,247,0) 62%),' +
  'radial-gradient(46% 56% at 25% 110%, rgba(100,98,254,0.85) 0%, rgba(100,98,254,0) 58%),' +
  'radial-gradient(40% 52% at 33% 112%, rgba(112,84,251,0.8) 0%, rgba(112,84,251,0) 55%)'

const lightsViolet =
  'radial-gradient(48% 60% at 42% 108%, rgba(152,65,252,0.92) 0%, rgba(152,65,252,0) 60%),' +
  'radial-gradient(40% 54% at 53% 111%, rgba(109,46,238,0.82) 0%, rgba(109,46,238,0) 56%),' +
  'radial-gradient(30% 50% at 90% 113%, rgba(67,42,144,0.85) 0%, rgba(67,42,144,0) 55%)'

export function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-black">
      {/* Colored lights (drifting) */}
      <div
        className="absolute inset-0 pointer-events-none animate-light-a"
        style={{ backgroundImage: lightsBlue }}
      />
      <div
        className="absolute inset-0 pointer-events-none animate-light-b"
        style={{ backgroundImage: lightsViolet }}
      />

      {/* Crisp vertical glass columns on top of the lights */}
      <div className="absolute inset-0 pointer-events-none hero-columns mix-blend-overlay" />

      {/* Headline */}
      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <h1 className="text-center font-medium text-white leading-[1.02] tracking-tight text-[clamp(2.75rem,11vw,8rem)]">
          Savoir douter,
          <br />
          Mieux naviguer
        </h1>
      </div>

      {/* Scroll-down arrow */}
      <a
        href="#features"
        aria-label="Faire défiler vers les fonctionnalités"
        className="absolute left-1/2 -translate-x-1/2 bottom-[18%] z-10 flex items-center justify-center w-[64px] h-[64px] rounded-full bg-black/40 backdrop-blur-sm text-white animate-bounce-slow hover:bg-black/60 transition-colors"
      >
        <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  )
}
