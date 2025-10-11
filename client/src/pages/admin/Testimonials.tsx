import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from './Dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
import type { Testimonial, InsertTestimonial } from '@shared/schema';

export default function AdminTestimonials() {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/admin/testimonials'],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertTestimonial) =>
      apiRequest('/api/admin/testimonials', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
      setIsCreateOpen(false);
      toast({
        title: 'Успешно',
        description: 'Отзыв создан',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось создать отзыв',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertTestimonial> }) =>
      apiRequest(`/api/admin/testimonials/${id}`, 'PATCH', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
      setEditingTestimonial(null);
      toast({
        title: 'Успешно',
        description: 'Отзыв обновлен',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось обновить отзыв',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/admin/testimonials/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
      toast({
        title: 'Успешно',
        description: 'Отзыв удален',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось удалить отзыв',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, isEdit = false) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: InsertTestimonial = {
      clientName: formData.get('clientName') as string,
      company: formData.get('company') as string,
      position: formData.get('position') as string,
      content: formData.get('content') as string,
      avatar: formData.get('avatar') as string,
      rating: parseInt(formData.get('rating') as string) || 5,
      published: formData.get('published') === 'on',
    };

    if (isEdit && editingTestimonial) {
      updateMutation.mutate({ id: editingTestimonial.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <AdminLayout title="Управление отзывами">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Отзывы</h2>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-testimonial">
                <Plus className="h-4 w-4 mr-2" />
                Добавить отзыв
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Новый отзыв</DialogTitle>
                <DialogDescription>
                  Добавьте отзыв клиента
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="clientName" className="text-sm font-medium">
                      Имя клиента
                    </label>
                    <Input id="clientName" name="clientName" required data-testid="input-clientName" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium">
                      Компания
                    </label>
                    <Input id="company" name="company" required data-testid="input-company" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="position" className="text-sm font-medium">
                      Должность
                    </label>
                    <Input id="position" name="position" required data-testid="input-position" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="rating" className="text-sm font-medium">
                      Рейтинг (1-5)
                    </label>
                    <Input
                      id="rating"
                      name="rating"
                      type="number"
                      min="1"
                      max="5"
                      defaultValue={5}
                      required
                      data-testid="input-rating"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">
                    Текст отзыва
                  </label>
                  <Textarea
                    id="content"
                    name="content"
                    required
                    rows={4}
                    data-testid="input-content"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="avatar" className="text-sm font-medium">
                    URL аватара (опционально)
                  </label>
                  <Input id="avatar" name="avatar" data-testid="input-avatar" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="published" name="published" defaultChecked data-testid="input-published" />
                  <label
                    htmlFor="published"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Опубликовано
                  </label>
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
                  <TableHead>Клиент</TableHead>
                  <TableHead>Компания</TableHead>
                  <TableHead>Рейтинг</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Нет отзывов. Создайте первый отзыв.
                    </TableCell>
                  </TableRow>
                ) : (
                  testimonials.map((testimonial) => (
                    <TableRow key={testimonial.id} data-testid={`row-testimonial-${testimonial.id}`}>
                      <TableCell className="font-medium">{testimonial.clientName}</TableCell>
                      <TableCell>{testimonial.company}</TableCell>
                      <TableCell>{'⭐'.repeat(testimonial.rating)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${testimonial.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {testimonial.published ? 'Опубликовано' : 'Скрыто'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingTestimonial(testimonial)}
                            data-testid={`button-edit-${testimonial.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm('Вы уверены, что хотите удалить этот отзыв?')) {
                                deleteMutation.mutate(testimonial.id);
                              }
                            }}
                            data-testid={`button-delete-${testimonial.id}`}
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
        {editingTestimonial && (
          <Dialog open={!!editingTestimonial} onOpenChange={() => setEditingTestimonial(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Редактировать отзыв</DialogTitle>
                <DialogDescription>
                  Обновите информацию об отзыве
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-clientName" className="text-sm font-medium">
                      Имя клиента
                    </label>
                    <Input
                      id="edit-clientName"
                      name="clientName"
                      defaultValue={editingTestimonial.clientName}
                      required
                      data-testid="input-edit-clientName"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-company" className="text-sm font-medium">
                      Компания
                    </label>
                    <Input
                      id="edit-company"
                      name="company"
                      defaultValue={editingTestimonial.company}
                      required
                      data-testid="input-edit-company"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-position" className="text-sm font-medium">
                      Должность
                    </label>
                    <Input
                      id="edit-position"
                      name="position"
                      defaultValue={editingTestimonial.position}
                      required
                      data-testid="input-edit-position"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-rating" className="text-sm font-medium">
                      Рейтинг (1-5)
                    </label>
                    <Input
                      id="edit-rating"
                      name="rating"
                      type="number"
                      min="1"
                      max="5"
                      defaultValue={editingTestimonial.rating}
                      required
                      data-testid="input-edit-rating"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-content" className="text-sm font-medium">
                    Текст отзыва
                  </label>
                  <Textarea
                    id="edit-content"
                    name="content"
                    defaultValue={editingTestimonial.content}
                    required
                    rows={4}
                    data-testid="input-edit-content"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-avatar" className="text-sm font-medium">
                    URL аватара (опционально)
                  </label>
                  <Input
                    id="edit-avatar"
                    name="avatar"
                    defaultValue={editingTestimonial.avatar || ''}
                    data-testid="input-edit-avatar"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-published"
                    name="published"
                    defaultChecked={editingTestimonial.published}
                    data-testid="input-edit-published"
                  />
                  <label
                    htmlFor="edit-published"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Опубликовано
                  </label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingTestimonial(null)}
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
