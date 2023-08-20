import { createContext, useContext } from 'react';

export type GlobalContent = {
  needsReload: boolean,
  didFirstLoad: boolean,
  setNeedsReload: (b: boolean) => void
}

export const GlobalContext = createContext<GlobalContent>({
  needsReload: false,
  didFirstLoad: false,
  setNeedsReload: () => {},
});

export const useGlobalContext = () => useContext(GlobalContext);