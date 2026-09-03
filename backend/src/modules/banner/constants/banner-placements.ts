export const BANNER_PLACEMENTS = {
  HOME_HERO: 'home_hero',
} as const;

export type BannerPlacementKey =
  (typeof BANNER_PLACEMENTS)[keyof typeof BANNER_PLACEMENTS];
