'use client'

import { useState, type ReactNode } from 'react'

type Feature = {
  title: ReactNode
  /** Title shown on the white back face. */
  backTitle: ReactNode
  description: string
  /** Icon path (in /public/icons). */
  icon: string
  /** Set when the SVG already includes its own badge (square + border). */
  selfContained?: boolean
}

const features: Feature[] = [
  {
    title: 'Parrainage',
    backTitle: 'Parrainage',
    description:
      "Invitez vos amis et vos proches grâce à un lien d'invitation pour créer une communauté et les inviter à se renseigner avant d'acheter.",
    icon: '/icons/parrainage.svg',
    selfContained: true,
  },
  {
    title: (
      <>
        Newsletter
        <br />
        mensuelle
      </>
    ),
    backTitle: (
      <>
        Newsletter
        <br />
        mensuelle
      </>
    ),
    description:
      "Recevez une newsletter chaque mois avec un résumé de votre utilisation de Preshot ainsi que les dernières avancées en termes de vérification de sites web.",
    icon: '/icons/newsletter.svg',
  },
  {
    title: (
      <>
        Historique
        <br />
        de vérification
      </>
    ),
    backTitle: (
      <>
        Historique
        <br />
        des vérifications
      </>
    ),
    description:
      "Avec notre offre premium, gardez une trace de la vérification de tous les sites sur lesquels vous avez effectué un paiement. Plus besoin d'un diagnostic sur les sites déjà visités !",
    icon: '/icons/historique.svg',
  },
  {
    title: (
      <>
        Détection de
        <br />
        dark patterns
      </>
    ),
    backTitle: (
      <>
        Détection des
        <br />
        dark patterns
      </>
    ),
    description:
      "Notre outil analyse le contenu d'une page à la recherche d'interfaces ou d'éléments manipulateurs et vous en informe le cas échéant.",
    icon: '/icons/dark-patterns.svg',
  },
]

/** Shared gradient background (color blobs + vertical glass sheen), reused on
 *  both faces so the back shows the same design through its padding frame. */
function CardBackground() {
  return (
    <>
      {/* color blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-10 bottom-0 h-52 w-52 rounded-full bg-violet/50 blur-3xl" />
        <div className="absolute right-0 top-0 h-60 w-60 rounded-full bg-blue-accent/40 blur-3xl" />
        <div className="absolute right-6 bottom-10 h-48 w-48 rounded-full bg-violet-light/40 blur-3xl" />
      </div>
      {/* vertical glass sheen (slats of 86.5px, like Figma) */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-70"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0px, rgba(0,0,0,0.3) 65.8px, rgba(255,255,255,0.3) 86.5px)',
        }}
      />
    </>
  )
}

function Card({ feature }: { feature: Feature }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <button
      type="button"
      aria-pressed={flipped}
      onClick={() => setFlipped((f) => !f)}
      className={`flip-card h-[468px] w-[346px] cursor-pointer text-left ${flipped ? 'is-flipped' : ''}`}
    >
      <div className="flip-inner">
        {/* Front */}
        <div className="flip-face bg-black">
          <CardBackground />

          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-12 px-6 text-center">
            {feature.selfContained ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={feature.icon} alt="" className="h-[100px] w-[100px]" />
            ) : (
              <div className="flex h-[100px] w-[100px] items-center justify-center rounded-[20px] border border-white bg-icon-bg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={feature.icon} alt="" className="h-[60px] w-[60px]" />
              </div>
            )}
            <h3 className="text-3xl font-semibold leading-tight tracking-tight text-white">
              {feature.title}
            </h3>
          </div>
        </div>

        {/* Back: same gradient design as the front, with a white inner panel
            inset by padding (25/33px like Figma) so the design frames it. */}
        <div className="flip-face flip-back bg-black">
          <CardBackground />

          <div className="relative z-10 flex h-full items-stretch px-[25px] py-[33px]">
            <div className="flex w-full flex-col overflow-hidden rounded-[20px] bg-white px-6 pb-12 pt-12 text-black">
              <h3 className="text-center text-2xl font-semibold leading-tight tracking-tight">
                {feature.backTitle}
              </h3>
              <p className="mt-auto text-base font-medium leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}

export function Features() {
  return (
    <section id="features" className="py-24 px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Section title */}
        <h2 className="mb-16 text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          Un ensemble de fonctionnalité
          <br />
          <span className="text-white/70">pour une navigation simplifiée</span>
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2">
          {features.map((f, i) => (
            <Card key={i} feature={f} />
          ))}
        </div>
      </div>
    </section>
  )
}
