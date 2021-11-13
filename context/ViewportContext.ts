import React, { useEffect, useState } from "react";

const MOBILE = 768;
const TABLET = 1024;

export interface IViewportContext {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const defaultContext: IViewportContext = {
  isMobile: window.innerWidth < MOBILE,
  isTablet: window.innerWidth <= TABLET && window.innerWidth >= MOBILE,
  isDesktop: window.innerWidth > TABLET + 1,
};

export const useViewportContext = (): IViewportContext => {
  const [isMobile, setMobileViewport] = useState(window.innerWidth < MOBILE);
  const [isTablet, setTabletViewport] = useState(
    window.innerWidth <= TABLET && window.innerWidth >= MOBILE
  );
  const [isDesktop, setDesktopViewport] = useState(
    window.innerWidth > TABLET + 1
  );

  window.addEventListener("resize", () => {
    setMobileViewport(window.innerWidth < MOBILE);
    setTabletViewport(
      window.innerWidth <= TABLET && window.innerWidth >= MOBILE
    );
    setDesktopViewport(window.innerWidth > TABLET + 1);
  });

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
};

export const ViewportContext = React.createContext(defaultContext);
