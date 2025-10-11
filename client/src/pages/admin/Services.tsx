import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from './Dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Service, InsertService } from '@shared/schema';

export default function AdminServices() {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertService) =>
      apiRequest('/api/admin/services', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      setIsCreateOpen(false);
      toast({
        title: 'Успешно',
        description: 'Услуга создана',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось создать услугу',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertService> }) =>
      apiRequest(`/api/admin/services/${id}`, 'PATCH', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      setEditingService(null);
      toast({
        title: 'Успешно',
        description: 'Услуга обновлена',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось обновить услугу',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/admin/services/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({
        title: 'Успешно',
        description: 'Услуга удалена',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось удалить услугу',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, isEdit = false) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: InsertService = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      icon: formData.get('icon') as string,
      order: parseInt(formData.get('order') as string) || 0,
    };

    if (isEdit && editingService) {
      updateMutation.mutate({ id: editingService.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <AdminLayout title="Управление услугами">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Услуги</h2>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-service">
                <Plus className="h-4 w-4 mr-2" />
                Добавить услугу
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Новая услуга</DialogTitle>
                <DialogDescription>
                  Заполните информацию о новой услуге
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Название
                  </label>
                  <Input
                    id="title"
                    name="title"
                    required
                    data-testid="input-title"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="slug" className="text-sm font-medium">
                    Slug (URL)
                  </label>
                  <Input
                    id="slug"
                    name="slug"
                    required
                    data-testid="input-slug"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Описание
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    data-testid="input-description"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="icon" className="text-sm font-medium">
                    Иконка (lucide-react название)
                  </label>
                  <Input
                    id="icon"
                    name="icon"
                    required
                    data-testid="input-icon"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="order" className="text-sm font-medium">
                    Порядок
                  </label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    defaultValue={0}
                    required
                    data-testid="input-order"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                    data-testid="button-cancel"
                  >
                    Отмена
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit">
                    {createMutation.isPending ? 'Создание...' : 'Создать'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Загрузка...</div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Порядок</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Нет услуг. Создайте первую услугу.
                    </TableCell>
                  </TableRow>
                ) : (
                  services.map((service) => (
                    <TableRow key={service.id} data-testid={`row-service-${service.id}`}>
                      <TableCell className="font-medium">{service.title}</TableCell>
                      <TableCell>{service.slug}</TableCell>
                      <TableCell className="max-w-md truncate">{service.description}</TableCell>
                      <TableCell>{service.order}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingService(service)}
                            data-testid={`button-edit-${service.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm('Вы уверены, что хотите удалить эту услугу?')) {
                                deleteMutation.mutate(service.id);
                              }
                            }}
                            data-testid={`button-delete-${service.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Edit Dialog */}
        {editingService && (
          <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Редактировать услугу</DialogTitle>
                <DialogDescription>
                  Обновите информацию об услуге
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="edit-title" className="text-sm font-medium">
                    Название
                  </label>
                  <Input
                    id="edit-title"
                    name="title"
                    defaultValue={editingService.title}
                    required
                    data-testid="input-edit-title"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-slug" className="text-sm font-medium">
                    Slug (URL)
                  </label>
                  <Input
                    id="edit-slug"
                    name="slug"
                    defaultValue={editingService.slug}
                    required
                    data-testid="input-edit-slug"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-description" className="text-sm font-medium">
                    Описание
                  </label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={editingService.description}
                    required
                    rows={4}
                    data-testid="input-edit-description"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-icon" className="text-sm font-medium">
                    Иконка (lucide-react название)
                  </label>
                  <Input
                    id="edit-icon"
                    name="icon"
                    defaultValue={editingService.icon}
                    required
                    data-testid="input-edit-icon"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-order" className="text-sm font-medium">
                    Порядок
                  </label>
                  <Input
                    id="edit-order"
                    name="order"
                    type="number"
                    defaultValue={editingService.order}
                    required
                    data-testid="input-edit-order"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingService(null)}
                    data-testid="button-cancel-edit"
                  >
                    Отмена
                  </Button>
                  <Button type="submit" disabled={updateMutation.isPending} data-testid="button-submit-edit">
                    {updateMutation.isPending ? 'Обновление...' : 'Обновить'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
}
