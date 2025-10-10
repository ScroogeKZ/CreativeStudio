import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Case } from "@shared/schema";

type Language = "ru" | "kz" | "en";

interface CasesProps {
  language: Language;
}

const content = {
  title: { ru: "Наши кейсы", kz: "Біздің кейстер", en: "Our Cases" },
  subtitle: { ru: "Успешные проекты для наших клиентов", kz: "Клиенттеріміз үшін табысты жобалар", en: "Successful projects for our clients" },
};

export function Cases({ language }: CasesProps) {
  const { data: cases = [] } = useQuery<Case[]>({
    queryKey: ['/api/cases'],
  });

  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6" data-testid="text-cases-title">
              {content.title[language]}
            </h1>
            <p className="text-xl text-muted-foreground" data-testid="text-cases-subtitle">
              {content.subtitle[language]}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((caseItem) => (
              <Link key={caseItem.id} href={`/cases/${caseItem.slug}`}>
                <Card className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer h-full" data-testid={`card-case-${caseItem.slug}`}>
                  <div className="aspect-video bg-gradient-to-br from-primary to-[hsl(15_90%_55%)] relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-sm font-medium px-3 py-1 bg-black/30 rounded-full backdrop-blur-sm">
                        {caseItem.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-muted-foreground mb-2">{caseItem.client}</p>
                    <h3 className="text-xl font-semibold mb-2">{caseItem.title[language]}</h3>
                    <p className="text-sm text-primary font-medium">{caseItem.shortResult[language]}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
