'use client';

import { useQuery } from '@tanstack/react-query';
import { InvestorService } from '../services/investor.service';
import type { Investor, PaginatedInvestors } from '../models/investor.model';

/**
 * Hook chinh cho 25 Investor.
 *
 * Cung cung cho:
 *   - Section "CAC CHU DAU TU" tren trang chu
 *   - Trang /chu-dau-tu
 *
 * Trang detail (/chu-dau-tu/[slug]) co the truyen `initialInvestors` de
 * tranh skeleton khi server da pre-render data. Hien tai trang list khong
 * truyen nen se co mot nhip skeleton ngan.
 */
export const useInvestorList = () =>
  useQuery({
    queryKey: ['investors'] as const,
    queryFn: () => InvestorService.list(),
    staleTime: 5 * 60 * 1000,
  });

/** Lookup Investor theo slug - dung cho trang detail. */
export const useInvestorDetail = (
  slug: string,
  initialData?: Investor | null,
) =>
  useQuery({
    queryKey: ['investor-detail', slug] as const,
    queryFn: () => InvestorService.detail(slug),
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });

export type { Investor, PaginatedInvestors };
