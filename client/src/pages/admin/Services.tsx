import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from './Dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MultilingualInput } from '@/components/admin/MultilingualInput';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

interface ServiceFormData {
  name: { ru: string; kz: string; en: string };
  subtitle: { ru: string; kz: string; en: string };
  description: { ru: string; kz: string; en: string };
  slug: string;
  color: string;
  features: string;
  order: number;
}

export default function AdminServices() {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  const [formData, setFormData] = useState<ServiceFormData>({
    name: { ru: '', kz: '', en: '' },
    subtitle: { ru: '', kz: '', en: '' },
    description: { ru: '', kz: '', en: '' },
    slug: '',
    color: 'digital',
    features: '',
    order: 0,
  });

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  const resetForm = () => {
    setFormData({
      name: { ru: '', kz: '', en: '' },
      subtitle: { ru: '', kz: '', en: '' },
      description: { ru: '', kz: '', en: '' },
      slug: '',
      color: 'digital',
      features: '',
      order: 0,
    });
  };

  const loadEditData = (service: Service) => {
    setFormData({
      name: service.name,
      subtitle: service.subtitle,
      description: service.description,
      slug: service.slug,
      color: service.color,
      features: service.features.join(', '),
      order: service.order,
    });
    setEditingService(service);
  };

  const createMutation = useMutation({
    mutationFn: (data: InsertService) =>
      apiRequest('/api/admin/services', {method: 'POST', body: JSON.stringify(data)}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      setIsCreateOpen(false);
      resetForm();
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
      apiRequest(`/api/admin/services/${id}`, {method: 'PATCH', body: JSON.stringify(data)}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      setEditingService(null);
      resetForm();
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
      apiRequest(`/api/admin/services/${id}`, {method: 'DELETE'}),
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const featuresArray = formData.features
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const data: InsertService = {
      name: formData.name,
      subtitle: formData.subtitle,
      description: formData.description,
      slug: formData.slug,
      color: formData.color,
      features: featuresArray,
      order: formData.order,
    };

    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleCreateOpen = (open: boolean) => {
    setIsCreateOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleEditClose = () => {
    setEditingService(null);
    resetForm();
  };

  return (
    <AdminLayout title="Управление услугами">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Услуги</h2>
          <Dialog open={isCreateOpen} onOpenChange={handleCreateOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-service">
                <Plus className="h-4 w-4 mr-2" />
                Добавить услугу
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Новая услуга</DialogTitle>
                <DialogDescription>
                  Заполните информацию о новой услуге
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <MultilingualInput
                  name="name"
                  label="Название"
                  value={formData.name}
                  onChange={(value) => setFormData({ ...formData, name: value })}
                  type="input"
                  required
                />

                <MultilingualInput
                  name="subtitle"
                  label="Подзаголовок"
                  value={formData.subtitle}
                  onChange={(value) => setFormData({ ...formData, subtitle: value })}
                  type="input"
                  required
                />

                <MultilingualInput
                  name="description"
                  label="Описание"
                  value={formData.description}
                  onChange={(value) => setFormData({ ...formData, description: value })}
                  type="textarea"
                  required
                />

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL) <span className="text-destructive">*</span></Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    data-testid="input-slug"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Цвет <span className="text-destructive">*</span></Label>
                  <Select
                    value={formData.color}
                    onValueChange={(value) => setFormData({ ...formData, color: value })}
                  >
                    <SelectTrigger id="color" data-testid="select-color">
                      <SelectValue placeholder="Выберите цвет" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="digital">Digital</SelectItem>
                      <SelectItem value="communication">Communication</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="tech">Tech</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="features">Особенности (через запятую)</Label>
                  <Input
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Функция 1, Функция 2, Функция 3"
                    data-testid="input-features"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Порядок <span className="text-destructive">*</span></Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    required
                    data-testid="input-order"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCreateOpen(false)}
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
                  <TableHead>Цвет</TableHead>
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
                      <TableCell className="font-medium">{service.name.ru}</TableCell>
                      <TableCell>{service.slug}</TableCell>
                      <TableCell className="capitalize">{service.color}</TableCell>
                      <TableCell>{service.order}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => loadEditData(service)}
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
          <Dialog open={!!editingService} onOpenChange={(open) => !open && handleEditClose()}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Редактировать услугу</DialogTitle>
                <DialogDescription>
                  Обновите информацию об услуге
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <MultilingualInput
                  name="edit-name"
                  label="Название"
                  value={formData.name}
                  onChange={(value) => setFormData({ ...formData, name: value })}
                  type="input"
                  required
                />

                <MultilingualInput
                  name="edit-subtitle"
                  label="Подзаголовок"
                  value={formData.subtitle}
                  onChange={(value) => setFormData({ ...formData, subtitle: value })}
                  type="input"
                  required
                />

                <MultilingualInput
                  name="edit-description"
                  label="Описание"
                  value={formData.description}
                  onChange={(value) => setFormData({ ...formData, description: value })}
                  type="textarea"
                  required
                />

                <div className="space-y-2">
                  <Label htmlFor="edit-slug">Slug (URL) <span className="text-destructive">*</span></Label>
                  <Input
                    id="edit-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    data-testid="input-edit-slug"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-color">Цвет <span className="text-destructive">*</span></Label>
                  <Select
                    value={formData.color}
                    onValueChange={(value) => setFormData({ ...formData, color: value })}
                  >
                    <SelectTrigger id="edit-color" data-testid="select-edit-color">
                      <SelectValue placeholder="Выберите цвет" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="digital">Digital</SelectItem>
                      <SelectItem value="communication">Communication</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="tech">Tech</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-features">Особенности (через запятую)</Label>
                  <Input
                    id="edit-features"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Функция 1, Функция 2, Функция 3"
                    data-testid="input-edit-features"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-order">Порядок <span className="text-destructive">*</span></Label>
                  <Input
                    id="edit-order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    required
                    data-testid="input-edit-order"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleEditClose}
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
