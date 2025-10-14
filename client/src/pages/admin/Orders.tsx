import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Plus, CheckCircle, Clock, AlertCircle, Loader2, Eye } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Order, Client, OrderTask, OrderUpdate } from '@shared/schema';
import { MultilingualInput } from '@/components/admin/MultilingualInput';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Ожидание', variant: 'secondary' },
  in_progress: { label: 'В работе', variant: 'default' },
  review: { label: 'На проверке', variant: 'outline' },
  completed: { label: 'Завершен', variant: 'default' },
  cancelled: { label: 'Отменен', variant: 'destructive' },
};

const taskStatusConfig: Record<string, { label: string; icon: any }> = {
  pending: { label: 'Запланирована', icon: Clock },
  in_progress: { label: 'Выполняется', icon: AlertCircle },
  completed: { label: 'Завершена', icon: CheckCircle },
};

export default function AdminOrders() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [taskForm, setTaskForm] = useState({ 
    title: { ru: '', kz: '', en: '' }, 
    description: { ru: '', kz: '', en: '' },
    status: 'pending',
    dueDate: '',
  });
  const [updateForm, setUpdateForm] = useState({
    title: { ru: '', kz: '', en: '' },
    message: { ru: '', kz: '', en: '' },
    type: 'update',
  });

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['/api/admin/orders'],
  });

  const { data: clients } = useQuery<Client[]>({
    queryKey: ['/api/admin/clients'],
  });

  const { data: tasks } = useQuery<OrderTask[]>({
    queryKey: [`/api/admin/orders/${selectedOrder?.id}/tasks`],
    enabled: !!selectedOrder,
  });

  const { data: updates } = useQuery<OrderUpdate[]>({
    queryKey: [`/api/admin/orders/${selectedOrder?.id}/updates`],
    enabled: !!selectedOrder,
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest(`/api/admin/orders/${selectedOrder?.id}/tasks`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/orders/${selectedOrder?.id}/tasks`] });
      setShowTaskDialog(false);
      setTaskForm({ title: { ru: '', kz: '', en: '' }, description: { ru: '', kz: '', en: '' }, status: 'pending', dueDate: '' });
    },
  });

  const createUpdateMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest(`/api/admin/orders/${selectedOrder?.id}/updates`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/orders/${selectedOrder?.id}/updates`] });
      setShowUpdateDialog(false);
      setUpdateForm({ title: { ru: '', kz: '', en: '' }, message: { ru: '', kz: '', en: '' }, type: 'update' });
    },
  });

  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      return apiRequest(`/api/admin/tasks/${taskId}/complete`, {
        method: 'PATCH',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/orders/${selectedOrder?.id}/tasks`] });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      return apiRequest(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
    },
  });

  if (!user) {
    setLocation('/admin/login');
    return null;
  }

  const getClientName = (clientId: string) => {
    const client = clients?.find(c => c.id === clientId);
    return client?.name || 'Неизвестно';
  };

  const handleCreateTask = () => {
    createTaskMutation.mutate({
      ...taskForm,
      dueDate: taskForm.dueDate || null,
    });
  };

  const handleCreateUpdate = () => {
    createUpdateMutation.mutate(updateForm);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-orders-title">Управление заказами</h1>
          <p className="text-muted-foreground">Отслеживание и управление заказами клиентов</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4">
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <Card key={order.id} data-testid={`card-order-${order.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg" data-testid={`text-order-title-${order.id}`}>
                        {order.title.ru}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Клиент: {getClientName(order.clientId)} • {order.serviceType}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Badge variant={statusConfig[order.status]?.variant || 'secondary'}>
                        {statusConfig[order.status]?.label || order.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        data-testid={`button-view-order-${order.id}`}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {selectedOrder?.id === order.id ? 'Скрыть' : 'Детали'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {selectedOrder?.id === order.id && (
                  <CardContent className="space-y-4 pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Прогресс</span>
                        <span className="font-medium">{order.progress}%</span>
                      </div>
                      <Progress value={order.progress} />
                    </div>

                    <div className="flex gap-2">
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatusMutation.mutate({ orderId: order.id, status: value })}
                      >
                        <SelectTrigger className="w-[180px]" data-testid={`select-order-status-${order.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Ожидание</SelectItem>
                          <SelectItem value="in_progress">В работе</SelectItem>
                          <SelectItem value="review">На проверке</SelectItem>
                          <SelectItem value="completed">Завершен</SelectItem>
                          <SelectItem value="cancelled">Отменен</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Tabs defaultValue="tasks" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="tasks" data-testid={`tab-tasks-${order.id}`}>
                          Задачи ({tasks?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="updates" data-testid={`tab-updates-${order.id}`}>
                          Обновления ({updates?.length || 0})
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="tasks" className="space-y-3 mt-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Этапы проекта</h4>
                          <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
                            <DialogTrigger asChild>
                              <Button size="sm" data-testid={`button-add-task-${order.id}`}>
                                <Plus className="h-4 w-4 mr-1" />
                                Добавить задачу
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Новая задача</DialogTitle>
                                <DialogDescription>Добавьте этап или задачу для проекта</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <MultilingualInput
                                  name="task-title"
                                  label="Название"
                                  value={taskForm.title}
                                  onChange={(value: { ru: string; kz: string; en: string }) => setTaskForm({ ...taskForm, title: value })}
                                  required
                                />
                                <MultilingualInput
                                  name="task-description"
                                  label="Описание"
                                  value={taskForm.description}
                                  onChange={(value: { ru: string; kz: string; en: string }) => setTaskForm({ ...taskForm, description: value })}
                                  type="textarea"
                                />
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Срок выполнения</label>
                                  <Input
                                    type="date"
                                    value={taskForm.dueDate}
                                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                                  />
                                </div>
                                <Button 
                                  onClick={handleCreateTask} 
                                  disabled={createTaskMutation.isPending}
                                  className="w-full"
                                  data-testid="button-save-task"
                                >
                                  {createTaskMutation.isPending ? 'Сохранение...' : 'Создать задачу'}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <div className="space-y-2">
                          {tasks && tasks.length > 0 ? (
                            tasks.map((task) => {
                              const StatusIcon = taskStatusConfig[task.status]?.icon || Clock;
                              return (
                                <div
                                  key={task.id}
                                  className="flex items-center justify-between p-3 border rounded-lg"
                                  data-testid={`task-item-${task.id}`}
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <StatusIcon className={`h-5 w-5 ${task.status === 'completed' ? 'text-green-600' : 'text-muted-foreground'}`} />
                                    <div>
                                      <p className="font-medium">{task.title.ru}</p>
                                      {task.description && (
                                        <p className="text-sm text-muted-foreground">{task.description.ru}</p>
                                      )}
                                      {task.dueDate && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          Срок: {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  {task.status !== 'completed' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => completeTaskMutation.mutate(task.id)}
                                      disabled={completeTaskMutation.isPending}
                                      data-testid={`button-complete-task-${task.id}`}
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-center text-muted-foreground py-4">Задач пока нет</p>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="updates" className="space-y-3 mt-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Обновления проекта</h4>
                          <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
                            <DialogTrigger asChild>
                              <Button size="sm" data-testid={`button-add-update-${order.id}`}>
                                <Plus className="h-4 w-4 mr-1" />
                                Добавить обновление
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Новое обновление</DialogTitle>
                                <DialogDescription>Сообщите клиенту о прогрессе</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <MultilingualInput
                                  name="update-title"
                                  label="Заголовок"
                                  value={updateForm.title}
                                  onChange={(value: { ru: string; kz: string; en: string }) => setUpdateForm({ ...updateForm, title: value })}
                                  required
                                />
                                <MultilingualInput
                                  name="update-message"
                                  label="Сообщение"
                                  value={updateForm.message}
                                  onChange={(value: { ru: string; kz: string; en: string }) => setUpdateForm({ ...updateForm, message: value })}
                                  type="textarea"
                                  required
                                />
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Тип</label>
                                  <Select
                                    value={updateForm.type}
                                    onValueChange={(value) => setUpdateForm({ ...updateForm, type: value })}
                                  >
                                    <SelectTrigger data-testid="select-update-type">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="update">Обновление</SelectItem>
                                      <SelectItem value="comment">Комментарий</SelectItem>
                                      <SelectItem value="milestone">Важное событие</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button 
                                  onClick={handleCreateUpdate} 
                                  disabled={createUpdateMutation.isPending}
                                  className="w-full"
                                  data-testid="button-save-update"
                                >
                                  {createUpdateMutation.isPending ? 'Сохранение...' : 'Добавить обновление'}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <div className="space-y-3">
                          {updates && updates.length > 0 ? (
                            updates.map((update) => (
                              <div
                                key={update.id}
                                className="p-3 border rounded-lg space-y-1"
                                data-testid={`update-item-${update.id}`}
                              >
                                <div className="flex justify-between items-start">
                                  <h5 className="font-medium">{update.title.ru}</h5>
                                  <Badge variant="outline" className="text-xs">
                                    {update.type === 'update' ? 'Обновление' : update.type === 'milestone' ? 'Событие' : 'Комментарий'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{update.message.ru}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(update.createdAt).toLocaleString('ru-RU')}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-muted-foreground py-4">Обновлений пока нет</p>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Заказов пока нет</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
