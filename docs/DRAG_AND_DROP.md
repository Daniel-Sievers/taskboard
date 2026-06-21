# Drag and drop

Taskboard uses `@dnd-kit` for task and list movement.

## Task dragging

Tasks can be reordered within a list and moved between lists. The saved order is persisted in Supabase so the board keeps its structure across sessions.

## List dragging

Lists can be reordered horizontally. A custom autoscroll loop tracks pointer position during drag operations so long boards remain usable while dragging.

## Mobile behavior

Touch devices use long-press activation for drag. This avoids conflicts between dragging and normal scrolling.

## Keyboard support

The board includes keyboard sensor support through `@dnd-kit`, giving the implementation a more complete interaction foundation.

## Design goal

Drag and drop is treated as a core planning interaction, not just a visual effect. Every successful move updates the persisted order.
