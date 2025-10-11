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
import type { Post, InsertPost } from '@shared/schema';

export default function AdminPosts() {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ['/api/admin/posts'],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertPost) =>
      apiRequest('/api/admin/posts', {method: 'POST', body: JSON.stringify(data)}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      setIsCreateOpen(false);
      toast({
        title: 'Успешно',
        description: 'Пост создан',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось создать пост',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertPost> }) =>
      apiRequest(`/api/admin/posts/${id}`, {method: 'PATCH', body: JSON.stringify(data)}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      setEditingPost(null);
      toast({
        title: 'Успешно',
        description: 'Пост обновлен',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось обновить пост',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/admin/posts/${id}`, {method: 'DELETE'}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: 'Успешно',
        description: 'Пост удален',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось удалить пост',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, isEdit = false) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: InsertPost = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      excerpt: formData.get('excerpt') as string,
      content: formData.get('content') as string,
      image: formData.get('image') as string,
      author: formData.get('author') as string,
      published: formData.get('published') === 'on',
      publishedAt: formData.get('published') === 'on' ? new Date() : undefined,
    };

    if (isEdit && editingPost) {
      updateMutation.mutate({ id: editingPost.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <AdminLayout title="Управление блогом">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Блог</h2>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-post">
                <Plus className="h-4 w-4 mr-2" />
                Добавить пост
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Новый пост</DialogTitle>
                <DialogDescription>
                  Создайте новую статью для блога
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Заголовок
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
                  <label htmlFor="author" className="text-sm font-medium">
                    Автор
                  </label>
                  <Input id="author" name="author" required data-testid="input-author" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="excerpt" className="text-sm font-medium">
                    Краткое описание
                  </label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    required
                    rows={3}
                    data-testid="input-excerpt"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">
                    Содержание
                  </label>
                  <Textarea
                    id="content"
                    name="content"
                    required
                    rows={8}
                    data-testid="input-content"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="image" className="text-sm font-medium">
                    URL изображения
                  </label>
                  <Input id="image" name="image" required data-testid="input-image" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="published" name="published" data-testid="input-published" />
                  <label
                    htmlFor="published"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Опубликовать сейчас
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
                  <TableHead>Заголовок</TableHead>
                  <TableHead>Автор</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Нет постов. Создайте первый пост.
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id} data-testid={`row-post-${post.id}`}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {post.published ? 'Опубликовано' : 'Черновик'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('ru-RU') : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingPost(post)}
                            data-testid={`button-edit-${post.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm('Вы уверены, что хотите удалить этот пост?')) {
                                deleteMutation.mutate(post.id);
                              }
                            }}
                            data-testid={`button-delete-${post.id}`}
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
        {editingPost && (
          <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Редактировать пост</DialogTitle>
                <DialogDescription>
                  Обновите информацию о посте
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edit-title" className="text-sm font-medium">
                      Заголовок
                    </label>
                    <Input
                      id="edit-title"
                      name="title"
                      defaultValue={editingPost.title}
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
                      defaultValue={editingPost.slug}
                      required
                      data-testid="input-edit-slug"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-author" className="text-sm font-medium">
                    Автор
                  </label>
                  <Input
                    id="edit-author"
                    name="author"
                    defaultValue={editingPost.author}
                    required
                    data-testid="input-edit-author"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-excerpt" className="text-sm font-medium">
                    Краткое описание
                  </label>
                  <Textarea
                    id="edit-excerpt"
                    name="excerpt"
                    defaultValue={editingPost.excerpt}
                    required
                    rows={3}
                    data-testid="input-edit-excerpt"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-content" className="text-sm font-medium">
                    Содержание
                  </label>
                  <Textarea
                    id="edit-content"
                    name="content"
                    defaultValue={editingPost.content}
                    required
                    rows={8}
                    data-testid="input-edit-content"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-image" className="text-sm font-medium">
                    URL изображения
                  </label>
                  <Input
                    id="edit-image"
                    name="image"
                    defaultValue={editingPost.image}
                    required
                    data-testid="input-edit-image"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-published"
                    name="published"
                    defaultChecked={editingPost.published}
                    data-testid="input-edit-published"
                  />
                  <label
                    htmlFor="edit-published"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Опубликовать
                  </label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingPost(null)}
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
