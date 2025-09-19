import { writable } from 'svelte/store';

export type User = {
  role: string;
  groupFlag?: string;
} | null;

export const userStore = () => {
  const { subscribe, set } = writable<User>(null);

  return {
    subscribe,
    login: (role: string, groupFlag?: string) => set({ role, groupFlag }),
    logout: () => set(null)
  };
};

export const user = userStore();