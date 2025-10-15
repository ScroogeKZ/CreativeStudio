import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from './Dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Case, InsertCase } from '@shared/schema';

type CaseFormData = {
  slug: string;
  title: { ru: string; kz: string; en: string };
  client: string;
  category: string;
  image: string;
  thumbnail: string;
  shortResult: { ru: string; kz: string; en: string };
  challenge: { ru: string; kz: string; en: string };
  solution: { ru: string; kz: string; en: string };
  results: { ru: string; kz: string; en: string };
  kpi: Array<{ label: { ru: string; kz: string; en: string }; value: string }>;
  screenshots: string[];
  published: boolean;
  order: number;
};

const emptyFormData: CaseFormData = {
  slug: '',
  title: { ru: '', kz: '', en: '' },
  client: '',
  category: '',
  image: '',
  thumbnail: '',
  shortResult: { ru: '', kz: '', en: '' },
  challenge: { ru: '', kz: '', en: '' },
  solution: { ru: '', kz: '', en: '' },
  results: { ru: '', kz: '', en: '' },
  kpi: [],
  screenshots: [],
  published: false,
  order: 0,
};

export default function AdminCases() {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [formData, setFormData] = useState<CaseFormData>(emptyFormData);

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
      setFormData(emptyFormData);
      toast({
        title: 'Успешно',
        description: 'Кейс создан',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error?.message || 'Не удалось создать кейс',
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
      setFormData(emptyFormData);
      toast({
        title: 'Успешно',
        description: 'Кейс обновлен',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error?.message || 'Не удалось обновить кейс',
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
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error?.message || 'Не удалось удалить кейс',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent, isEdit = false) => {
    e.preventDefault();
    
    if (isEdit && editingCase) {
      updateMutation.mutate({ id: editingCase.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openCreateDialog = () => {
    setFormData(emptyFormData);
    setIsCreateOpen(true);
  };

  const openEditDialog = (caseItem: Case) => {
    setFormData({
      slug: caseItem.slug,
      title: caseItem.title,
      client: caseItem.client,
      category: caseItem.category,
      image: caseItem.image,
      thumbnail: caseItem.thumbnail,
      shortResult: caseItem.shortResult,
      challenge: caseItem.challenge,
      solution: caseItem.solution,
      results: caseItem.results,
      kpi: caseItem.kpi,
      screenshots: caseItem.screenshots,
      published: caseItem.published,
      order: caseItem.order,
    });
    setEditingCase(caseItem);
  };

  const addKpi = () => {
    setFormData({
      ...formData,
      kpi: [...formData.kpi, { label: { ru: '', kz: '', en: '' }, value: '' }],
    });
  };

  const removeKpi = (index: number) => {
    setFormData({
      ...formData,
      kpi: formData.kpi.filter((_, i) => i !== index),
    });
  };

  const updateKpi = (index: number, field: 'label' | 'value', value: any) => {
    const newKpi = [...formData.kpi];
    if (field === 'label') {
      newKpi[index].label = value;
    } else {
      newKpi[index].value = value;
    }
    setFormData({ ...formData, kpi: newKpi });
  };

  const addScreenshot = () => {
    const url = prompt('Введите URL скриншота:');
    if (url) {
      setFormData({
        ...formData,
        screenshots: [...formData.screenshots, url],
      });
    }
  };

  const removeScreenshot = (index: number) => {
    setFormData({
      ...formData,
      screenshots: formData.screenshots.filter((_, i) => i !== index),
    });
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
        label="Название кейса"
        value={formData.title}
        onChange={(value) => setFormData({ ...formData, title: value })}
        type="input"
        required
      />

      <div className="space-y-2">
        <label htmlFor="client" className="text-sm font-medium">
          Клиент <span className="text-destructive">*</span>
        </label>
        <Input
          id="client"
          value={formData.client}
          onChange={(e) => setFormData({ ...formData, client: e.target.value })}
          required
          data-testid="input-client"
        />
      </div>

      <MultilingualInput
        name="shortResult"
        label="Краткий результат"
        value={formData.shortResult}
        onChange={(value) => setFormData({ ...formData, shortResult: value })}
        type="textarea"
        required
      />

      <MultilingualInput
        name="challenge"
        label="Задача / Проблема"
        value={formData.challenge}
        onChange={(value) => setFormData({ ...formData, challenge: value })}
        type="textarea"
        required
      />

      <MultilingualInput
        name="solution"
        label="Решение"
        value={formData.solution}
        onChange={(value) => setFormData({ ...formData, solution: value })}
        type="textarea"
        required
      />

      <MultilingualInput
        name="results"
        label="Результаты"
        value={formData.results}
        onChange={(value) => setFormData({ ...formData, results: value })}
        type="textarea"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="image" className="text-sm font-medium">
            URL главного изображения <span className="text-destructive">*</span>
          </label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            required
            data-testid="input-image"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="thumbnail" className="text-sm font-medium">
            URL миниатюры <span className="text-destructive">*</span>
          </label>
          <Input
            id="thumbnail"
            value={formData.thumbnail}
            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
            required
            data-testid="input-thumbnail"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">KPI (ключевые показатели)</label>
          <Button type="button" size="sm" onClick={addKpi} data-testid="button-add-kpi">
            <Plus className="h-4 w-4 mr-1" /> Добавить KPI
          </Button>
        </div>
        {formData.kpi.map((kpiItem, index) => (
          <div key={index} className="border rounded-lg p-3 space-y-3">
            <div className="flex justify-between items-start">
              <MultilingualInput
                name={`kpi-label-${index}`}
                label={`KPI ${index + 1} - Название`}
                value={kpiItem.label}
                onChange={(value) => updateKpi(index, 'label', value)}
                type="input"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeKpi(index)}
                data-testid={`button-remove-kpi-${index}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Значение</label>
              <Input
                value={kpiItem.value}
                onChange={(e) => updateKpi(index, 'value', e.target.value)}
                placeholder="например: +150%"
                required
                data-testid={`input-kpi-value-${index}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Скриншоты</label>
          <Button type="button" size="sm" onClick={addScreenshot} data-testid="button-add-screenshot">
            <Plus className="h-4 w-4 mr-1" /> Добавить скриншот
          </Button>
        </div>
        {formData.screenshots.map((screenshot, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              value={screenshot}
              onChange={(e) => {
                const newScreenshots = [...formData.screenshots];
                newScreenshots[index] = e.target.value;
                setFormData({ ...formData, screenshots: newScreenshots });
              }}
              data-testid={`input-screenshot-${index}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeScreenshot(index)}
              data-testid={`button-remove-screenshot-${index}`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
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
              setEditingCase(null);
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
    <AdminLayout title="Управление кейсами">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Кейсы</h2>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} data-testid="button-create-case">
                <Plus className="h-4 w-4 mr-2" />
                Добавить кейс
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Новый кейс</DialogTitle>
                <DialogDescription>
                  Заполните информацию о новом кейсе на всех языках
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
                  <TableHead>Название</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Порядок</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Нет кейсов. Создайте первый кейс.
                    </TableCell>
                  </TableRow>
                ) : (
                  cases.map((caseItem) => (
                    <TableRow key={caseItem.id} data-testid={`row-case-${caseItem.id}`}>
                      <TableCell className="font-medium">{caseItem.title.ru}</TableCell>
                      <TableCell>{caseItem.client}</TableCell>
                      <TableCell>{caseItem.category}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${caseItem.published ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'}`}>
                          {caseItem.published ? 'Опубликовано' : 'Черновик'}
                        </span>
                      </TableCell>
                      <TableCell>{caseItem.order}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(caseItem)}
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
          <Dialog open={!!editingCase} onOpenChange={() => { setEditingCase(null); setFormData(emptyFormData); }}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Редактировать кейс</DialogTitle>
                <DialogDescription>
                  Обновите информацию о кейсе
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
