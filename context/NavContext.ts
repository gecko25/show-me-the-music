import moment, { Moment } from "moment";
import React, { useEffect } from "react";
import { usePrevious } from "@hooks/index";

type NavIcon = {
  icon: JSX.Element;
  href?: string;
};
export interface INavContext {
  icons: NavIcon[];
  setNavIcons: (i: NavIcon[]) => void;
}

const defaultContext: INavContext = {
  icons: [],
  setNavIcons: () => {},
};

export const NavContext = React.createContext(defaultContext);

/** Only the provider should use this hook.
 * Everything else should use React.useContext(NavContext)
 * This hook allows the value of the date to not be overridden by defaults everytime
 */
export const useNavContext = (): INavContext => {
  const [icons, updateIcons] = React.useState<NavIcon[]>([]);

  const setNavIcons = React.useCallback((icons: NavIcon[]) => {
    updateIcons(icons);
  }, []);

  return {
    icons,
    setNavIcons,
  };
};
