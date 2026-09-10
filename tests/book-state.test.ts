import { describe, it, expect, vi } from 'vitest';
import { clampPage } from '../src/book/book.utils';

describe('Book State & Navigation Logic', () => {
  it('handles sequential next() and previous() navigation', () => {
    let currentPage = 0;
    const totalPages = 5;

    const next = () => {
      currentPage = clampPage(currentPage + 1, totalPages);
    };

    const previous = () => {
      currentPage = clampPage(currentPage - 1, totalPages);
    };

    next();
    expect(currentPage).toBe(1);
    next();
    expect(currentPage).toBe(2);
    previous();
    expect(currentPage).toBe(1);
    previous();
    expect(currentPage).toBe(0);
    previous(); // Should clamp at 0
    expect(currentPage).toBe(0);
  });

  it('handles goToPage with bounds checking', () => {
    let currentPage = 0;
    const totalPages = 4;

    const goToPage = (p: number) => {
      currentPage = clampPage(p, totalPages);
    };

    goToPage(3);
    expect(currentPage).toBe(3);

    goToPage(100);
    expect(currentPage).toBe(4);

    goToPage(-10);
    expect(currentPage).toBe(0);
  });

  it('fires onPageChange callback with clamped values', () => {
    const onPageChange = vi.fn();
    const totalPages = 3;

    const setPage = (p: number) => {
      const clamped = clampPage(p, totalPages);
      onPageChange(clamped);
    };

    setPage(2);
    expect(onPageChange).toHaveBeenCalledWith(2);

    setPage(99);
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
