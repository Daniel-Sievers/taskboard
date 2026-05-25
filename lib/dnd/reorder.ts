export function reorderById<T extends { id: string; position: number }>(items: T[], activeId: string, overId: string) {
  if (activeId === overId) return items;

  const fromIndex = items.findIndex((item) => item.id === activeId);
  const toIndex = items.findIndex((item) => item.id === overId);
  if (fromIndex < 0 || toIndex < 0) return items;

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);

  return withSequentialPositions(next);
}

export function withSequentialPositions<T extends { position: number }>(items: T[]) {
  return items.map((item, index) => ({ ...item, position: index + 1 }));
}
