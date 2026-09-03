'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ProjectService } from '../services/project.service';
import type {
  PhaseDetail,
  ProjectDetail,
  UnitQuery,
} from '../models/project-detail.model';
import type { ProjectQuery } from '../models/project.model';

/**
 * Query key phai chua MOI tham so anh huong den ket qua, neu khong
 * doi filter se tra ve cache cu.
 */
const projectListKey = (query: ProjectQuery) => ['projects', query] as const;

export const useProjectList = (query: ProjectQuery) =>
  useQuery({
    queryKey: projectListKey(query),
    queryFn: () => ProjectService.list(query),
    // Giu du lieu trang truoc khi chuyen trang de bang khong bi trang trong
    placeholderData: keepPreviousData,
  });

export const useProjectFilterOptions = () =>
  useQuery({
    queryKey: ['project-filter-options'],
    queryFn: () => ProjectService.filterOptions(),
    staleTime: 5 * 60 * 1000,
  });

export const useProjectHighlights = () =>
  useQuery({
    queryKey: ['project-highlights'],
    queryFn: () => ProjectService.highlights(),
    staleTime: 5 * 60 * 1000,
  });

/**
 * `initialProject` do route (server component) doc san va truyen xuong, nen
 * HTML tra ve tu server da co du noi dung - quan trong voi SEO trang chi tiet.
 * Khong co no thi lan tai dau chi ra khung xuong.
 */
export const useProjectDetail = (slug: string, initialProject?: ProjectDetail) =>
  useQuery({
    queryKey: ['project-detail', slug] as const,
    queryFn: () => ProjectService.detail(slug),
    initialData: initialProject,
    staleTime: 5 * 60 * 1000,
  });

export const usePhaseDetail = (
  projectSlug: string,
  phaseSlug: string,
  initialPhase?: PhaseDetail,
) =>
  useQuery({
    queryKey: ['project-phase', projectSlug, phaseSlug] as const,
    queryFn: () => ProjectService.phase(projectSlug, phaseSlug),
    initialData: initialPhase,
    staleTime: 5 * 60 * 1000,
  });

export const useProjectUnits = (slug: string, query: UnitQuery) =>
  useQuery({
    queryKey: ['project-units', slug, query] as const,
    queryFn: () => ProjectService.units(slug, query),
    // Giu bang hang cu khi doi trang/loc de bang khong nhay ve rong
    placeholderData: keepPreviousData,
  });
