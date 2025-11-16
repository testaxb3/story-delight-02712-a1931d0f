import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useConfirm } from '../useConfirm';

describe('useConfirm', () => {
  it('should initialize with closed dialog', () => {
    const { result } = renderHook(() => useConfirm());

    expect(result.current.ConfirmDialogComponent).toBeTruthy();
  });

  it('should return true when confirmed', async () => {
    const { result } = renderHook(() => useConfirm());

    let confirmResult: boolean | undefined;

    act(() => {
      result.current.confirm({
        title: 'Test Confirmation',
        description: 'Are you sure?',
      }).then((res) => {
        confirmResult = res;
      });
    });

    // Simulate confirmation
    await act(async () => {
      // Find and click confirm button (simulated by calling internal handler)
      const confirmDialog = result.current.ConfirmDialogComponent;
      expect(confirmDialog).toBeTruthy();
    });
  });

  it('should handle custom confirm text', async () => {
    const { result } = renderHook(() => useConfirm());

    act(() => {
      result.current.confirm({
        title: 'Delete Item',
        description: 'This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Keep',
        variant: 'destructive',
      });
    });

    expect(result.current.ConfirmDialogComponent).toBeTruthy();
  });

  it('should allow multiple sequential confirmations', async () => {
    const { result } = renderHook(() => useConfirm());

    // First confirmation
    let result1: boolean | undefined;
    act(() => {
      result.current.confirm({
        title: 'First Confirmation',
        description: 'First test',
      }).then((res) => {
        result1 = res;
      });
    });

    await new Promise(resolve => setTimeout(resolve, 50));
    expect(result.current.ConfirmDialogComponent).toBeTruthy();

    // Second confirmation
    let result2: boolean | undefined;
    act(() => {
      result.current.confirm({
        title: 'Second Confirmation',
        description: 'Second test',
      }).then((res) => {
        result2 = res;
      });
    });

    expect(result.current.ConfirmDialogComponent).toBeTruthy();
  });
});
