import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";

type Language = "ru" | "kz" | "en";

interface ServiceDetailProps {
  language: Language;
}

const servicesData = {
  digital: {
    name: { ru: "Digital & Brandformance", kz: "Digital & Brandformance", en: "Digital & Brandformance" },
    subtitle: { ru: "Brandformance-агентство", kz: "Brandformance-агенттігі", en: "Brandformance Agency" },
    description: {
      ru: "Мы создаем комплексные digital-стратегии, которые объединяют брендинг и производительность. Наш подход позволяет не только укрепить позиции бренда, но и достичь измеримых бизнес-результатов.",
      kz: "Біз брендингті және өнімділікті біріктіретін кешенді цифрлық стратегияларды жасаймыз. Біздің тәсіл бренд позицияларын нығайтуға ғана емес, сонымен қатар өлшенетін бизнес нәтижелеріне жетуге мүмкіндік береді.",
      en: "We create comprehensive digital strategies that combine branding and performance. Our approach allows not only to strengthen brand positions, but also to achieve measurable business results.",
    },
    color: "digital",
    features: ["Brandformance", "Performance Marketing", "Media Planning", "Mobile Marketing"],
    benefits: {
      ru: ["Увеличение узнаваемости бренда", "Рост конверсии и продаж", "Оптимизация маркетинговых расходов", "Комплексная аналитика и отчетность"],
      kz: ["Бренд танымалдығын арттыру", "Конверсия мен сатудың өсуі", "Маркетингтік шығындарды оңтайландыру", "Кешенді талдау және есептілік"],
      en: ["Increase brand awareness", "Growth in conversions and sales", "Optimization of marketing costs", "Comprehensive analytics and reporting"],
    },
  },
  communication: {
    name: { ru: "Communication", kz: "Коммуникация", en: "Communication" },
    subtitle: { ru: "Коммуникационное агентство", kz: "Коммуникациялық агенттік", en: "Communication Agency" },
    description: {
      ru: "Мы управляем репутацией и коммуникациями вашего бренда в цифровом пространстве. От PR-стратегий до управления социальными сетями — мы создаем позитивный имидж и прочные связи с вашей аудиторией.",
      kz: "Біз цифрлық кеңістіктегі брендіңіздің беделін және коммуникацияларын басқарамыз. PR-стратегиялардан әлеуметтік желілерді басқаруға дейін - біз оң имидж және аудиториямен берік байланыстар орнатамыз.",
      en: "We manage your brand's reputation and communications in the digital space. From PR strategies to social media management - we create a positive image and strong connections with your audience.",
    },
    color: "communication",
    features: ["ORM", "PR", "SMM", "Influence Marketing"],
    benefits: {
      ru: ["Управление онлайн-репутацией", "Эффективная PR-стратегия", "Активное присутствие в соцсетях", "Работа с инфлюенсерами"],
      kz: ["Онлайн беделді басқару", "Тиімді PR-стратегия", "Әлеуметтік желілерде белсенді болу", "Инфлюенсерлермен жұмыс"],
      en: ["Online reputation management", "Effective PR strategy", "Active social media presence", "Working with influencers"],
    },
  },
  research: {
    name: { ru: "Research", kz: "Зерттеу", en: "Research" },
    subtitle: { ru: "Репутационная аналитика", kz: "Репутациялық талдау", en: "Reputation Analytics" },
    description: {
      ru: "Глубокая аналитика и исследования для принятия обоснованных решений. Мы предоставляем данные и инсайты, которые помогают вашему бизнесу расти и развиваться на основе фактов.",
      kz: "Негізделген шешімдер қабылдау үшін терең талдау және зерттеулер. Біз бизнесіңізге фактілер негізінде өсуге және дамуға көмектесетін деректер мен түсініктер береміз.",
      en: "Deep analytics and research for informed decision making. We provide data and insights that help your business grow and develop based on facts.",
    },
    color: "research",
    features: ["Рейтинги", "Исследования", "Аналитика", "Спецпроекты"],
    benefits: {
      ru: ["Объективная оценка репутации", "Глубокие рыночные исследования", "Аналитика конкурентов", "Специализированные проекты"],
      kz: ["Беделді объективті бағалау", "Терең нарықтық зерттеулер", "Бәсекелестер талдауы", "Мамандандырылған жобалар"],
      en: ["Objective reputation assessment", "Deep market research", "Competitor analysis", "Specialized projects"],
    },
  },
  tech: {
    name: { ru: "Tech", kz: "Технологиялар", en: "Tech" },
    subtitle: { ru: "IT & Digital Solutions", kz: "IT & Digital шешімдер", en: "IT & Digital Solutions" },
    description: {
      ru: "Разработка современных технологических решений для вашего бизнеса. От веб-платформ до систем искусственного интеллекта — мы создаем инструменты, которые автоматизируют процессы и увеличивают эффективность.",
      kz: "Бизнесіңіз үшін заманауи технологиялық шешімдерді әзірлеу. Веб-платформалардан жасанды интеллект жүйелеріне дейін - біз процестерді автоматтандыратын және тиімділікті арттыратын құралдар жасаймыз.",
      en: "Development of modern technological solutions for your business. From web platforms to artificial intelligence systems - we create tools that automate processes and increase efficiency.",
    },
    color: "tech",
    features: ["Web Development", "CRM & ERP", "Chat-bots & AI", "Big Data & BI"],
    benefits: {
      ru: ["Современные веб-решения", "Интеграция CRM и ERP систем", "Автоматизация через AI", "Аналитика больших данных"],
      kz: ["Заманауи веб-шешімдер", "CRM және ERP жүйелерін интеграциялау", "AI арқылы автоматтандыру", "Үлкен деректер талдауы"],
      en: ["Modern web solutions", "CRM and ERP integration", "AI automation", "Big data analytics"],
    },
  },
};

export function ServiceDetail({ language }: HomeProps) {
  const [, params] = useRoute("/services/:slug");
  const slug = params?.slug || "digital";
  const service = servicesData[slug as keyof typeof servicesData] || servicesData.digital;

  const content = {
    contact: { ru: "Оставить заявку", kz: "Өтінім қалдыру", en: "Get Started" },
    advantages: { ru: "Преимущества", kz: "Артықшылықтар", en: "Benefits" },
    services: { ru: "Услуги", kz: "Қызметтер", en: "Services" },
  };

  return (
    <div className="min-h-screen pt-20">
      <section className={`py-20 sm:py-32 bg-gradient-to-br from-${service.color}/20 to-${service.color}/5`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-${service.color}`} data-testid="text-service-title">
              {service.name[language]}
            </h1>
            <p className="text-xl text-muted-foreground mb-4">{service.subtitle[language]}</p>
            <p className="text-lg text-muted-foreground mb-8" data-testid="text-service-description">
              {service.description[language]}
            </p>
            <Link href="/contact">
              <Button size="lg" className={`bg-${service.color} hover:bg-${service.color}`} data-testid="button-service-contact">
                {content.contact[language]}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">{content.services[language]}</h2>
              <div className="space-y-3">
                {service.features.map((feature, idx) => (
                  <Card key={idx} className="p-4 hover-elevate">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full bg-${service.color}`}></div>
                      <span className="font-medium">{feature}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">{content.advantages[language]}</h2>
              <div className="space-y-4">
                {service.benefits[language].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className={`h-6 w-6 text-${service.color} flex-shrink-0 mt-0.5`} />
                    <p className="text-muted-foreground">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            {language === "ru" && "Начнем работу над вашим проектом?"}
            {language === "kz" && "Жобаңызбен жұмысты бастайық па?"}
            {language === "en" && "Shall we start working on your project?"}
          </h2>
          <Link href="/contact">
            <Button size="lg" className={`bg-${service.color} hover:bg-${service.color}`} data-testid="button-service-cta">
              {content.contact[language]}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
