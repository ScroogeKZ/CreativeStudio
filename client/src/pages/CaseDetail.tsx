import { useRoute } from "wouter";
import { Card } from "@/components/ui/card";
import { Target, Lightbulb, TrendingUp } from "lucide-react";

type Language = "ru" | "kz" | "en";

interface CaseDetailProps {
  language: Language;
}

export function CaseDetail({ language }: CaseDetailProps) {
  const [, params] = useRoute("/cases/:slug");
  const slug = params?.slug || "";

  const content = {
    challenge: { ru: "Задача", kz: "Міндет", en: "Challenge" },
    solution: { ru: "Решение", kz: "Шешім", en: "Solution" },
    results: { ru: "Результаты", kz: "Нәтижелер", en: "Results" },
    kpi: { ru: "KPI", kz: "KPI", en: "KPI" },
  };

  const mockCase = {
    title: "Brandformance Campaign 2024",
    client: "Retail Company",
    category: "Digital & Brandformance",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
    challenge: {
      ru: "Клиент столкнулся с падением продаж и низкой узнаваемостью бренда в условиях высокой конкуренции на рынке. Необходимо было разработать комплексную стратегию, объединяющую брендинг и performance-маркетинг.",
      kz: "Клиент нарықтағы жоғары бәсекелестік жағдайында сатудың төмендеуіне және бренд танымалдығының төмендігіне тап болды. Брендингті және performance-маркетингті біріктіретін кешенді стратегияны әзірлеу қажет болды.",
      en: "The client faced declining sales and low brand awareness in a highly competitive market. It was necessary to develop a comprehensive strategy that combines branding and performance marketing.",
    },
    solution: {
      ru: "Мы разработали интегрированную brandformance-кампанию, включающую: контекстную и таргетированную рекламу, комплексный ребрендинг, influencer-маркетинг и оптимизацию конверсии на всех этапах воронки продаж.",
      kz: "Біз интеграцияланған brandformance-науқанды әзірледік: мәтінмәндік және мақсатты жарнама, кешенді ребрендинг, influencer-маркетинг және сату воронкасының барлық кезеңдерінде конверсияны оңтайландыру.",
      en: "We developed an integrated brandformance campaign including: contextual and targeted advertising, comprehensive rebranding, influencer marketing and conversion optimization at all stages of the sales funnel.",
    },
    results: {
      ru: "За 3 месяца работы мы достигли выдающихся результатов: рост продаж на 250%, увеличение узнаваемости бренда на 180%, снижение стоимости привлечения клиента на 40%.",
      kz: "3 ай жұмыс нәтижесінде біз керемет нәтижелерге қол жеткіздік: сатудың 250% өсуі, бренд танымалдығының 180% артуы, клиент тартудың құнын 40% азайту.",
      en: "In 3 months of work we achieved outstanding results: 250% increase in sales, 180% increase in brand awareness, 40% reduction in customer acquisition cost.",
    },
    kpi: [
      { label: { ru: "Рост продаж", kz: "Сатудың өсуі", en: "Sales Growth" }, value: "+250%" },
      { label: { ru: "Узнаваемость", kz: "Танымалдық", en: "Awareness" }, value: "+180%" },
      { label: { ru: "ROI", kz: "ROI", en: "ROI" }, value: "350%" },
      { label: { ru: "Снижение CAC", kz: "CAC азайту", en: "CAC Reduction" }, value: "-40%" },
    ],
  };

  return (
    <div className="min-h-screen pt-20">
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <p className="text-sm text-muted-foreground mb-2">{mockCase.client}</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" data-testid="text-case-title">
              {mockCase.title}
            </h1>
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {mockCase.category}
            </span>
          </div>

          <div className="aspect-video bg-gradient-to-br from-primary to-[hsl(15_90%_55%)] rounded-lg mb-12"></div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="p-6">
              <Target className="h-10 w-10 text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-3">{content.challenge[language]}</h2>
              <p className="text-muted-foreground">{mockCase.challenge[language]}</p>
            </Card>

            <Card className="p-6">
              <Lightbulb className="h-10 w-10 text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-3">{content.solution[language]}</h2>
              <p className="text-muted-foreground">{mockCase.solution[language]}</p>
            </Card>

            <Card className="p-6">
              <TrendingUp className="h-10 w-10 text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-3">{content.results[language]}</h2>
              <p className="text-muted-foreground">{mockCase.results[language]}</p>
            </Card>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8">{content.kpi[language]}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {mockCase.kpi.map((item, idx) => (
                <div key={idx} className="text-center" data-testid={`kpi-${idx}`}>
                  <div className="text-4xl font-bold text-primary mb-2">{item.value}</div>
                  <p className="text-sm text-muted-foreground">{item.label[language]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
