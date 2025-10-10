import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home } from "@/pages/Home";
import { ServiceDetail } from "@/pages/ServiceDetail";
import { Cases } from "@/pages/Cases";
import { CaseDetail } from "@/pages/CaseDetail";
import { Blog } from "@/pages/Blog";
import { BlogDetail } from "@/pages/BlogDetail";
import { Contact } from "@/pages/Contact";
import NotFound from "@/pages/not-found";
import { useState } from "react";

type Language = "ru" | "kz" | "en";

function Router() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "ru";
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header language={language} setLanguage={handleLanguageChange} />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={() => <Home language={language} />} />
          <Route path="/services/:slug" component={() => <ServiceDetail language={language} />} />
          <Route path="/services" component={() => <ServiceDetail language={language} />} />
          <Route path="/cases/:slug" component={() => <CaseDetail language={language} />} />
          <Route path="/cases" component={() => <Cases language={language} />} />
          <Route path="/blog/:slug" component={() => <BlogDetail language={language} />} />
          <Route path="/blog" component={() => <Blog language={language} />} />
          <Route path="/contact" component={() => <Contact language={language} />} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer language={language} />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
