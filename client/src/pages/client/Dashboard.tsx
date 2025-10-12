import { useClientAuth } from '@/lib/clientAuth';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/SEO';
import { LogOut, Package, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import type { Order } from '@shared/schema';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Ожидание', variant: 'secondary' },
  in_progress: { label: 'В работе', variant: 'default' },
  review: { label: 'На проверке', variant: 'outline' },
  completed: { label: 'Завершен', variant: 'default' },
  cancelled: { label: 'Отменен', variant: 'destructive' },
};

export default function ClientDashboard() {
  const { client, logout } = useClientAuth();
  const [, setLocation] = useLocation();

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['/api/client/orders'],
    enabled: !!client,
  });

  if (!client) {
    setLocation('/client/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    setLocation('/client/login');
  };

  return (
    <>
      <SEO 
        title="Личный кабинет"
        description="Управление заказами и отслеживание прогресса"
      />
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-dashboard-title">Личный кабинет</h1>
              <p className="text-sm text-muted-foreground" data-testid="text-client-name">{client.name}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Выход
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Всего заказов</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-orders">
                  {orders?.length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">В работе</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-active-orders">
                  {orders?.filter(o => o.status === 'in_progress').length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Завершено</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-completed-orders">
                  {orders?.filter(o => o.status === 'completed').length || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">Мои заказы</h2>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <Card key={order.id} data-testid={`card-order-${order.id}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg" data-testid={`text-order-title-${order.id}`}>
                            {order.title.ru}
                          </CardTitle>
                          <CardDescription data-testid={`text-order-service-${order.id}`}>
                            {order.serviceType}
                          </CardDescription>
                        </div>
                        <Badge 
                          variant={statusConfig[order.status]?.variant || 'secondary'}
                          data-testid={`badge-order-status-${order.id}`}
                        >
                          {statusConfig[order.status]?.label || order.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2" data-testid={`text-order-description-${order.id}`}>
                          {order.description.ru}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Прогресс</span>
                          <span className="font-medium" data-testid={`text-order-progress-${order.id}`}>
                            {order.progress}%
                          </span>
                        </div>
                        <Progress value={order.progress} data-testid={`progress-order-${order.id}`} />
                      </div>

                      {order.endDate && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          <span data-testid={`text-order-completed-${order.id}`}>
                            Завершен: {new Date(order.endDate).toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                      )}

                      {order.caseId && (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setLocation(`/cases/${order.caseId}`)}
                          data-testid={`button-view-case-${order.id}`}
                        >
                          Посмотреть кейс
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <XCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground" data-testid="text-no-orders">
                    У вас пока нет заказов
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
