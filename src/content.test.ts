import { describe, expect, it } from 'vitest';
import { navData, navGroupData } from './content';

describe('content navigation data consistency', () => {
  it('derives navData section order strictly from navGroupData (groups pages)', () => {
    // Collect section IDs in order from navGroupData
    const groupSectionIds = navGroupData.flatMap((group) => group.sections.map((section) => section.id));

    // Collect section IDs in order from navData
    const navDataSectionIds = navData.map((section) => section.id);

    // Verify both order arrays match 1:1 perfectly
    expect(navDataSectionIds).toEqual(groupSectionIds);
  });
});
