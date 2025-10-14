import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/lib/auth";
import { ClientAuthProvider } from "@/lib/clientAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home } from "@/pages/Home";
import { ServiceDetail } from "@/pages/ServiceDetail";
import { Cases } from "@/pages/Cases";
import { CaseDetail } from "@/pages/CaseDetail";
import { Blog } from "@/pages/Blog";
import { BlogDetail } from "@/pages/BlogDetail";
import { Contact } from "@/pages/Contact";
import Login from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import AdminServices from "@/pages/admin/Services";
import AdminCases from "@/pages/admin/Cases";
import AdminPosts from "@/pages/admin/Posts";
import AdminTestimonials from "@/pages/admin/Testimonials";
import AdminContacts from "@/pages/admin/Contacts";
import AdminOrders from "@/pages/admin/Orders";
import ClientLogin from "@/pages/client/Login";
import ClientDashboard from "@/pages/client/Dashboard";
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
    <Switch>
      <Route path="/admin/login" component={Login} />
      <Route path="/admin" component={() => <ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/services" component={() => <ProtectedRoute><AdminServices /></ProtectedRoute>} />
      <Route path="/admin/cases" component={() => <ProtectedRoute><AdminCases /></ProtectedRoute>} />
      <Route path="/admin/posts" component={() => <ProtectedRoute><AdminPosts /></ProtectedRoute>} />
      <Route path="/admin/testimonials" component={() => <ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
      <Route path="/admin/contacts" component={() => <ProtectedRoute><AdminContacts /></ProtectedRoute>} />
      <Route path="/admin/orders" component={() => <ProtectedRoute><AdminOrders /></ProtectedRoute>} />
      
      <Route path="/client/login" component={ClientLogin} />
      <Route path="/client/dashboard" component={ClientDashboard} />
      
      <Route>
        {() => (
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
        )}
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <ClientAuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ClientAuthProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
