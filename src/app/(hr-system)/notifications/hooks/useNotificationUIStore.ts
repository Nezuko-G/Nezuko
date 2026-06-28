import { create } from "zustand";

export type NotificationFilter = "all" | "read" | "unread";

interface NotificationUIState {
  filter: NotificationFilter;
  setFilter: (filter: NotificationFilter) => void;
}

export const useNotificationUIStore = create<NotificationUIState>((set) => ({
  filter: "all",
  setFilter: (filter) => set({ filter }),
}));
