import moment, { Moment } from "moment";
import React from "react";

export interface IDateContext {
  date: Moment;
  setDate: (d: Moment) => void;
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
  const [date, updateDate] = React.useState<Moment>(moment());

  const setDate = React.useCallback((d: Moment) => {
    updateDate(d);
  }, []);

  return {
    date,
    setDate,
  };
};
