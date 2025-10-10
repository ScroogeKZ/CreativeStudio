import { Link } from "wouter";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

type Language = "ru" | "kz" | "en";

interface FooterProps {
  language: Language;
}

const content = {
  about: {
    ru: "CreativeStudio — агентство полного цикла, специализирующееся на Digital, Communication, Research и Tech решениях.",
    kz: "CreativeStudio — толық циклді агенттік, Digital, Communication, Research және Tech шешімдеріне маманданған.",
    en: "CreativeStudio is a full-cycle agency specializing in Digital, Communication, Research and Tech solutions.",
  },
  services: { ru: "Услуги", kz: "Қызметтер", en: "Services" },
  company: { ru: "Компания", kz: "Компания", en: "Company" },
  contact: { ru: "Контакты", kz: "Байланыс", en: "Contact" },
  allRights: { ru: "Все права защищены", kz: "Барлық құқықтар қорғалған", en: "All rights reserved" },
};

export function Footer({ language }: FooterProps) {
  const serviceLinks = [
    { label: { ru: "Digital & Brandformance", kz: "Digital & Brandformance", en: "Digital & Brandformance" }, href: "/services/digital" },
    { label: { ru: "Communication", kz: "Коммуникация", en: "Communication" }, href: "/services/communication" },
    { label: { ru: "Research", kz: "Зерттеу", en: "Research" }, href: "/services/research" },
    { label: { ru: "Tech", kz: "Технологиялар", en: "Tech" }, href: "/services/tech" },
  ];

  const companyLinks = [
    { label: { ru: "О нас", kz: "Біз туралы", en: "About" }, href: "/#about" },
    { label: { ru: "Кейсы", kz: "Кейстер", en: "Cases" }, href: "/cases" },
    { label: { ru: "Блог", kz: "Блог", en: "Blog" }, href: "/blog" },
    { label: { ru: "Карьера", kz: "Мансап", en: "Career" }, href: "/career" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  ];

  return (
    <footer className="bg-card border-t border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-[hsl(15_90%_55%)] bg-clip-text text-transparent mb-4">
              CreativeStudio
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {content.about[language]}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-md bg-muted hover-elevate active-elevate-2 flex items-center justify-center transition-colors"
                    aria-label={social.label}
                    data-testid={`link-social-${social.label.toLowerCase()}`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{content.services[language]}</h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid={`link-footer-${link.href}`}>
                      {link.label[language]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{content.company[language]}</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid={`link-footer-${link.href.replace('/', '-')}`}>
                      {link.label[language]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{content.contact[language]}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Алматы, ул. Абая 150/230</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="tel:+77012345678" className="hover:text-foreground transition-colors">
                  +7 (701) 234-56-78
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:info@creativestudio.kz" className="hover:text-foreground transition-colors">
                  info@creativestudio.kz
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CreativeStudio. {content.allRights[language]}.
        </div>
      </div>
    </footer>
  );
}
