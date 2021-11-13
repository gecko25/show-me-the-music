import { useCallback } from "react";
import usePrevious from "./usePrevious";

/* eslint-disable */
// https://stackoverflow.com/questions/55187563/determine-which-dependency-array-variable-caused-useeffect-hook-to-fire
const useCallbackDebugger = (
  callbackFunc,
  dependencies,
  dependencyNames = []
) => {
  const previousDeps = usePrevious(dependencies, []);

  const changedDeps = dependencies.reduce((accum, dependency, index) => {
    if (dependency !== previousDeps[index]) {
      const keyName = dependencyNames[index] || index;
      return {
        ...accum,
        [keyName]: {
          before: previousDeps[index],
          after: dependency,
        },
      };
    }

    return accum;
  }, {});

  if (Object.keys(changedDeps).length) {
    console.log("[use-callback-debugger] ", changedDeps);
  }

  return useCallback(callbackFunc, dependencies);
};

export default useCallbackDebugger;
