import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { AdminUserService } from '../services/user.service';
import type {
  AdminUpdateUserInput,
  AdminUsersListParams,
} from '../models/user.model';

const usersQueryKey = (params: AdminUsersListParams) =>
  ['admin-users', params] as const;

export const useAdminUsers = (params: AdminUsersListParams) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: usersQueryKey(params),
    queryFn: () => AdminUserService.list(params),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; body: AdminUpdateUserInput }) =>
      AdminUserService.update(payload.id, payload.body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Đã cập nhật người dùng.');
    },
    onError: () => {
      toast.error('Không thể cập nhật người dùng.');
    },
  });

  const removeMutation = useMutation({
    mutationFn: (payload: { id: string }) => AdminUserService.remove(payload.id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Đã xóa mềm người dùng.');
    },
    onError: () => {
      toast.error('Không thể xóa người dùng.');
    },
  });

  return { listQuery, updateMutation, removeMutation };
};

