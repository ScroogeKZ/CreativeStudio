import { Link } from "wouter";
import { Hero3D } from "@/components/Hero3D";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, Target, Award, TrendingUp, Sparkles, Network, Database, Code } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Case, Post } from "@shared/schema";

type Language = "ru" | "kz" | "en";

interface HomeProps {
  language: Language;
}

const content = {
  hero: {
    title: {
      ru: "CreativeStudio — Digital & Brandformance Agency",
      kz: "CreativeStudio — Digital & Brandformance агенттігі",
      en: "CreativeStudio — Digital & Brandformance Agency",
    },
    subtitle: {
      ru: "Мы соединяем технологии, медиа и аналитику для роста вашего бренда",
      kz: "Біз брендіңіздің өсуі үшін технологияларды, медианы және аналитиканы біріктіреміз",
      en: "We connect technology, media and analytics for your brand growth",
    },
    cta1: { ru: "Оставить заявку", kz: "Өтінім қалдыру", en: "Get Started" },
    cta2: { ru: "Наши услуги", kz: "Біздің қызметтер", en: "Our Services" },
  },
  about: {
    title: { ru: "О компании", kz: "Компания туралы", en: "About Us" },
    description: {
      ru: "CreativeStudio — это агентство полного цикла, где объединяются креативность и технологии. Мы создаем комплексные digital-решения, которые помогают брендам расти и развиваться в современном цифровом мире. Наш подход основан на глубокой аналитике, инновационных технологиях и креативных стратегиях.",
      kz: "CreativeStudio — бұл креативтілік пен технологияларды біріктіретін толық циклді агенттік. Біз брендтерге қазіргі цифрлық әлемде өсуге және дамуға көмектесетін кешенді цифрлық шешімдер жасаймыз. Біздің тәсіліміз терең талдауға, инновациялық технологияларға және креативті стратегияларға негізделген.",
      en: "CreativeStudio is a full-cycle agency where creativity meets technology. We create comprehensive digital solutions that help brands grow and evolve in today's digital world. Our approach is based on deep analytics, innovative technologies and creative strategies.",
    },
  },
  services: {
    title: { ru: "Наши направления", kz: "Біздің бағыттар", en: "Our Services" },
    digital: {
      name: { ru: "Digital & Brandformance", kz: "Digital & Brandformance", en: "Digital & Brandformance" },
      subtitle: { ru: "Brandformance-агентство", kz: "Brandformance-агенттігі", en: "Brandformance Agency" },
      features: ["Brandformance", "Performance", "Media", "Mobile"],
    },
    communication: {
      name: { ru: "Communication", kz: "Коммуникация", en: "Communication" },
      subtitle: { ru: "Коммуникационное агентство", kz: "Коммуникациялық агенттік", en: "Communication Agency" },
      features: ["ORM", "PR", "SMM", "Influence"],
    },
    research: {
      name: { ru: "Research", kz: "Зерттеу", en: "Research" },
      subtitle: { ru: "Репутационная аналитика", kz: "Репутациялық талдау", en: "Reputation Analytics" },
      features: [
        { ru: "Рейтинги", kz: "Рейтингтер", en: "Ratings" },
        { ru: "Исследования", kz: "Зерттеулер", en: "Research" },
        { ru: "Аналитика", kz: "Талдау", en: "Analytics" },
        { ru: "Спецпроекты", kz: "Арнайы жобалар", en: "Special Projects" },
      ],
    },
    tech: {
      name: { ru: "Tech", kz: "Технологиялар", en: "Tech" },
      subtitle: { ru: "IT & Digital Solutions", kz: "IT & Digital шешімдер", en: "IT & Digital Solutions" },
      features: ["Web Development", "CRM & ERP", "Chat-bots & AI", "Big Data & BI"],
    },
  },
  kpi: {
    title: { ru: "Наши достижения", kz: "Біздің жетістіктер", en: "Our Achievements" },
    items: [
      { value: "100+", label: { ru: "Клиентов", kz: "Клиенттер", en: "Clients" }, icon: Users },
      { value: "300+", label: { ru: "Успешных кампаний", kz: "Табысты науқандар", en: "Successful Campaigns" }, icon: Target },
      { value: "10+", label: { ru: "Лет опыта", kz: "Жыл тәжірибе", en: "Years Experience" }, icon: TrendingUp },
      { value: "15+", label: { ru: "Международных наград", kz: "Халықаралық марапаттар", en: "International Awards" }, icon: Award },
    ],
  },
  cases: {
    title: { ru: "Наши кейсы", kz: "Біздің кейстер", en: "Our Cases" },
    viewAll: { ru: "Смотреть все кейсы", kz: "Барлық кейстерді көру", en: "View All Cases" },
  },
  blog: {
    title: { ru: "Блог", kz: "Блог", en: "Blog" },
    readAll: { ru: "Читать все статьи", kz: "Барлық мақалаларды оқу", en: "Read All Articles" },
  },
  cta: {
    title: { ru: "Готовы обсудить ваш проект?", kz: "Жобаңызды талқылауға дайынсыз ба?", en: "Ready to Discuss Your Project?" },
    button: { ru: "Оставить заявку", kz: "Өтінім қалдыру", en: "Get Started" },
  },
};

function CountUp({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <div ref={ref}>{count}</div>;
}

export function Home({ language }: HomeProps) {
  const { data: cases = [] } = useQuery<Case[]>({
    queryKey: ['/api/cases'],
  });

  const { data: posts = [] } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
    queryFn: async () => {
      const response = await fetch('/api/posts?limit=3');
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    },
  });

  const services = [
    {
      id: "digital",
      color: "digital",
      icon: Sparkles,
      ...content.services.digital,
    },
    {
      id: "communication",
      color: "communication",
      icon: Network,
      ...content.services.communication,
    },
    {
      id: "research",
      color: "research",
      icon: Database,
      ...content.services.research,
    },
    {
      id: "tech",
      color: "tech",
      icon: Code,
      ...content.services.tech,
    },
  ];

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Hero3D />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-[hsl(15_90%_55%)] to-primary bg-clip-text text-transparent" data-testid="text-hero-title">
            {content.hero.title[language]}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto" data-testid="text-hero-subtitle">
            {content.hero.subtitle[language]}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary text-primary-foreground w-full sm:w-auto" data-testid="button-hero-cta">
                {content.hero.cta1[language]}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" onClick={scrollToServices} className="w-full sm:w-auto" data-testid="button-hero-services">
              {content.hero.cta2[language]}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-32 bg-card" id="about">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6" data-testid="text-about-title">
            {content.about.title[language]}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-about-description">
            {content.about.description[language]}
          </p>
        </div>
      </section>

      <section className="py-20 sm:py-32" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16" data-testid="text-services-title">
            {content.services.title[language]}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link key={service.id} href={`/services/${service.id}`}>
                  <Card className={`p-6 h-full hover-elevate active-elevate-2 cursor-pointer border-l-8 border-l-${service.color} transition-all`} data-testid={`card-service-${service.id}`}>
                    <div className={`w-12 h-12 rounded-lg bg-${service.color}/10 flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 text-${service.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{service.name[language]}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{service.subtitle[language]}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="text-sm flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full bg-${service.color}`}></span>
                          {typeof feature === "string" ? feature : feature[language]}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-32 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16" data-testid="text-kpi-title">
            {content.kpi.title[language]}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.kpi.items.map((item, idx) => {
              const Icon = item.icon;
              const numericValue = parseInt(item.value.replace(/\D/g, ""));
              return (
                <div key={idx} className="text-center" data-testid={`kpi-item-${idx}`}>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
                    <CountUp end={numericValue} />
                    {item.value.includes("+") && "+"}
                  </div>
                  <p className="text-muted-foreground">{item.label[language]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold" data-testid="text-cases-title">
              {content.cases.title[language]}
            </h2>
            <Link href="/cases">
              <Button variant="ghost" className="hidden sm:flex" data-testid="button-view-cases">
                {content.cases.viewAll[language]}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.length > 0 ? (
              cases.slice(0, 3).map((caseItem) => (
                <Link key={caseItem.id} href={`/cases/${caseItem.slug}`}>
                  <Card className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer" data-testid={`card-case-${caseItem.slug}`}>
                    <div className="aspect-video bg-gradient-to-br from-primary to-[hsl(15_90%_55%)]"></div>
                    <div className="p-6">
                      <p className="text-xs text-muted-foreground mb-2">{caseItem.client}</p>
                      <h3 className="text-xl font-semibold mb-2">{caseItem.title[language]}</h3>
                      <p className="text-sm text-primary font-medium">{caseItem.shortResult[language]}</p>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-primary to-[hsl(15_90%_55%)]"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Brandformance Campaign</h3>
                  <p className="text-sm text-muted-foreground">+250% ROI за 3 месяца</p>
                </div>
              </Card>
            )}
          </div>
          <Link href="/cases">
            <Button variant="ghost" className="w-full mt-6 sm:hidden" data-testid="button-view-cases-mobile">
              {content.cases.viewAll[language]}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-20 sm:py-32 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold" data-testid="text-blog-title">
              {content.blog.title[language]}
            </h2>
            <Link href="/blog">
              <Button variant="ghost" className="hidden sm:flex" data-testid="button-read-blog">
                {content.blog.readAll[language]}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer" data-testid={`card-blog-${post.slug}`}>
                    <div className="aspect-video bg-gradient-to-br from-communication to-tech"></div>
                    <div className="p-6">
                      <p className="text-xs text-muted-foreground mb-2">
                        {new Date(post.createdAt).toLocaleDateString(language === "ru" ? "ru-RU" : language === "kz" ? "kk-KZ" : "en-US")}
                      </p>
                      <h3 className="text-lg font-semibold mb-2">{post.title[language]}</h3>
                      <p className="text-sm text-muted-foreground">{post.excerpt[language]}</p>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-communication to-tech"></div>
                <div className="p-6">
                  <p className="text-xs text-muted-foreground mb-2">15 марта 2024</p>
                  <h3 className="text-lg font-semibold mb-2">Тренды Digital-маркетинга 2024</h3>
                  <p className="text-sm text-muted-foreground">Обзор главных трендов в цифровом маркетинге...</p>
                </div>
              </Card>
            )}
          </div>
          <Link href="/blog">
            <Button variant="ghost" className="w-full mt-6 sm:hidden" data-testid="button-read-blog-mobile">
              {content.blog.readAll[language]}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-[hsl(15_90%_55%)]/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8" data-testid="text-cta-title">
            {content.cta.title[language]}
          </h2>
          <Link href="/contact">
            <Button size="lg" className="bg-primary hover:bg-primary text-primary-foreground" data-testid="button-cta">
              {content.cta.button[language]}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
