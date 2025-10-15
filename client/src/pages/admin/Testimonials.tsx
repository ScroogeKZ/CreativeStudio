import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from './Dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { MultilingualInput } from '@/components/admin/MultilingualInput';
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

type TestimonialFormData = {
  clientName: string;
  clientPosition: { ru: string; kz: string; en: string };
  companyName: string;
  avatar: string;
  quote: { ru: string; kz: string; en: string };
  rating: number;
  published: boolean;
  order: number;
};

const emptyFormData: TestimonialFormData = {
  clientName: '',
  clientPosition: { ru: '', kz: '', en: '' },
  companyName: '',
  avatar: '',
  quote: { ru: '', kz: '', en: '' },
  rating: 5,
  published: false,
  order: 0,
};

export default function AdminTestimonials() {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<TestimonialFormData>(emptyFormData);

  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/admin/testimonials'],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertTestimonial) =>
      apiRequest('/api/admin/testimonials', {method: 'POST', body: JSON.stringify(data)}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
      setIsCreateOpen(false);
      setFormData(emptyFormData);
      toast({
        title: 'Успешно',
        description: 'Отзыв создан',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error?.message || 'Не удалось создать отзыв',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertTestimonial> }) =>
      apiRequest(`/api/admin/testimonials/${id}`, {method: 'PATCH', body: JSON.stringify(data)}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
      setEditingTestimonial(null);
      setFormData(emptyFormData);
      toast({
        title: 'Успешно',
        description: 'Отзыв обновлен',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error?.message || 'Не удалось обновить отзыв',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/admin/testimonials/${id}`, {method: 'DELETE'}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
      toast({
        title: 'Успешно',
        description: 'Отзыв удален',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error?.message || 'Не удалось удалить отзыв',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent, isEdit = false) => {
    e.preventDefault();
    
    if (isEdit && editingTestimonial) {
      updateMutation.mutate({ id: editingTestimonial.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openCreateDialog = () => {
    setFormData(emptyFormData);
    setIsCreateOpen(true);
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setFormData({
      clientName: testimonial.clientName,
      clientPosition: testimonial.clientPosition,
      companyName: testimonial.companyName,
      avatar: testimonial.avatar || '',
      quote: testimonial.quote,
      rating: testimonial.rating,
      published: testimonial.published,
      order: testimonial.order,
    });
    setEditingTestimonial(testimonial);
  };

  const renderForm = (isEdit = false) => (
    <form onSubmit={(e) => handleSubmit(e, isEdit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="clientName" className="text-sm font-medium">
            Имя клиента <span className="text-destructive">*</span>
          </label>
          <Input
            id="clientName"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            required
            data-testid="input-clientName"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="companyName" className="text-sm font-medium">
            Название компании <span className="text-destructive">*</span>
          </label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
            data-testid="input-companyName"
          />
        </div>
      </div>

      <MultilingualInput
        name="clientPosition"
        label="Должность клиента"
        value={formData.clientPosition}
        onChange={(value) => setFormData({ ...formData, clientPosition: value })}
        type="input"
        required
      />

      <MultilingualInput
        name="quote"
        label="Текст отзыва"
        value={formData.quote}
        onChange={(value) => setFormData({ ...formData, quote: value })}
        type="textarea"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="avatar" className="text-sm font-medium">
            URL аватара
          </label>
          <Input
            id="avatar"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            data-testid="input-avatar"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="rating" className="text-sm font-medium">
            Рейтинг (1-5) <span className="text-destructive">*</span>
          </label>
          <Input
            id="rating"
            type="number"
            min="1"
            max="5"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
            required
            data-testid="input-rating"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="published"
            checked={formData.published}
            onCheckedChange={(checked) => setFormData({ ...formData, published: !!checked })}
            data-testid="input-published"
          />
          <label htmlFor="published" className="text-sm font-medium">
            Опубликовано
          </label>
        </div>
        <div className="space-y-2">
          <label htmlFor="order" className="text-sm font-medium">
            Порядок сортировки
          </label>
          <Input
            id="order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            data-testid="input-order"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setEditingTestimonial(null);
            } else {
              setIsCreateOpen(false);
            }
            setFormData(emptyFormData);
          }}
          data-testid="button-cancel"
        >
          Отмена
        </Button>
        <Button
          type="submit"
          disabled={isEdit ? updateMutation.isPending : createMutation.isPending}
          data-testid="button-submit"
        >
          {isEdit
            ? (updateMutation.isPending ? 'Обновление...' : 'Обновить')
            : (createMutation.isPending ? 'Создание...' : 'Создать')}
        </Button>
      </div>
    </form>
  );

  return (
    <AdminLayout title="Управление отзывами">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Отзывы</h2>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} data-testid="button-create-testimonial">
                <Plus className="h-4 w-4 mr-2" />
                Добавить отзыв
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Новый отзыв</DialogTitle>
                <DialogDescription>
                  Добавьте отзыв клиента на всех языках
                </DialogDescription>
              </DialogHeader>
              {renderForm(false)}
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
                  <TableHead>Должность</TableHead>
                  <TableHead>Рейтинг</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Порядок</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Нет отзывов. Создайте первый отзыв.
                    </TableCell>
                  </TableRow>
                ) : (
                  testimonials.map((testimonial) => (
                    <TableRow key={testimonial.id} data-testid={`row-testimonial-${testimonial.id}`}>
                      <TableCell className="font-medium">{testimonial.clientName}</TableCell>
                      <TableCell>{testimonial.companyName}</TableCell>
                      <TableCell>{testimonial.clientPosition.ru}</TableCell>
                      <TableCell>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}>
                              ★
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${testimonial.published ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'}`}>
                          {testimonial.published ? 'Опубликовано' : 'Черновик'}
                        </span>
                      </TableCell>
                      <TableCell>{testimonial.order}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(testimonial)}
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
          <Dialog open={!!editingTestimonial} onOpenChange={() => { setEditingTestimonial(null); setFormData(emptyFormData); }}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Редактировать отзыв</DialogTitle>
                <DialogDescription>
                  Обновите информацию об отзыве
                </DialogDescription>
              </DialogHeader>
              {renderForm(true)}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
}
