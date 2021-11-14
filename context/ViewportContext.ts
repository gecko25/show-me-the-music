import React, { useEffect, useState } from "react";

const MOBILE = 768;
const TABLET = 1024;

export interface IViewportContext {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const defaultContext: IViewportContext = {
  isMobile: true,
  isTablet: false,
  isDesktop: false,
};

export const useViewportContext = (): IViewportContext => {
  const [isMobile, setMobileViewport] = useState(true);
  const [isTablet, setTabletViewport] = useState(false);
  const [isDesktop, setDesktopViewport] = useState(false);

  if (typeof window !== "undefined") {
    window.addEventListener("resize", () => {
      setMobileViewport(window.innerWidth < MOBILE);
      setTabletViewport(
        window.innerWidth <= TABLET && window.innerWidth >= MOBILE
      );
      setDesktopViewport(window.innerWidth > TABLET + 1);

      console.log("window.innerWidth", window.innerWidth);
    });
  }

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
};

export const ViewportContext = React.createContext(defaultContext);
