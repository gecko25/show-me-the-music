import React from "react";
import moment, { Moment } from "moment";
import { IDateContext } from "./DateContext";

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

export default useDateContext;
