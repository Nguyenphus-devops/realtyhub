import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { ContactAdminService } from '../services/contact-admin.service';
import type { UpdateAdminContactPayload } from '../models/contact.model';

export const useAdminContacts = () => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: () => ContactAdminService.findAll(),
  });

  const updateMutation = useMutation({
    mutationFn: (params: { id: string; data: UpdateAdminContactPayload }) =>
      ContactAdminService.update(params.id, params.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
    },
  });

  return {
    listQuery,
    updateMutation,
    contacts: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    isError: listQuery.isError,
    error: listQuery.error,
    refetch: listQuery.refetch,
  };
};
