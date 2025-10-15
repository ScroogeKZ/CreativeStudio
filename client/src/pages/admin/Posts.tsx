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
import type { Post, InsertPost } from '@shared/schema';

type PostFormData = {
  slug: string;
  title: { ru: string; kz: string; en: string };
  excerpt: { ru: string; kz: string; en: string };
  content: { ru: string; kz: string; en: string };
  coverImage: string;
  category: string;
  author: string;
  published: boolean;
};

const emptyFormData: PostFormData = {
  slug: '',
  title: { ru: '', kz: '', en: '' },
  excerpt: { ru: '', kz: '', en: '' },
  content: { ru: '', kz: '', en: '' },
  coverImage: '',
  category: '',
  author: 'CreativeStudio',
  published: false,
};

export default function AdminPosts() {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<PostFormData>(emptyFormData);

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
      setFormData(emptyFormData);
      toast({
        title: 'Успешно',
        description: 'Пост создан',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error?.message || 'Не удалось создать пост',
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
      setFormData(emptyFormData);
      toast({
        title: 'Успешно',
        description: 'Пост обновлен',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error?.message || 'Не удалось обновить пост',
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
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error?.message || 'Не удалось удалить пост',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent, isEdit = false) => {
    e.preventDefault();
    
    if (isEdit && editingPost) {
      updateMutation.mutate({ id: editingPost.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openCreateDialog = () => {
    setFormData(emptyFormData);
    setIsCreateOpen(true);
  };

  const openEditDialog = (post: Post) => {
    setFormData({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      category: post.category,
      author: post.author,
      published: post.published,
    });
    setEditingPost(post);
  };

  const renderForm = (isEdit = false) => (
    <form onSubmit={(e) => handleSubmit(e, isEdit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium">
            Slug (URL) <span className="text-destructive">*</span>
          </label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
            data-testid="input-slug"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            Категория <span className="text-destructive">*</span>
          </label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            data-testid="input-category"
          />
        </div>
      </div>

      <MultilingualInput
        name="title"
        label="Заголовок статьи"
        value={formData.title}
        onChange={(value) => setFormData({ ...formData, title: value })}
        type="input"
        required
      />

      <div className="space-y-2">
        <label htmlFor="author" className="text-sm font-medium">
          Автор <span className="text-destructive">*</span>
        </label>
        <Input
          id="author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          required
          data-testid="input-author"
        />
      </div>

      <MultilingualInput
        name="excerpt"
        label="Краткое описание"
        value={formData.excerpt}
        onChange={(value) => setFormData({ ...formData, excerpt: value })}
        type="textarea"
        required
      />

      <MultilingualInput
        name="content"
        label="Содержание статьи"
        value={formData.content}
        onChange={(value) => setFormData({ ...formData, content: value })}
        type="textarea"
        required
      />

      <div className="space-y-2">
        <label htmlFor="coverImage" className="text-sm font-medium">
          URL обложки <span className="text-destructive">*</span>
        </label>
        <Input
          id="coverImage"
          value={formData.coverImage}
          onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
          required
          data-testid="input-coverImage"
        />
      </div>

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

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setEditingPost(null);
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
    <AdminLayout title="Управление блогом">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Блог</h2>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} data-testid="button-create-post">
                <Plus className="h-4 w-4 mr-2" />
                Добавить пост
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Новый пост</DialogTitle>
                <DialogDescription>
                  Создайте новую статью для блога на всех языках
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
                  <TableHead>Заголовок</TableHead>
                  <TableHead>Автор</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Нет постов. Создайте первый пост.
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id} data-testid={`row-post-${post.id}`}>
                      <TableCell className="font-medium">{post.title.ru}</TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell>{post.category}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${post.published ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'}`}>
                          {post.published ? 'Опубликовано' : 'Черновик'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString('ru-RU') : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(post)}
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
          <Dialog open={!!editingPost} onOpenChange={() => { setEditingPost(null); setFormData(emptyFormData); }}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Редактировать пост</DialogTitle>
                <DialogDescription>
                  Обновите информацию о посте
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
