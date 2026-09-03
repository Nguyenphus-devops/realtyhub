import { MOCK_PROFILE, type Profile } from '../mocks/profile.mock';

/**
 * Service doc profile theo slug. Hien tai mock tra cung 1 user cho moi
 * slug (de demo UI khong can seed data nhieu). Sau nay noi backend that,
 * doi thanh `fetch(API + '/users/' + slug)`.
 */
export const profileService = {
  async findBySlug(slug: string): Promise<Profile | null> {
    // Mock: khop slug hoac mac dinh tra MOCK_PROFILE.
    // TODO: thay bang axios khi backend san sang.
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (slug === MOCK_PROFILE.slug || slug === 'me') return MOCK_PROFILE;
    return null;
  },
};
