import { useRoute, Link } from "wouter";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Language = "ru" | "kz" | "en";

interface BlogDetailProps {
  language: Language;
}

export function BlogDetail({ language }: BlogDetailProps) {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";

  const content = {
    back: { ru: "Назад к блогу", kz: "Блогқа оралу", en: "Back to Blog" },
    readAlso: { ru: "Читайте также", kz: "Сондай-ақ оқыңыз", en: "Read Also" },
  };

  const mockPost = {
    title: { ru: "Тренды Digital-маркетинга 2024", kz: "Digital-маркетингтің трендтері 2024", en: "Digital Marketing Trends 2024" },
    date: "2024-03-15",
    author: "CreativeStudio",
    category: "Digital",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
    content: {
      ru: `
        <p>Digital-маркетинг продолжает стремительно развиваться, и 2024 год обещает множество новых возможностей и вызовов для брендов. В этой статье мы рассмотрим ключевые тренды, которые будут определять индустрию в ближайшем будущем.</p>

        <h2>1. Искусственный интеллект в маркетинге</h2>
        <p>AI становится незаменимым инструментом для персонализации контента, автоматизации процессов и анализа данных. Chatbots нового поколения способны проводить глубокие беседы с клиентами, а AI-powered аналитика помогает предсказывать поведение аудитории.</p>

        <h2>2. Видео-контент доминирует</h2>
        <p>Короткие видео в TikTok, Reels и Shorts продолжают набирать популярность. Бренды, которые освоили формат коротких вертикальных видео, получают огромное преимущество в охвате и вовлечении.</p>

        <h2>3. Brandformance подход</h2>
        <p>Объединение брендинга и performance-маркетинга становится новым стандартом. Компании больше не выбирают между узнаваемостью и конверсией — они добиваются обеих целей одновременно.</p>
      `,
      kz: `
        <p>Digital-маркетинг қарқынды дамуда және 2024 жыл брендтер үшін көптеген жаңа мүмкіндіктер мен міндеттерді уәде етеді. Бұл мақалада біз жақын болашақта индустрияны анықтайтын негізгі трендтерді қарастырамыз.</p>

        <h2>1. Маркетингтегі жасанды интеллект</h2>
        <p>AI контентті жекелендіру, процестерді автоматтандыру және деректерді талдау үшін алмастырылмайтын құралға айналады. Жаңа буын Chatbot-тары клиенттермен терең әңгімелер жүргізе алады, ал AI-қуатты талдау аудиторияның мінез-құлқын болжауға көмектеседі.</p>

        <h2>2. Бейне контент басым</h2>
        <p>TikTok, Reels және Shorts-тағы қысқа бейнелер танымалдылықты жалғастыруда. Қысқа тік бейнелер форматын меңгерген брендтер қамту мен тартуда үлкен артықшылыққа ие болады.</p>

        <h2>3. Brandformance тәсілі</h2>
        <p>Брендингті және performance-маркетингті біріктіру жаңа стандартқа айналады. Компаниялар танымалдық пен конверсия арасында таңдау жасамайды - олар екі мақсатқа бір мезгілде жетеді.</p>
      `,
      en: `
        <p>Digital marketing continues to evolve rapidly, and 2024 promises many new opportunities and challenges for brands. In this article we will look at the key trends that will define the industry in the near future.</p>

        <h2>1. Artificial Intelligence in Marketing</h2>
        <p>AI is becoming an indispensable tool for content personalization, process automation and data analysis. Next-generation chatbots are capable of having deep conversations with customers, and AI-powered analytics help predict audience behavior.</p>

        <h2>2. Video Content Dominates</h2>
        <p>Short videos on TikTok, Reels and Shorts continue to gain popularity. Brands that have mastered the short vertical video format gain a huge advantage in reach and engagement.</p>

        <h2>3. Brandformance Approach</h2>
        <p>Combining branding and performance marketing is becoming the new standard. Companies no longer choose between awareness and conversion - they achieve both goals simultaneously.</p>
      `,
    },
  };

  const relatedPosts = [
    { title: { ru: "Эффективная стратегия в соцсетях", kz: "Әлеуметтік желілердегі тиімді стратегия", en: "Effective Social Media Strategy" }, slug: "social-media-strategy" },
    { title: { ru: "ИИ в маркетинге", kz: "Маркетингтегі AI", en: "AI in Marketing" }, slug: "ai-in-marketing" },
  ];

  return (
    <div className="min-h-screen pt-20">
      <article className="py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="mb-6" data-testid="button-back-to-blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {content.back[language]}
            </Button>
          </Link>

          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              {mockPost.category}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6" data-testid="text-post-title">
              {mockPost.title[language]}
            </h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(mockPost.date).toLocaleDateString(language === "ru" ? "ru-RU" : language === "kz" ? "kk-KZ" : "en-US")}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{mockPost.author}</span>
              </div>
            </div>
          </div>

          <div className="aspect-video bg-gradient-to-br from-primary to-[hsl(15_90%_55%)] rounded-lg mb-12"></div>

          <div
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: mockPost.content[language] }}
            data-testid="text-post-content"
          />

          <div className="mt-16 pt-16 border-t border-border">
            <h2 className="text-2xl font-bold mb-6">{content.readAlso[language]}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <Card className="p-6 hover-elevate active-elevate-2 cursor-pointer" data-testid={`card-related-${post.slug}`}>
                    <h3 className="font-semibold">{post.title[language]}</h3>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
