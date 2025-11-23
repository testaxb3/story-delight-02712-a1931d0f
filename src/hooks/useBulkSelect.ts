import React, { useState, useCallback, useMemo } from 'react';

interface UseBulkSelectProps<T> {
  items: T[];
  getId: (item: T) => string;
}

export function useBulkSelect<T>({ items, getId }: UseBulkSelectProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const selectedItems = useMemo(() => {
    return items.filter(item => selectedIds.has(getId(item)));
  }, [items, selectedIds, getId]);

  const isSelected = useCallback((item: T) => {
    return selectedIds.has(getId(item));
  }, [selectedIds, getId]);

  const isAllSelected = useMemo(() => {
    return items.length > 0 && items.every(item => selectedIds.has(getId(item)));
  }, [items, selectedIds, getId]);

  const isSomeSelected = useMemo(() => {
    return selectedIds.size > 0 && !isAllSelected;
  }, [selectedIds.size, isAllSelected]);

  const toggleSelect = useCallback((item: T) => {
    const id = getId(item);
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, [getId]);

  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(item => getId(item))));
    }
  }, [items, isAllSelected, getId]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const selectItems = useCallback((itemsToSelect: T[]) => {
    setSelectedIds(new Set(itemsToSelect.map(item => getId(item))));
  }, [getId]);

  return {
    selectedIds: Array.from(selectedIds),
    selectedItems,
    selectedCount: selectedIds.size,
    isSelected,
    isAllSelected,
    isSomeSelected,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    selectItems,
  };
}
