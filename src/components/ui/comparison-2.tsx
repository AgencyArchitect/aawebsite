import { Check, X, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const acmePoints = [
  "Merkeigen creative strategy, samen met de eigenaar bepaald",
  "Unieke concepten die schaalbaar zijn — geen one-shot",
  "Ideatie en product- en marktonderzoek inbegrepen",
  "Strategie blijft van jou: je begrijpt wat er getest wordt",
  "Één partij die de strategie bepaalt én uitvoert",
  "Geen copy-paste: marketing voelt niet meer als gokken",
];

const othersPoints = [
  "Je accountmanager snapt jouw brand niet.",
  "Je schaalt niet, maar blijft hangen in wekelijkse aanpassingen. Totdat het wel 'lukt'. Wanneer weet niemand.",
  "Strategie die niet van jou is. En die je zelf niet begrijpt.",
  "Resultaten blijven matig.",
  "Copy-paste concepten die op andere klanten lijken.",
  "Geen echte creative strategy, alleen creatives.",
  "Focus op media buying, óf op campagnes. Maar niet het systeem erachter.",
];

function CheckRow({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#8a5a2b]">
        <Check className="size-3 text-white" aria-hidden />
      </span>
      <span className="text-sm leading-relaxed text-white">{text}</span>
    </li>
  );
}

function CrossRow({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#8a5a2b]/15">
        <X className="size-3 text-[#8a5a2b]" aria-hidden />
      </span>
      <span className="text-sm leading-relaxed text-[#8a5a2b]">{text}</span>
    </li>
  );
}

export default function ComparisonBlock() {
  return (
    <section className="flex w-full items-center justify-center bg-background px-6 py-12 text-foreground">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#001d51] sm:text-4xl">
            Andere aanpak, met een reden.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="flex flex-col justify-between border-[#001d51] bg-[#001d51] text-white">
            <div>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-semibold text-white">
                    Agency Architect
                  </CardTitle>
                </div>
                <CardDescription className="text-white/75">
                  Een merkeigen en schaalbare creative strategy, samen bepaald en uitgevoerd.
                </CardDescription>
              </CardHeader>

              <Separator className="bg-white/20" />

              <CardContent className="pt-4">
                <ul className="flex flex-col gap-3">
                  {acmePoints.map((point) => (
                    <CheckRow key={point} text={point} />
                  ))}
                </ul>
              </CardContent>
            </div>

            <CardFooter className="border-t border-white/20">
              <Button
                render={<a href="/creative-scale-audit/" />}
                className="w-full bg-white text-[#001d51] hover:bg-white/90"
              >
                Gratis Meta Audit
                <ArrowRight data-icon="inline-end" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col justify-between bg-[#f6f4f0] text-[#8a5a2b]">
            <div>
              <CardHeader>
                <CardTitle className="text-base font-semibold text-[#8a5a2b]">
                  Freelancer of agency
                </CardTitle>
                <CardDescription className="text-[#8a5a2b]/80">
                  De veelvoorkomende vorm van samenwerken die niet schaalt.
                </CardDescription>
              </CardHeader>

              <Separator className="bg-[#8a5a2b]/20" />

              <CardContent className="pt-4">
                <ul className="flex flex-col gap-3">
                  {othersPoints.map((point) => (
                    <CrossRow key={point} text={point} />
                  ))}
                </ul>
              </CardContent>
            </div>

            <CardFooter className="border-t border-[#8a5a2b]/20">
              <Button
                variant="outline"
                render={<a href="/e-commerce-marketing/" />}
                className="w-full border-[#8a5a2b] text-[#8a5a2b] hover:bg-[#8a5a2b]/10"
              >
                Bekijk onze aanpak
                <ArrowRight data-icon="inline-end" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}