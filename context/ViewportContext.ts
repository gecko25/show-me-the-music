import React, { useEffect, useState } from "react";

const MOBILE = 768;
const TABLET = 1024;

export interface IViewportContext {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  innerWidth: number;
}

const defaultContext: IViewportContext = {
  isMobile: true,
  isTablet: false,
  isDesktop: false,
  innerWidth: 0,
};

export const useViewportContext = (): IViewportContext => {
  const [isMobile, setMobileViewport] = useState(true);
  const [isTablet, setTabletViewport] = useState(false);
  const [isDesktop, setDesktopViewport] = useState(false);
  const [innerWidth, setInnerWidth] = useState(0);

  const setViewport = () => {
    setMobileViewport(window.innerWidth < MOBILE);
    setTabletViewport(
      window.innerWidth <= TABLET && window.innerWidth >= MOBILE
    );
    setDesktopViewport(window.innerWidth > TABLET + 1);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setViewport(); // set on page load
      setInnerWidth(window.innerWidth);
      window.addEventListener("resize", () => {
        setViewport(); // re-set on resize
        setInnerWidth(window.innerWidth);
      });
    }
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop,
    innerWidth,
  };
};

export const ViewportContext = React.createContext(defaultContext);
