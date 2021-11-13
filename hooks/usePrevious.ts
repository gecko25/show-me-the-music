import { useEffect, useRef } from "react";

const usePrevious = (value: any, initialValue = value) => {
  const ref = useRef(initialValue);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default usePrevious;
