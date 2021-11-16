import moment, { Moment } from "moment";
import React from "react";
import { usePrevious } from "@hooks/index";

export interface IDateContext {
  date: Moment | null;
  setDate: (d: Moment | null) => void;
}

const defaultContext: IDateContext = {
  date: moment(),
  setDate: () => {},
};

export const DateContext = React.createContext(defaultContext);

/** Only the provider should use this hook.
 * Everything else should use React.useContext(DateContext)
 * This hook allows the value of the date to not be overridden by defaults everytime
 */
export const useDateContext = (): IDateContext => {
  const [date, updateDate] = React.useState<Moment | null>(moment());
  const prevDate: Moment = usePrevious(date, null);

  const setDate = React.useCallback((d: Moment | null) => {
    updateDate(d);
  }, []);

  return {
    date,
    setDate,
  };
};
