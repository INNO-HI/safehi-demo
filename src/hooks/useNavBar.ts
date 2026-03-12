'use client';

import { create } from 'zustand';

interface NavBarStore {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const useNavBar = create<NavBarStore>((set) => ({
  visible: true,
  setVisible: (visible) => set({ visible }),
}));
