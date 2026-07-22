import { Reveal, MaskedHeading } from '@/components/motion/reveal'
import { SectionLabel } from '@/components/brand/section-label'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { beliefs } from '@/lib/data'

export function Beliefs() {
  return (
    <section className="border-t border-foreground/10 bg-beige py-16 text-beige-foreground md:py-28">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <SectionLabel number="02" className="opacity-60">
          Lo que creemos
        </SectionLabel>
        <h2 className="mt-6 text-[clamp(2rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
          <MaskedHeading lines={['Los fundamentos', 'de nuestra fe']} />
        </h2>

        <Reveal delay={0.1} className="mt-12">
          <Accordion className="border-t border-foreground/15">
            {beliefs.map((b) => (
              <AccordionItem
                key={b.title}
                value={b.title}
                className="border-b border-foreground/15"
              >
                <AccordionTrigger className="py-6 text-xl font-semibold tracking-[-0.01em] hover:no-underline">
                  {b.title}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed opacity-75">
                  {b.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
