import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/SEO";
import type { Post } from "@shared/schema";

type Language = "ru" | "kz" | "en";

interface BlogProps {
  language: Language;
}

const content = {
  title: { ru: "Блог", kz: "Блог", en: "Blog" },
  subtitle: { ru: "Статьи о digital-маркетинге, технологиях и трендах", kz: "Digital-маркетинг, технологиялар және трендтер туралы мақалалар", en: "Articles about digital marketing, technology and trends" },
  readMore: { ru: "Читать далее", kz: "Толығырақ оқу", en: "Read More" },
};

export function Blog({ language }: BlogProps) {
  const { data: posts = [] } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  const seoContent = {
    title: {
      ru: 'Блог о маркетинге и digital | Creative Studio',
      kz: 'Маркетинг және digital туралы блог | Creative Studio',
      en: 'Marketing and Digital Blog | Creative Studio'
    },
    description: {
      ru: 'Статьи и insights о digital-маркетинге, SMM, брендинге, веб-технологиях и трендах индустрии от экспертов Creative Studio.',
      kz: 'Creative Studio сарапшыларынан digital-маркетинг, SMM, брендинг, веб-технологиялар және индустрия трендтері туралы мақалалар мен insights.',
      en: 'Articles and insights about digital marketing, SMM, branding, web technologies and industry trends from Creative Studio experts.'
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <SEO 
        title={seoContent.title[language]}
        description={seoContent.description[language]}
        lang={language}
      />
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6" data-testid="text-blog-title">
              {content.title[language]}
            </h1>
            <p className="text-xl text-muted-foreground" data-testid="text-blog-subtitle">
              {content.subtitle[language]}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer h-full" data-testid={`card-blog-${post.slug}`}>
                  <div className="aspect-video bg-gradient-to-br from-primary to-[hsl(15_90%_55%)] relative">
                    <div className="absolute top-4 left-4">
                      <span className="text-white text-xs font-medium px-3 py-1 bg-black/30 rounded-full backdrop-blur-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.createdAt).toLocaleDateString(language === "ru" ? "ru-RU" : language === "kz" ? "kk-KZ" : "en-US")}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{post.title[language]}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{post.excerpt[language]}</p>
                    <span className="text-sm text-primary font-medium hover:underline">
                      {content.readMore[language]} →
                    </span>
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
