import { createContext, useContext } from 'react';

export type GlobalContent = {
  isInitialLoading: boolean,
  needsReload: boolean,
  didFirstLoad: boolean,
  setNeedsReload: (b: boolean) => void,
  thingIdLoading?: number,
  setThingIdLoading: (n?: number) => void,
}

export const GlobalContext = createContext<GlobalContent>({
  isInitialLoading: false,
  needsReload: false,
  didFirstLoad: false,
  setNeedsReload: () => {},
  thingIdLoading: undefined,
  setThingIdLoading: () => {},
});

export const useGlobalContext = () => useContext(GlobalContext);