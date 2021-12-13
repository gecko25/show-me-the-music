import { RefObject, useEffect, useState } from "react";

function useWindow() {
  const [window, setWindow] = useState<Window>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindow(window);
    }
  }, [window]);

  return {
    window,
  };
}

export default useWindow;
