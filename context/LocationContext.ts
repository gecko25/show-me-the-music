import React from "react";
import { LocationComplete } from "../types";
import { usePrevious } from "@hooks/index";
export interface ILocationContext {
  location: LocationComplete | null;
  prevLocation: LocationComplete | null;
  setLocation: (l: LocationComplete) => void;
}

const defaultContext: ILocationContext = {
  location: null,
  prevLocation: null,
  setLocation: () => {},
};

export const LocationContext = React.createContext(defaultContext);

/** Only the provider should use this hook.
 * Everything else should use React.useContext(LocationContext)
 * This hook allows the value of the date to not be overridden by defaults everytime
 */
export const useLocationContext = (): ILocationContext => {
  const [location, updateLocation] = React.useState<LocationComplete | null>(
    null
  );
  const prevLocation: LocationComplete = usePrevious(location, null);
  const setLocation = React.useCallback((l: LocationComplete) => {
    updateLocation(l);
  }, []);

  return {
    location,
    prevLocation,
    setLocation,
  };
};
