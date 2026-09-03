"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LeadAdminService } from "../services/lead-admin.service";
import type { AdminLead, UpdateAdminLeadPayload } from "../models/lead.model";

export const useAdminLeads = () => {
  const queryClient = useQueryClient();

  const {
    data: leads = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<AdminLead[]>({
    queryKey: ["leads"],
    queryFn: () => LeadAdminService.findAll(),
    staleTime: 1000 * 60 * 5,
  });

  const updateMutation = useMutation<
    AdminLead,
    Error,
    { id: string; data: UpdateAdminLeadPayload }
  >({
    mutationFn: ({ id, data }) => LeadAdminService.update(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  return {
    leads,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    updateMutation,
  };
};
