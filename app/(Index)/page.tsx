import { Button } from "@/components/ui/button"
import { ArrowRight, Quote } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-mono text-foreground selection:bg-secondary selection:text-secondary-foreground">
      {/* 
        HERO SECTION - The Front Cover
        Neobrutalist thick borders, hard box-shadows, editorial serif typography.
      */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-16">
        <div className="flex flex-col border-4 border-primary shadow-[8px_8px_0px_0px_var(--color-primary)] md:flex-row dark:shadow-[8px_8px_0px_0px_var(--color-primary)]">
          {/* Left Block - Text */}
          <div className="flex flex-1 flex-col justify-between border-b-4 border-primary bg-background p-8 md:border-r-4 md:border-b-0 md:p-12">
            <div>
              <div className="mb-12 inline-block border-2 border-primary bg-secondary px-3 py-1 text-xs font-bold tracking-widest text-secondary-foreground uppercase">
                Vol. 1 // The Adaptation
              </div>

              <h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-primary md:text-6xl lg:text-[5rem]">
                The miles <br />
                change you. <br />
                <span className="font-serif text-muted-foreground italic">
                  The plan should too.
                </span>
              </h1>
            </div>

            <div className="mt-16 space-y-8">
              <p className="max-w-md text-lg leading-relaxed text-foreground">
                Running is a fluid narrative, not a rigid 16-week spreadsheet.
                When you slept terribly, or when you feel like flying, a static
                PDF cannot hear you.
              </p>

              <Button
                size="lg"
                className="group h-16 w-full border-2 border-primary bg-primary text-base font-bold tracking-widest text-primary-foreground uppercase shadow-[6px_6px_0px_0px_var(--color-secondary)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_var(--color-secondary)] sm:w-auto sm:px-12"
                asChild
              >
                <Link href="/plan">
                  Connect Strava{" "}
                  <ArrowRight className="ml-4 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Block - Image */}
          <div className="relative flex-1 bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&q=80&w=1000"
              alt="Runner in the early morning"
              className="h-full min-h-[400px] w-full object-cover opacity-90 mix-blend-multiply contrast-125 saturate-50 dark:mix-blend-luminosity"
            />
            {/* Neobrutalist Image Label */}
            <div className="absolute bottom-6 left-6 border-2 border-primary bg-background px-4 py-2 text-xs font-bold tracking-widest text-primary uppercase shadow-[4px_4px_0px_0px_var(--color-primary)]">
              FIG. 01 — Morning Light
            </div>
          </div>
        </div>
      </section>

      {/* 
        THE MANIFESTO - Editorial Pull Quote in Neobrutalist block
      */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16 md:px-8">
        <div className="relative border-4 border-primary bg-secondary px-6 py-16 text-center shadow-[8px_8px_0px_0px_var(--color-primary)] md:px-16 md:py-24">
          <Quote className="absolute -top-6 left-1/2 h-12 w-12 -translate-x-1/2 bg-background fill-primary text-primary" />
          <h2 className="font-serif text-3xl leading-snug text-secondary-foreground md:text-4xl lg:text-5xl lg:leading-normal">
            "You miss a Tuesday interval session because life happens. The
            spreadsheet is blind to reality. You cram it into Wednesday, ruin
            your recovery, and step to the line entirely fried."
          </h2>
          <div className="mt-8 inline-block border-t-2 border-primary pt-4 text-xs font-bold tracking-widest text-secondary-foreground uppercase">
            The problem with paper plans
          </div>
        </div>
      </section>

      {/* 
        EDITORIAL FEATURE SPREAD - Compartmentalized Grid
      */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8">
        {/* Article 1 */}
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-center">
          <div className="order-2 flex-1 space-y-6 md:order-1 md:pr-12">
            <div className="inline-block border border-primary px-2 py-1 text-[10px] tracking-widest text-primary uppercase">
              Chapter 01
            </div>
            <h3 className="font-serif text-4xl text-primary md:text-5xl">
              Graceful Recalibration.
            </h3>
            <p className="max-w-md text-lg leading-relaxed text-foreground">
              When you skip a day, RunCore observes the silence. It doesn't send
              you a red alert. Instead, it scales down Thursday's tempo and
              adjusts your long run pace, ensuring you absorb the intended
              training stimulus without crossing the line into injury.
            </p>
          </div>

          <div className="order-1 flex-1 md:order-2">
            <div className="relative border-4 border-primary shadow-[8px_8px_0px_0px_var(--color-primary)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?auto=format&fit=crop&q=80&w=800"
                alt="Runner checking watch"
                className="aspect-square w-full object-cover opacity-80 mix-blend-multiply contrast-125 saturate-0 dark:mix-blend-luminosity"
              />
            </div>
          </div>
        </div>

        {/* Article 2 */}
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          <div className="flex-1">
            <div className="relative border-4 border-primary shadow-[8px_8px_0px_0px_var(--color-primary)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=800"
                alt="Runner on a trail"
                className="aspect-[4/3] w-full object-cover opacity-90 mix-blend-multiply contrast-100 sepia-[0.2] dark:mix-blend-luminosity"
              />
            </div>
          </div>

          <div className="flex-1 space-y-6 md:pl-12">
            <div className="inline-block border border-primary px-2 py-1 text-[10px] tracking-widest text-primary uppercase">
              Chapter 02
            </div>
            <h3 className="font-serif text-4xl text-primary md:text-5xl">
              The Pure Telemetry.
            </h3>
            <p className="max-w-md text-lg leading-relaxed text-foreground">
              No subjective surveys. No sliders asking "how are you feeling
              today?" We believe the body leaves an honest signature on the
              asphalt.
            </p>

            {/* Neobrutalist Data List */}
            <div className="flex flex-col gap-3 pt-4">
              {[
                "Heart Rate Drift",
                "Cadence & Stride",
                "Pace Variance",
                "Elevation Load",
              ].map((item, i) => (
                <div
                  key={item}
                  className="flex items-center gap-4 border-2 border-primary bg-muted p-3"
                >
                  <span className="bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
                    0{i + 1}
                  </span>
                  <span className="text-sm font-bold tracking-widest text-primary uppercase">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 
        FOOTER / CTA - Heavy Impact
      */}
      <section className="mt-16 w-full border-t-4 border-primary bg-primary px-4 py-24 text-primary-foreground">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h2 className="font-serif text-5xl leading-tight md:text-6xl lg:text-7xl">
            Arrive at the start line ready.
          </h2>
          <p className="mt-6 max-w-xl text-lg text-primary-foreground/80">
            Stop letting a static piece of paper dictate your physical limits.
            Connect your data and build a base that breathes with you.
          </p>

          <Button
            size="lg"
            variant="secondary"
            className="group mt-12 h-16 border-2 border-background bg-secondary px-12 text-base font-bold tracking-widest text-secondary-foreground uppercase shadow-[6px_6px_0px_0px_var(--color-background)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_var(--color-background)]"
            asChild
          >
            <Link href="/plan">
              Begin the Log{" "}
              <ArrowRight className="ml-4 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
