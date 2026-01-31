import { describe, it, expect, vi, beforeEach } from 'vitest';
// Import strictly after hoisting
import { getStories } from '../lib/stories';

const mocks = vi.hoisted(() => {
  const mockSelect = vi.fn();
  const mockOrder = vi.fn();
  const mockLimit = vi.fn();
  const mockOverlaps = vi.fn();
  const mockOr = vi.fn();
  
  const mockQueryBuilder = {
    overlaps: mockOverlaps,
    or: mockOr,
    then: (resolve: any) => resolve({ data: [], error: null })
  };

  mockSelect.mockReturnValue({ order: mockOrder });
  mockOrder.mockReturnValue({ limit: mockLimit });
  mockLimit.mockReturnValue(mockQueryBuilder);
  mockOverlaps.mockReturnValue(mockQueryBuilder);
  mockOr.mockReturnValue(mockQueryBuilder);

  const mockFrom = vi.fn(() => ({ select: mockSelect }));

  return {
    mockFrom,
    mockSelect,
    mockOrder,
    mockLimit,
    mockOverlaps,
    mockOr,
    mockQueryBuilder
  };
});

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: mocks.mockFrom
  }
}));

describe('getStories filtering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Ensure return values are set
    mocks.mockSelect.mockReturnValue({ order: mocks.mockOrder });
    mocks.mockOrder.mockReturnValue({ limit: mocks.mockLimit });
    mocks.mockLimit.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mockOverlaps.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mockOr.mockReturnValue(mocks.mockQueryBuilder);
    mocks.mockFrom.mockReturnValue({ select: mocks.mockSelect });
  });

  it('should fetch stories without filters', async () => {
    await getStories();
    expect(mocks.mockFrom).toHaveBeenCalledWith('stories');
    expect(mocks.mockSelect).toHaveBeenCalled();
    expect(mocks.mockOverlaps).not.toHaveBeenCalled();
    expect(mocks.mockOr).not.toHaveBeenCalled();
  });

  it('should apply genre filter', async () => {
    const genres = ['Fiction', 'Mystery'];
    await getStories({ genres });
    expect(mocks.mockOverlaps).toHaveBeenCalledWith('genres', genres);
  });

  it('should apply search filter', async () => {
    const search = 'test';
    await getStories({ search });
    expect(mocks.mockOr).toHaveBeenCalledWith(expect.stringContaining('test'));
  });

  it('should apply both filters', async () => {
    const genres = ['Romance'];
    const search = 'love';
    await getStories({ genres, search });
    expect(mocks.mockOverlaps).toHaveBeenCalledWith('genres', genres);
    expect(mocks.mockOr).toHaveBeenCalledWith(expect.stringContaining('love'));
  });
  
  it('should handle empty genre list as no filter', async () => {
      await getStories({ genres: [] });
      expect(mocks.mockOverlaps).not.toHaveBeenCalled();
  });
});
