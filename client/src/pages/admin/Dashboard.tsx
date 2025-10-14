import { useAuth } from '@/lib/auth';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Star, 
  MessageSquare, 
  LogOut,
  Menu
} from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useState } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AdminLayout({ children, title = 'Админ-панель' }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { href: '/admin', label: 'Главная', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Заказы', icon: Briefcase },
    { href: '/admin/services', label: 'Услуги', icon: FileText },
    { href: '/admin/cases', label: 'Кейсы', icon: Briefcase },
    { href: '/admin/posts', label: 'Блог', icon: FileText },
    { href: '/admin/testimonials', label: 'Отзывы', icon: Star },
    { href: '/admin/contacts', label: 'Обращения', icon: MessageSquare },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/admin/login';
  };

  return (
    <>
      <SEO title={title} description="Панель управления контентом" noindex />
      <div className="flex h-screen bg-background">
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-card border-r flex flex-col overflow-hidden`}>
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">CMS</h2>
            <p className="text-sm text-muted-foreground mt-1">{user?.name}</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <a 
                    className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                    data-testid={`link-${item.label.toLowerCase()}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </a>
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="h-5 w-5" />
              <span>Выйти</span>
            </Button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b flex items-center justify-between px-6 bg-card">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                data-testid="button-toggle-sidebar"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-semibold">{title}</h1>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {user?.email}
            </div>
          </header>
          
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <AdminLayout title="Главная">
      <div className="max-w-4xl">
        <h2 className="text-3xl font-bold mb-6">Добро пожаловать, {user?.name}!</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/admin/services">
            <a className="block p-6 bg-card rounded-lg border hover:border-primary transition-colors" data-testid="card-services">
              <FileText className="h-8 w-8 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Услуги</h3>
              <p className="text-muted-foreground">Управление услугами компании</p>
            </a>
          </Link>
          
          <Link href="/admin/cases">
            <a className="block p-6 bg-card rounded-lg border hover:border-primary transition-colors" data-testid="card-cases">
              <Briefcase className="h-8 w-8 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Кейсы</h3>
              <p className="text-muted-foreground">Управление портфолио проектов</p>
            </a>
          </Link>
          
          <Link href="/admin/posts">
            <a className="block p-6 bg-card rounded-lg border hover:border-primary transition-colors" data-testid="card-posts">
              <FileText className="h-8 w-8 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Блог</h3>
              <p className="text-muted-foreground">Управление блог-постами</p>
            </a>
          </Link>
          
          <Link href="/admin/testimonials">
            <a className="block p-6 bg-card rounded-lg border hover:border-primary transition-colors" data-testid="card-testimonials">
              <Star className="h-8 w-8 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Отзывы</h3>
              <p className="text-muted-foreground">Управление отзывами клиентов</p>
            </a>
          </Link>

          <Link href="/admin/contacts">
            <a className="block p-6 bg-card rounded-lg border hover:border-primary transition-colors" data-testid="card-contacts">
              <MessageSquare className="h-8 w-8 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Обращения</h3>
              <p className="text-muted-foreground">Просмотр обращений от клиентов</p>
            </a>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
