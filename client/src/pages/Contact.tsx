import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SEO } from "@/components/SEO";
import { MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { InsertContact } from "@shared/schema";

type Language = "ru" | "kz" | "en";

interface ContactProps {
  language: Language;
}

const content = {
  title: { ru: "Свяжитесь с нами", kz: "Бізбен байланысыңыз", en: "Contact Us" },
  subtitle: { ru: "Готовы обсудить ваш проект? Заполните форму, и мы свяжемся с вами в ближайшее время", kz: "Жобаңызды талқылауға дайынсыз ба? Форманы толтырыңыз, біз сізбен жақын арада байланысамыз", en: "Ready to discuss your project? Fill out the form and we will contact you soon" },
  form: {
    name: { ru: "Ваше имя", kz: "Сіздің атыңыз", en: "Your Name" },
    email: { ru: "Email", kz: "Email", en: "Email" },
    phone: { ru: "Телефон", kz: "Телефон", en: "Phone" },
    company: { ru: "Компания", kz: "Компания", en: "Company" },
    message: { ru: "Сообщение", kz: "Хабарлама", en: "Message" },
    submit: { ru: "Отправить заявку", kz: "Өтінім жіберу", en: "Send Request" },
    sending: { ru: "Отправка...", kz: "Жіберілуде...", en: "Sending..." },
  },
  info: {
    address: { ru: "Адрес", kz: "Мекенжай", en: "Address" },
    phone: { ru: "Телефон", kz: "Телефон", en: "Phone" },
    email: { ru: "Email", kz: "Email", en: "Email" },
  },
  success: { ru: "Спасибо! Мы свяжемся с вами в ближайшее время.", kz: "Рақмет! Біз сізбен жақын арада байланысамыз.", en: "Thank you! We will contact you soon." },
  error: { ru: "Произошла ошибка. Попробуйте еще раз.", kz: "Қате пайда болды. Қайталап көріңіз.", en: "An error occurred. Please try again." },
};

export function Contact({ language }: ContactProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      return await apiRequest("POST", "/api/contacts", data);
    },
    onSuccess: () => {
      toast({
        title: content.success[language],
      });
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    },
    onError: () => {
      toast({
        title: content.error[language],
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const seoContent = {
    title: {
      ru: 'Контакты | Creative Studio',
      kz: 'Байланыс | Creative Studio',
      en: 'Contact Us | Creative Studio'
    },
    description: {
      ru: 'Свяжитесь с Creative Studio для обсуждения вашего проекта. Оставьте заявку, и мы свяжемся с вами в ближайшее время.',
      kz: 'Жобаңызды талқылау үшін Creative Studio-мен байланысыңыз. Өтінім қалдырыңыз, біз сізбен жақын арада байланысамыз.',
      en: 'Contact Creative Studio to discuss your project. Leave a request and we will contact you soon.'
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6" data-testid="text-contact-title">
              {content.title[language]}
            </h1>
            <p className="text-xl text-muted-foreground" data-testid="text-contact-subtitle">
              {content.subtitle[language]}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    {content.form.name[language]} *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    data-testid="input-name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    {content.form.email[language]} *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    data-testid="input-email"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    {content.form.phone[language]}
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    data-testid="input-phone"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2">
                    {content.form.company[language]}
                  </label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    data-testid="input-company"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    {content.form.message[language]} *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    data-testid="input-message"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary"
                  disabled={contactMutation.isPending}
                  data-testid="button-submit"
                >
                  {contactMutation.isPending ? content.form.sending[language] : content.form.submit[language]}
                </Button>
              </form>
            </Card>

            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{content.info.address[language]}</h3>
                    <p className="text-muted-foreground">Алматы, ул. Абая 150/230</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{content.info.phone[language]}</h3>
                    <a href="tel:+77012345678" className="text-muted-foreground hover:text-foreground transition-colors">
                      +7 (701) 234-56-78
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{content.info.email[language]}</h3>
                    <a href="mailto:info@creativestudio.kz" className="text-muted-foreground hover:text-foreground transition-colors">
                      info@creativestudio.kz
                    </a>
                  </div>
                </div>
              </Card>

              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2906.4859894445496!2d76.9499073!3d43.2380049!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDE0JzE2LjgiTiA3NsKwNTYnNTkuNyJF!5e0!3m2!1sen!2skz!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
