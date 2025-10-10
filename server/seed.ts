import { db } from "./db";
import { services, cases, posts, testimonials } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Seed Services
  const servicesData = [
    {
      slug: "digital",
      name: { ru: "Digital & Brandformance", kz: "Digital & Brandformance", en: "Digital & Brandformance" },
      subtitle: { ru: "Brandformance-агентство", kz: "Brandformance-агенттігі", en: "Brandformance Agency" },
      description: {
        ru: "Мы создаем комплексные digital-стратегии, которые объединяют брендинг и производительность.",
        kz: "Біз брендингті және өнімділікті біріктіретін кешенді цифрлық стратегияларды жасаймыз.",
        en: "We create comprehensive digital strategies that combine branding and performance.",
      },
      color: "digital",
      features: ["Brandformance", "Performance Marketing", "Media Planning", "Mobile Marketing"],
      order: 1,
    },
    {
      slug: "communication",
      name: { ru: "Communication", kz: "Коммуникация", en: "Communication" },
      subtitle: { ru: "Коммуникационное агентство", kz: "Коммуникациялық агенттік", en: "Communication Agency" },
      description: {
        ru: "Мы управляем репутацией и коммуникациями вашего бренда в цифровом пространстве.",
        kz: "Біз цифрлық кеңістіктегі брендіңіздің беделін және коммуникацияларын басқарамыз.",
        en: "We manage your brand's reputation and communications in the digital space.",
      },
      color: "communication",
      features: ["ORM", "PR", "SMM", "Influence Marketing"],
      order: 2,
    },
    {
      slug: "research",
      name: { ru: "Research", kz: "Зерттеу", en: "Research" },
      subtitle: { ru: "Репутационная аналитика", kz: "Репутациялық талдау", en: "Reputation Analytics" },
      description: {
        ru: "Глубокая аналитика и исследования для принятия обоснованных решений.",
        kz: "Негізделген шешімдер қабылдау үшін терең талдау және зерттеулер.",
        en: "Deep analytics and research for informed decision making.",
      },
      color: "research",
      features: ["Рейтинги", "Исследования", "Аналитика", "Спецпроекты"],
      order: 3,
    },
    {
      slug: "tech",
      name: { ru: "Tech", kz: "Технологиялар", en: "Tech" },
      subtitle: { ru: "IT & Digital Solutions", kz: "IT & Digital шешімдер", en: "IT & Digital Solutions" },
      description: {
        ru: "Разработка современных технологических решений для вашего бизнеса.",
        kz: "Бизнесіңіз үшін заманауи технологиялық шешімдерді әзірлеу.",
        en: "Development of modern technological solutions for your business.",
      },
      color: "tech",
      features: ["Web Development", "CRM & ERP", "Chat-bots & AI", "Big Data & BI"],
      order: 4,
    },
  ];

  await db.insert(services).values(servicesData);
  console.log("✅ Services seeded");

  // Seed Cases
  const casesData = [
    {
      slug: "brandformance-campaign-2024",
      title: {
        ru: "Brandformance Campaign 2024",
        kz: "Brandformance науқаны 2024",
        en: "Brandformance Campaign 2024",
      },
      client: "Retail Company",
      category: "Digital & Brandformance",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      shortResult: {
        ru: "+250% ROI за 3 месяца",
        kz: "3 айда +250% ROI",
        en: "+250% ROI in 3 months",
      },
      challenge: {
        ru: "Клиент столкнулся с падением продаж и низкой узнаваемостью бренда в условиях высокой конкуренции.",
        kz: "Клиент нарықтағы жоғары бәсекелестік жағдайында сатудың төмендеуіне және бренд танымалдығының төмендігіне тап болды.",
        en: "The client faced declining sales and low brand awareness in a highly competitive market.",
      },
      solution: {
        ru: "Мы разработали интегрированную brandformance-кампанию с контекстной рекламой и influencer-маркетингом.",
        kz: "Біз мәтінмәндік жарнама және influencer-маркетингпен интеграцияланған brandformance-науқанды әзірледік.",
        en: "We developed an integrated brandformance campaign with contextual advertising and influencer marketing.",
      },
      results: {
        ru: "За 3 месяца: рост продаж на 250%, увеличение узнаваемости бренда на 180%.",
        kz: "3 айда: сатудың 250% өсуі, бренд танымалдығының 180% артуы.",
        en: "In 3 months: 250% increase in sales, 180% increase in brand awareness.",
      },
      kpi: [
        { label: { ru: "Рост продаж", kz: "Сатудың өсуі", en: "Sales Growth" }, value: "+250%" },
        { label: { ru: "Узнаваемость", kz: "Танымалдық", en: "Awareness" }, value: "+180%" },
        { label: { ru: "ROI", kz: "ROI", en: "ROI" }, value: "350%" },
        { label: { ru: "Снижение CAC", kz: "CAC азайту", en: "CAC Reduction" }, value: "-40%" },
      ],
      screenshots: [],
      published: true,
      order: 1,
    },
  ];

  await db.insert(cases).values(casesData);
  console.log("✅ Cases seeded");

  // Seed Blog Posts
  const postsData = [
    {
      slug: "digital-marketing-trends-2024",
      title: {
        ru: "Тренды Digital-маркетинга 2024",
        kz: "Digital-маркетингтің трендтері 2024",
        en: "Digital Marketing Trends 2024",
      },
      excerpt: {
        ru: "Обзор главных трендов в цифровом маркетинге на текущий год",
        kz: "Ағымдағы жылдағы цифрлық маркетингтегі негізгі трендтерге шолу",
        en: "Overview of the main trends in digital marketing for the current year",
      },
      content: {
        ru: "<p>Digital-маркетинг продолжает стремительно развиваться...</p>",
        kz: "<p>Digital-маркетинг қарқынды дамуда...</p>",
        en: "<p>Digital marketing continues to evolve rapidly...</p>",
      },
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=675&fit=crop",
      category: "Digital",
      author: "CreativeStudio",
      published: true,
    },
  ];

  await db.insert(posts).values(postsData);
  console.log("✅ Posts seeded");

  // Seed Testimonials
  const testimonialsData = [
    {
      clientName: "Алексей Петров",
      clientPosition: {
        ru: "CEO",
        kz: "Бас директор",
        en: "CEO",
      },
      companyName: "TechCorp",
      avatar: null,
      quote: {
        ru: "CreativeStudio помогла нам увеличить продажи на 250% за 3 месяца. Профессиональная команда!",
        kz: "CreativeStudio бізге 3 айда сатуды 250% арттыруға көмектесті. Кәсіби команда!",
        en: "CreativeStudio helped us increase sales by 250% in 3 months. Professional team!",
      },
      rating: 5,
      published: true,
      order: 1,
    },
  ];

  await db.insert(testimonials).values(testimonialsData);
  console.log("✅ Testimonials seeded");

  console.log("✨ Database seeded successfully!");
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
