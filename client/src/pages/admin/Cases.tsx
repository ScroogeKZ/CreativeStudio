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
import type { Case, InsertCase } from '@shared/schema';

export default function AdminCases() {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);

  const { data: cases = [], isLoading } = useQuery<Case[]>({
    queryKey: ['/api/admin/cases'],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertCase) =>
      apiRequest('/api/admin/cases', {method: 'POST', body: JSON.stringify(data)}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/cases'] });
      queryClient.invalidateQueries({ queryKey: ['/api/cases'] });
      setIsCreateOpen(false);
      toast({
        title: 'Успешно',
        description: 'Кейс создан',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось создать кейс',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertCase> }) =>
      apiRequest(`/api/admin/cases/${id}`, {method: 'PATCH', body: JSON.stringify(data)}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/cases'] });
      queryClient.invalidateQueries({ queryKey: ['/api/cases'] });
      setEditingCase(null);
      toast({
        title: 'Успешно',
        description: 'Кейс обновлен',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось обновить кейс',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/admin/cases/${id}`, {method: 'DELETE'}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/cases'] });
      queryClient.invalidateQueries({ queryKey: ['/api/cases'] });
      toast({
        title: 'Успешно',
        description: 'Кейс удален',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось удалить кейс',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, isEdit = false) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: InsertCase = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      client: formData.get('client') as string,
      description: formData.get('description') as string,
      content: formData.get('content') as string,
      image: formData.get('image') as string,
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
      published: formData.get('published') === 'on',
      order: parseInt(formData.get('order') as string) || 0,
    };

    if (isEdit && editingCase) {
      updateMutation.mutate({ id: editingCase.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <AdminLayout title="Управление кейсами">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Кейсы</h2>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-case">
                <Plus className="h-4 w-4 mr-2" />
                Добавить кейс
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Новый кейс</DialogTitle>
                <DialogDescription>
                  Заполните информацию о новом кейсе
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Название
                    </label>
                    <Input id="title" name="title" required data-testid="input-title" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="slug" className="text-sm font-medium">
                      Slug (URL)
                    </label>
                    <Input id="slug" name="slug" required data-testid="input-slug" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="client" className="text-sm font-medium">
                    Клиент
                  </label>
                  <Input id="client" name="client" required data-testid="input-client" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Краткое описание
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    rows={3}
                    data-testid="input-description"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">
                    Полное описание
                  </label>
                  <Textarea
                    id="content"
                    name="content"
                    required
                    rows={6}
                    data-testid="input-content"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="image" className="text-sm font-medium">
                      URL изображения
                    </label>
                    <Input id="image" name="image" required data-testid="input-image" />
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
                </div>
                <div className="space-y-2">
                  <label htmlFor="tags" className="text-sm font-medium">
                    Теги (через запятую)
                  </label>
                  <Input id="tags" name="tags" placeholder="веб, дизайн, маркетинг" data-testid="input-tags" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="published" name="published" data-testid="input-published" />
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
                  <TableHead>Название</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Порядок</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Нет кейсов. Создайте первый кейс.
                    </TableCell>
                  </TableRow>
                ) : (
                  cases.map((caseItem) => (
                    <TableRow key={caseItem.id} data-testid={`row-case-${caseItem.id}`}>
                      <TableCell className="font-medium">{caseItem.title.ru}</TableCell>
                      <TableCell>{caseItem.client}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${caseItem.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {caseItem.published ? 'Опубликовано' : 'Черновик'}
                        </span>
                      </TableCell>
                      <TableCell>{caseItem.order}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingCase(caseItem)}
                            data-testid={`button-edit-${caseItem.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm('Вы уверены, что хотите удалить этот кейс?')) {
                                deleteMutation.mutate(caseItem.id);
                              }
                            }}
                            data-testid={`button-delete-${caseItem.id}`}
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
        {editingCase && (
          <Dialog open={!!editingCase} onOpenChange={() => setEditingCase(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Редактировать кейс</DialogTitle>
                <DialogDescription>
                  Обновите информацию о кейсе
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-title" className="text-sm font-medium">
                      Название
                    </label>
                    <Input
                      id="edit-title"
                      name="title"
                      defaultValue={editingCase.title}
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
                      defaultValue={editingCase.slug}
                      required
                      data-testid="input-edit-slug"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-client" className="text-sm font-medium">
                    Клиент
                  </label>
                  <Input
                    id="edit-client"
                    name="client"
                    defaultValue={editingCase.client}
                    required
                    data-testid="input-edit-client"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-description" className="text-sm font-medium">
                    Краткое описание
                  </label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={editingCase.description}
                    required
                    rows={3}
                    data-testid="input-edit-description"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-content" className="text-sm font-medium">
                    Полное описание
                  </label>
                  <Textarea
                    id="edit-content"
                    name="content"
                    defaultValue={editingCase.content}
                    required
                    rows={6}
                    data-testid="input-edit-content"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-image" className="text-sm font-medium">
                      URL изображения
                    </label>
                    <Input
                      id="edit-image"
                      name="image"
                      defaultValue={editingCase.image}
                      required
                      data-testid="input-edit-image"
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
                      defaultValue={editingCase.order}
                      required
                      data-testid="input-edit-order"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-tags" className="text-sm font-medium">
                    Теги (через запятую)
                  </label>
                  <Input
                    id="edit-tags"
                    name="tags"
                    defaultValue={editingCase.tags?.join(', ')}
                    placeholder="веб, дизайн, маркетинг"
                    data-testid="input-edit-tags"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-published"
                    name="published"
                    defaultChecked={editingCase.published}
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
                    onClick={() => setEditingCase(null)}
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
