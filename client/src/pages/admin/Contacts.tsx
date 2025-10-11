import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from './Dashboard';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Contact } from '@shared/schema';

export default function AdminContacts() {
  const { toast } = useToast();

  const { data: contacts = [], isLoading } = useQuery<Contact[]>({
    queryKey: ['/api/admin/contacts'],
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest(`/api/admin/contacts/${id}/status`, {method: 'PATCH', body: JSON.stringify({ status })}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contacts'] });
      toast({
        title: 'Успешно',
        description: 'Статус обращения обновлен',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
      });
    },
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new':
        return { label: 'Новое', className: 'bg-blue-100 text-blue-800' };
      case 'contacted':
        return { label: 'Обработано', className: 'bg-yellow-100 text-yellow-800' };
      case 'closed':
        return { label: 'Закрыто', className: 'bg-green-100 text-green-800' };
      default:
        return { label: status, className: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <AdminLayout title="Обращения клиентов">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Обращения</h2>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Загрузка...</div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Имя</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Сообщение</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Нет обращений
                    </TableCell>
                  </TableRow>
                ) : (
                  contacts.map((contact) => {
                    const statusInfo = getStatusLabel(contact.status);
                    return (
                      <TableRow key={contact.id} data-testid={`row-contact-${contact.id}`}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.phone || '-'}</TableCell>
                        <TableCell className="max-w-md truncate">{contact.message}</TableCell>
                        <TableCell>
                          {new Date(contact.createdAt).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${statusInfo.className}`}>
                            {statusInfo.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Select
                            value={contact.status}
                            onValueChange={(status) =>
                              updateStatusMutation.mutate({ id: contact.id, status })
                            }
                          >
                            <SelectTrigger className="w-32" data-testid={`select-status-${contact.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">Новое</SelectItem>
                              <SelectItem value="contacted">Обработано</SelectItem>
                              <SelectItem value="closed">Закрыто</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
