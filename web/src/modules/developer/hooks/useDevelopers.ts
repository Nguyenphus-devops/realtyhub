'use client';

import { useQuery } from '@tanstack/react-query';
import { DeveloperService } from '../services/developer.service';
import type { DeveloperDetail } from '../models/developer.model';

/**
 * Query key chua slug de moi developer co cache rieng. Trang chi tiet
 * cung co the truyen `initialDetail` (server component doc san va truyen
 * xuong) nen lan tai dau khong ra skeleton.
 */
export const useDeveloperList = () =>
  useQuery({
    queryKey: ['developers'] as const,
    queryFn: () => DeveloperService.list(),
    staleTime: 5 * 60 * 1000,
  });

export const useDeveloperDetail = (
  slug: string,
  initialDetail?: DeveloperDetail,
) =>
  useQuery({
    queryKey: ['developer-detail', slug] as const,
    queryFn: () => DeveloperService.detail(slug),
    initialData: initialDetail,
    staleTime: 5 * 60 * 1000,
  });
