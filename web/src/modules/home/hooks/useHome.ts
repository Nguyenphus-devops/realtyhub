/**
 * Hooks cho trang chu - TanStack Query, giu pattern giong useProjects.ts.
 *
 * `initialContent` do route (server component) doc san va truyen xuong, nen
 * HTML tra ve tu server da co noi dung hero + featured projects - quan trong
 * voi SEO va first paint.
 */
import { useQuery } from '@tanstack/react-query';
import { HomeService } from '../services/home.service';
import type { HomeContent } from '../models/home.model';

export const useHomeContent = (initialContent?: HomeContent) =>
  useQuery({
    queryKey: ['home-content'] as const,
    queryFn: () => HomeService.content(),
    initialData: initialContent,
    // Noi dung trang chu thay doi rat cham - 5 phut la du
    staleTime: 5 * 60 * 1000,
  });
